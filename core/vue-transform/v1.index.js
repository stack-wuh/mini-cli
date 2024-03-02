import fs from 'fs-extra'
// import vueParser from 'vue-eslint-parser'
import * as espree from 'espree'
import * as compilerCore from '@vue/compiler-core'
import { NodeTypes } from './config'
const { generate, baseParse, transform, getBaseTransformPreset } = compilerCore


const workflow = async () => {
  const source = await fs.readFile('./demo.vue', { encoding: 'utf-8' })
  const vueAst =  baseParse(source, { filePath: './demo.vue', sourceType: 'module', parser: espree })

  const template = vueAst.children.find(c => c.tag === 'template')
  const script = vueAst.children.find(c => c.tag === 'script')
  const style = vueAst.children.find(c => c.tag === 'style')
  
  const div = baseParse('<p>hello, world!!!!</p>')

  const plugin = (node, context) => {
    if (node.type === NodeTypes.ELEMENT && node.tag === 'div') {
      console.log('===== node', node)
      context.replaceNode(div)
    }
  }

  const prefixIdentifiers = true

  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(
      prefixIdentifiers
    )


  transform(template, { 
    filename: 'template.name.vue',
    prefixIdentifiers,
    nodeTransforms: [].concat(nodeTransforms, plugin).filter(Boolean)
  })

  // traverseNode(vueAst, {
  //   nodeTransforms: [plugin]
  // })
  
  console.log('=====> source.template', template)
  vueAst.children[0] = template
  // console.log('=====> source.script', script)
  // console.log('=====> source.style', style)
  const code = await generate(vueAst, { mode: 'module', sourceMap: true })
  console.log('===== result', code)
}

workflow()