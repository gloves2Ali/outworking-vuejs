/**
 * 获取系统时间
 */
import * as types from '../mutation-types'

// initial state
const state = {
    value: '',
}

// get for contacts
const getters = {
    getStateTime: st => st.value,
}

// actions
const actions = {
    getStateTime({ commit },value) {
        commit(types.GET_STATETIME,value);
        // console.log('actions',value);
    },
}

// mutation
const mutations = {
    [types.GET_STATETIME](st, value){
        st.value = value
        // console.log('mu',st.value);
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}