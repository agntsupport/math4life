-- Math4Life K-8 Lessons and Problems Seeder
-- Creates interactive lessons and practice exercises

-- ============================================================================
-- KINDERGARTEN COUNTING LESSONS
-- ============================================================================

-- Lesson for K.CC.A.1 - Count to 100 by ones and tens
INSERT INTO lessons (standard_id, lesson_type_id, title, description, content, difficulty_level, estimated_minutes, learning_objectives, materials_needed, is_published) VALUES
((SELECT id FROM standards WHERE code = 'K.CC.A.1'), 
 (SELECT id FROM lesson_types WHERE code = 'tutorial'),
 'Counting to 100: Ones and Tens',
 'Learn to count to 100 by ones and by tens with interactive practice',
 '{
   "sections": [
     {
       "type": "introduction",
       "title": "Let''s Learn to Count!",
       "content": "Today we''ll learn how to count all the way to 100! We''ll count by ones (1, 2, 3...) and by tens (10, 20, 30...)."
     },
     {
       "type": "demonstration",
       "title": "Counting by Ones",
       "content": "Watch as we count: 1, 2, 3, 4, 5... Let''s count together!",
       "interactive": {
         "type": "number_sequence",
         "start": 1,
         "end": 20,
         "step": 1
       }
     },
     {
       "type": "demonstration", 
       "title": "Counting by Tens",
       "content": "Now let''s count by tens: 10, 20, 30, 40... This is faster!",
       "interactive": {
         "type": "number_sequence",
         "start": 10,
         "end": 100,
         "step": 10
       }
     },
     {
       "type": "practice",
       "title": "Your Turn to Count",
       "content": "Fill in the missing numbers!",
       "exercises": ["counting_sequence", "missing_numbers", "tens_pattern"]
     }
   ]
 }',
 1, 15,
 ARRAY['Count to 100 by ones', 'Count to 100 by tens', 'Recognize number patterns'],
 ARRAY['Number chart', 'Counting objects'],
 true);

-- Problems for counting lesson
INSERT INTO problems (lesson_id, problem_type, question_text, question_data, correct_answer, hints, explanation, difficulty, points, order_in_lesson) VALUES
-- Problem 1: Count by ones
((SELECT id FROM lessons WHERE title = 'Counting to 100: Ones and Tens'), 
 'interactive', 
 'Count from 1 to 10. Click on each number in order.',
 '{
   "type": "number_clicking",
   "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
   "layout": "grid",
   "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"]
 }',
 '{"sequence": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}',
 ARRAY['Start with 1', 'What comes after 5?', 'Count one by one'],
 'Great job! Counting by ones means we add 1 each time: 1, 2, 3, 4...',
 1, 5, 1),

-- Problem 2: Count by tens
((SELECT id FROM lessons WHERE title = 'Counting to 100: Ones and Tens'),
 'interactive',
 'Count by tens from 10 to 50. Drag the numbers in order.',
 '{
   "type": "drag_and_drop",
   "items": [
     {"id": "10", "value": 10, "display": "10"},
     {"id": "20", "value": 20, "display": "20"}, 
     {"id": "30", "value": 30, "display": "30"},
     {"id": "40", "value": 40, "display": "40"},
     {"id": "50", "value": 50, "display": "50"}
   ],
   "dropZones": 5
 }',
 '{"sequence": [10, 20, 30, 40, 50]}',
 ARRAY['Count by 10s', 'What comes after 20?', 'Add 10 each time'],
 'Excellent! When we count by tens, we add 10 each time: 10, 20, 30...',
 2, 5, 2),

-- Problem 3: Missing numbers
((SELECT id FROM lessons WHERE title = 'Counting to 100: Ones and Tens'),
 'multiple_choice',
 'What number comes after 7?',
 '{
   "type": "multiple_choice",
   "options": [
     {"id": "a", "text": "6", "value": 6},
     {"id": "b", "text": "8", "value": 8},
     {"id": "c", "text": "9", "value": 9},
     {"id": "d", "text": "10", "value": 10}
   ]
 }',
 '{"correct": "b", "value": 8}',
 ARRAY['Count from 6, 7, ...', 'What comes next?'],
 'Correct! After 7 comes 8. In counting, each number is one more than the previous.',
 1, 3, 3);

-- ============================================================================
-- GRADE 1 ADDITION LESSONS  
-- ============================================================================

