import { Pool } from 'pg'

export interface ProgressMetrics {
  standardId: number
  standardCode: string
  standardTitle: string
  masteryLevel: number
  attempts: number
  timeSpentMinutes: number
  lastAttemptAt?: Date
  masteredAt?: Date
  domainCode: string
  domainName: string
}

export interface DomainProgress {
  domainCode: string
  domainName: string
  totalStandards: number
  attemptedStandards: number
  masteredStandards: number
  averageMastery: number
  timeSpentMinutes: number
}

export interface GradeProgress {
  gradeCode: string
  gradeName: string
  totalStandards: number
  attemptedStandards: number
  masteredStandards: number
  averageMastery: number
  timeSpentMinutes: number
  domains: DomainProgress[]
}

export interface LearningPath {
  studentId: number
  recommendedLessons: number[]
  reasoning: string
  currentLevel: string
  nextMilestones: string[]
}

export interface AdaptiveFeedback {
  needsReview: number[]
  readyForAdvancement: number[]
  strugglingAreas: string[]
  strengthAreas: string[]
  recommendations: string[]
}

export class ProgressTrackingService {
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  /**
   * Get comprehensive progress overview for a student
   */
  async getStudentProgressOverview(studentId: number): Promise<GradeProgress> {
    const query = `
      WITH student_grade AS (
        SELECT gl.code as grade_code, gl.name as grade_name
        FROM users u
        JOIN grade_levels gl ON u.current_grade_id = gl.id
        WHERE u.id = $1
      ),
      grade_standards AS (
        SELECT s.id, s.code, s.title, d.code as domain_code, d.name as domain_name
        FROM standards s
        JOIN clusters c ON s.cluster_id = c.id
        JOIN domains d ON c.domain_id = d.id
        JOIN grade_levels gl ON c.grade_id = gl.id
        JOIN student_grade sg ON gl.code = sg.grade_code
      ),
      progress_summary AS (
        SELECT 
          gs.domain_code,
          gs.domain_name,
          COUNT(gs.id) as total_standards,
          COUNT(sp.standard_id) as attempted_standards,
          COUNT(CASE WHEN sp.mastery_level >= 0.8 THEN 1 END) as mastered_standards,
          COALESCE(AVG(sp.mastery_level), 0) as average_mastery,
          COALESCE(SUM(sp.time_spent_minutes), 0) as time_spent_minutes
        FROM grade_standards gs
        LEFT JOIN student_progress sp ON gs.id = sp.standard_id AND sp.student_id = $1
        GROUP BY gs.domain_code, gs.domain_name
      ),
      overall_summary AS (
        SELECT 
          sg.grade_code,
          sg.grade_name,
          SUM(ps.total_standards) as total_standards,
          SUM(ps.attempted_standards) as attempted_standards,
          SUM(ps.mastered_standards) as mastered_standards,
          AVG(ps.average_mastery) as average_mastery,
          SUM(ps.time_spent_minutes) as time_spent_minutes
        FROM progress_summary ps
        CROSS JOIN student_grade sg
        GROUP BY sg.grade_code, sg.grade_name
      )
      SELECT 
        os.*,
        json_agg(
          json_build_object(
            'domainCode', ps.domain_code,
            'domainName', ps.domain_name,
            'totalStandards', ps.total_standards,
            'attemptedStandards', ps.attempted_standards,
            'masteredStandards', ps.mastered_standards,
            'averageMastery', ps.average_mastery,
            'timeSpentMinutes', ps.time_spent_minutes
          ) ORDER BY ps.domain_code
        ) as domains
      FROM overall_summary os
      CROSS JOIN progress_summary ps
      GROUP BY os.grade_code, os.grade_name, os.total_standards, 
               os.attempted_standards, os.mastered_standards, 
               os.average_mastery, os.time_spent_minutes
    `
    
    const result = await this.pool.query(query, [studentId])
    if (result.rows.length === 0) {
      throw new Error('Student not found or has no assigned grade')
    }

    const row = result.rows[0]
    return {
      gradeCode: row.grade_code,
      gradeName: row.grade_name,
      totalStandards: parseInt(row.total_standards),
      attemptedStandards: parseInt(row.attempted_standards),
      masteredStandards: parseInt(row.mastered_standards),
      averageMastery: parseFloat(row.average_mastery),
      timeSpentMinutes: parseInt(row.time_spent_minutes),
      domains: row.domains
    }
  }

