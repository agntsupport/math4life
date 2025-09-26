-- Math4Life K-8 Standards Database Seeder
-- Populates database with Common Core Math Standards

-- ============================================================================
-- KINDERGARTEN STANDARDS
-- ============================================================================

-- Set up grade-domain relationships for Kindergarten
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('CC', 'OA') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = 'K' AND d.code IN ('CC', 'OA', 'NBT', 'MD', 'G');

-- Kindergarten Counting and Cardinality clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'CC'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.CC.A', 'Know number names and the count sequence', 
 'Students learn to count to 100 by ones and tens, count forward from any given number, and write numbers 0-20', 'major'),
((SELECT id FROM domains WHERE code = 'CC'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.CC.B', 'Count to tell the number of objects', 
 'Students understand the relationship between numbers and quantities up to 20', 'major'),
((SELECT id FROM domains WHERE code = 'CC'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.CC.C', 'Compare numbers', 
 'Students identify whether the number of objects in one group is greater than, less than, or equal to another group', 'major');

-- Kindergarten Counting and Cardinality standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = 'K.CC.A'), 'K.CC.A.1', 
 'Count to 100 by ones and by tens',
 'Count to 100 by ones and by tens.',
 'Count: 1, 2, 3... up to 100. Count by tens: 10, 20, 30... up to 100.', 1),

((SELECT id FROM clusters WHERE code = 'K.CC.A'), 'K.CC.A.2', 
 'Count forward beginning from a given number',
 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
 'Start counting from 47 and continue: 47, 48, 49, 50...', 2),

((SELECT id FROM clusters WHERE code = 'K.CC.A'), 'K.CC.A.3', 
 'Write numbers from 0 to 20',
 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
 'Write the number 15. Show 8 objects and write the numeral 8.', 2),

((SELECT id FROM clusters WHERE code = 'K.CC.B'), 'K.CC.B.4', 
 'Understand the relationship between numbers and quantities',
 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
 'When counting objects, the last number counted tells how many objects there are in total.', 3),

((SELECT id FROM clusters WHERE code = 'K.CC.B'), 'K.CC.B.5', 
 'Count to answer "how many?" questions',
 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration.',
 'Count 15 toys arranged in a line. Count 8 stickers arranged in a circle.', 2),

((SELECT id FROM clusters WHERE code = 'K.CC.C'), 'K.CC.C.6', 
 'Compare two numbers between 1 and 10',
 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group.',
 'Compare groups of 7 and 5 objects. Determine that 7 > 5.', 3),

((SELECT id FROM clusters WHERE code = 'K.CC.C'), 'K.CC.C.7', 
 'Compare two numbers between 1 and 10 presented as written numerals',
 'Compare two numbers between 1 and 10 presented as written numerals.',
 'Compare 8 and 6. Determine that 8 > 6.', 3);

-- Kindergarten Operations and Algebraic Thinking clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.OA.A', 'Understand addition as putting together and adding to', 
 'Students represent addition and subtraction with objects, fingers, drawings, sounds, acting out situations, and verbal explanations', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.OA.B', 'Understand subtraction as taking apart and taking from', 
 'Students understand subtraction as taking apart and taking from', 'major');

-- Kindergarten Operations and Algebraic Thinking standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = 'K.OA.A'), 'K.OA.A.1', 
 'Represent addition and subtraction',
 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.',
 'Use objects to show 3 + 2 = 5. Act out a story problem: "I had 4 apples and ate 1. How many are left?"', 2),

((SELECT id FROM clusters WHERE code = 'K.OA.A'), 'K.OA.A.2', 
 'Solve addition and subtraction word problems',
 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
 'Maria has 3 stickers. Her friend gives her 2 more. How many stickers does Maria have now?', 3),

((SELECT id FROM clusters WHERE code = 'K.OA.A'), 'K.OA.A.3', 
 'Decompose numbers less than or equal to 10',
 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation.',
 'Show that 5 = 2 + 3 and 5 = 4 + 1. Draw pictures to show different ways to make 7.', 4),

((SELECT id FROM clusters WHERE code = 'K.OA.A'), 'K.OA.A.4', 
 'Find the number that makes 10',
 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
 'If I have 7, how many more do I need to make 10? 7 + ? = 10', 4),

((SELECT id FROM clusters WHERE code = 'K.OA.A'), 'K.OA.A.5', 
 'Fluently add and subtract within 5',
 'Fluently add and subtract within 5.',
 'Quickly solve: 2 + 3, 5 - 1, 4 + 1, 3 - 2', 3);

-- ============================================================================
-- GRADE 1 STANDARDS (Sample)
-- ============================================================================

-- Set up grade-domain relationships for Grade 1
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NBT') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '1' AND d.code IN ('OA', 'NBT', 'MD', 'G');

