import core from '@babel/core'
import fs from 'fs-extra'
import t from '@babel/types'

const filepath = './demo.js'

const workflow = async () => {
	const source = await fs.readFile(filepath, { encoding: 'utf-8' })
	const ast = await core.parse(source, { sourceType: 'module' })

	/**
	 * @NOTE 使用函数声明创建函数
	 * function foo () {
	 *  console.log('=====> foo')
	 * }
	 */
	const funcNode1 = t.functionDeclaration(
		t.identifier('foo'),
		[t.identifier('p1'), t.identifier('p2'), t.identifier('...p')],
		t.blockStatement([
			t.expressionStatement(
				t.callExpression(
					t.memberExpression(t.identifier('console'), t.identifier('log')),
					[t.stringLiteral('=====> foo.p1'), t.identifier('p1')]
				)
			),
			t.expressionStatement(
				t.callExpression(
					t.memberExpression(t.identifier('console'), t.identifier('log')),
					[t.stringLiteral('=====> foo.p'), t.identifier('p')]
				)
			),
		])
	)

	/**
	 * @NOTE 使用函数字面量
	 * var foo = function () {
	 *  console.log('=======> foo')
	 * }
	 */
	const node2FuncExpression = t.functionExpression(
		t.identifier(''),
		[t.identifier('p1')],
		t.blockStatement([
			t.expressionStatement(
				t.callExpression(
					t.memberExpression(t.identifier('console'), t.identifier('log')),
					[t.identifier('p1')]
				)
			),
		])
	)
	const funcNode2 = t.variableDeclaration('const', [
		t.variableDeclarator(t.identifier('foo'), node2FuncExpression),
	])

	/**
	 * @NOTE 利用构造函数
	 * var foo = new Function('p1', 'p2', `console.log('======> foo', p1)`)
	 */
	const node3NewExpression = t.newExpression(t.identifier('Function'), [
		t.identifier('"p1"'),
		t.identifier('"p2"'),
		t.stringLiteral('console.log(' + "'=====> foo'" + ', p1)'),
	])
	const funcNode3 = t.variableDeclaration('const', [
		t.variableDeclarator(t.identifier('foo'), node3NewExpression),
	])

	/**
	 * @NOTE  箭头函数
	 * var foo = () => { console.log('======> foo') }
	 */
	const node4ArrowFunc = t.arrowFunctionExpression(
		[t.identifier('p1'), t.identifier('t2')],
		t.blockStatement([
			t.expressionStatement(
				t.callExpression(
					t.memberExpression(t.identifier('console'), t.identifier('log')),
					[t.stringLiteral('=====> foo'), t.identifier('p1')]
				)
			),
		])
	)
	const funcNode4 = t.variableDeclaration('const', [
		t.variableDeclarator(t.identifier('foo'), node4ArrowFunc),
	])

	/**
	 * @NOTE 实现await 异步箭头函数
	 * var foo = async () => {
	 *  await console.log('=====> foo')
	 * }
	 */
	const arrowAwaitFunc = t.arrowFunctionExpression(
		[t.identifier('p1'), t.identifier('p2')],
		t.blockStatement([
			t.expressionStatement(
				t.awaitExpression(
					t.callExpression(
						t.memberExpression(t.identifier('console'), t.identifier('log')),
						[t.stringLiteral('======> foo', t.identifier('p1'))]
					)
				)
			),
		]),
		true
	)
	const funcNode5 = t.variableDeclaration('const', [
		t.variableDeclarator(t.identifier('foo'), arrowAwaitFunc),
	])

	/**
	 * @NOTE 使用函数声明，实现异步函数
	 */
	const funcNode6 = t.functionDeclaration(
		t.identifier('foo'),
		[t.identifier('p1')],
		t.blockStatement([
			t.expressionStatement(
				t.awaitExpression(
					t.callExpression(
						t.memberExpression(t.identifier('console'), t.identifier('log')),
						[t.identifier('p1')]
					)
				)
			),
		]),
		false,
		true
	)

	/**
	 * @NOTE 在对象中声明函数
	 *
	 * var obj = {
	 *  say (p1) {
	 *    console.log('=====> foo', p1)
	 *  }
	 * }
	 */
	const objNode1 = t.variableDeclaration('const', [
		t.variableDeclarator(
			t.identifier('obj'),
			t.objectExpression([
				t.objectProperty(
					t.identifier('say'),
					t.functionExpression(
						null,
						[t.identifier('p1')],
						t.blockStatement([
							t.expressionStatement(
								t.callExpression(
									t.memberExpression(
										t.identifier('console'),
										t.identifier('log')
									),
									[t.identifier('p1')]
								)
							),
						])
					)
				),
			])
		),
	])

	/**
	 * @NOTE 使用构造函数的原型链
	 *
	 * function Foo() {}
	 * Foo.prototype = function (p1) {
	 *   console.log(p1);
	 * }
	 */
	const funcNode7 = t.functionDeclaration(
		t.identifier('Foo'),
		[],
		t.blockStatement([])
	)
	const node7Statement = t.assignmentExpression(
		'=',
		t.memberExpression(t.identifier('Foo'), t.identifier('prototype')),
		t.functionExpression(
			null,
			[t.identifier('p1')],
			t.blockStatement([
				t.expressionStatement(
					t.callExpression(
						t.memberExpression(t.identifier('console'), t.identifier('log')),
						[t.identifier('p1')]
					)
				),
			])
		)
	)

	/**
	 * @NOTE 利用Class的属性，声明一个函数
   * 
   * class Foo {
   *  say (p1) {
   *    console.log('=======> say', p1)
   *  }
   * }
	 */
	const classBody = t.classBody([
		t.classMethod(
			'method',
			t.identifier('say'),
			[t.identifier('p1')],
			t.blockStatement([
				t.expressionStatement(
					t.callExpression(
						t.memberExpression(t.identifier('console'), t.identifier('log')),
						[t.identifier('p1')]
					)
				),
			])
		),
	])
	const funcNode8 = t.file(
		t.program([t.classDeclaration(t.identifier('Foo'), null, classBody)])
	)


  /**
   * @NOTE  使用IIFE构建函数
   * 
   * (function () {
   *  console.log(this)
   * })(window)
   */
  const funcNode9 = t.expressionStatement(t.callExpression(t.functionExpression(
    null,
    [],
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('console'), t.identifier('log')),
          [t.thisExpression()]
        )
      )
    ])
  ), [t.identifier('window')]))

	ast.program.body.push(
		funcNode1,
		funcNode2,
		funcNode3,
		funcNode4,
		funcNode5,
		funcNode6,
		objNode1,
		funcNode7,
		node7Statement,
		funcNode8,
    funcNode9
	)

	const output = core.transformFromAstSync(ast, {})
	console.log('====> workflow.output.code', output.code)
	// await fs.writeFile(filepath, output.code)
}

workflow()