  /**
   * Get detailed progress for specific standards
   */
  async getDetailedStandardsProgress(studentId: number, domainCode?: string): Promise<ProgressMetrics[]> {
    let query = `
      SELECT 
        s.id as standard_id,
        s.code as standard_code,
        s.title as standard_title,
        d.code as domain_code,
        d.name as domain_name,
        COALESCE(sp.mastery_level, 0) as mastery_level,
        COALESCE(sp.attempts, 0) as attempts,
        COALESCE(sp.time_spent_minutes, 0) as time_spent_minutes,
        sp.last_attempt_at,
        sp.mastered_at
      FROM standards s
      JOIN clusters c ON s.cluster_id = c.id
      JOIN domains d ON c.domain_id = d.id
      JOIN grade_levels gl ON c.grade_id = gl.id
      JOIN users u ON gl.id = u.current_grade_id
      LEFT JOIN student_progress sp ON s.id = sp.standard_id AND sp.student_id = u.id
      WHERE u.id = $1
    `
    
    const params: any[] = [studentId]
    
    if (domainCode) {
      query += ' AND d.code = $2'
      params.push(domainCode)
    }
    
    query += ' ORDER BY s.code'
    
    const result = await this.pool.query(query, params)
    
    return result.rows.map(row => ({
      standardId: row.standard_id,
      standardCode: row.standard_code,
      standardTitle: row.standard_title,
      domainCode: row.domain_code,
      domainName: row.domain_name,
      masteryLevel: parseFloat(row.mastery_level),
      attempts: parseInt(row.attempts),
      timeSpentMinutes: parseInt(row.time_spent_minutes),
      lastAttemptAt: row.last_attempt_at,
      masteredAt: row.mastered_at
    }))
  }

