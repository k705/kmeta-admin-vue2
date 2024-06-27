import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // if (store.getters.routes.length > 0) {
  //   next()
  // } else {
  //   if (to.path === '/login'||'/register') {
  //     next()
  //     NProgress.done()
  //   } else {
  //     try {
  //       await store.dispatch('user/getButtons')

  //       next({ ...to })
  //     } catch (error) {
  //       // Message.error(error || 'Has Error')
  //       next(`/login?redirect=${to.path}`)
  //       NProgress.done()
  //     }
  //   }
  // }
  if (to.path === '/login' || '/register') {
    next()
    NProgress.done()
  } else {
    try {

      const accessRoutes = await store.dispatch('permission/generateRoutes')

      router.addRoutes(accessRoutes)


      next({ ...to, replace: true })
    } catch (error) {
      // Message.error(error || 'Has Error')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
