import { login, logout, authMenu } from '@/api/user'
// import { resetRoutes} from '@/permission'

import { getToken, setToken, removeToken, setAvatar, getAvatar, removeAvatar } from '@/utils/auth'
import router, { resetRouter } from '@/router'



const state = {
  token: getToken(),
  name: '',
  avatar: '',
}

const mutations = {

  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

}

const actions = {
  // user login
  login({ commit }, userInfo) {

    const { username, password } = userInfo

    return new Promise((resolve, reject) => {


      login({ username: username.trim(), password: password }).then(response => {
        console.log(response.data.data);

        const { accessToken, avatar, username } = response.data.data

        console.log(accessToken, avatar, username, 'accessToken,avatar,username');
        // console.log(accessToken,'accessToken');
        commit('SET_TOKEN', accessToken)
        commit('SET_AVATAR', avatar)
        commit('SET_NAME', username)
        setToken(accessToken)
        setAvatar(avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },



  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')

        removeToken()
        removeAvatar()
        resetRouter()
        location.reload()
        // dispatch('permission/resetRoutes')
        // dispatch('permission/resetRoutes', null, { root: true });
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
      commit('SET_TOKEN', '')
      removeToken() // must remove  token  first
      
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