  /**
   * Record a learning session and update progress
   */
  async recordLearningSession(
    studentId: number, 
    standardId: number, 
    sessionScore: number, 
    timeSpentMinutes: number,
    _problemsAttempted: number,
    _problemsCorrect: number
  ): Promise<void> {
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Update student progress
      await client.query(`
        INSERT INTO student_progress (
          student_id, standard_id, mastery_level, attempts, 
          first_attempt_at, last_attempt_at, time_spent_minutes
        ) VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4)
        ON CONFLICT (student_id, standard_id) DO UPDATE SET
          mastery_level = CASE 
            WHEN $3 > student_progress.mastery_level THEN $3
            ELSE (student_progress.mastery_level * 0.7) + ($3 * 0.3)
          END,
          attempts = student_progress.attempts + 1,
          last_attempt_at = CURRENT_TIMESTAMP,
          time_spent_minutes = student_progress.time_spent_minutes + $4,
          mastered_at = CASE 
            WHEN $3 >= 0.8 AND student_progress.mastered_at IS NULL 
            THEN CURRENT_TIMESTAMP 
            ELSE student_progress.mastered_at 
          END,
          updated_at = CURRENT_TIMESTAMP
      `, [studentId, standardId, sessionScore, timeSpentMinutes])
      
      // Check if intervention is needed
      await this.checkForInterventions(client, studentId, standardId, sessionScore)
      
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Generate adaptive learning path for student
   */
  async generateLearningPath(studentId: number): Promise<LearningPath> {
    const query = `
      WITH student_mastery AS (
        SELECT 
          standard_id, 
          mastery_level,
          CASE WHEN mastery_level >= 0.8 THEN 'mastered'
               WHEN mastery_level >= 0.6 THEN 'developing'
               WHEN mastery_level >= 0.3 THEN 'beginning'
               ELSE 'not_started'
          END as proficiency_level
        FROM student_progress 
        WHERE student_id = $1
      ),
      available_lessons AS (
        SELECT 
          l.id as lesson_id,
          s.id as standard_id,
          s.code,
          s.complexity_level,
          l.difficulty_level,
          COALESCE(sm.proficiency_level, 'not_started') as current_level,
          COALESCE(sm.mastery_level, 0) as mastery_level
        FROM lessons l
        JOIN standards s ON l.standard_id = s.id
        JOIN clusters c ON s.cluster_id = c.id
        JOIN grade_levels gl ON c.grade_id = gl.id
        JOIN users u ON gl.id = u.current_grade_id
        LEFT JOIN student_mastery sm ON s.id = sm.standard_id
        WHERE u.id = $1 AND l.is_published = true
      ),
      recommended_lessons AS (
        SELECT lesson_id, standard_id, code, current_level, mastery_level
        FROM available_lessons
        WHERE current_level IN ('not_started', 'beginning', 'developing')
        ORDER BY 
          CASE current_level 
            WHEN 'beginning' THEN 1
            WHEN 'not_started' THEN 2
            WHEN 'developing' THEN 3
          END,
          complexity_level,
          difficulty_level
        LIMIT 10
      )
      SELECT 
        array_agg(lesson_id ORDER BY complexity_level, difficulty_level) as recommended_lessons,
        string_agg(DISTINCT current_level, ', ') as current_levels,
        avg(mastery_level) as avg_mastery
      FROM recommended_lessons
    `
    
    const result = await this.pool.query(query, [studentId])
    
    if (result.rows.length === 0) {
      return {
        studentId,
        recommendedLessons: [],
        reasoning: 'No suitable lessons found for current grade level',
        currentLevel: 'unknown',
        nextMilestones: []
      }
    }
    
    const row = result.rows[0]
    const avgMastery = parseFloat(row.avg_mastery) || 0
    
    let reasoning = 'Based on current progress: '
    if (avgMastery < 0.3) {
      reasoning += 'Focus on fundamental concepts and building basic skills.'
    } else if (avgMastery < 0.6) {
      reasoning += 'Continue practicing core concepts with some new challenges.'
    } else if (avgMastery < 0.8) {
      reasoning += 'Ready for more advanced problems and application.'
    } else {
      reasoning += 'Mastery achieved, ready for enrichment and next grade preparation.'
    }
    
    return {
      studentId,
      recommendedLessons: row.recommended_lessons || [],
      reasoning,
      currentLevel: row.current_levels || 'not_started',
      nextMilestones: await this.getNextMilestones(studentId)
    }
  }

  /**
   * Get adaptive feedback based on recent performance
   */
  async getAdaptiveFeedback(studentId: number): Promise<AdaptiveFeedback> {
    const query = `
      WITH recent_progress AS (
        SELECT 
          sp.standard_id,
          sp.mastery_level,
          sp.attempts,
          sp.last_attempt_at,
          s.code as standard_code,
          d.code as domain_code,
          d.name as domain_name
        FROM student_progress sp
        JOIN standards s ON sp.standard_id = s.id
        JOIN clusters c ON s.cluster_id = c.id
        JOIN domains d ON c.domain_id = d.id
        WHERE sp.student_id = $1 
          AND sp.last_attempt_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
      ),
      struggling_standards AS (
        SELECT standard_id, domain_code, domain_name
        FROM recent_progress
        WHERE mastery_level < 0.5 AND attempts >= 3
      ),
      ready_for_advancement AS (
        SELECT standard_id, domain_code, domain_name
        FROM recent_progress
        WHERE mastery_level >= 0.8
      ),
      needs_review AS (
        SELECT standard_id, domain_code, domain_name
        FROM recent_progress
        WHERE mastery_level BETWEEN 0.5 AND 0.79 
          AND last_attempt_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
      )
      SELECT 
        COALESCE(array_agg(DISTINCT ss.standard_id), ARRAY[]::integer[]) as struggling,
        COALESCE(array_agg(DISTINCT rfa.standard_id), ARRAY[]::integer[]) as ready_advancement,
        COALESCE(array_agg(DISTINCT nr.standard_id), ARRAY[]::integer[]) as needs_review,
        COALESCE(array_agg(DISTINCT ss.domain_name), ARRAY[]::text[]) as struggling_domains,
        COALESCE(array_agg(DISTINCT rfa.domain_name), ARRAY[]::text[]) as strength_domains
      FROM struggling_standards ss
      FULL OUTER JOIN ready_for_advancement rfa ON true
      FULL OUTER JOIN needs_review nr ON true
    `
    
    const result = await this.pool.query(query, [studentId])
    const row = result.rows[0]
    
    const recommendations = []
    
    if (row.struggling?.length > 0) {
      recommendations.push('Consider reviewing fundamental concepts before attempting new material')
      recommendations.push('Use visual aids and manipulatives for better understanding')
    }
    
    if (row.ready_advancement?.length > 0) {
      recommendations.push('Ready for more challenging problems in strong areas')
      recommendations.push('Consider enrichment activities to deepen understanding')
    }
    
    if (row.needs_review?.length > 0) {
      recommendations.push('Schedule review sessions for recently learned concepts')
    }
    
    return {
      needsReview: row.needs_review || [],
      readyForAdvancement: row.ready_advancement || [],
      strugglingAreas: row.struggling_domains || [],
      strengthAreas: row.strength_domains || [],
      recommendations
    }
  }

  /**
   * Get time-based analytics for student engagement
   */
  async getEngagementAnalytics(studentId: number, days: number = 30): Promise<any> {
    const query = `
      WITH daily_activity AS (
        SELECT 
          DATE(sp.last_attempt_at) as activity_date,
          COUNT(DISTINCT sp.standard_id) as standards_worked,
          SUM(sp.time_spent_minutes) as total_minutes,
          AVG(sp.mastery_level) as avg_performance
        FROM student_progress sp
        WHERE sp.student_id = $1 
          AND sp.last_attempt_at > CURRENT_TIMESTAMP - INTERVAL '$2 days'
        GROUP BY DATE(sp.last_attempt_at)
        ORDER BY activity_date
      ),
      weekly_trends AS (
        SELECT 
          DATE_TRUNC('week', sp.last_attempt_at) as week_start,
          COUNT(DISTINCT sp.standard_id) as standards_per_week,
          SUM(sp.time_spent_minutes) as minutes_per_week,
          AVG(sp.mastery_level) as avg_weekly_performance
        FROM student_progress sp
        WHERE sp.student_id = $1 
          AND sp.last_attempt_at > CURRENT_TIMESTAMP - INTERVAL '$2 days'
        GROUP BY DATE_TRUNC('week', sp.last_attempt_at)
        ORDER BY week_start
      )
      SELECT 
        json_agg(da ORDER BY da.activity_date) as daily_activity,
        json_agg(wt ORDER BY wt.week_start) as weekly_trends
      FROM daily_activity da
      FULL OUTER JOIN weekly_trends wt ON true
    `
    
    const result = await this.pool.query(query, [studentId, days])
    return result.rows[0] || { daily_activity: [], weekly_trends: [] }
  }

  /**
   * Private helper to check for interventions
   */
  private async checkForInterventions(
    client: any, 
    studentId: number, 
    standardId: number, 
    _sessionScore: number
  ): Promise<void> {
    // Check if student is struggling (multiple attempts with low scores)
    const struggleCheck = await client.query(`
      SELECT attempts, mastery_level
      FROM student_progress
      WHERE student_id = $1 AND standard_id = $2
    `, [studentId, standardId])
    
    if (struggleCheck.rows.length > 0) {
      const { attempts, mastery_level } = struggleCheck.rows[0]
      
      if (attempts >= 3 && mastery_level < 0.5) {
        await client.query(`
          INSERT INTO interventions (
            student_id, standard_id, intervention_type, priority, message, recommended_actions
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (student_id, standard_id, intervention_type) 
          WHERE is_resolved = false DO NOTHING
        `, [
          studentId, 
          standardId, 
          'remediation',
          'high',
          'Student is struggling with this concept after multiple attempts',
          JSON.stringify({
            actions: ['review_prerequisites', 'use_manipulatives', 'teacher_assistance'],
            suggested_resources: ['visual_aids', 'step_by_step_tutorials']
          })
        ])
      }
    }
  }

  /**
   * Private helper to get next milestones
   */
  private async getNextMilestones(studentId: number): Promise<string[]> {
    const query = `
      SELECT DISTINCT d.name
      FROM standards s
      JOIN clusters c ON s.cluster_id = c.id
      JOIN domains d ON c.domain_id = d.id
      JOIN grade_levels gl ON c.grade_id = gl.id
      JOIN users u ON gl.id = u.current_grade_id
      LEFT JOIN student_progress sp ON s.id = sp.standard_id AND sp.student_id = u.id
      WHERE u.id = $1 AND (sp.mastery_level IS NULL OR sp.mastery_level < 0.8)
      ORDER BY d.name
      LIMIT 3
    `
    
    const result = await this.pool.query(query, [studentId])
    return result.rows.map(row => `Master ${row.name} concepts`)
  }
}

export default ProgressTrackingService