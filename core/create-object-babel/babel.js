import * as core from '@babel/core'
import fs from 'fs-extra'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })
  const ast = core.parse(source, { sourceType: 'module' })

  /**
   * @NOTE 字面量声明对象
   */
  const obj1Node = t.objectExpression([
    t.objectProperty(t.identifier('name'), t.stringLiteral('shadow'))
  ])
  const obj1 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('obj1'), obj1Node)
  ])

  /**
   * @NOTE new关键字创建对象
   */
  const obj2CallNode = t.newExpression(t.identifier('Object'), [
    t.objectExpression([
      t.objectProperty(t.identifier('name'), t.stringLiteral('shadow'))
    ])
  ])
  const obj2 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('obj2'), obj2CallNode)
  ])

  /**
   * @NOTE  通过Object.create 方法
   */
  const obj3CallNode = t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('create')),
    [t.objectExpression([
      t.objectProperty(t.identifier('name'), t.stringLiteral('shadow'))
    ])]
  )
  const obj3 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('obj3'), obj3CallNode)
  ])

  /**
   * @NOTE 使用工厂函数创建对象
   */
  const obj4Func = t.functionDeclaration(
    t.identifier('createObject'),
    [t.identifier('o')],
    t.blockStatement([
      t.functionDeclaration(t.identifier('F'), [], t.blockStatement([])),
      t.expressionStatement(t.assignmentExpression('=', t.memberExpression(t.identifier('F'), t.identifier('prototype')), t.identifier('o'))),
      t.returnStatement(t.newExpression(t.identifier('F'), []))
    ])
  )
  const obj4Call = t.callExpression(t.identifier('createObject'), [
    t.objectExpression([
      t.objectProperty(t.identifier('name'), t.stringLiteral('shadow'))
    ])
  ])
  const obj4 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('obj4'), obj4Call)
  ])


  /**
   * @NOTE 使用Set创建对象
   * @NOTE 其实就是使用new 关键字 var s = new Set()
   */
  const obj5New = t.newExpression(t.identifier('Set'), [
    t.arrayExpression([
      t.numericLiteral(1),
      t.numericLiteral(2)
    ])
  ])
  const obj5 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('obj5'), obj5New)
  ])

  /**
   * @NOTE 使用Map创建对象
   * @NOTE 其实质就是使用new 关键字 var m = new Map()
   * m.set('a', 1)
   */
  const obj6New = t.newExpression(t.identifier('Map'), [])
  const obj6 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('m'), obj6New)
  ])
  const obj6Assign = t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('m'), t.identifier('set')), [
    t.stringLiteral('a'),
    t.numericLiteral(1)
  ]))

  ast.program.body.push(obj1, obj2, obj3, obj4Func, obj4, obj5, obj6, obj6Assign)

  console.log('=======> ast', ast)

  const output = await core.transformFromAstSync(ast)

  console.log('======> output.code', output.code)
}


workflow()