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
 'Find the number that makes the equation true: 8 - ? = 3. This is the same as 3 + ? = 8.', 3),

((SELECT id FROM clusters WHERE code = '1.OA.C'), '1.OA.C.5', 
 'Count on to add within 20',
 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).',
 'To solve 8 + 3, count on from 8: 9, 10, 11. To solve 11 - 3, count back from 11: 10, 9, 8.', 2),

((SELECT id FROM clusters WHERE code = '1.OA.C'), '1.OA.C.6', 
 'Add and subtract within 20 with fluency',
 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10.',
 'Quickly solve problems like 7 + 3, 10 - 4, 8 + 2, 9 - 5 without counting.', 3),

((SELECT id FROM clusters WHERE code = '1.OA.D'), '1.OA.D.7', 
 'Understand the meaning of the equal sign',
 'Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false.',
 'Is 6 = 6 true? Is 7 = 8 - 1 true? Is 5 + 2 = 4 + 4 false?', 4),

((SELECT id FROM clusters WHERE code = '1.OA.D'), '1.OA.D.8', 
 'Find the unknown number in addition or subtraction equation',
 'Determine the unknown whole number in an addition or subtraction equation relating three whole numbers.',
 'Find the unknown in: 8 + ? = 11, 5 = ? - 3, 6 + 6 = ?', 4);

-- Grade 1 Number and Operations in Base Ten clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NBT'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.NBT.A', 'Extend the counting sequence', 
 'Students count to 120 and understand place value', 'major'),
((SELECT id FROM domains WHERE code = 'NBT'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.NBT.B', 'Understand place value', 
 'Students understand that two-digit numbers are composed of tens and ones', 'major'),
((SELECT id FROM domains WHERE code = 'NBT'), (SELECT id FROM grade_levels WHERE code = '1'), 
 '1.NBT.C', 'Use place value understanding to add and subtract', 
 'Students add within 100 using concrete models or drawings', 'supporting');

-- Grade 1 Number and Operations in Base Ten standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '1.NBT.A'), '1.NBT.A.1', 
 'Count to 120',
 'Count to 120, starting at any number less than 120.',
 'Count from 73 to 120. Count from 105 to 120.', 2),

((SELECT id FROM clusters WHERE code = '1.NBT.B'), '1.NBT.B.2', 
 'Understand two-digit numbers',
 'Understand that the two digits of a two-digit number represent amounts of tens and ones.',
 '23 is 2 tens and 3 ones. 45 is 4 tens and 5 ones.', 3),

((SELECT id FROM clusters WHERE code = '1.NBT.B'), '1.NBT.B.3', 
 'Compare two-digit numbers',
 'Compare two two-digit numbers based on meanings of the tens and ones digits.',
 'Is 34 greater than, less than, or equal to 29? 34 > 29 because 3 tens is greater than 2 tens.', 3),

((SELECT id FROM clusters WHERE code = '1.NBT.C'), '1.NBT.C.4', 
 'Add within 100 using place value',
 'Add within 100, including adding a two-digit number and a one-digit number.',
 '23 + 5 = ? Think: 23 + 5 = 20 + 3 + 5 = 20 + 8 = 28', 4),

((SELECT id FROM clusters WHERE code = '1.NBT.C'), '1.NBT.C.5', 
 'Find 10 more or 10 less mentally',
 'Given a two-digit number, mentally find 10 more or 10 less than the number.',
 'What is 10 more than 47? 57. What is 10 less than 62? 52.', 3),

((SELECT id FROM clusters WHERE code = '1.NBT.C'), '1.NBT.C.6', 
 'Subtract multiples of 10',
 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90.',
 '70 - 40 = 30. 90 - 20 = 70.', 3);

-- ============================================================================
-- GRADE 2 STANDARDS (Sample)
-- ============================================================================

-- Set up grade-domain relationships for Grade 2
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NBT') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '2' AND d.code IN ('OA', 'NBT', 'MD', 'G');

