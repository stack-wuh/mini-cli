import { Linter } from 'eslint'
import fs from 'fs-extra'
import { lintAndFix } from './index.js'

const linter = new Linter()

const source = fs.readFileSync('../test/demo1.js', { encoding: 'utf-8' })

linter.defineRule('no-dynamic-a', {
  meta: {
    fix: true,
    fixable: 'code',
    type: 'problem',
    messages: '不能使用变量a'
  },
  create (context) {
    return {
      VariableDeclaration (node) {
        node.declarations.forEach(decl => {
          if (decl.id.name === 'a') {
            context.report({
              node: decl,
              message: 'Use "let" instead of "var".',
              fix: function *(fixer) {
                yield fixer.replaceText(node, 'var b = 11')
              }
            });
          }
        })
      }
    }
  }
})

linter.defineRule('no-dynamic-b', {
  meta: {
    fix: true,
    fixable: 'code',
    type: 'problem',
    messages: '不能使用变量b'
  },
  create (context) {
    return {
      VariableDeclaration (node) {
        node.declarations.forEach(decl => {
          if (decl.id.name === 'b') {
            context.report({
              node: decl,
              message: 'Use "let" instead of "var".',
              fix: function *(fixer) {
                yield fixer.replaceText(node, 'var c = 11')
              }
            });
          }
        })
      }
    }
  }
})

const workflow = async () => {
  const messages = linter.verifyAndFix(source, {
    rules: { 
      'no-dynamic-a': 'error',
      'no-dynamic-b': 'error'
    }
  }, { filename: '../test/demo1.js' })

  // console.log('====> messages', messages.output)

  await fs.writeFile('../test/demo1.js', messages.output, 'utf8')
}

workflow()