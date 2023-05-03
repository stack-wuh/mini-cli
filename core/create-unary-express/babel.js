import core from '@babel/core'
import fs from 'fs-extra'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })
  const ast = await core.parse(source, { sourceType: 'module' })

  /**
   * @NOTE 使用 + 运算符
   * 
   * var node1 = +1
   */
  const unaryNode1 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('node1'), t.unaryExpression('+', t.numericLiteral(1), true))
  ])

  /**
   * @NOTE 使用 - 运算符
   * var node2 = -1
   */
  const unaryNode2 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('node2'), t.unaryExpression('-', t.numericLiteral(1), true))
  ])

  /**
   * @NOTE 自增与自减 同理
   * var node3 = ++1
   * var node4 = --1
   */
  const increateNode = t.updateExpression('++', t.numericLiteral(1), true)
  const unaryNode3 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('node3'), increateNode)
  ])

  /**
   * @NOTE 实现取反的逻辑操作符
   * 
   * var node4 = !1
   */
  const unaryNode4 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('node4'), t.unaryExpression('!', t.numericLiteral(1), true))
  ])

  /**
   * @NOTE 派生操作 实现!!
   */
  const node5C = t.unaryExpression('!', t.numericLiteral(1), true)
  const node5 = t.unaryExpression('!', node5C, true)
  const unaryNode5 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('node5'), node5)
  ])

  /**
   * @NOTE 实现typeof
   * typeof 1
   */
  const typeofNode = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('typeofNode'), t.unaryExpression('typeof', t.numericLiteral(1), true))
  ])

  /**
   * @NOTE 实现delete 操作符
   * delete obj.name
   */
  const deleteNode = t.unaryExpression('delete', t.memberExpression(t.identifier('obj'), t.identifier('name')))

  ast.program.body.push(unaryNode1, unaryNode2, unaryNode3, unaryNode4, unaryNode5, typeofNode, deleteNode)

  const output = await core.transformFromAstSync(ast)
  console.log('=======> workflow.ast', output.code)
}

workflow()