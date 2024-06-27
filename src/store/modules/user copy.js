import { login, logout, authMenu } from '@/api/user'
import {getToken, setToken, removeToken, setAvatar, getAvatar} from '@/utils/auth'
import router, { constantRoutes, anyRoutes, resetRouter } from '@/router'
// import { resetRouter } from '@/router'
// import _ from 'lodash'

const renderRoutes = (originRoutes, permissionList) => {
  return originRoutes.reduce((prev, item) => {
    if (permissionList.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = renderRoutes(item.children, permissionList)
      }

      prev.push(item)
    }

    return prev
  }, [])
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: getAvatar(),
    routes: JSON.parse(localStorage.getItem('routes')) || []
  }
}

const state = getDefaultState()

// const state = {
//   token: getToken(),
//   name: '',
//   avatar: '',
//   // introduction: '',
//   // roles: []
//   routes: JSON.parse(localStorage.getItem('routes')) || []
// }

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
   const asyncRoutes = routes.map(function (item) {
      return item
    })
    const userRoutes = renderRoutes(_.cloneDeep(asyncRoutes), routes) // 生成用户路由
    router.addRoutes(userRoutes)
    localStorage.setItem('routes', JSON.stringify(routes))
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {

    const { username, password } = userInfo

    return new Promise((resolve, reject) => {


      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response.data
        console.log(data.accessToken);
        commit('SET_TOKEN', data.accessToken)
        commit('SET_AVATAR', data.avatar)
        commit('SET_NAME', data.username)
        setToken(data.accessToken)
        setAvatar(data.avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getButtons({ commit }) {
    return new Promise((resolve, reject) => {
      authMenu().then(response => {
        console.log('路由1', response.data.data);
        commit('SET_ROUTES', response.data.data)
        resolve()
      }).catch(error => {
        console.log('err1', error);
        reject(error)
      })
    })
  },



  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem('routes')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        console.log("err3", error);
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