-- Lesson for 1.OA.A.1 - Add and subtract word problems
INSERT INTO lessons (standard_id, lesson_type_id, title, description, content, difficulty_level, estimated_minutes, learning_objectives, materials_needed, is_published) VALUES
((SELECT id FROM standards WHERE code = '1.OA.A.1'),
 (SELECT id FROM lesson_types WHERE code = 'guided'),
 'Addition Word Problems',
 'Solve addition word problems within 20 using objects and drawings',
 '{
   "sections": [
     {
       "type": "introduction",
       "title": "Addition Stories",
       "content": "Math is everywhere! Let''s solve problems about toys, animals, and friends using addition."
     },
     {
       "type": "demonstration",
       "title": "How to Solve Word Problems",
       "content": "1. Read the problem carefully. 2. Find the numbers. 3. Decide if we add or subtract. 4. Solve and check!",
       "interactive": {
         "type": "step_by_step",
         "example": "Sarah has 3 apples. Her mom gives her 2 more. How many apples does Sarah have now?"
       }
     },
     {
       "type": "practice",
       "title": "Practice Problems",
       "content": "Now you try! Use the pictures to help you solve.",
       "exercises": ["word_problem_visual", "choose_operation", "solve_and_check"]
     }
   ]
 }',
 2, 20,
 ARRAY['Solve addition word problems', 'Use objects to model problems', 'Identify key information in problems'],
 ARRAY['Counting objects', 'Problem solving worksheet'],
 true);

-- Problems for addition word problems lesson
INSERT INTO problems (lesson_id, problem_type, question_text, question_data, correct_answer, hints, explanation, difficulty, points, order_in_lesson) VALUES
-- Problem 1: Visual word problem
((SELECT id FROM lessons WHERE title = 'Addition Word Problems'),
 'interactive',
 'Tim has 4 toy cars. His sister gives him 3 more toy cars. How many toy cars does Tim have altogether?',
 '{
   "type": "visual_word_problem",
   "scenario": "toy_cars",
   "initial_amount": 4,
   "added_amount": 3,
   "visual_aids": {
     "cars": ["red", "blue", "green", "yellow", "purple", "orange", "pink"],
     "animation": "addition"
   },
   "tools": ["counter", "number_line"]
 }',
 '{"answer": 7, "operation": "addition", "equation": "4 + 3 = 7"}',
 ARRAY['Count the cars Tim starts with', 'Count the cars his sister gives him', 'Add them together'],
 'Great! Tim starts with 4 cars and gets 3 more. 4 + 3 = 7 cars total.',
 2, 10, 1),

-- Problem 2: Choose the operation
((SELECT id FROM lessons WHERE title = 'Addition Word Problems'),
 'multiple_choice',
 'Maria has 5 stickers. She gets 6 more stickers. What should Maria do to find how many stickers she has?',
 '{
   "type": "operation_choice",
   "options": [
     {"id": "a", "text": "Add: 5 + 6", "operation": "addition"},
     {"id": "b", "text": "Subtract: 5 - 6", "operation": "subtraction"},
     {"id": "c", "text": "Count: 1, 2, 3, 4, 5", "operation": "counting"},
     {"id": "d", "text": "Nothing", "operation": "none"}
   ],
   "visual": "stickers"
 }',
 '{"correct": "a", "operation": "addition", "reason": "getting_more"}',
 ARRAY['Maria is getting MORE stickers', 'When we get more, we add', 'What operation adds numbers?'],
 'Perfect! When Maria gets MORE stickers, we ADD them: 5 + 6 = 11 stickers.',
 2, 5, 2),

-- Problem 3: Two-step thinking
((SELECT id FROM lessons WHERE title = 'Addition Word Problems'),
 'open_ended',
 'Draw a picture to solve: There are 8 birds in a tree. 4 more birds fly to the tree. How many birds are in the tree now?',
 '{
   "type": "drawing_problem", 
   "tools": ["pencil", "eraser", "colors"],
   "canvas": {
     "width": 400,
     "height": 300,
     "background": "tree_scene"
   },
   "answer_type": "number",
   "max_answer": 20
 }',
 '{"answer": 12, "drawing_required": true, "equation": "8 + 4 = 12"}',
 ARRAY['Draw 8 birds first', 'Then draw 4 more birds', 'Count all the birds'],
 'Excellent drawing! You showed 8 birds + 4 birds = 12 birds total.',
 3, 15, 3);

-- ============================================================================
-- GRADE 3 FRACTIONS LESSONS
-- ============================================================================

