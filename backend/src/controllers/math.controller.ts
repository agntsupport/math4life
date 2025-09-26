import { Request, Response } from 'express'
import * as math from 'mathjs'
import { MathService } from '../services/math.service'
import { logger } from '../utils/logger'

const mathService = new MathService()

export const validateExpression = async (req: Request, res: Response) => {
  try {
    const { expression } = req.body
    const result = mathService.validateExpression(expression)
    res.json(result)
  } catch (error: any) {
    logger.error(`Validation error: ${error.message}`)
    res.status(400).json({
      valid: false,
      error: error.message
    })
  }
}

export const simplifyExpression = async (req: Request, res: Response) => {
  try {
    const { expression } = req.body
    const simplified = mathService.simplify(expression)
    res.json({
      original: expression,
      simplified,
      steps: mathService.getSimplificationSteps(expression, simplified)
    })
  } catch (error: any) {
    logger.error(`Simplification error: ${error.message}`)
    res.status(400).json({
      error: error.message
    })
  }
}

export const solveEquation = async (req: Request, res: Response) => {
  try {
    const { equation, variable = 'x' } = req.body
    const solution = mathService.solveEquation(equation, variable)
    res.json({
      equation,
      variable,
      solution,
      steps: mathService.getSolutionSteps(equation, variable)
    })
  } catch (error: any) {
    logger.error(`Solve error: ${error.message}`)
    res.status(400).json({
      error: error.message
    })
  }
}

export const getHint = async (req: Request, res: Response) => {
  try {
    const { expression, problemType, currentStep } = req.body
    const hint = mathService.generateHint(expression, problemType, currentStep)
    res.json({
      hint,
      nextStep: hint.nextStep || null
    })
  } catch (error: any) {
    logger.error(`Hint generation error: ${error.message}`)
    res.status(400).json({
      error: error.message
    })
  }
}

export const evaluateStep = async (req: Request, res: Response) => {
  try {
    const { previousExpression, currentExpression, expectedResult } = req.body
    const evaluation = mathService.evaluateStep(
      previousExpression,
      currentExpression,
      expectedResult
    )
    res.json(evaluation)
  } catch (error: any) {
    logger.error(`Step evaluation error: ${error.message}`)
    res.status(400).json({
      error: error.message
    })
  }
}