-- Grade 2 Operations and Algebraic Thinking clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '2'), 
 '2.OA.A', 'Represent and solve problems involving addition and subtraction', 
 'Students use addition and subtraction within 100 to solve problems', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '2'), 
 '2.OA.B', 'Add and subtract within 20', 
 'Students develop fluency with addition and subtraction within 20', 'major'),
((SELECT id FROM domains WHERE code = 'OA'), (SELECT id FROM grade_levels WHERE code = '2'), 
 '2.OA.C', 'Work with equal groups of objects to gain foundations for multiplication', 
 'Students work with arrays and equal groups to prepare for multiplication', 'supporting');

-- Grade 2 Operations and Algebraic Thinking standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '2.OA.A'), '2.OA.A.1', 
 'Solve word problems within 100',
 'Use addition and subtraction within 100 to solve one- and two-step word problems.',
 'Lucy has 24 stickers. She gives away 8 stickers and then buys 15 more. How many stickers does she have now?', 4),

((SELECT id FROM clusters WHERE code = '2.OA.B'), '2.OA.B.2', 
 'Add and subtract within 20 fluently',
 'Fluently add and subtract within 20 using mental strategies.',
 'Solve 13 + 6, 17 - 9, 8 + 7, 15 - 8 quickly using mental math.', 3),

((SELECT id FROM clusters WHERE code = '2.OA.C'), '2.OA.C.3', 
 'Work with equal groups',
 'Determine whether a group of objects has an odd or even number of members.',
 'Are there an even or odd number of objects in a group of 14? Show by pairing objects.', 2),

((SELECT id FROM clusters WHERE code = '2.OA.C'), '2.OA.C.4', 
 'Use arrays to show repeated addition',
 'Use addition to find the total number of objects arranged in rectangular arrays.',
 'Find the total number of dots in a 3×4 array: 3 + 3 + 3 + 3 = 12.', 3);

-- ============================================================================
-- GRADE 3 STANDARDS (Sample) - Introduction to Fractions
-- ============================================================================

-- Set up grade-domain relationships for Grade 3
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NBT', 'NF') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '3' AND d.code IN ('OA', 'NBT', 'NF', 'MD', 'G');

-- Grade 3 Number and Operations—Fractions clusters (NEW DOMAIN!)
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '3'), 
 '3.NF.A', 'Develop understanding of fractions as numbers', 
 'Students understand fractions as numbers on the number line', 'major');

-- Grade 3 Fractions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.1', 
 'Understand fractions as parts of a whole',
 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.',
 'If a pizza is cut into 8 equal pieces, each piece is 1/8 of the whole pizza.', 2),

((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.2', 
 'Understand fractions on a number line',
 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.',
 'Show 3/4 on a number line divided into fourths between 0 and 1.', 3),

((SELECT id FROM clusters WHERE code = '3.NF.A'), '3.NF.A.3', 
 'Compare fractions with same denominators',
 'Explain equivalence of fractions and compare fractions by reasoning about their size.',
 'Compare 2/4 and 3/4. Which is larger? Why? 3/4 > 2/4 because 3 parts is more than 2 parts.', 4);

-- ============================================================================
-- MIDDLE SCHOOL PREVIEW - GRADE 6 RATIOS
-- ============================================================================

-- Set up grade-domain relationships for Grade 6
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('RP', 'NS', 'EE') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '6' AND d.code IN ('RP', 'NS', 'EE', 'G', 'SP');

-- Grade 6 Ratios and Proportional Relationships clusters (NEW DOMAIN!)
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'RP'), (SELECT id FROM grade_levels WHERE code = '6'), 
 '6.RP.A', 'Understand ratio concepts and use ratio reasoning', 
 'Students understand ratio and rate reasoning to solve problems', 'major');

-- Grade 6 Ratios standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.1', 
 'Understand the concept of a ratio',
 'Understand the concept of a ratio and use ratio language to describe a ratio relationship.',
 'In a bag of marbles, there are 3 red marbles for every 2 blue marbles. The ratio of red to blue is 3:2.', 2),

