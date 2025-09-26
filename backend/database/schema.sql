-- Math4Life K-8 Curriculum Database Schema
-- Foundation Architecture for Common Core Standards Implementation

-- ============================================================================
-- CORE CURRICULUM STRUCTURE
-- ============================================================================

-- Grade levels from Kindergarten to 8th grade
CREATE TABLE grade_levels (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL, -- 'K', '1', '2', ..., '8'
    name VARCHAR(50) NOT NULL, -- 'Kindergarten', 'Grade 1', etc.
    display_order INTEGER NOT NULL,
    age_range VARCHAR(20), -- '5-6', '6-7', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mathematical domains (changes by grade level)
CREATE TABLE domains (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL, -- 'CC', 'OA', 'NBT', 'NF', 'MD', 'G', 'RP', 'NS', 'EE', 'F', 'SP'
    name VARCHAR(100) NOT NULL, -- 'Counting and Cardinality', 'Operations & Algebraic Thinking'
    description TEXT,
    grade_start VARCHAR(10), -- Starting grade for this domain
    grade_end VARCHAR(10), -- Ending grade for this domain
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grade-Domain relationships (many-to-many)
CREATE TABLE grade_domains (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grade_levels(id),
    domain_id INTEGER REFERENCES domains(id),
    is_primary BOOLEAN DEFAULT false, -- Major focus area for this grade
    UNIQUE(grade_id, domain_id)
);

-- Standards clusters within domains
CREATE TABLE clusters (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER REFERENCES domains(id),
    grade_id INTEGER REFERENCES grade_levels(id),
    code VARCHAR(20) NOT NULL, -- e.g., 'K.CC.A'
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cluster_type VARCHAR(20) DEFAULT 'major', -- 'major', 'supporting', 'additional'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual Common Core standards
CREATE TABLE standards (
    id SERIAL PRIMARY KEY,
    cluster_id INTEGER REFERENCES clusters(id),
    code VARCHAR(30) UNIQUE NOT NULL, -- e.g., 'K.CC.A.1'
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    examples TEXT, -- Example problems or scenarios
    prerequisite_standards INTEGER[], -- Array of prerequisite standard IDs
    complexity_level INTEGER DEFAULT 1, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTENT STRUCTURE
-- ============================================================================

-- Lesson types (tutorial, practice, assessment, etc.)
CREATE TABLE lesson_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL, -- 'tutorial', 'guided', 'practice', 'assessment'
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- For UI display
    color VARCHAR(20) -- Theme color
);

-- Individual lessons aligned to standards
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    standard_id INTEGER REFERENCES standards(id),
    lesson_type_id INTEGER REFERENCES lesson_types(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content JSONB, -- Lesson content structure
    difficulty_level INTEGER DEFAULT 1, -- 1-5 within the standard
    estimated_minutes INTEGER DEFAULT 15,
    prerequisites INTEGER[], -- Array of prerequisite lesson IDs
    learning_objectives TEXT[],
    materials_needed TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Problems/exercises within lessons
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id),
    problem_type VARCHAR(30) NOT NULL, -- 'multiple_choice', 'drag_drop', 'open_ended', 'interactive'
    question_text TEXT NOT NULL,
    question_data JSONB, -- Problem-specific data (images, interactive elements)
    correct_answer JSONB, -- Answer key
    hints TEXT[],
    explanation TEXT,
    difficulty INTEGER DEFAULT 1,
    points INTEGER DEFAULT 1,
    order_in_lesson INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- USER MANAGEMENT & PROGRESS
-- ============================================================================

-- User roles (student, teacher, parent, admin)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced user table for K-8 context
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role_id INTEGER REFERENCES user_roles(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    current_grade_id INTEGER REFERENCES grade_levels(id),
    birth_date DATE,
    parent_email VARCHAR(255), -- For students
    school_name VARCHAR(200),
    teacher_id INTEGER REFERENCES users(id), -- Student's primary teacher
    preferences JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student progress tracking per standard
CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    standard_id INTEGER REFERENCES standards(id),
    mastery_level DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0 (0% to 100%)
    attempts INTEGER DEFAULT 0,
    first_attempt_at TIMESTAMP,
    last_attempt_at TIMESTAMP,
    mastered_at TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, standard_id)
);

-- Detailed lesson completion tracking
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    lesson_id INTEGER REFERENCES lessons(id),
    status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'mastered'
    score DECIMAL(5,2), -- Percentage score
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, lesson_id)
);