-- Grade 1 Operations and Algebraic Thinking clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.OA.A', 'Represent and solve problems involving addition and subtraction', 
 'Students use addition and subtraction within 20 to solve word problems', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.OA.B', 'Understand and apply properties of operations', 
 'Students understand properties of addition and the relationship between addition and subtraction', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.OA.C', 'Add and subtract within 20', 
 'Students demonstrate fluency for addition and subtraction within 10', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.OA.D', 'Work with addition and subtraction equations', 
 'Students understand the meaning of the equal sign and determine if equations are true or false', 'supporting');

-- Grade 1 Operations and Algebraic Thinking standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '1.OA.A'), '1.OA.A.1', 
 'Add and subtract word problems within 20',
 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing.',
 'Tom has 8 baseball cards. His friend gives him 5 more. How many baseball cards does Tom have altogether?', 3),

((SELECT id FROM clusters WHERE code = '1.OA.A'), '1.OA.A.2', 
 'Solve word problems with three whole numbers',
 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20.',
 'At the park, there are 3 red flowers, 4 yellow flowers, and 2 purple flowers. How many flowers are there in total?', 4),

((SELECT id FROM clusters WHERE code = '1.OA.B'), '1.OA.B.3', 
 'Apply properties of operations',
 'Apply properties of operations as strategies to add and subtract.',
 'If 8 + 3 = 11 is known, then 3 + 8 = 11 is also known (commutative property). To add 2 + 6 + 4, add 6 + 4 = 10, then 2 + 10 = 12 (associative property).', 4),

((SELECT id FROM clusters WHERE code = '1.OA.B'), '1.OA.B.4', 
 'Understand subtraction as unknown-addend problem',
 'Understand subtraction as an unknown-addend problem.',
 'Find 10 - 8 by finding the number that makes 10 when added to 8: 8 + ? = 10', 4),

((SELECT id FROM clusters WHERE code = '1.OA.C'), '1.OA.C.5', 
 'Relate counting to addition and subtraction',
 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).',
 'To solve 6 + 3, start at 6 and count on: 7, 8, 9', 2),

((SELECT id FROM clusters WHERE code = '1.OA.C'), '1.OA.C.6', 
 'Add and subtract within 20 using strategies',
 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10.',
 'Use strategies like making 10: 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13', 3);

-- ============================================================================
-- GRADE 3 STANDARDS (Sample - Introduction of Fractions)
-- ============================================================================

-- Set up grade-domain relationships for Grade 3
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NF') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '3' AND d.code IN ('OA', 'NBT', 'NF', 'MD', 'G');

-- Grade 3 Number and Operations - Fractions clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '3'), 
 '3.NF.A', 'Develop understanding of fractions as numbers', 
 'Students understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts', 'major');

-- Grade 3 Fractions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.1', 
 'Understand a fraction 1/b',
 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a fraction a/b as the quantity formed by a parts of size 1/b.',
 'Understand that 1/4 represents one piece when a whole is divided into 4 equal parts. Understand that 3/4 represents 3 pieces of size 1/4.', 3),

((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.2', 
 'Understand a fraction on a number line',
 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.',
 'Represent 3/4 on a number line by dividing the distance from 0 to 1 into 4 equal parts and marking the point at 3/4.', 4),

((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.3', 
 'Explain equivalence of fractions',
 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.',
 'Recognize that 1/2 = 2/4 by using visual fraction models. Compare 1/3 and 1/2 by reasoning that 1/2 is larger because halves are bigger than thirds.', 4);

-- ============================================================================
-- GRADE 6 STANDARDS (Sample - Introduction of Ratios)
-- ============================================================================

-- Set up grade-domain relationships for Grade 6
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('RP', 'NS', 'EE') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '6' AND d.code IN ('RP', 'NS', 'EE', 'G', 'SP');

-- Grade 6 Ratios and Proportional Relationships clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'RP'), (SELECT id FROM grade_levels WHERE code = '6'), 
 '6.RP.A', 'Understand ratio concepts and use ratio reasoning', 
 'Students understand the concept of a ratio and use ratio language to describe relationships', 'major');

-- Grade 6 Ratios standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.1', 
 'Understand the concept of a ratio',
 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
 'The ratio of wings to beaks in the bird house at the zoo was 2:1, because for every 2 wings there was 1 beak.', 3),

((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.2', 
 'Understand the concept of a unit rate',
 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.',
 'This recipe has a ratio of 3 cups of flour to 4 cups of sugar, so there is 3/4 cup of flour for each cup of sugar.', 4),

((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.3', 
 'Use ratio and rate reasoning to solve problems',
 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.',
 'If it took 7 hours to mow 4 lawns, then at that rate, how many lawns could be mowed in 35 hours?', 5);

-- ============================================================================
-- GRADE 8 STANDARDS (Sample - Functions)
-- ============================================================================

-- Set up grade-domain relationships for Grade 8
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('EE', 'F') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '8' AND d.code IN ('NS', 'EE', 'F', 'G', 'SP');

-- Grade 8 Functions clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'F'), (SELECT id FROM grade_levels WHERE code = '8'), 
 '8.F.A', 'Define, evaluate, and compare functions', 
 'Students understand that a function is a rule that assigns to each input exactly one output', 'major'),