((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.2', 
 'Understand unit rates',
 'Understand the concept of a unit rate and use rate language in the context of a ratio relationship.',
 'If 12 apples cost $4, then the unit rate is $4 ÷ 12 = $0.33 per apple.', 3),

((SELECT id FROM clusters WHERE code = '6.RP.A'), '6.RP.A.3', 
 'Solve ratio and rate problems',
 'Use ratio and rate reasoning to solve real-world and mathematical problems.',
 'If a recipe calls for 2 cups of flour for every 3 cups of milk, how much flour is needed for 9 cups of milk?', 4);

-- ============================================================================
-- COMPLETE REMAINING ELEMENTARY GRADES (4-5)
-- ============================================================================

-- Set up grade-domain relationships for Grade 4
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NBT', 'NF') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '4' AND d.code IN ('OA', 'NBT', 'NF', 'MD', 'G');

-- Grade 4 Number and Operations—Fractions clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '4'), 
 '4.NF.A', 'Extend understanding of fraction equivalence and ordering', 
 'Students build fractions from unit fractions and understand fraction equivalence', 'major'),
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '4'), 
 '4.NF.B', 'Build fractions from unit fractions', 
 'Students compose and decompose fractions using unit fractions', 'major'),
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '4'), 
 '4.NF.C', 'Understand decimal notation for fractions', 
 'Students express fractions with denominators of 10 and 100 as decimal numbers', 'supporting');

-- Grade 4 Fractions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '4.NF.A'), '4.NF.A.1', 
 'Explain fraction equivalence',
 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b) by using visual fraction models.',
 'Show that 1/2 = 2/4 = 3/6 using fraction circles or number lines.', 3),

((SELECT id FROM clusters WHERE code = '4.NF.A'), '4.NF.A.2', 
 'Compare fractions with different denominators',
 'Compare two fractions with different numerators and denominators by creating common denominators.',
 'Compare 3/4 and 5/6: Convert to 9/12 and 10/12, so 5/6 > 3/4.', 4),

((SELECT id FROM clusters WHERE code = '4.NF.B'), '4.NF.B.3', 
 'Add and subtract fractions with like denominators',
 'Understand addition and subtraction of fractions as joining and separating parts.',
 'Solve 3/8 + 2/8 = 5/8 and 7/10 - 3/10 = 4/10.', 3),

((SELECT id FROM clusters WHERE code = '4.NF.B'), '4.NF.B.4', 
 'Multiply fractions by whole numbers',
 'Apply and extend understanding of multiplication to multiply a fraction by a whole number.',
 'Calculate 3 × (2/5) = 6/5 = 1 1/5. Solve: "How much is 4 groups of 1/3?"', 4),

((SELECT id FROM clusters WHERE code = '4.NF.C'), '4.NF.C.5', 
 'Express fractions as decimals',
 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100.',
 'Write 3/10 = 30/100 = 0.30. Express 7/100 as 0.07.', 3),

((SELECT id FROM clusters WHERE code = '4.NF.C'), '4.NF.C.6', 
 'Use decimal notation and compare decimals',
 'Use decimal notation for fractions with denominators 10 or 100 and compare decimal numbers.',
 'Compare 0.3 and 0.27: Since 0.30 > 0.27, we have 0.3 > 0.27.', 4);

-- Set up grade-domain relationships for Grade 5
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('OA', 'NBT', 'NF') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '5' AND d.code IN ('OA', 'NBT', 'NF', 'MD', 'G');

-- Grade 5 Number and Operations—Fractions clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '5'), 
 '5.NF.A', 'Add and subtract fractions with unlike denominators', 
 'Students use equivalent fractions to add and subtract fractions', 'major'),
((SELECT id FROM domains WHERE code = 'NF'), (SELECT id FROM grade_levels WHERE code = '5'), 
 '5.NF.B', 'Apply and extend understanding of multiplication and division', 
 'Students multiply and divide fractions and mixed numbers', 'major');

-- Grade 5 Fractions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '5.NF.A'), '5.NF.A.1', 
 'Add and subtract fractions with unlike denominators',
 'Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions.',
 'Calculate 1/4 + 1/6: Find common denominator 12, so 3/12 + 2/12 = 5/12.', 4),

