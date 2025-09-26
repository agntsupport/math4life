import { Pool } from 'pg'

export interface GradeLevel {
  id: number
  code: string
  name: string
  displayOrder: number
  ageRange: string
  createdAt: Date
  updatedAt: Date
}

export interface Domain {
  id: number
  code: string
  name: string
  description: string
  gradeStart: string
  gradeEnd: string
  createdAt: Date
}

export interface Standard {
  id: number
  clusterId: number
  code: string
  title: string
  description: string
  examples?: string
  prerequisiteStandards: number[]
  complexityLevel: number
  createdAt: Date
}

export interface StudentProgress {
  id: number
  studentId: number
  standardId: number
  masteryLevel: number
  attempts: number
  firstAttemptAt?: Date
  lastAttemptAt?: Date
  masteredAt?: Date
  timeSpentMinutes: number
  createdAt: Date
  updatedAt: Date
}

export class GradeLevelService {
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  /**
   * Get all grade levels ordered by display order
   */
  async getAllGradeLevels(): Promise<GradeLevel[]> {
    const query = `
      SELECT id, code, name, display_order as "displayOrder", 
             age_range as "ageRange", created_at as "createdAt", 
             updated_at as "updatedAt"
      FROM grade_levels 
      ORDER BY display_order
    `
    const result = await this.pool.query(query)
    return result.rows
  }

  /**
   * Get grade level by code (K, 1, 2, etc.)
   */
  async getGradeLevelByCode(code: string): Promise<GradeLevel | null> {
    const query = `
      SELECT id, code, name, display_order as "displayOrder", 
             age_range as "ageRange", created_at as "createdAt", 
             updated_at as "updatedAt"
      FROM grade_levels 
      WHERE code = $1
    `
    const result = await this.pool.query(query, [code])
    return result.rows[0] || null
  }

  /**
   * Get domains available for a specific grade
   */
  async getDomainsForGrade(gradeCode: string): Promise<Domain[]> {
    const query = `
      SELECT d.id, d.code, d.name, d.description, 
             d.grade_start as "gradeStart", d.grade_end as "gradeEnd", 
             d.created_at as "createdAt", gd.is_primary as "isPrimary"
      FROM domains d
      JOIN grade_domains gd ON d.id = gd.domain_id
      JOIN grade_levels gl ON gd.grade_id = gl.id
      WHERE gl.code = $1
      ORDER BY d.code
    `
    const result = await this.pool.query(query, [gradeCode])
    return result.rows
  }

  /**
   * Get standards for a specific grade and domain
   */
  async getStandardsForGradeDomain(gradeCode: string, domainCode: string): Promise<Standard[]> {
    const query = `
      SELECT s.id, s.cluster_id as "clusterId", s.code, s.title, 
             s.description, s.examples, s.prerequisite_standards as "prerequisiteStandards",
             s.complexity_level as "complexityLevel", s.created_at as "createdAt"
      FROM standards s
      JOIN clusters c ON s.cluster_id = c.id
      JOIN domains d ON c.domain_id = d.id
      JOIN grade_levels gl ON c.grade_id = gl.id
      WHERE gl.code = $1 AND d.code = $2
      ORDER BY s.code
    `
    const result = await this.pool.query(query, [gradeCode, domainCode])
    return result.rows
  }

  /**
   * Get student's current grade level
   */
  async getStudentGradeLevel(studentId: number): Promise<GradeLevel | null> {
    const query = `
      SELECT gl.id, gl.code, gl.name, gl.display_order as "displayOrder", 
             gl.age_range as "ageRange", gl.created_at as "createdAt", 
             gl.updated_at as "updatedAt"
      FROM grade_levels gl
      JOIN users u ON gl.id = u.current_grade_id
      WHERE u.id = $1
    `
    const result = await this.pool.query(query, [studentId])
    return result.rows[0] || null
  }

  /**
   * Update student's grade level
   */
  async updateStudentGradeLevel(studentId: number, gradeCode: string): Promise<boolean> {
    const gradeLevel = await this.getGradeLevelByCode(gradeCode)
    if (!gradeLevel) {
      throw new Error(`Grade level ${gradeCode} not found`)
    }

    const query = `
      UPDATE users 
      SET current_grade_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `
    const result = await this.pool.query(query, [gradeLevel.id, studentId])
    return (result.rowCount || 0) > 0
  }

  /**
   * Get student progress overview for their current grade
   */
  async getStudentGradeProgress(studentId: number): Promise<any> {
    const query = `
      SELECT 
        gl.code as grade_code,
        gl.name as grade_name,
        d.code as domain_code,
        d.name as domain_name,
        COUNT(s.id) as total_standards,
        COUNT(sp.standard_id) as attempted_standards,
        COUNT(CASE WHEN sp.mastery_level >= 0.8 THEN 1 END) as mastered_standards,
        COALESCE(AVG(sp.mastery_level), 0) as average_mastery
      FROM users u
      JOIN grade_levels gl ON u.current_grade_id = gl.id
      JOIN grade_domains gd ON gl.id = gd.grade_id
      JOIN domains d ON gd.domain_id = d.id
      JOIN clusters c ON d.id = c.domain_id AND gl.id = c.grade_id
      JOIN standards s ON c.id = s.cluster_id
      LEFT JOIN student_progress sp ON s.id = sp.standard_id AND u.id = sp.student_id
      WHERE u.id = $1
      GROUP BY gl.code, gl.name, d.code, d.name, d.id
      ORDER BY d.code
    `
    const result = await this.pool.query(query, [studentId])
    return result.rows
  }

