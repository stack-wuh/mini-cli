import fs from 'fs-extra'
import core from '@babel/core'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })
  const ast = core.parse(source, { sourceType: 'module' })


  const loggerExpressStatement = t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier('console'), t.identifier('log')),
      [
        t.stringLiteral('=======> '),
        t.identifier('a'),
        t.identifier('b')
      ]
    )
  )

  /**
   * @NOTE if语句
   * 
   * @example
   * 
   * if (a > 10 && a <= 100 || b === 100) {
   *  console.log('=====', a, b)
   * }
   */
  const leftStatement = t.binaryExpression('>', t.identifier('a'), t.numericLiteral(10))
  const andStatement = t.logicalExpression('&&', leftStatement, t.binaryExpression('<=', t.identifier('a'), t.numericLiteral(100)))
  const orStatement = t.logicalExpression('||', andStatement, t.binaryExpression('===', t.identifier('b'), t.numericLiteral(100)))
  const ifStatement = t.ifStatement(orStatement, t.blockStatement([
    loggerExpressStatement
  ]))

  /**
   * @NOTE if-else 语句
   * 
   * @example
   * 
   * if (a === 100) {
   *  console.log()
   * } else if (a === 200) {
   *  console.log()
   * } else {
   *  console.log()
   * }
   */
  const leftStatement1 = t.binaryExpression('===', t.identifier('a'), t.numericLiteral(100))
  const elseStatement = t.binaryExpression('===', t.identifier('a'), t.numericLiteral(200))
  const ifElseStatement = t.ifStatement(
    leftStatement1,
    t.blockStatement([loggerExpressStatement]),
    t.ifStatement(
      elseStatement,
      t.blockStatement([loggerExpressStatement]), 
      t.blockStatement([
        loggerExpressStatement
      ])
    ),
  )

  /**
   * @NOTE switch 语句
   * 
   * @example
   * 
   * switch (a) {
   *  case 1: {
   *    console.log()
   *    breadk 
   *  },
   *  case 2: {
   *    console.log()
   *    break
   *  },
   *  default: {
   *    console.log()
   *    break
   *  }
   * }
   */
  const switchStatement = t.switchStatement(
    t.identifier('a'),
    [
      t.switchCase(
        t.numericLiteral(1),
        [t.blockStatement([loggerExpressStatement, t.breakStatement()])]
      ),
      t.switchCase(
        t.numericLiteral(2),
        [t.blockStatement([loggerExpressStatement, t.breakStatement()])]
      ),
      t.switchCase(
        null,
        [
          t.blockStatement([loggerExpressStatement])
        ]
      )
    ]
  )

  /**
   * @NOTE 利用逻辑操作符
   * 
   * @example
   * 
   * function foo (a) {
   *    a && (console.log())
   * }
   */
  const logicalStatement = t.functionDeclaration(
    t.identifier('foo'),
    [t.identifier('a')],
    t.blockStatement([
      t.expressionStatement(
        t.logicalExpression('&&', t.identifier('a'), t.callExpression(t.identifier('console.log'), []))
      )
    ])
  )

  
  ast.program.body.push(ifStatement, ifElseStatement, switchStatement, logicalStatement)

  const output = core.transformFromAstSync(ast)
  console.log('====> output.code', output.code)
}

workflow()