import * as math from 'mathjs'
import { logger } from '../utils/logger'

export class MathService {
  validateExpression(expression: string): { valid: boolean; error?: string } {
    try {
      math.parse(expression)
      return { valid: true }
    } catch (error: any) {
      return { valid: false, error: error.message }
    }
  }

  simplify(expression: string): string {
    try {
      const node = math.parse(expression)
      const simplified = math.simplify(node)
      return simplified.toString()
    } catch (error: any) {
      logger.error(`Simplification error: ${error.message}`)
      throw error
    }
  }

  solveEquation(equation: string, _variable: string = 'x'): any {
    try {
      const parts = equation.split('=')
      if (parts.length !== 2) {
        throw new Error('Invalid equation format. Use format: expression = value')
      }
      
      const leftSide = parts[0].trim()
      const rightSide = parts[1].trim()
      
      const expr = `${leftSide} - (${rightSide})`
      const parsed = math.parse(expr)
      const simplified = math.simplify(parsed)
      
      return {
        expression: simplified.toString(),
        value: this.evaluateExpression(rightSide)
      }
    } catch (error: any) {
      logger.error(`Solve equation error: ${error.message}`)
      throw error
    }
  }

  evaluateExpression(expression: string): number {
    try {
      return math.evaluate(expression)
    } catch (error: any) {
      logger.error(`Evaluation error: ${error.message}`)
      throw error
    }
  }

  getSimplificationSteps(original: string, simplified: string): string[] {
    const steps: string[] = []
    steps.push(`Original: ${original}`)
    
    try {
      const node = math.parse(original)
      let current = node
      let stepCount = 0
      const maxSteps = 10
      
      while (stepCount < maxSteps) {
        const next = math.simplify(current)
        if (next.toString() === current.toString()) break
        
        steps.push(`Step ${stepCount + 1}: ${next.toString()}`)
        current = next
        stepCount++
      }
      
      steps.push(`Final: ${simplified}`)
    } catch (error) {
      logger.error(`Error generating steps: ${error}`)
    }
    
    return steps
  }

  getSolutionSteps(equation: string, variable: string): string[] {
    const steps: string[] = []
    steps.push(`Original equation: ${equation}`)
    
    try {
      const parts = equation.split('=')
      if (parts.length === 2) {
        steps.push(`Left side: ${parts[0].trim()}`)
        steps.push(`Right side: ${parts[1].trim()}`)
        steps.push(`Move all terms to one side`)
        steps.push(`Simplify to find ${variable}`)
      }
    } catch (error) {
      logger.error(`Error generating solution steps: ${error}`)
    }
    
    return steps
  }

  generateHint(_expression: string, problemType: string = 'general', currentStep?: number): any {
    const hints: { [key: string]: string[] } = {
      arithmetic: [
        'Recuerda el orden de las operaciones (PEMDAS)',
        'Resuelve primero los paréntesis',
        'Luego exponentes, multiplicación y división de izquierda a derecha',
        'Finalmente suma y resta de izquierda a derecha'
      ],
      algebra: [
        'Identifica los términos semejantes',
        'Combina los términos con la misma variable',
        'Aísla la variable en un lado de la ecuación',
        'Simplifica ambos lados paso a paso'
      ],
      equation: [
        'Mantén la ecuación balanceada',
        'Lo que hagas en un lado, hazlo en el otro',
        'Despeja la variable paso a paso',
        'Verifica tu respuesta sustituyendo'
      ],
      general: [
        'Toma un paso a la vez',
        'Verifica cada operación',
        'Simplifica cuando sea posible',
        'Revisa tu trabajo'
      ]
    }
    
    const typeHints = hints[problemType] || hints.general
    const step = currentStep || 0
    const hint = typeHints[step % typeHints.length]
    
    return {
      message: hint,
      nextStep: (step + 1) < typeHints.length ? step + 1 : null,
      totalSteps: typeHints.length
    }
  }

  evaluateStep(previous: string, current: string, expected?: string): any {
    try {
      const prevValue = this.evaluateExpression(previous)
      const currValue = this.evaluateExpression(current)
      
      const isCorrect = Math.abs(prevValue - currValue) < 0.0001
      
      let feedback = ''
      if (isCorrect) {
        feedback = 'Paso correcto. Las expresiones son equivalentes.'
      } else {
        feedback = `Paso incorrecto. El valor cambió de ${prevValue} a ${currValue}`
      }
      
      if (expected) {
        const expValue = this.evaluateExpression(expected)
        if (Math.abs(currValue - expValue) < 0.0001) {
          feedback += ' ¡Has llegado al resultado esperado!'
        }
      }
      
      return {
        correct: isCorrect,
        feedback,
        previousValue: prevValue,
        currentValue: currValue
      }
    } catch (error: any) {
      return {
        correct: false,
        feedback: `Error al evaluar: ${error.message}`,
        error: error.message
      }
    }
  }
}