-- Individual problem attempt tracking
CREATE TABLE problem_attempts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    problem_id INTEGER REFERENCES problems(id),
    lesson_progress_id INTEGER REFERENCES lesson_progress(id),
    student_answer JSONB,
    is_correct BOOLEAN,
    points_earned INTEGER,
    time_spent_seconds INTEGER,
    hints_used INTEGER DEFAULT 0,
    attempt_number INTEGER,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ASSESSMENT & ANALYTICS
-- ============================================================================

-- Formal assessments (unit tests, grade-level assessments)
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    grade_id INTEGER REFERENCES grade_levels(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(30), -- 'diagnostic', 'formative', 'summative', 'placement'
    standards_covered INTEGER[], -- Array of standard IDs
    total_points INTEGER,
    passing_score INTEGER,
    time_limit_minutes INTEGER,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student assessment results
CREATE TABLE assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id),
    student_id INTEGER REFERENCES users(id),
    score INTEGER,
    percentage DECIMAL(5,2),
    time_spent_minutes INTEGER,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    detailed_results JSONB, -- Breakdown by standard/question
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning path recommendations
CREATE TABLE learning_paths (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    recommended_lessons INTEGER[], -- Array of lesson IDs in order
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- ADAPTIVE LEARNING ENGINE
-- ============================================================================

-- Difficulty adjustment tracking
CREATE TABLE difficulty_adjustments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    standard_id INTEGER REFERENCES standards(id),
    old_level INTEGER,
    new_level INTEGER,
    reason VARCHAR(100), -- 'too_easy', 'too_hard', 'mastered', 'struggling'
    algorithm_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Intervention triggers and recommendations
CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    standard_id INTEGER REFERENCES standards(id),
    intervention_type VARCHAR(50), -- 'review', 'remediation', 'enrichment', 'teacher_alert'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    message TEXT,
    recommended_actions JSONB,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

-- Multimedia resources (images, videos, audio)
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL, -- 'image', 'video', 'audio', 'document', 'interactive'
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500),
    mime_type VARCHAR(100),
    file_size INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource associations with lessons/problems
CREATE TABLE lesson_resources (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id),
    resource_id INTEGER REFERENCES resources(id),
    resource_role VARCHAR(50), -- 'main_content', 'example', 'hint', 'solution'
    order_in_lesson INTEGER,
    UNIQUE(lesson_id, resource_id, resource_role)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core query indexes
CREATE INDEX idx_users_current_grade ON users(current_grade_id);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_teacher ON users(teacher_id);

CREATE INDEX idx_standards_cluster ON standards(cluster_id);
CREATE INDEX idx_standards_code ON standards(code);

CREATE INDEX idx_lessons_standard ON lessons(standard_id);
CREATE INDEX idx_lessons_type ON lessons(lesson_type_id);
CREATE INDEX idx_lessons_published ON lessons(is_published);

CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_standard ON student_progress(standard_id);
CREATE INDEX idx_student_progress_mastery ON student_progress(mastery_level);

CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(status);

CREATE INDEX idx_problem_attempts_student ON problem_attempts(student_id);
CREATE INDEX idx_problem_attempts_problem ON problem_attempts(problem_id);

CREATE INDEX idx_assessment_results_student ON assessment_results(student_id);
CREATE INDEX idx_assessment_results_assessment ON assessment_results(assessment_id);

-- ============================================================================
-- INITIAL DATA SETUP
-- ============================================================================

-- Insert grade levels
INSERT INTO grade_levels (code, name, display_order, age_range) VALUES
('K', 'Kindergarten', 0, '5-6'),
('1', 'Grade 1', 1, '6-7'),
('2', 'Grade 2', 2, '7-8'),
('3', 'Grade 3', 3, '8-9'),
('4', 'Grade 4', 4, '9-10'),
('5', 'Grade 5', 5, '10-11'),
('6', 'Grade 6', 6, '11-12'),
('7', 'Grade 7', 7, '12-13'),
('8', 'Grade 8', 8, '13-14');

