import * as core from '@babel/core'
import fs from 'fs-extra'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })
  const ast = core.parse(source, { sourceType: 'module' })

  /**
   * @NOTE 这里使用的字面量表达式创建了一个变量arr2
   */
  const arr2 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr2'), t.arrayExpression([ t.numericLiteral(1), t.numericLiteral(2) ]))
  ])


  /**
   * @NOTE 使用new表达式构建数组
   */
  const newArr3 = t.newExpression(t.identifier('Array'), [ t.numericLiteral(1), t.numericLiteral(2) ])
  const arr3 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr3'), newArr3)
  ])

  /**
   * @NOTE 使用Array.from实现创建数组
   * 
   * @example Array.from({ 0: 1, 1: 2, length: 2 })
   */
  const arr4ObjValue = t.objectExpression([
    t.objectProperty(t.numericLiteral(0), t.numericLiteral(1)),
    t.objectProperty(t.numericLiteral(1), t.numericLiteral(2)),
    t.objectProperty(t.identifier('length'), t.numericLiteral(2)),
  ])
  const arr4 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr4'), t.callExpression(
      t.memberExpression(t.identifier('Array'), t.identifier('from')),
      [arr4ObjValue]
    ))
  ])

  /**
   * @NOTE 使用Array.of 创建数组
   * 
   * @example Array.of(1, 2, 3)
   */
  const arr5 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr5'), t.callExpression(
      t.memberExpression(t.identifier('Array'), t.identifier('of')),
      [t.numericLiteral(1), t.numericLiteral(2)]
    ))
  ])

  ast.program.body.push(arr2, arr3, arr4, arr5)

  const output = core.transformFromAstSync(ast)

  console.log('=====> ast', output.code)
}

workflow()