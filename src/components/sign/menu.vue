<template>
  <div>
    <header class="header">
      <div class="line">
        <div class="title">签到时间</div>
        <div class="desc">
          <p class="fs-15">{{ DateTime }}</p>
        </div>
      </div>
      <div class="line">
        <div class="title">签到地点</div>
        <div class="desc">
          <p class="fs-13">{{ $route.params.addr }}</p>
        </div>
      </div>
    </header>
    <div class="panel">
      <div class="panel-access">
        <div class="panel-access-hd w-60">类型</div>
        <div class="panel-access-bd panel-access-bd-line t-r">
          <div class="radio-div" v-for="item in options" v-on:click="toggleRadio($event)">
            <input type="radio" class="radio-input" 
            :value="item.reason" 
            :id="item.sType"
            name="outType"
            v-model="picked">
            <label :for="item.sType" class="radio-label">
              <span class="radio-core"></span>
              {{item.value}}
            </label>
          </div>
        </div>
      </div>
      <div class="panel-access">
        <div class="panel-access-hd">{{ picked }}</div>
        <div class="panel-access-bd">
          <input placeholder="请填写事由" type="text" maxlength="30" class="mint-field-core t-r fs-15" id="mReson">
        </div>
      </div>
      <div class="panel-access-p">
        <textarea @keyup="monitorNum($event)" placeholder="请填写签到备注" maxlength="200" rows="4" class="mint-field-core" id="mContent"></textarea>
      </div>
      <div class="panel-access-p panel-end">
        <span>{{remarkNum}}</span>/200
      </div>
      <div class="panel-access-p">
        <a href="javascript:void(0)" class="upload uploading ps-r" v-for="item in signPicUrl" >
          <img :src="item.image" class="pic" alt="图片" :remotepath="item.sucPath" v-on:click="showPage($event)">
          <img src="../../assets/img/close_pic.svg" alt=""
           class="close-pic" v-on:click="deletePic($event)">
        </a>
        <a href="javascript:void(0)" class="upload ps-r" v-if=" signPicUrl.length < '3' ">
          <input type="file" class="inputstyle" @change="uploadImage($event)">
          <img src="../../assets/img/add-img.svg" alt="">
        </a>
      </div>
    </div>
    <div class="btn">
      <mt-button type="primary" id="submit2" size="large" @click="submit($event)" >
        提交
      </mt-button>
    </div>
    <div class="page" v-on:click="closePage($event)" v-show="!pageShow">
      <div class="page-gallery" style="display: block">
          <span class="page-gallery_img"  id="pageShow2"></span>      
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button,Toast,Indicator,MessageBox} from 'mint-ui';
import API from '../../api';
import * as dateTime from '../../assets/js/time'
// import $ from '../../assets/js/sdk/jquery1x.min.js';
import qcloud from '../../assets/js/sdk/qcloud_sdk.js';
import swf from '../../assets/js/sdk/swfobject.js';
var $ = require("jquery");
// console.log($);
Vue.component(Button.name, Button);