-- Lesson for 3.NF.A.1 - Understand fractions as parts of a whole
INSERT INTO lessons (standard_id, lesson_type_id, title, description, content, difficulty_level, estimated_minutes, learning_objectives, materials_needed, is_published) VALUES
((SELECT id FROM standards WHERE code = '3.NF.A.1'),
 (SELECT id FROM lesson_types WHERE code = 'tutorial'),
 'Fractions: Parts of a Whole',
 'Understand fractions as equal parts of a whole using visual models',
 '{
   "sections": [
     {
       "type": "introduction",
       "title": "What Are Fractions?",
       "content": "Fractions show parts of a whole. When we share a pizza equally, each piece is a fraction!"
     },
     {
       "type": "demonstration",
       "title": "Understanding 1/4",
       "content": "If we cut a pizza into 4 equal pieces, each piece is 1/4 (one-fourth) of the whole pizza.",
       "interactive": {
         "type": "fraction_circles",
         "shapes": ["circle", "rectangle", "triangle"],
         "denominator": 4
       }
     },
     {
       "type": "demonstration",
       "title": "Different Fractions",
       "content": "Let''s explore halves (1/2), thirds (1/3), and fourths (1/4).",
       "interactive": {
         "type": "fraction_comparison",
         "fractions": ["1/2", "1/3", "1/4"]
       }
     },
     {
       "type": "practice",
       "title": "Practice with Fractions",
       "content": "Try identifying and creating your own fractions!",
       "exercises": ["identify_fractions", "create_fractions", "compare_sizes"]
     }
   ]
 }',
 3, 25,
 ARRAY['Understand fractions as parts of a whole', 'Identify unit fractions', 'Recognize equal parts'],
 ARRAY['Fraction circles', 'Shape manipulatives', 'Drawing paper'],
 true);

-- Problems for fractions lesson  
INSERT INTO problems (lesson_id, problem_type, question_text, question_data, correct_answer, hints, explanation, difficulty, points, order_in_lesson) VALUES
-- Problem 1: Interactive fraction identification
((SELECT id FROM lessons WHERE title = 'Fractions: Parts of a Whole'),
 'interactive',
 'This circle is divided into equal parts. What fraction is the colored part?',
 '{
   "type": "fraction_identification",
   "shape": "circle",
   "total_parts": 4,
   "colored_parts": 1,
   "visual": {
     "shape_color": "#FFE5B4",
     "colored_color": "#FF6B6B",
     "border_color": "#333"
   },
   "interaction": "click_to_select"
 }',
 '{"fraction": "1/4", "numerator": 1, "denominator": 4}',
 ARRAY['Count the total parts', 'Count the colored parts', 'The fraction is colored parts / total parts'],
 'Excellent! The circle has 4 equal parts and 1 is colored, so the fraction is 1/4.',
 2, 8, 1),

-- Problem 2: Create fractions
((SELECT id FROM lessons WHERE title = 'Fractions: Parts of a Whole'),
 'interactive',
 'Color 2 parts of this rectangle to show the fraction 2/6.',
 '{
   "type": "fraction_creation",
   "shape": "rectangle",
   "total_parts": 6,
   "target_numerator": 2,
   "target_denominator": 6,
   "tools": ["color_tool", "eraser"],
   "colors": ["#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"]
 }',
 '{"colored_parts": 2, "total_parts": 6, "fraction": "2/6"}',
 ARRAY['The rectangle has 6 parts', 'You need to color 2 parts', 'Click on 2 parts to color them'],
 'Perfect! You colored 2 out of 6 parts, which makes the fraction 2/6.',
 3, 10, 2),

-- Problem 3: Fraction comparison
((SELECT id FROM lessons WHERE title = 'Fractions: Parts of a Whole'),
 'multiple_choice',
 'Which fraction represents the largest part?',
 '{
   "type": "fraction_comparison",
   "options": [
     {
       "id": "a", 
       "fraction": "1/2",
       "visual": "half_circle",
       "text": "1/2 (one half)"
     },
     {
       "id": "b",
       "fraction": "1/3", 
       "visual": "third_circle",
       "text": "1/3 (one third)"
     },
     {
       "id": "c",
       "fraction": "1/4",
       "visual": "quarter_circle", 
       "text": "1/4 (one fourth)"
     },
     {
       "id": "d",
       "fraction": "1/8",
       "visual": "eighth_circle",
       "text": "1/8 (one eighth)"
     }
   ],
   "show_visuals": true
 }',
 '{"correct": "a", "fraction": "1/2", "reasoning": "larger_denominator_smaller_pieces"}',
 ARRAY['Look at the pictures', 'Which piece is biggest?', 'Smaller denominators mean bigger pieces'],
 'Great thinking! 1/2 is the largest because when you divide something into fewer pieces, each piece is bigger.',
 3, 8, 3);

-- ============================================================================
-- GRADE 6 RATIOS LESSONS
-- ============================================================================

