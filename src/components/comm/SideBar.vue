<template>
  <!-- <div style="position:absolute"> -->
    <mt-tabbar fixed>
      <mt-tab-item id="签到" href="#/" v-bind:class="[$route.path==='/'?onClass:'']">
        <img slot="icon" src="../../assets/img/sign-select.svg" v-if="$route.path==='/'">
        <img slot="icon" src="../../assets/img/sign.svg" v-else>
        签到
      </mt-tab-item>
      <mt-tab-item id="统计" href="#/static/show" v-bind:class="[$route.path==='/static/show'?onClass:'']">
        <img slot="icon" src="../../assets/img/static-select.svg" v-if="$route.path==='/static/show'">
        <img slot="icon" src="../../assets/img/static.svg" v-else>
        统计
      </mt-tab-item>
      <mt-tab-item id="足迹" href="#/footprint/foot/uType/uId/uDate/uDateType" v-bind:class="[$route.name==='foot'?onClass:'']">
        <img slot="icon" src="../../assets/img/foot-select.svg" v-if="$route.name==='foot'">
        <img slot="icon" src="../../assets/img/foot.svg" v-else>
        足迹
      </mt-tab-item>
    </mt-tabbar>
</template>

<script>
import Vue from 'vue'
import {Tabbar, TabItem} from 'mint-ui'
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
// import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'SideBar',
  components: {
    // Tabbar,
    // TabbarItem
  },
  data: function() {
    return {
      onClass: 'on',
    }
  },
  created() {
    // console.log(this.$route.path)
  },
  // computed: {
  //   path() {
  //       return this.router.path
  //   }
  // }
}
</script>

<style scoped>
  .mint-tabbar {
    z-index:1;
  }
  .mint-tab-item.on{
    /*background:#eaeaea;*/
    /*color: #09bb07;*/
    color:#26a2ff;
  }
  .mint-tabbar.is-fixed {
    position:absolute!important;
  }
</style>