-- Insert mathematical domains
INSERT INTO domains (code, name, description, grade_start, grade_end) VALUES
('CC', 'Counting and Cardinality', 'Know number names and the count sequence', 'K', 'K'),
('OA', 'Operations and Algebraic Thinking', 'Represent and solve problems involving addition, subtraction, multiplication, and division', 'K', '5'),
('NBT', 'Number and Operations in Base Ten', 'Understand place value and operations with multi-digit numbers', 'K', '5'),
('NF', 'Number and Operations—Fractions', 'Develop understanding of fractions as numbers', '3', '5'),
('MD', 'Measurement and Data', 'Solve problems involving measurement and representation of data', 'K', '5'),
('G', 'Geometry', 'Reason with shapes and their attributes', 'K', '8'),
('RP', 'Ratios and Proportional Relationships', 'Understand ratio concepts and proportional relationships', '6', '7'),
('NS', 'The Number System', 'Apply and extend understanding of numbers and operations', '6', '8'),
('EE', 'Expressions and Equations', 'Work with algebraic expressions and solve equations', '6', '8'),
('F', 'Functions', 'Define, evaluate, and compare functions', '8', '8'),
('SP', 'Statistics and Probability', 'Develop understanding of statistical thinking', '6', '8');

-- Insert user roles
INSERT INTO user_roles (name, permissions) VALUES
('student', '{"view_lessons": true, "take_assessments": true, "view_progress": true}'),
('teacher', '{"view_all_lessons": true, "create_assignments": true, "view_student_progress": true, "grade_assessments": true}'),
('parent', '{"view_child_progress": true, "view_lessons": false, "receive_reports": true}'),
('admin', '{"full_access": true}');

-- Insert lesson types
INSERT INTO lesson_types (code, name, description, icon, color) VALUES
('tutorial', 'Tutorial', 'Guided introduction to new concepts', 'school', 'blue'),
('guided', 'Guided Practice', 'Step-by-step practice with support', 'psychology', 'green'),
('practice', 'Independent Practice', 'Self-paced problem solving', 'fitness_center', 'orange'),
('assessment', 'Assessment', 'Evaluation of understanding', 'assignment', 'red'),
('review', 'Review', 'Reinforce previously learned concepts', 'refresh', 'purple'),
('enrichment', 'Enrichment', 'Advanced or extended learning', 'star', 'gold');

-- Add comments for documentation
COMMENT ON TABLE grade_levels IS 'Educational grade levels from Kindergarten through 8th grade';
COMMENT ON TABLE domains IS 'Mathematical domains as defined by Common Core Standards';
COMMENT ON TABLE standards IS 'Individual Common Core State Standards with full text and examples';
COMMENT ON TABLE student_progress IS 'Tracks mastery level for each student per standard';
COMMENT ON TABLE lessons IS 'Individual learning activities aligned to standards';
COMMENT ON TABLE problem_attempts IS 'Detailed tracking of student responses to practice problems';

-- Performance optimization views
CREATE VIEW student_current_progress AS
SELECT 
    u.id as student_id,
    u.first_name,
    u.last_name,
    gl.name as current_grade,
    COUNT(sp.standard_id) as standards_attempted,
    AVG(sp.mastery_level) as average_mastery,
    COUNT(CASE WHEN sp.mastery_level >= 0.8 THEN 1 END) as standards_mastered
FROM users u
JOIN grade_levels gl ON u.current_grade_id = gl.id
LEFT JOIN student_progress sp ON u.id = sp.student_id
WHERE u.role_id = (SELECT id FROM user_roles WHERE name = 'student')
GROUP BY u.id, u.first_name, u.last_name, gl.name;

CREATE VIEW grade_standards_overview AS
SELECT 
    gl.code as grade_code,
    gl.name as grade_name,
    d.code as domain_code,
    d.name as domain_name,
    COUNT(s.id) as total_standards,
    COUNT(c.id) as total_clusters
FROM grade_levels gl
JOIN grade_domains gd ON gl.id = gd.grade_id
JOIN domains d ON gd.domain_id = d.id
LEFT JOIN clusters c ON d.id = c.domain_id AND gl.id = c.grade_id
LEFT JOIN standards s ON c.id = s.cluster_id
GROUP BY gl.id, gl.code, gl.name, d.id, d.code, d.name
ORDER BY gl.display_order, d.code;