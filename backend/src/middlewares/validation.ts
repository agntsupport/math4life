import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const validateMathInput = [
  body('expression')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Expression must be a non-empty string')
    .isLength({ max: 1000 })
    .withMessage('Expression is too long'),
  
  body('equation')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Equation must be a non-empty string')
    .matches(/^[^=]+=.+$/)
    .withMessage('Equation must contain exactly one equals sign'),
  
  body('variable')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Variable name must be between 1 and 10 characters'),
  
  body('problemType')
    .optional()
    .isIn(['arithmetic', 'algebra', 'equation', 'general'])
    .withMessage('Invalid problem type'),
  
  body('currentStep')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Current step must be a positive integer'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    return next()
  }
]