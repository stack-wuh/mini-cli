import { ESLint } from 'eslint'
import vueParser from 'vue-eslint-parser'
import { parse } from 'espree'

const metas = {
  name: 'eslint-plugin-transform',
  version: '1.0.0',
}

const transformPlugin = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'My custom ESLint rule',
      category: 'Fill me in',
      recommended: false,
      url: 'https://example.com'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          myOption: {
            type: 'string',
            default: 'defaultValue'
          }
        },
        additionalProperties: false
      }
    ],
  },
  create (context) {
    console.log('====> create')
    return {}
  }
}

const plugins = {
  rules: {
    'transform-vue': transformPlugin
  },
  configs: {
    extract: {
      plugins: ['transform'], // 插件的前缀名称
      rules: {
        'transform/transform-vue': 'error',
      },
    },
  }
}

const workflow = async () => {
  const eslint = new ESLint({
    fix: true,
    cwd: '/Users/wuhong/custom-desktop/github/utils/mini-cli/core/vue-transform',
    useEslintrc: false,
    ignore: false,

    plugins: {
      [metas.name]: plugins,
    },

    overrideConfig: {
      parser: vueParser.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        parser: {
          js: parse,
          jsx: parse,
        },
        extends: ['plugin:transform/extract'],
        rules: {
          'transform-vue': 'error'
        }
      }
    },
  })

  const result = await eslint.lintFiles('./demo.vue')
  // console.log('======> result', result)
  await ESLint.outputFixes(result)
}

workflow()