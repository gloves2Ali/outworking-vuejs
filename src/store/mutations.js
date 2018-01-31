// some common or scattered mutations
import * as types from './mutation-types'

export default {
    // 部门列表变化
    [types.GET_ALL_DEPTS](state, depts) {
        state.depts = depts;
        localStorage.setItem("depts", JSON.stringify(depts));
    },

    // 员工列表变化
    [types.GET_ALL_STAFFS](state, staffs) {
        state.staffs = staffs;
        localStorage.setItem("staffs", JSON.stringify(staffs));
    },
    
    // 部门组织架构
    [types.GET_DEPTTREE](state, depttree) {
        state.depttree = depttree;
        localStorage.setItem("depttree", JSON.stringify(depttree));
    },
    
}