((SELECT id FROM clusters WHERE code = '5.NF.A'), '5.NF.A.2', 
 'Solve word problems involving addition and subtraction of fractions',
 'Solve word problems involving addition and subtraction of fractions referring to the same whole.',
 'Maria ate 1/4 of a pizza and Jose ate 1/3 of the same pizza. How much did they eat together?', 5),

((SELECT id FROM clusters WHERE code = '5.NF.B'), '5.NF.B.3', 
 'Interpret multiplication of fractions',
 'Interpret a fraction as division of the numerator by the denominator.',
 'Understand that 3/4 means 3 ÷ 4. Calculate 2 × (3/5) using area models.', 4),

((SELECT id FROM clusters WHERE code = '5.NF.B'), '5.NF.B.4', 
 'Multiply fractions and mixed numbers',
 'Apply and extend understanding of multiplication to multiply fractions and mixed numbers.',
 'Calculate 2 1/3 × 1 1/2. Convert to improper fractions: 7/3 × 3/2 = 21/6 = 3 1/2.', 5),

((SELECT id FROM clusters WHERE code = '5.NF.B'), '5.NF.B.5', 
 'Interpret division of fractions',
 'Interpret division of a unit fraction by a non-zero whole number.',
 'If 1/3 of a ribbon is divided equally among 4 people, how much does each person get? 1/3 ÷ 4 = 1/12.', 5);

-- ============================================================================
-- MIDDLE SCHOOL EXPANSION (Grades 7-8)
-- ============================================================================

-- Set up grade-domain relationships for Grade 7
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('RP', 'NS', 'EE') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '7' AND d.code IN ('RP', 'NS', 'EE', 'G', 'SP');

-- Grade 7 The Number System clusters
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'NS'), (SELECT id FROM grade_levels WHERE code = '7'), 
 '7.NS.A', 'Apply and extend understanding of operations with fractions', 
 'Students add, subtract, multiply, and divide rational numbers', 'major'),
((SELECT id FROM domains WHERE code = 'NS'), (SELECT id FROM grade_levels WHERE code = '7'), 
 '7.NS.B', 'Apply and extend understanding of addition and subtraction', 
 'Students understand addition and subtraction of rational numbers', 'major'),
((SELECT id FROM domains WHERE code = 'NS'), (SELECT id FROM grade_levels WHERE code = '7'), 
 '7.NS.C', 'Apply and extend understanding of multiplication and division', 
 'Students multiply and divide rational numbers', 'major');

-- Grade 7 Number System standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '7.NS.A'), '7.NS.A.1', 
 'Apply properties of operations with rational numbers',
 'Apply and extend understanding of addition and subtraction to add and subtract rational numbers.',
 'Calculate (-3) + 5 = 2. Understand that 7 + (-4) = 7 - 4 = 3.', 3),

((SELECT id FROM clusters WHERE code = '7.NS.A'), '7.NS.A.2', 
 'Multiply and divide rational numbers',
 'Apply and extend understanding of multiplication and division to multiply and divide rational numbers.',
 'Calculate (-2) × 3 = -6 and (-12) ÷ (-4) = 3. Understand sign rules.', 4),

((SELECT id FROM clusters WHERE code = '7.NS.A'), '7.NS.A.3', 
 'Solve real-world problems with rational numbers',
 'Solve real-world and mathematical problems involving the four operations with rational numbers.',
 'Temperature drops 15°F from 8°F. What is the new temperature? 8 + (-15) = -7°F.', 4);

-- Set up grade-domain relationships for Grade 8
INSERT INTO grade_domains (grade_id, domain_id, is_primary) 
SELECT 
    gl.id, 
    d.id, 
    CASE WHEN d.code IN ('NS', 'EE', 'F') THEN true ELSE false END
FROM grade_levels gl, domains d 
WHERE gl.code = '8' AND d.code IN ('NS', 'EE', 'F', 'G', 'SP');

-- Grade 8 Functions clusters (NEW DOMAIN!)
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'F'), (SELECT id FROM grade_levels WHERE code = '8'), 
 '8.F.A', 'Define, evaluate, and compare functions', 
 'Students understand functions as relationships between inputs and outputs', 'major'),
