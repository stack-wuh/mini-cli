import * as acorn from 'acorn'
import fs from 'fs-extra'
import { variableDeclaration, variableDeclarator, identifier, expressionStatement } from '@babel/types'
import escodegen from 'escodegen'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath)
  const ast = acorn.parse(source, { sourceType: 'module', ecmaVersion: 2021 })

  const str2 = variableDeclaration('const', [
    variableDeclarator(identifier('str2'), identifier(`'shadow2'`)),
    variableDeclarator(identifier('num2'), identifier('22'))
  ])


  ast.body.push(str2)

  const output = await escodegen.generate(ast, { format: { quotes: 'single' } })

  console.log('======> ast ', output)
}

workflow()