-- Lesson for 6.RP.A.1 - Understand the concept of a ratio
INSERT INTO lessons (standard_id, lesson_type_id, title, description, content, difficulty_level, estimated_minutes, learning_objectives, materials_needed, is_published) VALUES
((SELECT id FROM standards WHERE code = '6.RP.A.1'),
 (SELECT id FROM lesson_types WHERE code = 'guided'),
 'Introduction to Ratios',
 'Understand ratios as comparisons between quantities and learn ratio language',
 '{
   "sections": [
     {
       "type": "introduction",
       "title": "What Are Ratios?",
       "content": "Ratios help us compare amounts of different things. They show relationships between quantities."
     },
     {
       "type": "demonstration",
       "title": "Ratio Language",
       "content": "If there are 3 cats and 2 dogs, we can say ''the ratio of cats to dogs is 3 to 2'' or ''3:2''.",
       "interactive": {
         "type": "ratio_visualization",
         "scenarios": ["pets", "sports_teams", "food_items"]
       }
     },
     {
       "type": "demonstration",
       "title": "Different Ways to Write Ratios",
       "content": "Ratios can be written as 3:2, 3 to 2, or 3/2. They all mean the same thing!",
       "interactive": {
         "type": "ratio_notation",
         "examples": ["3:2", "3 to 2", "3/2"]
       }
     },
     {
       "type": "practice",
       "title": "Practice with Ratios",
       "content": "Let''s practice identifying and writing ratios from real situations.",
       "exercises": ["identify_ratios", "write_ratios", "equivalent_ratios"]
     }
   ]
 }',
 4, 30,
 ARRAY['Understand ratio as a comparison', 'Use ratio language correctly', 'Write ratios in different forms'],
 ARRAY['Colored objects for counting', 'Ratio worksheet'],
 true);

-- Problems for ratios lesson
INSERT INTO problems (lesson_id, problem_type, question_text, question_data, correct_answer, hints, explanation, difficulty, points, order_in_lesson) VALUES
-- Problem 1: Visual ratio identification
((SELECT id FROM lessons WHERE title = 'Introduction to Ratios'),
 'interactive',
 'Look at the picture. What is the ratio of red circles to blue circles?',
 '{
   "type": "visual_ratio",
   "objects": [
     {"type": "circle", "color": "red", "count": 6},
     {"type": "circle", "color": "blue", "count": 4}
   ],
   "layout": "mixed",
   "answer_format": ["ratio_colon", "ratio_words", "ratio_fraction"]
 }',
 '{"ratio": "6:4", "simplified": "3:2", "words": "6 to 4", "fraction": "6/4"}',
 ARRAY['Count the red circles', 'Count the blue circles', 'Write red : blue'],
 'Correct! There are 6 red and 4 blue circles, so the ratio is 6:4 or 3:2 when simplified.',
 3, 12, 1),

-- Problem 2: Ratio word problems
((SELECT id FROM lessons WHERE title = 'Introduction to Ratios'),
 'open_ended',
 'In a basketball team, there are 5 guards and 3 forwards. Write this ratio in three different ways.',
 '{
   "type": "ratio_writing",
   "scenario": "basketball_team",
   "data": {
     "guards": 5,
     "forwards": 3
   },
   "required_formats": ["colon", "words", "fraction"],
   "answer_type": "multiple_formats"
 }',
 '{"colon": "5:3", "words": "5 to 3", "fraction": "5/3"}',
 ARRAY['Guards come first in the ratio', 'Try writing 5:3', 'Also try ''5 to 3'' and ''5/3'''],
 'Excellent! The ratio of guards to forwards can be written as 5:3, 5 to 3, or 5/3.',
 4, 15, 2),

-- Problem 3: Real-world ratios
((SELECT id FROM lessons WHERE title = 'Introduction to Ratios'),
 'multiple_choice',
 'A recipe calls for 2 cups of flour for every 1 cup of milk. What is the ratio of flour to milk?',
 '{
   "type": "recipe_ratio",
   "ingredients": {
     "flour": {"amount": 2, "unit": "cups"},
     "milk": {"amount": 1, "unit": "cups"}
   },
   "options": [
     {"id": "a", "ratio": "1:2", "text": "1:2 (milk to flour)"},
     {"id": "b", "ratio": "2:1", "text": "2:1 (flour to milk)"},
     {"id": "c", "ratio": "2:3", "text": "2:3 (flour to total)"},
     {"id": "d", "ratio": "1:3", "text": "1:3 (milk to total)"}
   ],
   "visual": "recipe_card"
 }',
 '{"correct": "b", "ratio": "2:1", "explanation": "flour_comes_first"}',
 ARRAY['How much flour? How much milk?', 'Flour comes first in the question', 'The ratio is flour : milk'],
 'Perfect! The recipe uses 2 cups flour for every 1 cup milk, so the ratio is 2:1.',
 4, 10, 3);