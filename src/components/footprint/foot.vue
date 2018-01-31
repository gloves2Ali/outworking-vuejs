<template>
  <div class="template">
    <header class="header" v-if="!hasfoots">
      <div class="header-content">
        <p class="name c-title">{{userDept}}&nbsp;{{userName}}</p>
        <p class="date c-time" >{{userDate}}</p>
        <div class="header-ava">
          <img :src="userAva" alt=""><!--  | defaultUserAva -->
        </div>
      </div>
    </header>
    <div class="foots">
      <div class="nodata"  v-if="hasfoots">
          <img src="http://assets.xxkj.com/images/nodata.png" alt="" class="nodata-img">
          <div class="t-c">您的历史数据为空 #>_<# </div>      
      </div>
      <div class="content" v-else>
        <div class="foot-cell" v-for="foot,k in foots">
          <div class="mb-20">
            <span class="c-time">
              <span class="c-time" >{{userMD[k]}}</span>
              {{foot.time}}
            </span>
            <span class="ml-10 c-title" v-if="foot.type=='1'">外出公干</span>
            <span class="ml-10 c-title" v-else-if="foot.type=='2'">外访客户</span>
            <span class="ml-10 c-title" v-else-if="foot.type=='3'">出差</span>
          </div>
          <div class="mb-20 clear">
            <div class="cell-icon">
              <img src="../../assets/img/foot_location.svg" alt="">
            </div>
            <div class="cell-content" v-html="foot.address">
              <!-- {{foot.address}} -->
            </div>
          </div>
          <div class="mb-20 clear">
            <div class="cell-icon">
              <img src="../../assets/img/foot_type0.svg" alt="" v-if="foot.type=='1'">
              <img src="../../assets/img/foot_type1.svg" alt="" v-else-if="foot.type=='2'">
              <img src="../../assets/img/foot_type2.svg" alt="" v-else-if="foot.type=='3'">
            </div>
            <div class="cell-content">
              <p>{{foot.title}}</p>
            </div>
          </div>
          <div class="mb-20 clear" v-if="foot.content">
            <div class="cell-icon">
              <img src="../../assets/img/foot_content.svg" alt="">
            </div>
            <div class="cell-content">
              <p>{{foot.content}}</p>
            </div>
          </div>
          <div class="mb-20 clear">
            <div class="cell-img" v-for="item,i in foot.images" :keys="i">
              <img :src="item" class="foot-img" v-on:click="showPage($event,i)" >
            </div>
          </div>
        </div>
      </div>
    </div>
    <side-bar v-if="this.$route.params.id === 'uId' "></side-bar>
    <!-- 图片查看 -->
    <!-- <div class="page" v-on:click="closePage($event)" v-show="!pageShow">
      <div class="page-gallery" style="display: block">
        <span class="page-gallery_img"  id="pageShow"></span>      
      </div>
    </div> -->
    <div class="page" v-if="!pageShow" v-on:click="closePage()">
      <mt-swipe :auto="0" :continuous="false" :defaultIndex = "defaultIndex" >
        <mt-swipe-item v-for="item in footImage" >
          <img :src="item" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Indicator, Swipe, SwipeItem } from 'mint-ui'
import SideBar from '../comm/SideBar'
import API from '../../api'

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

