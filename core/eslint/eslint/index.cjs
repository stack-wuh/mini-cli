let { ESLint } = require('eslint')

const workflow = async () => {
  const eslint = new ESLint({ fix: true, fixTypes: ['suggestion', 'problem'] })
  try {
    const results = await eslint.lintFiles(['./demo.cjs'])

    await ESLint.outputFixes(results);
    console.log('=====> results', results)

  } catch (error) {
    console.error(error)
  }
}

workflow()