export default {
    name: 'menu',
    mounted () {
      var context = this;
      this.tips=function (msg) {
          let instance = Toast(msg);
          setTimeout(() => {
            instance.close();
          }, 1000);
      }
      //获取当前年月日时分秒
      var curD = function() {context.DateTime = dateTime.curDate().checkDate;}
      setInterval(curD,1000);
      curD();
      // 初始化 创建云文件夹
      var initQCloud = function () {
        context.q_appid = OUT_DATA_CONFIG.cos.appid;
        context.q_signurl = OUT_DATA_CONFIG.cos.signurl;
        context.q_remotepath = OUT_DATA_CONFIG.cos.remotepath;
        // console.log(context.q_appid+','+context.q_signurl+','+context.q_remotepath);
        // console.log(qcloud);
        context.cos = new qcloud(context.q_appid, context.q_signurl);
        // console.log(context.cos);
        var successCallBack = function(result){
          // console.log('成功');
          // console.log(result);
        }
        var errorCallBack = function(result){
          // console.log('失败');
          // console.log(result.responseText);
        }
        context.cos.createFolder(successCallBack, errorCallBack, 'qmoa', context.q_remotepath);
      }
      initQCloud();

    },
    data () {
        return {
          picked:"公干事由",
          options:[
            {
              value:'外出公干',
              sType:'1',
              reason:'公干事由',
            },
            {
              value:'外访客户',
              sType:'2',
              reason:'客户名称',
            },
            {
              value:'出差',
              sType:'3',
              reason:'出差事由',
            },
          ],
          signAddr:'',  // 签到地址
          signLat:'',   // 签到纬度
          signLng:'',   // 签到经度
          signType:'1',  // 签到类型 (默认为1) 
          signReson:'', // 签到事由
          signContent:'', // 签到备注 (非)
          signPic:[], //  传参变量 签到图片 (非)
          signPicUrl:[], // 渲染变量 签到图片 
          q_appid:'', // 云存储 appid
          q_signurl:'', // 云存储 signurl
          q_remotepath: '', // 云存储 地址
          cos:'', // 初始化存储对象
          DateTime:'', //打卡时间
          pageShow:true, //图片查看器
          remarkNum:'0', // 备注字数
          flag:undefined, // 重新定位标记
          gData:{} // 判断变量
        }
    },
    created:function() {
      // this.uploadImage();
    },
    methods: {
      // 监测备注字数
      monitorNum:function(evt) {
        var e = evt.target;
        this.remarkNum = e.value.length;
      },
      // 图片查看器
      showPage:function(evt) {
        this.pageShow = !this.pageShow;
        var e = evt.target;
        var src = e.getAttribute("src");
        document.getElementById('pageShow2').style.backgroundImage="url("+src+")";
      },
      closePage:function(evt) {
        this.pageShow = !this.pageShow;
        document.getElementById('pageShow2').style.backgroundImage="";
      },

      toggleRadio:function(e) {
        var target = e.target;
        this.signType = target.getAttribute('id');
      },
      // 上传图片
      uploadImage:function(e) {
        var context = this;
        var evt = e.target;
        var files = evt.files;
        var timestamp = Date.parse(new Date()); // 获取当前时间戳
        // console.log(files);
        var hz = files[0].name.substring(files[0].name.lastIndexOf('.'));
        if(files[0] == "" || files[0] == undefined) {
          context.tips('请上传图片');
          return false;
        }

        if(files[0].size/(1024*1024) > 3) {
          context.tips('图片大小不能超过3M');
          return false;
        }

        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(hz)) {
          context.tips('上传正确的图片格式');
          return false;
        }
        Indicator.open({
          text: '图片上传中...',
          spinnerType: 'fading-circle'
        });
        var successCallBack = function(result){
          // console.log('成功');
          Indicator.close();
          context.signPic.push(JSON.parse(result).data.source_url);
          context.signPicUrl.push({
            image:JSON.parse(result).data.source_url,
            sucPath:JSON.parse(result).data.resource_path
          });
          // console.log(context.signPic);
        }
        var errorCallBack = function(result){
          context.tips('上传失败',result.responseText);
        }
        context.cos.uploadFile(successCallBack, errorCallBack, 'qmoa', "/"+timestamp+hz, files[0]);
        

      },
      // 删除图片 
      deletePic:function(e) {
        var context = this;
        var evt = e.target;
        var pevtValue = evt.previousElementSibling.getAttribute('remotepath');
        var pevtSrc = evt.previousElementSibling.getAttribute('src');
        // 删除传参变量
        var del = function(Arr,key) { 
          var arrs = [];
          for (var i = 0; i < Arr.length; i++) {
              if(Arr[i] != key){
                arrs.push(Arr[i]);
              }
          }
          return arrs;
        }
        // 删除渲染变量
        var delUrl = function(Arr,key) {
          var arrs = [];
          for (var i = 0; i < Arr.length; i++) {
            if(Arr[i].image != key) {
              arrs.push(Arr[i]);
            }
          }
          return arrs;
        }
        // context.signPic = del(context.signPic,pevtSrc);
          // context.signPicUrl = delUrl(context.signPicUrl,pevtSrc);
        // console.log(context.cos);
        var successCallBack = function(result){
          context.signPic = del(context.signPic,pevtSrc);
          context.signPicUrl = delUrl(context.signPicUrl,pevtSrc);
        }
        var errorCallBack = function(result){
          context.tips('删除失败',result.responseText);
        }
        // console.log(context.cos.deleteFile);
        // console.log(pevtValue);
        context.cos.deleteFile(successCallBack, errorCallBack, 'qmoa', pevtValue);
      },
      // 判断定位是否正确 半径1.5km以内为合法
      isLegalLocation:function() {
        var context = this;
        var newLat , newLng;
        // var newLat=31.285202,newLng=121.114357;
        // var geolocation = new qq.maps.Geolocation(OUT_DATA_CONFIG.lbs_key, "myapp");
        geolocation.getLocation(showPosition, showErr);
        function showPosition(position) {
          newLat = position.lat;
          newLng = position.lng;
          if(newLat != '' && newLng != '') {
            var difLat = Math.abs(context.signLat-newLat)*111;
            var difLng = Math.abs(111*Math.cos(context.signLng) - 111*Math.cos(newLng));
            // alert(difLat);
            // alert(difLng);
            if( difLng > 0.2 || difLat > 0.2) {
              MessageBox.alert('已超出定位范围,确定重新定位').then(action => {
                  window.location.hash='#/'
              })
            }else{ 
              // submit提交
              context.gData.isSubmit = true;
              document.getElementById("submit2").click();
            }
            Indicator.close();
          }
        }
        function showErr() {
          MessageBox.alert('定位失败,请检查gps是否打开').then(action => {
              window.location.hash='#/'
          })
          Indicator.close();
        }
      },

      submit:function(evt) {
        var context = this;
        var params = {};
        var result='';
        var token = '';
        var e = evt.target;
        context.signAddr = this.$route.params.addr;
        context.signLat = this.$route.params.lat;
        context.signLng = this.$route.params.lng;
        context.signReson = $.trim(document.getElementById('mReson').value);
        context.signContent = $.trim(document.getElementById('mContent').value);
        result = context.signPic.toString();
        token = OUT_DATA_CONFIG.token;
        // console.log(result);
        // return false ;
        params = {
          type:context.signType,
          address:context.signAddr,
          lng:context.signLng,
          lat:context.signLat,
          title:context.signReson,
          content:context.signContent,
          images:result,
          token:token
        }

        if(context.signReson==''){
          context.tips('请输入'+context.picked);
          return;
        }

        if(context.signReson.length > 30) {
          context.tips('事由不能超过30个字符');
          return;
        }

        if(context.signContent.length > 100) {
          context.tips('备注不能超过100个字符');
          return;
        }

        if(context.gData.isSubmit) {
          // alert(1);
          this.$http.jsonp(API.APPLY,{
            params:params,
            before:function(){ e.setAttribute("disabled","disabled");
            }
           }).then((res) => {
              context.tips('提交成功');
              function skipLac() {
                window.location.hash='#/footprint/foot/uType/uId/uDate/uDateType'
              }
              setTimeout(skipLac, 1100);
              // console.log('res',res);
            },function (res){
              // console.log('上传错误');
            });
          return false;
        }else{
          Indicator.open({
              text: '正在验证定位',
              spinnerType: 'fading-circle'
          })
          context.isLegalLocation();
          return false;
        }

      }
    },
}
</script>

