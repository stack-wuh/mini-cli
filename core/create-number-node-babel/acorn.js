import * as acorn from 'acorn'
import fs from 'fs-extra'
import escodegen from 'escodegen'
import { VariableDeclaration, VariableDeclarator, Identifier, addComment } from '@babel/types'
import prettier from 'prettier'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })

  // 利用acorn解析成ast
  const ast = await acorn.parse(source, { sourceType: 'module', ecmaVersion: 2021 })

  // 生成一个声明表达式节点
  const var1 = VariableDeclaration('const', [
    VariableDeclarator(Identifier('a_num1'), Identifier('12'))
  ])

  // 这里调用@@babel/types中提供的addComment方法，添加一条块级注释
  addComment(var1, 'leading', '这里是由acorn生成的注释', false)

  // 直接在文件后追加节点
  ast.body.push(var1)

  // 利用escodegen提供的generate方法生成源代码
  const output = await escodegen.generate(ast, { 
    comment: true
  })

  const code = prettier.format(output, { semi: false, singleQuote: true })

  fs.writeFile(filepath, code)

  console.log('=========> output', output)
}

workflow()