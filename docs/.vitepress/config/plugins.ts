import mdContainer from 'markdown-it-container'
import externalLinkIcon from '../plugins/external-link-icon'
import tableWrapper from '../plugins/table-wrapper'
import tooltip from '../plugins/tooltip'
import tag from '../plugins/tag'
import demo from '../plugins/demo'
import { ApiTableContainer } from '../plugins/api-table'
import type MarkdownIt from 'markdown-it'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(externalLinkIcon)
  md.use(tableWrapper)
  md.use(tooltip)
  md.use(tag)
  md.use(mdContainer, 'demo', demo)
  md.use(ApiTableContainer)
}