((SELECT id FROM domains WHERE code = 'F'), (SELECT id FROM grade_levels WHERE code = '8'), 
 '8.F.B', 'Use functions to model relationships between quantities', 
 'Students construct functions to model linear relationships between two quantities', 'major');

-- Grade 8 Functions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.1', 
 'Understand that a function is a rule',
 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.',
 'The function f(x) = 2x + 3 assigns to each input x exactly one output 2x + 3.', 4),

((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.2', 
 'Compare properties of two functions',
 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
 'Compare the rate of change of f(x) = 3x + 2 with the rate of change shown in a table of values for another linear function.', 5),

((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.3', 
 'Interpret the equation y = mx + b',
 'Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear.',
 'Recognize that y = 2x + 1 is a linear function with slope 2 and y-intercept 1, while y = x² is not linear.', 4),

((SELECT id FROM clusters WHERE code = '8.F.B'), '8.F.B.4', 
 'Construct a function to model a linear relationship',
 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values.',
 'A cell phone plan costs $20 per month plus $0.05 per text message. Write a function to model the monthly cost.', 5),

((SELECT id FROM clusters WHERE code = '8.F.B'), '8.F.B.5', 
 'Describe qualitatively the functional relationship',
 'Describe qualitatively the functional relationship between two quantities by analyzing a graph.',
 'Describe how the height of water in a bathtub changes over time as it is being filled, then drained.', 4);

-- ============================================================================
-- SET UP PREREQUISITE RELATIONSHIPS
-- ============================================================================

-- Update some standards with prerequisite relationships
UPDATE standards SET prerequisite_standards = ARRAY[]::integer[] WHERE code LIKE 'K.%';

UPDATE standards SET prerequisite_standards = ARRAY[
    (SELECT id FROM standards WHERE code = 'K.CC.A.1'),
    (SELECT id FROM standards WHERE code = 'K.CC.A.2')
] WHERE code = '1.OA.C.5';

UPDATE standards SET prerequisite_standards = ARRAY[
    (SELECT id FROM standards WHERE code = 'K.OA.A.1'),
    (SELECT id FROM standards WHERE code = 'K.OA.A.2')
] WHERE code = '1.OA.A.1';

UPDATE standards SET prerequisite_standards = ARRAY[
    (SELECT id FROM standards WHERE code = '1.OA.A.1'),
    (SELECT id FROM standards WHERE code = '1.OA.A.2')
] WHERE code = '3.NF.A.1';

-- ============================================================================
-- CREATE SAMPLE LESSON CONTENT
-- ============================================================================

-- Sample lessons for Kindergarten counting
INSERT INTO lessons (standard_id, lesson_type_id, title, description, content, difficulty_level, estimated_minutes, learning_objectives) VALUES
((SELECT id FROM standards WHERE code = 'K.CC.A.1'), 
 (SELECT id FROM lesson_types WHERE code = 'tutorial'), 
 'Counting to 10', 
 'Learn to count from 1 to 10 using fun animations and sounds',
 '{"type": "interactive_counting", "max_number": 10, "has_audio": true, "has_animation": true}',
 1, 15, 
 ARRAY['Count from 1 to 10', 'Recognize number sequence', 'Associate numbers with quantities']),

((SELECT id FROM standards WHERE code = 'K.CC.A.1'), 
 (SELECT id FROM lesson_types WHERE code = 'practice'), 
 'Counting Practice 1-20', 
 'Practice counting objects from 1 to 20 with immediate feedback',
 '{"type": "counting_practice", "min_number": 1, "max_number": 20, "objects": ["dots", "animals", "toys"]}',
 2, 20, 
 ARRAY['Count objects accurately', 'Recognize numbers 1-20', 'Build counting fluency']),

((SELECT id FROM standards WHERE code = 'K.OA.A.1'), 
 (SELECT id FROM lesson_types WHERE code = 'tutorial'), 
 'Introduction to Addition', 
 'Learn what addition means using visual objects and stories',
 '{"type": "addition_intro", "max_sum": 5, "use_manipulatives": true, "story_problems": true}',
 1, 20, 
 ARRAY['Understand addition concept', 'Use objects to add', 'Solve simple word problems']);

-- Update the schema version
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version) VALUES (1);

-- Add helpful comments
COMMENT ON DATABASE postgres IS 'Math4Life K-8 Curriculum Database - Common Core Standards Implementation';

-- Performance optimization: Update table statistics
ANALYZE;