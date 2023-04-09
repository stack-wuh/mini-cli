import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import fs from 'fs-extra'
import escodegen from 'escodegen'
import prettier from 'prettier'

const filepath = './demo.js'

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: 'utf-8' })

  /**
   * @NOTE 解析源代码成为AST
  */
  const comments = []
  const ast = acorn.parse(source, { 
                        sourceType: 'module', 
                        ecmaVersion: 2020,
                        onComment: comments,
                        locations: true
                      })

  /**
   * @NOTE 遍历AST
   */
  walk.simple(ast, {
    VariableDeclaration (node) {
      const { id } = node.declarations[0]
      const commentNode = {
        type: "Block",
        value: ['\n', `* this is comment ${id.name}`, `* ${new Date().toLocaleDateString()} \n`].join('\n'),
        loc: node.loc
      }
      const commentFilters = comments.filter(c => (c.loc.end.line) <= node.loc.start.line)
      let tail = null

      if (commentFilters.length) {
        tail = comments.shift()
      }

      node.leadingComments = [].concat(tail).filter(Boolean)
      node.leadingComments = [].concat(node.leadingComments, commentNode).filter(Boolean)
    }
  })

  const code = escodegen.generate(ast, { 
    format: {
      semicolons: false,
    },
    comment: true
  })

  const result = prettier.format(code, { semi: false, singleQuote: true })

  console.log('====== transform.code')
  console.log(result)
}

workflow()



