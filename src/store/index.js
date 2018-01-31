import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from 'vuex/dist/logger'

import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.config.debug = true // 测试状态

Vue.use(Vuex)

// main state
const state = {
    depts: [], // 部门列表
    staffs: [], // 员工列表
    depttree: [], // 部门组织架构
}
// console.log('indexJs',getStateTime.state);

export default new Vuex.Store({
    // 以下state, actions, getters ,mutations
    // 模块为公用模块
    state,
    actions,
    getters,
    mutations,
    //modules下的example对象为按具体业务来划分的state,
    //actions, getters, mutations的实例模块
    // modules: {
    //    getStateTime:getStateTime,
    // },
    strict: Vue.config.debug,
    plugins: Vue.config.debug ? [createLogger()] : [],
})
