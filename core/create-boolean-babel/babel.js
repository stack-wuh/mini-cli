import fs from 'fs-extra'
import core from '@babel/core'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })
  const ast = await core.parse(source, { sourceType: 'module' })

  /**
   * @NOTE 声明一个值为false的变量bool1
   * var bool1 = false
   */
  const bool1 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('bool1'), t.booleanLiteral(false))
  ])

  /**
   * @NOTE 使用new关键字创建
   * var bool2 = new Boolean(false)
   */
  const newNode = t.newExpression(t.identifier('Boolean'), [
    t.booleanLiteral(false)
  ])
  const bool2 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('bool2'), newNode)
  ])

  /**
   * @NOTE 使用拆箱转换
   * var bool3 = !!1
   */
  const unaryNode = t.unaryExpression('!', t.numericLiteral(1), true)
  const unaryNode1 = t.unaryExpression('!', unaryNode, true)
  const bool3 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('bool3'), unaryNode1)
  ])
  ast.program.body.push(bool1, bool2, bool3)

  const output = core.transformFromAstSync(ast)
  console.log('====> workflow.ast', output.code)
}

workflow()