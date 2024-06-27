import { asyncRoutes, constantRoutes } from '@/router'
import { getAccessedRoutes, setAccessedRoutes, removeAccessedRoutes } from '@/utils/auth'

import { authMenu } from '@/api/user'// 【新加入】引入请求，后面有文件，先不慌
import Layout from '@/layout'// 【新加入】引入layout


function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    if (route.meta.roles.indexOf(roles) > -1) {
      return true
    } else {
      return false
    }
    // return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

//这里自己写方法，作用就是向 asyncRoutes 插入路由，达到动态路由的效果
/**
 * 【新加入】后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  //data挨个遍历
  data.forEach(item => {
    //path不为空的话，就新建一个对象，装数据
    if (item.pagePath !== '') {
      //这个就仿照目录的机构，搭建
      const menu = {
        path: item.path,
        component: Layout, //这个不用写data里面的内容，引用就行了
        // redirect: item.redirect,
        children: [],
        // alwaysShow: true ,
        name: item.name,

        meta: { title: item.title, icon: item.icon },
      }
      //遍历子标签，并加入到主目录的children中去
      item.children.forEach(item => {
        const menu2 = {
          path: item.path,
          component: (resolve) => require([`@/views${item.component}`], resolve),
          name: item.name,
          meta: { title: item.title, icon: item.icon },
          hidden: item.hidden
        }
        //加入到主目录的children中去
        menu.children.push(menu2)
      })
      //追加
      routes.push(menu)
    }
  })
  //把404加到最后，因为作者说  // 404 page must be placed at the end !!!
  const menu3 = {
    path: '*',
    redirect: '/404',
    hidden: true
  }
  //追加
  routes.push(menu3)
}

//不看
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
//不看
const state = {
  routes: [],
  addRoutes: []
}
//不看
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 【新加入】开始
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由，authMenu（state.token）后面会写
      authMenu(state.token).then(response => {

        let data = response.data.data

        //我的code为100200为正常
        if (response.data.code !== 200) {
          this.$message({
            message: '菜单数据加载异常',
            type: "info"
          })
          console.log(1111111);
        } else {
          //获取目录的json
          data = response.data.data
          //把data的数据拷贝到loadMenuData里面
          Object.assign(loadMenuData, data)
          //把asyncRoutes的数据拷贝到tempAsyncRoutes里面
          const tempAsyncRoutes = Object.assign([], asyncRoutes)
          // 最最重要的，把loadMenuData追加到tempAsyncRoutes后面
          generaMenu(tempAsyncRoutes, loadMenuData)
          //定义accessedRoutes
          // let accessedRoutes
          // 把 tempAsyncRoutes 的值给 accessedRoutes ，并输出
          // eslint-disable-next-line prefer-const
          const accessedRoutes = tempAsyncRoutes || []
          //下面这些就是加载目录了
          commit('SET_ROUTES', accessedRoutes)
          setAccessedRoutes(accessedRoutes)
          localStorage.setItem('routes', JSON.stringify(accessedRoutes));
          console.log(accessedRoutes, 'accessedRoutes');
          resolve(accessedRoutes)
        }
      })
    }).catch(error => {
      console.log(error)
    })
  },
  // resetRoutes({ commit }) {
  //   commit('SET_ROUTES', '')
  //   console.log('dcds');
  // }
  // generateRoutes({ commit }) {
  //  console.log(111);
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
