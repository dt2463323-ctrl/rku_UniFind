import common from './common'
import nav from './nav'
import home from './home'
import search from './search'
import report from './report'
import item from './item'
import matches from './matches'
import reports from './reports'
import notifications from './notifications'
import profile from './profile'
import panels from './panels'
import data from './data'

import type { en } from '../en'

export const ja: Record<keyof typeof en, string> = {
  ...common,
  ...nav,
  ...home,
  ...search,
  ...report,
  ...item,
  ...matches,
  ...reports,
  ...notifications,
  ...profile,
  ...panels,
  ...data,
}
