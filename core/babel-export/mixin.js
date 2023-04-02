/**
 * @NOTE 这里与《重学前端》联动，用babel找出一个模块中，全部的export的变量
 * 
 * 导出表达式对应的节点 ExportNamedDeclaration
 */

import fsp from 'fs/promises'
import parser from '@babel/parser'
import * as walk from 'acorn-walk'
const filePath = './export.js'

/**
 * @NOTE 利用parser解析源文件
 * @NOTE 利用traverse遍历ast语法对象
 * 
 */
const workflowWithTraverse = async () => {
  const source = await fsp.readFile(filePath, { encoding: 'utf-8' })

  if (!source) return

  const ast = parser.parse(source, { sourceType: 'module' })

  const exportNamed = {}

  walk.simple(ast.program, {
    ExportNamedDeclaration: (node) => {
      const [head] = node.declaration.declarations
      exportNamed[head.id.name] = true
    }
  })


  console.log('=====> workflowWithTraverse.exportNamed', exportNamed)
}
workflowWithTraverse()