  /**
   * Get recommended next standards for a student based on their progress
   */
  async getRecommendedStandards(studentId: number, limit: number = 5): Promise<Standard[]> {
    const query = `
      WITH student_mastered AS (
        SELECT standard_id 
        FROM student_progress 
        WHERE student_id = $1 AND mastery_level >= 0.8
      ),
      available_standards AS (
        SELECT s.*, 
               CASE WHEN sm.standard_id IS NOT NULL THEN 1 ELSE 0 END as is_mastered,
               COALESCE(sp.mastery_level, 0) as current_mastery
        FROM standards s
        JOIN clusters c ON s.cluster_id = c.id
        JOIN grade_levels gl ON c.grade_id = gl.id
        JOIN users u ON gl.id = u.current_grade_id
        LEFT JOIN student_mastered sm ON s.id = sm.standard_id
        LEFT JOIN student_progress sp ON s.id = sp.standard_id AND sp.student_id = $1
        WHERE u.id = $1 AND sm.standard_id IS NULL
      )
      SELECT id, cluster_id as "clusterId", code, title, description, 
             examples, prerequisite_standards as "prerequisiteStandards",
             complexity_level as "complexityLevel", created_at as "createdAt"
      FROM available_standards
      WHERE current_mastery < 0.8
      ORDER BY complexity_level, current_mastery DESC
      LIMIT $2
    `
    const result = await this.pool.query(query, [studentId, limit])
    return result.rows
  }

  /**
   * Record student progress on a standard
   */
  async updateStudentProgress(
    studentId: number, 
    standardId: number, 
    score: number, 
    timeSpentMinutes: number
  ): Promise<StudentProgress> {
    const query = `
      INSERT INTO student_progress (
        student_id, standard_id, mastery_level, attempts, 
        first_attempt_at, last_attempt_at, time_spent_minutes
      ) VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4)
      ON CONFLICT (student_id, standard_id) DO UPDATE SET
        mastery_level = GREATEST(student_progress.mastery_level, $3),
        attempts = student_progress.attempts + 1,
        last_attempt_at = CURRENT_TIMESTAMP,
        time_spent_minutes = student_progress.time_spent_minutes + $4,
        mastered_at = CASE WHEN $3 >= 0.8 AND student_progress.mastered_at IS NULL 
                          THEN CURRENT_TIMESTAMP 
                          ELSE student_progress.mastered_at END,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, student_id as "studentId", standard_id as "standardId",
                mastery_level as "masteryLevel", attempts, 
                first_attempt_at as "firstAttemptAt", last_attempt_at as "lastAttemptAt",
                mastered_at as "masteredAt", time_spent_minutes as "timeSpentMinutes",
                created_at as "createdAt", updated_at as "updatedAt"
    `
    const result = await this.pool.query(query, [studentId, standardId, score, timeSpentMinutes])
    return result.rows[0]
  }

  /**
   * Get grade level statistics (for admin/teacher dashboards)
   */
  async getGradeLevelStats(gradeCode: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT u.id) as total_students,
        COUNT(DISTINCT s.id) as total_standards,
        AVG(sp.mastery_level) as average_mastery,
        COUNT(CASE WHEN sp.mastery_level >= 0.8 THEN 1 END) as total_masteries,
        COUNT(sp.standard_id) as total_attempts
      FROM grade_levels gl
      LEFT JOIN users u ON gl.id = u.current_grade_id
      LEFT JOIN grade_domains gd ON gl.id = gd.grade_id
      LEFT JOIN domains d ON gd.domain_id = d.id
      LEFT JOIN clusters c ON d.id = c.domain_id AND gl.id = c.grade_id
      LEFT JOIN standards s ON c.id = s.cluster_id
      LEFT JOIN student_progress sp ON s.id = sp.standard_id AND u.id = sp.student_id
      WHERE gl.code = $1
    `
    const result = await this.pool.query(query, [gradeCode])
    return result.rows[0]
  }

  /**
   * Check if a student can access a specific grade level content
   */
  async canStudentAccessGrade(studentId: number, targetGradeCode: string): Promise<boolean> {
    const studentGrade = await this.getStudentGradeLevel(studentId)
    const targetGrade = await this.getGradeLevelByCode(targetGradeCode)
    
    if (!studentGrade || !targetGrade) return false
    
    // Students can access their current grade and previous grades
    return targetGrade.displayOrder <= studentGrade.displayOrder
  }
}

export default GradeLevelService