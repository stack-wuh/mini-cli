import fsp from 'fs/promises'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import core from '@babel/core'
import prettier from 'prettier'

const filepath = './demo.js'


const workflowBabel = async () => {
  const source = await fsp.readFile(filepath, { encoding: 'utf-8' })

  const ast = parser.parse(source)

  traverse.default(ast, {
    // 这里不对，这个是在var后面加了注释
    Identifier (path) {
      if (path.node.name === 'str') {
        path.node.name = 'str'
        path.parentPath.parentPath.addComment('leading', '这里是一条注释', true)
      }
    },

    /**
     * @NOTE 可以用声明表达式去找对应的节点
     * 
     * !1. 现在是有一个前置条件, 只给num1这个变量加前后注释
     */
    VariableDeclarator (path) {
      if (path.node.id.name === 'num1') {
        // console.log('=====> variableDeclaration.path', path)
        /**
         * @NOTE false代表是多行注释，true 代表单行注释
         */
        path.parentPath.addComment('leading', ' before \n *asd \n *sss \n', false)
        path.addComment('trailing', 'after', true)
      }
    },
    VariableDeclaration (path) {
      const [head] = path.node.declarations

      // 添加后置注释
      path.addComment('trailing', `${head.id.name} 的后置注释`, false)
      // 添加前置注释
      path.addComment('leading', `${head.id.name} 的前置注释`, false)
    }
  })

  // 生成源代码
  const result = await core.transformFromAstSync(ast, source, {
    generatorOpts: {
      minified: false,
      comments: true,
    }
  })

  // 使用prettier去掉句尾分号，改双引号为单引号
  const template = prettier.format(result.code, { semi: false, singleQuote: true,  })
  console.log('======> result', template)
}

workflowBabel()