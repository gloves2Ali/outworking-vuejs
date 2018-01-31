// some common or scattered actions
import * as types from './mutation-types'
import API from '../apis'


/**
 * 获取部门列表
 */
export const getAllDepts = ({ commit }) => {
    return new Promise((resolve, reject) => {
        var data = JSON.parse(localStorage.getItem("depts"));
        if(data) {
            commit(types.GET_ALL_DEPTS, data);
            resolve();
        }else {
            API.getAllDepts((depts) => {
                commit(types.GET_ALL_DEPTS, depts);
                resolve();
            })
        }
        // API.getAllDepts((depts) => {
        //     commit(types.GET_ALL_DEPTS, depts);
        //     resolve();
        // })
    })
}


/**
 * 获取员工列表
 */
export const getAllStaffs = ({ commit }) => {
    return new Promise((resolve, reject) => {
        // API.getAllStaffs((staffs) => {
        //     commit(types.GET_ALL_STAFFS, staffs);
        //     resolve();
        // })
        var data = JSON.parse(localStorage.getItem("staffs"));
        if(data) {
            commit(types.GET_ALL_STAFFS, data);
            resolve();
        }else {
            API.getAllStaffs((staffs) => {
                commit(types.GET_ALL_STAFFS, staffs);
                resolve();
            })
        }
    })
}


/**
 * 获取部门组织架构
 */
export const getDeptTree = ({ commit }) => {
    return new Promise((resolve, reject) => {
        // API.getDeptTree((depts) => {
        //     commit(types.GET_DEPTTREE, depts);
        //     resolve();
        // })
        var data = JSON.parse(localStorage.getItem("depttree"));
        if(data) {
            commit(types.GET_DEPTTREE, data);
            resolve();
        }else {
            API.getDeptTree((depts) => {
                commit(types.GET_DEPTTREE, depts);
                resolve();
            })
        }
    })
}