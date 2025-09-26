import { Router } from 'express'
import { validateExpression, simplifyExpression, solveEquation, getHint, evaluateStep } from '../controllers/math.controller'
import { validateMathInput } from '../middlewares/validation'

const router = Router()

router.post('/validate', validateMathInput, validateExpression)
router.post('/simplify', validateMathInput, simplifyExpression)
router.post('/solve', validateMathInput, solveEquation)
router.post('/hint', validateMathInput, getHint)
router.post('/evaluate-step', validateMathInput, evaluateStep)

export default router