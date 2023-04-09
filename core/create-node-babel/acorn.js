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
    // 找出全部的声明语句节点
    VariableDeclaration (node) {
      
      const { id } = node.declarations[0]
      // 准备一个块级注释的节点
      const commentNode = {
        type: "Block",
        value: ['\n', `* this is comment ${id.name}`, `* ${new Date().toLocaleDateString()} \n`].join('\n'),
        loc: node.loc
      }

      // 筛选出原注释节点需要添加的节点位置
      const commentFilters = comments.filter(c => (c.loc.end.line) <= node.loc.start.line)
      let tail = null

      if (commentFilters.length) {
        tail = comments.shift()
      }

      // 还原原注释节点
      node.leadingComments = [].concat(tail).filter(Boolean)
      // 添加新的注释节点
      node.leadingComments = [].concat(node.leadingComments, commentNode).filter(Boolean)
      node.trailingComments = [].concat(node.trailingComments, commentNode).filter(Boolean)
    }
  })

  // 生成源代码
  const code = escodegen.generate(ast, { 
    format: {
      semicolons: false,
    },
    comment: true
  })

  // prettier美化代码，去掉句尾分号，改双引号为单引号
  const result = prettier.format(code, { semi: false, singleQuote: true })

  console.log('====== transform.code')
  console.log(result)
}

workflow()