<style scoped>
  .panel-access-bd-line {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
  }
  .panel-access-bd-line .radio-div {
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    padding: 0 2px;
  }
  .radio-input {
    display: none;
  }
  .radio-label {
    color: #666;
    font-size: 12px;
    display: inline-block;
    height: 22px;
    line-height: 22px;
  }
  .radio-core {
    display: inline-block;
    background-color:#fff;
    height: 16px;
    width: 16px;
    position: relative;
    border:1px solid #ccc;
    border-radius: 100%;
    vertical-align: middle;
  }
  .radio-core:after{
    content: "";
    position: absolute;
    width: 10px;
    height: 6px;
    top:2px;
    left:2px;
    transform:rotate(-45deg);
    -webkit-transform:rotate(-45deg);
  }
  .radio-input:checked + label .radio-core {
    background-color: #26a2ff;
    border-color:#26a2ff;
  }
  .radio-input:checked + label .radio-core:after {
    border-style:solid;
    border-width: 0 0 2px 2px;
    border-radius: 0;
    border-color:#fff;
  }
  .header {
    background: #fff;
    margin-bottom: 10px;
  }
  .header .line {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
    padding: 15px 10px;
    position: relative;
  }
  .header .line:before{
    content:" ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom:1px solid #E5E5E5;
    color:#E5E5E5;
    -webkit-transform-origin:0 0;
            transform-origin:0 0;
    -webkit-transform:scaleY(0.5);
            transform:scaleY(0.5);
  }
  .header .title {
    width: 80px;
    color:#000;
    font-size: 17px;
  }
  .line .desc{
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    min-width: 0;
    text-align: right;
    color: #666;
  }
  .panel {
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
  }
  .panel:before {
    content:" ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top:1px solid #E5E5E5;
    color:#E5E5E5;
    -webkit-transform-origin:0 0;
            transform-origin:0 0;
    -webkit-transform:scaleY(0.5);
            transform:scaleY(0.5);
  }
  .panel:after {
    content:" ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom:1px solid #E5E5E5;
    color:#E5E5E5;
    -webkit-transform-origin:0 0;
            transform-origin:0 0;
    -webkit-transform:scaleY(0.5);
            transform:scaleY(0.5);
  }
  .panel-access {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
    padding: 15px 10px;
    position: relative;
  }
  .panel-access:before {
    content:" ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom:1px solid #E5E5E5;
    color:#E5E5E5;
    -webkit-transform-origin:0 0;
            transform-origin:0 0;
    -webkit-transform:scaleY(0.5);
            transform:scaleY(0.5);
  }
  .panel-access-p {
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    padding: 15px;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
  }
  .panel-end {
    -webkit-justify-content:flex-end;
            justify-content:flex-end;
    -webkit-box-pack:end;
            box-pack:end;
  }
  .upload {
    width: 48px;
    height: 48px;
    border:1px solid #F0F0F0;
    margin-left:15px;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;
    -weikit-justify-content:center;
    -ms-justify-content:center;
    justify-content:center;
  }
  .panel-access-p .upload:first-child {
    margin-left:0;
  }
  .uploading {
    /*position: relative;*/
  }
  .uploading .pic{
    vertical-align: middle;
    width: 48px;
    height: 48px;
    border:none 0;
  }
  .close-pic {
    position: absolute;
    top: -6px;
    right: -6px;
  }
  .inputstyle {
    width: 50px;
    height:50px;
    position: absolute;
    top: 0;
    left: 0;
    outline: medium none;
    filter:alpha(opacity=0);
    -moz-opacity:0;
    opacity:0; 
  }
  .panel-access-hd {
    width: 80px;
    color: #000;
    font-size: 17px;
    -webkit-align-items:center;
    -ms-flex-align:center;
    align-items:center;
    display:-webkit-flex;
    display:flex;
  }
  .panel-access-bd {
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    min-width: 0;
  }
  .btn {
    padding: 15px;
  }
</style>