import fs from 'fs-extra'
import puppeteer from 'puppeteer'

const ELEMENT_UI_COMPONENT_URL =
  'https://element.eleme.cn/#/zh-CN/component/installation'

const getBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })

  return browser
}

/**
 * @NOTE 获取官网的菜单以及相关的数据
 */
const workflowForNavMenu = async () => {
  const browser = await getBrowser()

  const page = await browser.newPage()

  await page.goto(ELEMENT_UI_COMPONENT_URL, { timeout: 60000 })
  console.log('======> 已正常跳转页面')

  await page.waitForSelector('div.nav-group li.nav-item a')
  console.log('=====> 已获取指定元素', await page.title())

  const links = await page.evaluate(() => {
    const elems = document.querySelectorAll('div.nav-group li.nav-item a')
    const result = [...elems]
      .map((elem) => {
        const name = elem.innerText
        const rename = name.split(' ')[0]

        return {
          name,
          rename,
          prefixName: ['el', 'kye']
            .map((c) => [c, rename].join('-'))
            .map((c) => c.toLowerCase()),
          href: elem.href,
        }
      })
      .filter((c) => !['Typography'].includes(c.rename))

    return result
  })

  await fs.ensureFile('./element-ui-nav-menu.json')
  await fs.writeJSON('./element-ui-nav-menu.json', {
    name: 'element-ui-nav-menu',
    total: links.length,
    result: links,
  })
  await browser.close()
}

/**
 * @NOTE 在组件页面，获取相关的数据
 *
 * * attributes
 * * slot
 * * events
 */
const workflowForTarget = async () => {
  const menuData = await fs.readJSON('./element-ui-nav-menu.json')
  let start = 0
  let success = 0
  let error = 0
  const errorMaps = {}
  // console.log('==== menuData', menuData)
  // const current = menuData.result[0]

  const browser = await getBrowser()
  const page = await browser.newPage()

  const walk = async () => {
    while (start < menuData.total) {
      const current = menuData.result[start]

      if (current.href) {
        console.log('======> 开始导航', current.href)
        await page.goto(current.href)
        console.log('=======> 页面已导航')

        try {
          await page.waitForSelector('h3+table')
          console.log('=======> 目标对象已渲染')
        } catch (error) {
          current.body = []
          start++
          error++

          errorMaps[current.href] = current
          console.error('=====> 目标渲染失败!')
          await walk()
          return
        }

        const result = await page.evaluate(() => {
          const tableElems = document.querySelectorAll('h3+table')
          const originElems = [...tableElems].map((c) => {
            const labelElem = c.previousElementSibling
            const labels = [...c.querySelectorAll('thead tr th')].map(
              (c) => c.innerText
            )
            const values = [...c.querySelectorAll('tbody tr')].map((c) => {
              return [...c.querySelectorAll('td')].map((c) => c.innerText)
            })
            const data = values.map((value) => {
              return value.reduce((acc, curr, idx) => {
                acc[labels[idx]] = curr

                return acc
              }, {})
            })

            const label = labelElem.lastChild.textContent
              .trim()
              .toLocaleLowerCase()
            const type = label.match(/[a-zA-Z]+/gi).slice(-1)[0]

            return {
              label,
              type,
              labels,
              values,
              data,
            }
          })

          return originElems
        })

        current.body = result
        await fs.writeJSON('./element-ui-nav-menu.json', menuData)
        success++
      }

      start++
    }
  }

  await walk()
  await browser.close()

  menuData.errorMaps = errorMaps
  menuData.error = error
  menuData.success = success

  await fs.writeJSON('./element-ui-nav-menu.json', menuData)

  // console.log('======> 开始导航')
  // await page.goto(current.href)
  // console.log('=======> 页面已导航')

  // await page.waitForSelector('h3+table')
  // console.log('=======> 目标对象已渲染')

  // const result = await page.evaluate(() => {
  //   const tableElems = document.querySelectorAll('h3+table')
  //   const originElems = [...tableElems].map(c => {
  //     const labelElem = c.previousElementSibling
  //     const labels = [...c.querySelectorAll('thead tr th')].map(c => c.innerText)
  //     const values = [...c.querySelectorAll('tbody tr')].map(c => {
  //       return [...c.querySelectorAll('td')].map(c => c.innerText)
  //     })
  //     const data = values.map(value => {
  //       return value.map((c, idx) => ({ [labels[idx]]: c }))
  //     })

  //     return {
  //       label: labelElem.lastChild.textContent.trim(),
  //       labels,
  //       values,
  //       data
  //     }
  //   })

  //   return originElems
  // })

  // current.body = result
  // await fs.writeJSON('./element-ui-nav-menu.json', menuData)
}

// workflowForTarget()

const workflow = async () => {
  // await workflowForNavMenu()
  await workflowForTarget()
}

workflow()
