import path from 'path'
import fs from 'fs'
import { camelize } from 'vue'
import MarkdownIt from 'markdown-it'
import { docRoot } from '@element-plus/build-utils'
import { highlight } from '../utils/highlight'
import tag from './tag'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string
}

const localMd = MarkdownIt().use(tag)

const demo: ContainerOpts = {
  validate(params) {
    return !!params.trim().match(/^demo\s*(.*)$/)
  },

  render(tokens, idx) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
    if (tokens[idx].nesting === 1 /* means the tag is opening */) {
      const description = m && m.length > 1 ? m[1] : ''
      const sourceFileToken = tokens[idx + 2]
      let source = ''
      const sourceFile = sourceFileToken.children?.[0].content ?? ''

      if (sourceFileToken.type === 'inline') {
        source = fs.readFileSync(
          path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
          'utf-8'
        )
      }
      if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

      return `<Demo source="${encodeURIComponent(
        highlight(source, 'vue')
      )}" path="${sourceFile}" raw-source="${encodeURIComponent(
        source
      )}" description="${encodeURIComponent(localMd.render(description))}">
  <template #source><${camelize(sourceFile.replace(/\//g, '-'))}/></template>`
    } else {
      return '</Demo>\n'
    }
  },
}

export default demo
