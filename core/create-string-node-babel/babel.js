import fs from 'fs-extra'
import babel from '@babel/core'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })

  const ast = babel.parse(source, { sourceType: 'module' })

  /**
   * @NOTE 创建一个字符串节点
   */
  const varStr1 = t.variableDeclaration('const', 
   [t.variableDeclarator(t.identifier('str1'), t.stringLiteral('shadow'))])

  /**
   * @NOTE 创建一个数字节点
   */
  const varNum1 = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('num1'), t.numericLiteral(1))
  ])

  ast.program.body.push(varStr1, varNum1)

  const output = babel.transformFromAstSync(ast)

  console.log(output.code)
}

workflow()