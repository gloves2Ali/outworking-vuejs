<template>
  <div>
    <h2>{{ msg }}</h2><hr />
    <input type="text" v-model="msg" /><hr />
    <h2>{{ changeMsg }}</h2><hr />
    <h3>{{ $store.state.count }} -- {{ count }}</h3>
    <p>
      <button @click="$store.commit('add',10)">+</button>
      <button @click="reduce">-</button>
    </p>
    <hr />
    <p>
      <button @click="addAction">+</button>
      <button @click="reduceAction">-</button>
    </p>
    <hr />
    <button @click="submitForm">点击触发axios的post</button>
    <hr />
    <button @click="initLi">点击触发axios的get渲染页面</button>  
    <hr />
    <ul>
      <li v-for="list in lists">{{ list }}</li>
    </ul> 
    <hr />
    <!--<ul>
      <li>新增computed插入数组</li>
      <li v-for="list in sortItems">{{ list }}</li>
    </ul>-->
    <hr />
    <p>v-model绑定数组 checkbox</p>
    <input type="checkbox" value="Apple" v-model="arrs" />
    <input type="checkbox" value="Banana" v-model="arrs" />
    <input type="checkbox" value="Crist" v-model="arrs" />
    <p>{{ arrs }}</p>
    <hr />
    <p>v-model绑定 radio</p>
    <input type="radio" id="man" v-model="sex" value="男"/>
    <label for="man">男</label>
    <input type="radio" id="wman" v-model="sex" value="女"/>
    <label for="wman">女</label>
    <p>{{ sex }}</p>
    <hr />
    <p>组件引用</p>
    <flow></flow>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations, mapGetters, mapActions } from 'vuex'
import store from '../../vuex/store'
import Flow from '../modules/flow'

export default {
  name: 'test',
  components:{
    Flow,
  },
  data(){
    return {
      msg:'Hello vuex',
      items:[],
      lists:[20,23,18,65,32,19,54,56,41],
      students:[
        {name:'jspang',age:32},
        {name:'Panda',age:30},
        {name:'PanPaN',age:21},
        {name:'King',age:45}
      ],
      arrs:[],
      sex:"",
    }
  },
  computed:{
    ...mapState(['count']),
    //...mapGetters(['count'])
    sortItems:function(){
      return this.lists.push(100);
    },
    callComPar:function(params) {
      console.log("params:",params);
    },
    changeMsg:function(){
      return this.msg +"00";
    },
  },
  methods:{
    ...mapMutations(['add','reduce']),
    ...mapActions(['addAction','reduceAction']),
    submitForm(){
      this.$store.dispatch('saveForm');
    },
    initLi(){
      this.items = this.$store.dispatch('initLi');
    },
    // 测试 method方法里调用computed的对象，并且传参
    callComputedParams:function(){
      console.log(this.students[0].name);
      this.callComPar(this.students[0].name);
    },
  },
  store
}
</script>

<style scoped>
  li { 
    display: inline-block;
    margin-right: 4px;
  }
</style>
