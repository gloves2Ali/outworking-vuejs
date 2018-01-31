import Show from './components/static/show' // 统计
import StaticDetails from './components/static/staticDetails' // 统计个人详情
import Check from './components/sign/check' // 签到(首页)
import Menu from './components/sign/menu'  // 签到表单
import Foot from './components/footprint/foot' // 足迹
import Test from './components/comm/test' // 测试
import Flow from './components/modules/flow' // 测试
// 路由列表
const routers = [
    // ====== 签到模块
    {path: '/', component: Check, name: 'check'}, // 签到(首页)
    {path: '/sign/menu/:lat/:lng/:addr', component: Menu, name: 'menu'}, // 签到表单 /:lat/:lng/:addr
    // ====== 统计模块
    {path: '/static/show', component: Show, name: 'show'}, // 统计
    {path: '/static/staticDetails', component: StaticDetails, name: 'staticDetails'}, // 统计个人详情
    // ====== 足迹模块
    {path: '/footprint/foot/:type/:id/:date/:date_type', component: Foot, name: 'foot'}, // 足迹

    // ======  测试模块 2017-05-15
    {path:'/test',component: Test, name: 'test'}, // 
    {path:'/flow',component: Flow, name: 'flow'}, // 
    // ====== 公共模块
    //{path: '*', redirect: '/'}

]

export default routers
