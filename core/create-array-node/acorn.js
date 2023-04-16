import * as acorn from 'acorn'
import fs from 'fs-extra'
import t from '@babel/types'
import escodegen from 'escodegen'

const filepath = './demo.js'
const workflow = async () => {
  const source = await fs.readFile(filepath)
  const ast = acorn.parse(source, { sourceType: 'module', ecmaVersion: 2021 })


  /**
   * @NOTE 使用数组字面量创建数组
   */
  const arr2Node = t.arrayExpression([t.identifier('1'), t.identifier('2')])
  const arr2 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr2'), arr2Node)
  ])

  /**
   * @NOTE 使用new关键字实例
   */
  const arr3Node = t.newExpression(t.identifier('Array'), [t.identifier('1'), t.identifier('2')])
  const arr3 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('arr3'), arr3Node)
  ])

  /**
   * @NOTE 使用Array.from 构建数组
   */
  const arr4Ast = acorn.parse(`const arr4 = Array.from({ 0: 1, length: 2 })`)
  const arr4 = arr4Ast.body[0]

  /**
   * @NOTE 使用Array.of 构建数组
   */
  const arr5Ast = acorn.parse(`const arr5 = Array.of(1, 2, 3)`)
  const arr5 = arr5Ast.body[0]

  ast.body.push(arr2, arr3, arr4, arr5)

  const output = escodegen.generate(ast)
  console.log('======> output', output)
}

workflow()