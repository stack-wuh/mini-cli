const { promisify } = require('util')
const figlet = promisify(require('figlet'))

const chalk = require('chalk')
const clear = require('clear')

const logger = conment => console.log(chalk.white(conment))

module.exports = async name => {
    clear()
    const data = await figlet('HELLO WOLRD!')
    logger(data)
}