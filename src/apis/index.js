import Vue from 'vue'
import VueResource from 'vue-resource'
import API from '../api'

Vue.use(VueResource)

export default {


    /**
     * 获取部门列表
     */
    getAllDepts(callback) {
        Vue.http.jsonp(API.DEPTS_INFO).then((res) => {
            const depts = res.data.data || [];
            callback(depts);
            // console.log('apis-depts',depts);
        })
    },

    /**
     * 获取员工列表
     */
    getAllStaffs(callback) {
        Vue.http.jsonp(API.STAFFS_INFO).then((res) => {
            const staffs = res.data.data || [];
            callback(staffs);
            // console.log('apis-staffs',staffs);
        })
    },
    
    /**
     * 获取部门组织架构
     */
    getDeptTree(callback) {
        Vue.http.jsonp(API.DEPT_TREE).then((res) => {
            const depttree = res.data.data || [];
            callback(depttree);
            // console.log('apis-depts',depttree);
        })
    },

}