import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Kmeta 系统管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
