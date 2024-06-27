import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/activateEmail',
    component: () => import('@/views/activateEmail/index'),
    hidden: true
  },
  {
    path: '/activateEmailCert',
    component: () => import('@/views/activateEmailCert/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/first',
    meta: { title: '首页', icon: 'el-icon-s-help' },
    hidden:true,
    children: [
      {
        path: 'first',
        name: 'First',
        component: () => import('@/views/first'),
        meta: { title: '首页', icon: 'table' },

      },]
  },




]

// export const asyncRoutes = [
//   // 内容管理：k星管理、k星创建
//   {
//     path: '/manage',
//     component: Layout,
//     redirect: '/manage/starmanage',
//     name: 'Manage',
//     alwaysShow: true,
//     meta: { title: '管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'starmanage',
//         name: 'Starmanage',
//         component: () => import('@/views/manage/starmanage'),
//         meta: { title: 'K星管理', icon: 'table' }
//       },

//       {
//         path: 'star',
//         name: 'Star',
//         component: () => import('@/views/manage/star'),
//         hidden: true,
//         meta: { title: '创建星球', icon: 'table' }
//       },

//     ]
//   },
//   // 资产管理：结算卡管理、奖品管理、
//   {
//     path: '/asset',
//     component: Layout,
//     redirect: '/asset/starasset',
//     name: 'Asset',
//     alwaysShow: true,
//     meta: { title: '资产管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'debitcard',
//         name: 'Debitcard',
//         component: () => import('@/views/asset/debitcard'),
//         meta: { title: '结算卡管理', icon: 'tree' }
//       },

//       {
//         path: 'prize',
//         name: 'Prize',
//         component: () => import('@/views/asset/prize'),

//         meta: { title: '奖品管理', icon: 'table' }
//       },
//     ]
//   },
//   // 运营管理：结算卡推荐管理、抽奖活动管理、banner管理、等级特权管理、审核管理、投诉管理
//   {
//     path: '/operations',
//     component: Layout,
//     redirect: '/operations/debitCardRecommended',
//     name: 'Operations',
//     meta: { title: '运营管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'debitCardRecommended',
//         name: 'DebitCardRecommended',
//         component: () => import('@/views/operations/debitCardRecommended'),
//         meta: { title: '结算卡推荐管理', icon: 'table' }
//       },
//       {
//         path: 'lottery',
//         name: 'Lottery',
//         component: () => import('@/views/operations/lottery'),
//         meta: { title: '抽奖活动管理', icon: 'table' }
//       }, {
//         path: 'banner',
//         name: 'Banner',
//         component: () => import('@/views/operations/banner'),
//         meta: { title: 'banner管理', icon: 'table' }
//       }, {
//         path: 'privileges',
//         name: 'Privileges',
//         component: () => import('@/views/operations/privileges'),
//         meta: { title: '等级特权管理', icon: 'table' }
//       },{
//         path: 'complaint',
//         name: 'Complaint',
//         component: () => import('@/views/operations/complaint'),
//         meta: { title: '投诉管理', icon: 'table' }
//       },

//     ]
//   },
//   // 审核管理
//   {
//     path: '/check',
//     component: Layout,
//     redirect: '/check/starcheck',
//     name: 'Check',
//     meta: { title: '审核管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'starcheck',
//         name: 'Starcheck',
//         component: () => import('@/views/check/starcheck'),
//         meta: { title: '星球审核', icon: 'table' }
//       },

//       {
//         path: 'brandcheck',
//         name: 'Brandcheck',
//         component: () => import('@/views/check/brandcheck'),

//         meta: { title: '企业认证审核', icon: 'table' }
//       },
//     ]
//   },
//   // 企业认证
//   {
//     path: '/certification',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: 'Certification',
//         component: () => import('@/views/certification/index'),
//         meta: { title: '企业认证/年审', icon: 'form' }
//       }
//     ]
//   },
//   // 系统管理：权限管理、用户管理、角色管理、操作日志
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/system/permission',
//     name: 'System',
//     meta: { title: '系统管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'permission',
//         name: 'Permission',
//         component: () => import('@/views/system/permission'),
//         meta: { title: '权限管理', icon: 'table' }
//       },

//       {
//         path: 'user',
//         name: 'User',
//         component: () => import('@/views/system/user'),

//         meta: { title: '用户管理', icon: 'table' }
//       },
//       {
//         path: 'role',
//         name: 'Role',
//         component: () => import('@/views/system/role'),

//         meta: { title: '角色管理', icon: 'table' }
//       },
//       {
//         path: 'log',
//         name: 'Log',
//         component: () => import('@/views/system/log'),

//         meta: { title: '操作日志', icon: 'table' }
//       },

//     ]
//   },
//   // 系统配置：协议、K分池-月活、短信、K分上限、企业权限/角色、版本更新
//   {
//     path: '/sconfiguration',
//     component: Layout,
//     redirect: '/sconfiguration/permission',
//     name: 'Sconfiguration',
//     meta: { title: '系统配置', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'protocol',
//         name: 'Protocol',
//         component: () => import('@/views/sconfiguration/protocol'),
//         meta: { title: '协议', icon: 'table' }
//       },

//       {
//         path: 'mau',
//         name: 'Mau',
//         component: () => import('@/views/sconfiguration/mau'),

//         meta: { title: 'K分池-月活', icon: 'table' }
//       },
//       {
//         path: 'sms',
//         name: 'Sms',
//         component: () => import('@/views/sconfiguration/sms'),

//         meta: { title: '短信', icon: 'table' }
//       },
//       {
//         path: 'limit',
//         name: 'Limit',
//         component: () => import('@/views/sconfiguration/limit'),

//         meta: { title: 'K分上限', icon: 'table' }
//       },
//       {
//         path: 'businessRole',
//         name: 'BusinessRole',
//         component: () => import('@/views/sconfiguration/businessRole'),

//         meta: { title: '企业权限/角色', icon: 'table' }
//       },
//       {
//         path: 'version',
//         name: 'Version',
//         component: () => import('@/views/sconfiguration/version'),

//         meta: { title: '版本更新', icon: 'table' }
//       },

//     ]
//   },
//   // 数据看板
//   {
//     path: '/dashboard',
//     component: Layout,
//     redirect: '/dashboard/stardata',
//     name: 'dashboard',
//     alwaysShow: true,
//     meta: { title: '数据看板', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'stardata',
//         name: 'Stardata',
//         component: () => import('@/views/dashboard/stardata'),
//         meta: { title: 'K星数据', icon: 'table' }
//       },]
//   },

//   // 检测系统

// // 404 page must be placed at the end !!!
// { path: '*', redirect: '/404', hidden: true }
// ]




//保存原型对象的Push

export const asyncRoutes = [

]






let originPush = Router.prototype.push
let originReplace = Router.prototype.replace
//重写push方法
Router.prototype.push = function (location, res, rej) {
  if (res && rej) {
    originPush.call(this, location, res, rej)
  }
  else {
    originPush.call(this, location, () => { }, () => { })
  }

}
//重写replace方法
Router.prototype.replace = function (location, res, rej) {
  if (res && rej) {
    originReplace.call(this, location, res, rej)
  }
  else {
    originReplace.call(this, location, () => { }, () => { })
  }

}






const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes

})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
