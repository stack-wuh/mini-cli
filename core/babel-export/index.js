/**
 * @NOTE 这里与《重学前端》联动，用babel找出一个模块中，全部的export的变量
 * 
 * 导出表达式对应的节点 ExportNamedDeclaration
 */

import fsp from 'fs/promises'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
const filePath = './export.js'


/**
 * @NOTE 用parser解析源文件
 * @NOTE 用ast对象处理导出的字段名
 */
const workflow = async () => {
  const source = await fsp.readFile(filePath, { encoding: 'utf-8' })

  const ast = parser.parse(source, { sourceType: 'module' })

  const exportNamed = {}

  const { body } = ast.program

  body.forEach(node => {
    if (!node.declaration) return
    const { declarations } = node.declaration
    const head = declarations[0]

    exportNamed[head.id.name] = true
  })

  console.log('=====> workflow.exportNamed', exportNamed)
}

workflow()


/**
 * @NOTE 利用parser解析源文件
 * @NOTE 利用traverse遍历ast语法对象
 * 
 */
const workflowWithTraverse = async () => {
  const source = await fsp.readFile(filePath, { encoding: 'utf-8' })

  if (!source) return

  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] })

  const exportNamed = {}

  traverse.default(ast, {
    ExportNamedDeclaration: path => {
      const { name } = path.node.declaration.declarations[0].id
      console.log('===> path.node', path.node.declaration.declarations[0].id)

      exportNamed[name] = true
    }
  })


  console.log('=====> workflowWithTraverse.exportNamed', exportNamed)
}
workflowWithTraverse()
