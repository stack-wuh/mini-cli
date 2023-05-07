import fs from "fs-extra";
import core from "@babel/core";
import t from "@babel/types";

const filepath = "./demo.js";

const workflow = async () => {
  const source = await fs.readFile(filepath, { encoding: "utf-8" });
  const ast = core.parse(source, { sourceType: "module" });

  /**
   * @NOTE 实现for语句
   *
   * @example
   * for (let i =0; i < 10; i ++) {
   *  if (i === 5) {
   *    break;
   *  }
   *  console.log('======i', i)
   * }
   */
  const forStatement = t.forStatement(
    // 变量声明
    t.variableDeclaration("let", [
      t.variableDeclarator(t.identifier("i"), t.numericLiteral(0)),
    ]),
    // 二元表达式
    t.binaryExpression("<", t.identifier("i"), t.numericLiteral(10)),
    // 更新表达式
    t.updateExpression("++", t.identifier("i")),
    t.blockStatement([
      // if语句
      t.ifStatement(
        t.binaryExpression("===", t.identifier("i"), t.numericLiteral(5)),
        t.blockStatement([t.breakStatement()])
      ),
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier("console"), t.identifier("log")),
          [t.stringLiteral("===== i"), t.identifier("i")]
        )
      ),
    ])
  );

  /**
   * @NOTE
   *
   * @example
   * let i = 0
   *  while (i < 10) {
   *    i++
   *    console.log('=====i', i)
   *  }
   */
  const varIStatement = t.variableDeclaration("var", [
    t.variableDeclarator(t.identifier("i"), t.numericLiteral(0)),
  ]);
  const whileStatement = t.whileStatement(
    t.binaryExpression("<", t.identifier("i"), t.numericLiteral(10)),
    t.blockStatement([
      t.expressionStatement(t.updateExpression("++", t.identifier("i"))),
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier("console"), t.identifier("log")),
          [t.stringLiteral("======> i"), t.identifier("i")]
        )
      ),
    ])
  );

  /**
   * @NOTE do-while语句
   *
   * @example
   * do {
   *   i++
   *   console.log('=========iii', iii)
   * } while(iii < 10)
   */
  const doWhileStatement = t.doWhileStatement(
    t.binaryExpression("<", t.identifier("i"), t.numericLiteral(10)),
    t.blockStatement([
      t.expressionStatement(
        t.updateExpression('++', t.identifier('i'))
      ),
      t.expressionStatement(
        t.callExpression(t.identifier("console"), [t.identifier("i")])
      ),
    ])
  );

  /**
   * @NOTE for-in语句
   * 
   * @example
   * var obj = { name: 'asd' }
  *
   * for (let k in obj) { console.log('====>k', k) }
   */
  const forInStatement = t.forInStatement(
    t.variableDeclaration('let', [t.variableDeclarator(t.identifier('k'))]),
    t.identifier('obj'),
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('console'), t.identifier('log')),
          [t.stringLiteral('=======> i'), t.identifier('k')]
        )
      )
    ])
  )

  /**
   * @NOTE for-of 语句
   * 
   * @example
   * for (let k of arr) { console.log('=====> k', k) }
   */
  const forOfStatement = t.forOfStatement(
    t.variableDeclaration('let', [t.variableDeclarator(t.identifier('k'))]),
    t.identifier('arr'),
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('console'), t.identifier('log')),
          [
            t.stringLiteral('======> k'),
            t.identifier('k')
          ]
        )
      )
    ])
  )

  ast.program.body.push(
    forStatement,
    varIStatement,
    whileStatement,
    doWhileStatement,
    forInStatement,
    forOfStatement
  );

  const output = core.transformFromAstSync(ast);
  console.log("====> output.code", output.code);
};

workflow();