export default {
  name: 'foot',
  components: {
    SideBar,
  },
  data: function() {
    return {
      foots:[], // 历史足迹
      userName:'', // user
      userDate:'', // date
      userMD:[] , //month&day
      hasfoots:false, // 是否有无足迹
      pageShow:true, // 图片查看器
      pageSrc:'', // 图片地址
      userAva:'', // 用户头像
      userDept:'', // dept
      defaultUserAva: '../../assets/img/avatar.png' ,// 默认用户头像
      footImage:[], // 图片浏览存放对象
      defaultIndex:0 // 图片浏览索引值
    }
  },
  created:function() {
    // Indicator.open({
    //   text: '足迹加载中',
    //   spinnerType: 'double-bounce'
    // });
    // if(this.foots) {
    //   console.log("加载完成");
    //   Indicator.close();
    // }
    if(this.$route.params.id === 'uId') {
      this.loadTrail();
    }else {
      this.loadTrailByUser();
      // 存放cookie
      var type = this.$route.params.type;
      var dm = this.$route.params.date_type;
      var days = this.$route.params.date;
      // console.log("foot获取参数：",type+","+dm+","+days);
      function setCookie(name,value,hours) {
        var exp = new Date();
        exp.setTime(exp.getTime() + hours*3600*1000);
        document.cookie = name+"="+ value + ";expires=" + exp.toGMTString();
      }
      setCookie("type",this.$route.params.type,1);
      setCookie("dm",this.initIsDayMonth(this.$route.params.date_type),1);
      setCookie("days",this.$route.params.date,1);
    }
  },
  methods: {
    // 转换date_type
    initIsDayMonth:function(val) {
      var bool;
      if(val == "day") bool=true;
      else bool=false;
      return bool;
    },
    // 图片查看器
    // showPage:function(evt) {
    //   this.pageShow = !this.pageShow;
    //   var e = evt.target;
    //   var src = e.getAttribute("src");
    //   document.getElementById('pageShow').style.backgroundImage="url("+src+")";
    // },
    // closePage:function(evt) {
    //   this.pageShow = !this.pageShow;
    //   document.getElementById('pageShow').style.backgroundImage="";
    // },
    // 
    showPage:function(evt,index) {
      this.pageShow = !this.pageShow;
      var e = evt.target;
      var arrs = [];
      var context = this;
      // context.defaultIndex = "";
      context.defaultIndex = index;
      this.footImage = arrs;//清空对象
      var imgNode = e.parentNode.parentNode.childNodes;
      for (var i = 0; i < imgNode.length; i++) {
        var j = imgNode[i].firstChild.src;
        this.footImage.push(j);
      }
    },
    closePage:function() {
      // console.log(1);
      this.pageShow = true;
    },
    
    // 本地用户
    loadTrail:function() {
      var context = this;
      this.$http.jsonp(API.TRAIL,{
        before:function(){ Indicator.open({
            text: '足迹加载中',
            spinnerType: 'double-bounce'
          });}
      }).then((res) => {
            context.foots = res.data.data;
            if(context.foots) {
              Indicator.close();
            }
            context.filterUserAndDate(context.foots);
            context.ishasfoots(context.foots);
            // console.log(context.foots);
            // Indicator.close();
        }, function (res) {
              // console.log('错误');
      });
    },
    // 统计进来用户
    loadTrailByUser:function() {
      var context = this;
      var params = {};
      params = {
        type: context.$route.params.type,
        staff_id: context.$route.params.id,
        is_date_month: context.$route.params.date_type,
        date: context.$route.params.date 
      };
      // console.log(params);
      this.$http.jsonp(API.TRAIL,{params:params}).then((res) => {
        context.foots = res.data.data;
        context.filterUserAndDate(context.foots);
        context.ishasfoots(context.foots);  
        // console.log('byuser',context.foots);
      },function(res) {
        // console.log('userBy错误')
      });
    },
    // 遍历 拿出username date deptName ava
    filterUserAndDate:function(arr) {
      var context = this;
      var usermd=[];
      if(arr.length > 0) {
        context.userName = arr[0].staff_name;
        context.userDept = arr[0].dept_name;
        context.userAva = arr[0].avatar;
        if(context.$route.params.date_type === 'day'){
          context.userDate = arr[0].date;
        }else {
          context.userDate = arr[0].date.substring(0,7);
        }
        for (var i = 0; i < arr.length; i++) {
          usermd.push(arr[i].date.substring(5,10).replace("-","月")+'日');
        }
        context.userMD = usermd;
      }
    },
    // 判断是否有无足迹
    ishasfoots:function(arr) {
      if(arr.length < 1) this.hasfoots = true
      else this.hasfoots = false
    },

  },
}

</script>

<style scoped>
  .header {
      position: absolute;
      top: 0;
      left: 0;
      width:100%;
      height: 50px;
      padding:0px 20px;
      background-color: #0a87f3;
      z-index:1999;
  }
    .header-content {
      height: 100%;
      position: relative;
    }
      .header-ava {
        position: absolute;
        right: 25px;
        top: 20px;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border:1px solid #c1c1c1;
        background-color: #fff;
      }
        .header-ava img {
          width: 46px;
          height: 46px;
          margin-top: 2px;
          margin-left: 2px;
        }
      .header p {
        color: #fff;
        padding-top: 5px;
        cursor: pointer;
      }
      .header p:first-child {
        padding-top : 8px;
      }
  .foots {
    padding-top:50px;
    padding-bottom:55px;
    height:100%;
    overflow:auto;
    box-sizing:border-box;
  }
    .content {
      padding: 20px 30px;
      background-color: #fff;
      color: #666;
    }
      .foot-cell {
        position: relative;
        border-left:1px solid #e6e6e6;
        z-index: 0;
        padding:0 10px 25px 25px;
      }
      .foot-cell:before {
        content:"";
        position: absolute;
        display: inline-block;
        width: 12px;
        height: 12px;
        border:1px solid #CEAFAF;
        border-radius: 50%;
        background-color: #CEAFAF;
        z-index: 1001;
        top: 0px;
        left: -8px;
      }
      .foot-cell:after {
        content:"";
        position: absolute;
        display: inline-block;
        width: 16px;
        height: 16px;
        border:2px solid #e6e6e6;
        border-radius: 50%;
        background-color: #fff;
        z-index: 1000;
        top: -3px;
        left: -11px;
      }
      .content .foot-cell:last-child {
        border-left:1px solid transparent;
      }
        .cell-icon {
          float:left;
          width: 24px;
        }
          .cell-icon img {
            border:none 0;
            width: 16px;
            vertical-align: top;
          }
        .cell-content {
          padding-left: 30px;
        }
          .cell-content p {
            word-break:break-all;
            word-wrap:break-word;
          }
          .cell-img {
            width: 60px;
            height: 60px;
            float:left;
            margin-right:15px;
            margin-bottom: 10px;
            overflow: hidden;
          }
            .cell-img img {
              width: 60px;
              height: 60px;
              background-color: #f6f6f6;
            }
  
</style>