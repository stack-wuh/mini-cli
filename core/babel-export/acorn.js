import fsp from 'fs/promises'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

const filePath = './export.js'

/**
 * @NOTE 这里是acorn版本的解析器
 * @NOTE 对解析出来的AST对象进行取值
 */
const workflow = async () => {
  const source = await fsp.readFile(filePath, { encoding: 'utf-8' })

  const ast = acorn.parse(source, { sourceType: 'module' })
  const { body } = ast

  const exportNamed = {}
  body.filter(node => node.type === 'ExportNamedDeclaration').forEach(node => {
    const [head] = node.declaration.declarations

    exportNamed[head.id.name] = true
  })

  console.log('======> workflow.exportNamed', exportNamed)
}

workflow()

/**
 * @NOTE 使用acorn解析ast
 * @NOTE 使用acorn-walk 实现节点的遍历
 */
const workflowWithWalk = async () => {
  const source = await fsp.readFile(filePath, { encoding: 'utf-8' })

  const ast = acorn.parse(source, { sourceType: 'module' })
  console.log('====> ast', ast)

  const exportNamed = {}

  walk.simple(ast, {
    ExportNamedDeclaration: node => {
      const [head] = node.declaration.declarations
      exportNamed[head.id.name] = true
    }
  })

  console.log('=====> workflowWithWalk.exportNamed', exportNamed)
}

workflowWithWalk()