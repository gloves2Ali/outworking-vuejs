// Base Request URL
const baseURL = "http://mp.dev.xxkj.com/out";
const accountURL = "http://mp.dev.xxkj.com/account/data";
// http://mp.dev.xxkj.com
// API
const API = {
    APPLY: `${baseURL}/trail/apply`, // 新增足迹
    STATIC: `${baseURL}/data/index`, // 统计
    TRAIL: `${baseURL}/trail/trailList`, // 足迹
    SIGN_COUNT: `${baseURL}/trail/signCount`, // 打卡次数
    // 全局共享
    STAFFS_INFO: `${accountURL}/staffs`, // 员工信息
    DEPTS_INFO: `${accountURL}/depts`, // 部门信息
    DEPT_TREE: `${accountURL}/depttree`, // 部门组织架构
};

export default API;