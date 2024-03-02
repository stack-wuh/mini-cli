import EsModule from "eslint"

const { ESLint } = EsModule

const confiuration = {
  useEslintrc: false,
  overrideConfig: {
      parserOptions: {
          sourceType: "module",
          ecmaVersion: "latest",
      },
      env: {
          es2022: true,
          node: true,
          es6: true
      },
  }
}

export const createEslintInstance = () => {
  const config = Object.assign({}, confiuration, { fix: true })
  const eslint =  new ESLint(config)

  return eslint
}

export const lintAndFix = async (eslint, filePath) => {
  const results = await eslint.lintFiles(filePath)
  await ESLint.outputFixes(results)

  return results
}

export const outputLintingResults = (results) => {
  const problems = results.reduce((acc, result) => acc + result.errorCount + result.warningCount, 0)

  return problems
}

const workflow = async () => {
  try {
    const eslint = createEslintInstance()

    const results = await lintAndFix(eslint, ['../test/**.js'])

    const result = outputLintingResults(results)
  } catch (error) {
    console.error('[workflow.error]: ', error)    
  }
}


workflow()