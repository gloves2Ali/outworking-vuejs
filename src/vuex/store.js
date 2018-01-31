/**
 * Created by cdt on 2017/5/16.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  count:3,
  test01:{
    pageCode:"pa-20161230185725-077"
  },
  test02:{
    code:"pa-20160523092917-169"
  }
}
const mutations ={
  add(state,n){
    state.count += n;
  },
  reduce(state) {
    state.count --;
  }
}

const getters = {
  count:state => state.count+=100
}

const actions = {
    addAction(context){
      context.commit('add',15);
    //setTimeout(()=>{context.commit(reduce)},3000);
      console.log('先执行加、再是减');
    },
    reduceAction({commit}){
      commit('reduce');
    },
    saveForm(context){
      console.log('触发了post');
      const _a = context.state.test01.pageCode;
      const _b = context.state.test02.code;
      axios.post('http://new.kxmy.com/ebiz-hgs/web/index/areaPageData.htm?pageCode='+ _a,{
        // params:{
        //   ID:12345
        // }
      })
      .then(function(res){
        console.log(res.datas.bannerList);
      })
      .catch(function(err){
        console.log(err);
      });
    },
    initLi(context) {
      console.log('触发了get');
      axios.get('http://118.89.241.242/datas/travel/pay/main.json')
      .then(function(res){
        const arrs = res.datas;
        console.log(arrs);
      })
      .catch(function(err){
        console.log(err);
      });
    }
}

// const moduleA = {
// }

export default new Vuex.Store({
  //modules:{a:moduleA}
  state,
  mutations,
  getters,
  actions
})
