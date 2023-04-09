import fs from 'fs-extra'
import core from '@babel/core'
import t from '@babel/types'
import prettier from 'prettier'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })

  const ast = core.parse(source, { sourceType: 'module' })

  const variableDeclaration = t.variableDeclaration('var',
    [t.variableDeclarator(t.identifier('num1'), t.numericLiteral(1)),
    t.variableDeclarator(t.identifier('num2'), t.numericLiteral(2))]
  )

  const variableDeclaration1 = t.variableDeclaration('var', [
    t.variableDeclarator(t.identifier('cn1'), t.numericLiteral(11)),
    t.variableDeclarator(t.identifier('cn2'), t.numericLiteral(12))
  ])

  t.addComment(variableDeclaration, 'leading', 'before', false)
  t.addComments(variableDeclaration1, 'CommentBlock', [
    t.addComment(variableDeclaration1, 'leading', '第一行注释'),
    t.addComment(variableDeclaration1, 'leading', '第二行注释'),
  ])

  /**
   * @NOTE 第一种方法，可以直接操作AST对象，在这个对象的基础上，直接改AST的值
   */
  // ast.program.body.splice(0, 0, variableDeclaration)
  
  /**
   * 可以使用push方法去修改ast中的body
   */
  ast.program.body.push(variableDeclaration, variableDeclaration1)

  const output = core.transformFromAstSync(ast, source, {
    generatorOpts: {
      minified: false,
      comments: true,
    }
  })

  const formatCode = prettier.format(output.code, { singleQuote: true, semi: false })

  console.log('====> code', formatCode)
  fs.writeFileSync(filepath, formatCode)

}

workflow()