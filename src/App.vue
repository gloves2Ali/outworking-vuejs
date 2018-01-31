<template>
    <router-view></router-view>
</template>

<script>
// import Hello from './components/Hello'
import './assets/js/$.js'

export default {
  name: 'app',
  ready() {
    
  }
}
</script>

<style>
@import '~mint-ui/lib/style.css'; 
/*@import '~vux/dist/vux.css';    */
@import './assets/css/global.css';
@import './assets/css/comm.css';

body,html{
    background-color:#fbf9fe;
    overflow-x:hidden;
    height: 100%;
    width: 100%;
}
.template{
    position:relative;
    height:100%;
}
</style>
