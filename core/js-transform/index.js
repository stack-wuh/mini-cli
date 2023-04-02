import * as acorn from "acorn"
import * as acornWalk from 'acorn-walk'
import * as escodegen from 'escodegen'

/**
 * Object.keys(acorn)
 * 
 * =====> acorn [
  'Node',              'Parser',
  'Position',          'SourceLocation',
  'TokContext',        'Token',
  'TokenType',         'defaultOptions',
  'getLineInfo',       'isIdentifierChar',
  'isIdentifierStart', 'isNewLine',
  'keywordTypes',      'lineBreak',
  'lineBreakG',        'nonASCIIwhitespace',
  'parse',             'parseExpressionAt',
  'tokContexts',       'tokTypes',
  'tokenizer',         'version'
]
 */



const template = `
  const name = 'shadow'
  const age = 20
  const { id } = obj
`

const ast = acorn.parse(template)


acornWalk.simple(ast, {
  VariableDeclarator: node => {
    node.init.value = 'shadow1'

    if (node.id.name = 'age') {
      node.id.name = 'oldAge'
      node.init.value = 32
    }
    console.log('====> node', node)
  },
})

const newCode = escodegen.generate(ast)
console.log('====> new Code', newCode)