((SELECT id FROM domains WHERE code = 'F'), (SELECT id FROM grade_levels WHERE code = '8'), 
 '8.F.B', 'Use functions to model relationships between quantities', 
 'Students model linear relationships using functions', 'major');

-- Grade 8 Functions standards
INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.1', 
 'Understand functions',
 'Understand that a function is a rule that assigns exactly one output to each input.',
 'The rule "double the input" gives f(3) = 6, f(5) = 10. Is "x → x²" a function?', 3),

((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.2', 
 'Compare functions represented differently',
 'Compare properties of two functions each represented in a different way.',
 'Compare a function given by a table vs. one given by an equation like y = 2x + 1.', 4),

((SELECT id FROM clusters WHERE code = '8.F.A'), '8.F.A.3', 
 'Interpret functions in context',
 'Interpret the equation y = mx + b as defining a linear function.',
 'In y = 3x + 2, the slope is 3 and y-intercept is 2. What does this mean in context?', 4),

((SELECT id FROM clusters WHERE code = '8.F.B'), '8.F.B.4', 
 'Construct functions to model linear relationships',
 'Construct a function to model a linear relationship between two quantities.',
 'A gym charges $20 to join plus $5 per visit. Write a function for total cost.', 5),

((SELECT id FROM clusters WHERE code = '8.F.B'), '8.F.B.5', 
 'Describe qualitative features of functions',
 'Describe qualitatively the functional relationship between two quantities.',
 'As time increases, how does the height of a ball thrown upward change?', 4);

-- ============================================================================
-- GEOMETRY STANDARDS ACROSS GRADES
-- ============================================================================

-- Kindergarten Geometry
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'G'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.G.A', 'Identify and describe shapes', 
 'Students identify, describe, and analyze shapes', 'supporting'),
((SELECT id FROM domains WHERE code = 'G'), (SELECT id FROM grade_levels WHERE code = 'K'), 
 'K.G.B', 'Analyze, compare, and compose shapes', 
 'Students compose simple shapes to form larger shapes', 'supporting');

INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = 'K.G.A'), 'K.G.A.1', 
 'Describe objects in the environment using names of shapes',
 'Describe objects in the environment using names of shapes and describe relative positions.',
 'Point out rectangles, circles, triangles, and squares in the classroom. Use words like above, below, beside.', 1),

((SELECT id FROM clusters WHERE code = 'K.G.A'), 'K.G.A.2', 
 'Name shapes regardless of orientation or size',
 'Correctly name shapes regardless of their orientations or overall size.',
 'Recognize a triangle whether it points up, down, or sideways. Identify large and small circles as circles.', 2),

((SELECT id FROM clusters WHERE code = 'K.G.B'), 'K.G.B.6', 
 'Compose simple shapes to form larger shapes',
 'Compose simple shapes to form larger shapes.',
 'Use two triangles to make a rectangle. Combine pattern blocks to create new designs.', 3);

-- Grade 3 Geometry
INSERT INTO clusters (domain_id, grade_id, code, name, description, cluster_type) VALUES
((SELECT id FROM domains WHERE code = 'G'), (SELECT id FROM grade_levels WHERE code = '3'), 
 '3.G.A', 'Reason with shapes and their attributes', 
 'Students understand that shapes can be classified by their attributes', 'supporting');

INSERT INTO standards (cluster_id, code, title, description, examples, complexity_level) VALUES
((SELECT id FROM clusters WHERE code = '3.G.A'), '3.G.A.1', 
 'Understand categories of shapes',
 'Understand that shapes in different categories may share attributes.',
 'Rectangles and squares both have 4 right angles. Rhombuses and squares both have 4 equal sides.', 3),

((SELECT id FROM clusters WHERE code = '3.G.A'), '3.G.A.2', 
 'Partition shapes into equal areas',
 'Partition shapes into parts with equal areas and express area as a unit fraction.',
 'Divide a rectangle into 6 equal parts. Each part is 1/6 of the whole area.', 4);
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