<template>
    <div class="template">
        <div id="CheckMap"></div>
        <!-- 打卡 -->
        <div id="Wrapper" class="wrapper" v-show="willShow">
            <div class="content" >
                <div class="top">
                    <div class="c-title">
                        <p>{{Date_hms}}</p>
                        <p>{{Date_ymd}}  {{Date_week}}</p>
                        <div class="c-time" v-on:click="toggle">地址微调</div>
                    </div>
                </div>
                <div class="content-bottom">
                    <div class="bottom">
                        <router-link :to="{ name: 'menu', params: {lat: curLat,lng:curLng,addr:curAddr} }"  
                        class="check" v-if="flag==='1'">
                        签到
                        </router-link>
                        <a  class="check" v-else-if="flag==='2'" @click="checkTip">
                        签到
                        </a>
                        <a  class="check" v-else-if="flag==='0'" @click="checkTip2">
                        签到
                        </a>
                    </div>
                    <div class="check-num">
                        <span v-if="SignCount > 0">今日签到{{SignCount}}次</span>
                        <span v-else>今日未签到</span>
                    </div>
                    <!-- <div class="check-num" v-show="false">今日签到<span>1</span>次</div> -->
                </div>
            </div>
        </div>
        <!-- 地址微调 -->
        <div id="Fine" class="fine" v-show="!willShow">
            <div class="fine-panel" v-for="item,k in items" >
                <label class="fine-panel-access"  :for="k"  @click.stop="toggleLoc($event)"><!-- @click.stop="toggleLoc($event)" -->
                    <div class="fine-panel-hd">
                        <p class="addr">{{item.cName}}</p>
                        <p class="prv ellipsis">{{item.addr}}</p>
                    </div>
                    <div class="typeCheck">
                        <input type="radio" class="radio-input" :id='k' :data-id="k"
                        name="outType" />
                        <!-- :value="item.value"  -->
                        <span class="radio-core"></span>
                    </div>
                </label>
            </div>
            <!-- <div class="nodata-tip">没有更多数据了</div> -->
            <div class="nodata-loadmore nodata-loadmore_line">
                <span class="nodata-loadmore_tips">:-O 到头啦</span>
            </div>
        </div>
        <!-- back -->
        <div class="fine-back" v-on:click="backCheck" v-show="!toggleBack">
            <img src="../../assets/img/back-check.svg" alt="">
        </div>
        <side-bar v-if="willShow"></side-bar> 
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast,Indicator } from 'mint-ui';
import SideBar from '../comm/SideBar';
import API from '../../api';
import * as dateTime from '../../assets/js/time'

export default {
    name: 'check',
    components: {
        SideBar,
    },
    data () {
        return {
            curLng:'', // 当前定位 经度
            curLat:'', // 当前定位 纬度
            curAddr:'', // 当前定位 位置
            // flag:true, // 签到 标记
            // nearFlag:true, // 周边定位 标记
            flag:'0', // 签到标记 0:初始化 ，1：正常，2：失败
            nearFlag:'0', // 周边定位 0:初始化 ，1：正常，2：失败
            willShow:true, // 切换bottom模块
            items:[],// 周边
            marker:[],// marker
            infoWin:[],// label
            map:[],//map
            tips:'',
            Date_hms:'', // 时分秒
            Date_ymd:'', // 年月日
            Date_week:'', // 星期
            SignCount:'', // 打卡次数
            toggleBack:true // 控制返回按钮显示隐藏
        }
    },
    mounted () {
        var context = this;
        
        //获取当前年月日时分秒
        var curD = function() {context.Date_hms = dateTime.curDate().hms;}
        setInterval(curD,1000);
        curD();
        var curD2 = function () {
            context.Date_ymd = dateTime.curDate().YMD;
            context.Date_week = dateTime.curDate().week;
        }
        curD2();

        context.tips=function (msg) {
            let instance = Toast(msg);
            setTimeout(() => {
              instance.close();
            }, 2000);
        }

        var initPageSize = function() {
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var h1 = (h - 55)*0.5;
            var height = h1 + 'px'
            var height2 =  ((h - 55)*0.5) + 'px';
            var height3 = (h - h1) + 'px';
            $('#CheckMap').css("height", height);
            $('#Wrapper').css("height", height2);
            $('#Fine').css("height", height3);
        }
        window.addEventListener('resize',initPageSize);
        initPageSize();

        var searchService, markers = [];
        var  loc ,poc = {}; //存放周边地址
        // var geolocation = new qq.maps.Geolocation(OUT_DATA_CONFIG.lbs_key, "myapp");
        //设置Poi检索服务，用于本地检索、周边检索
        var searchService = new qq.maps.SearchService({
            //检索成功的回调函数
            complete: function(results) {
                context.nearFlag = '1';
                //设置回调函数参数
                // console.log('results:',results);
                var pois = results.detail.pois;
                for (var i = 0, l = pois.length; i < l; i++) {
                    loc={};
                    var poi = pois[i];
                    // 将搜索出来的点存入对象
                    loc.lat = poi.latLng.lat;
                    loc.lng = poi.latLng.lng;
                    loc.addr = poi.address;
                    loc.cName = poi.name;
                    context.items.push(loc);
                }
                // console.log('items',context.items);
            },
            //若服务请求失败，则运行以下函数
            error: function() {
                context.nearFlag = '2';
                context.tips('周边定位失败');
            }
        });
        var showPosition = function (position) {
            // alert("position1:",position);
            context.curLat = position.lat;
            context.curLng = position.lng;
            context.curAddr = position.addr;
            poc.lat = position.lat;
            poc.lng = position.lng;
            poc.addr = "当前位置";
            poc.cName = position.addr;
            // console.log(poc);
            context.items.push(poc);
            var center = new qq.maps.LatLng(context.curLat,context.curLng);
            context.map = new qq.maps.Map($('#CheckMap').context,{
                center: center,
                zoom: 13
            });
            context.marker = new qq.maps.Marker({
                position: center,
                map: context.map
            });

            context.infoWin = new qq.maps.Label({
                position: center,
                map: context.map,
                content: ''
            });
            if(context.curAddr == '' || context.curLat == '' || context.curLng == ''){
                context.tips('定位失败');
               var coord=new qq.maps.LatLng(30.28520156, 120.11435688);
               geocoder.getAddress(coord);
                // context.flag = false;
                context.flag = '2';
                context.infoWin.setVisible(false);
            }else{
                // context.flag = true;
                context.flag = '1';
                context.infoWin.setVisible(true);
            }
            var cssC = {
                backgroundColor: '#fff',
                borderColor:'#e5e5e5',
                borderRadius:'14px',
                padding:'8px',
                color: "#ff6600",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop:"-55px",
                maginLeft:"-50px",
                textAlign:"center",
                width:"auto",
            };
            context.infoWin.setStyle(cssC);
            // context.infoWin.open();
            context.infoWin.setContent(position.addr);
            context.infoWin.setPosition(center);
            searchService.setPageCapacity(100);
            searchService.searchNearBy('企业', center , 200);
        }
        // 电脑调试的时候使用
        var geocoder = new qq.maps.Geocoder({
            complete:function(result){
                // console.log(typeof(result.detail.lat));
                var position = {};
                // console.log('result2:',result);
                if (typeof(result.detail.lat) == 'undefined') {
                    position.lat = result.detail.location.lat;
                    position.lng = result.detail.location.lng;
                    position.addr = result.detail.address;
                } else {
                    position.lat = result.detail.lat;
                    position.lng = result.detail.lng;
                    position.addr = result.detail.addr;
                }
                showPosition(position);
            },
            error: function(result) {
                // console.log(result);
            }
        });
        
        // }
        var showErr = function (){
            geolocation.getIpLocation(showPosition, function () {
                context.tips('定位失败！请刷新页面');
            });
        }
        var initMap = function() {
            // var options = {timeout: 8000/*,failTipFlag: true*/};
            geolocation.getLocation(showPosition, showErr/*, options*/);
        }
        initMap();

    },
    created:function() {
        this.loadSignCount();
    },
    methods: {
        //打卡次数
        loadSignCount:function() {
            var context = this;
            context.$http.jsonp(API.SIGN_COUNT).then((res) => {
                // console.log(res);
                context.SignCount = res.data.data.sign_count;
            },function(res){
                // console.log('res',请求打卡次数失败);
            });
        },

        // 定位=>微调
        toggle:function() {
            if(this.willShow==true){
                if(this.nearFlag=='2' || this.flag == '2'){
                    this.tips('周边定位失败！请检查GPS并且刷新页面');
                    this.willShow==true
                }else if(this.nearFlag=='0' || this.flag == '0'){
                    this.tips('正在定位中...请等待');
                    this.willShow==true
                }else {
                    this.willShow=false ;
                    this.toggleBack = false;
                    // 添加第一项为选中
                    var p = document.getElementById('Fine').firstChild;
                    var o = p.getElementsByClassName("radio-input");
                    o[0].setAttribute("checked","checked");
                }
            }
            else{
                this.willShow=true
            }
        },
        // 微调=>定位
        toggleLoc:function(evt) { 
            // evt=evt|| window.event;
            var radio = evt.target;
            // console.log(radio.name);
            if (radio.name=='outType') {
                // console.log('if里',radio.name);
                this.toggleBack = true;
                this.willShow = true;
                var id = radio.getAttribute("data-id");
                this.curLat = this.items[id]['lat'];
                this.curLng = this.items[id]['lng'];
                this.curAddr = this.items[id]['cName'];
                // this.curLng = radio.getAttribute("my-lng");
                // this.curAddr = radio.value;
                var latLng = new qq.maps.LatLng(this.curLat, this.curLng)
                this.marker.setPosition(latLng);
                this.infoWin.setPosition(latLng);
                this.infoWin.setContent(this.curAddr);
                //地图调整中心
                this.map.panTo(new qq.maps.LatLng(this.curLat, this.curLng));
                // console.log(this.curLat+','+this.curLng+','+this.curAddr);
            }
            
        },
        // 定位 判断
        checkTip:function() {
            this.tips('定位失败！请打开GPS并且刷新页面');
        },
        // 定位 判断
        checkTip2:function() {
            this.tips('正在定位中...请等待');
        },
        // 微调->定位
        backCheck:function() {
            this.willShow = true;
            this.toggleBack = true;
        }

    },
}
</script>

<style scoped>
    .wrapper {
        background: #fff;
    }
    .content {
        padding: 10px;
        position: relative;
        height: 100%;
    }
    .content-bottom {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        z-index:1;
    }
    @media screen and (min-width: 320px) { 
        .content-bottom {
            top: 70px;
        }
    }
    @media screen and (min-width: 375px) { 
        .content-bottom {
            top: 100px;
        }
    }
    @media screen and (min-width: 414px) { 
        .content-bottom {
            top: 150px;
        }
    }
    .content .top{ /*.content .bottom*/
        display: -webkit-box;
        display: -moz-box;   
        display: -ms-flexbox;  
        display: -webkit-flex;
                display: flex;
    }
    .content .top {
        font-size: 14px;
        margin-bottom: 20px;
        -webkit-justify-content:center;
        justify-content:center;
    }    
        .c-title {
            -webkit-flex:1;
                -ms-flex:1;
                    flex:1;
            text-align: center;
            color: #333;
            position: relative;
        }
            .c-title p { padding-bottom: 5px;}
            .c-time {
                position: absolute;
                right: 0px;
                top: 2px;
            }
    /*.content-bottom .bottom {
        -webkit-box-align:center;
          -moz-box-align: center;   
            -ms-flex-align: center; 
        -webkit-align-items:center;
                align-items:center;
                -webkit-box-pack: center;   
                 -moz-box-pack: center;   
                 -ms-flex-pack: center; 
        -webkit-justify-content: center;
                justify-content: center;
    }*/
    .content-bottom .bottom {
        position: relative;

    }
    .content-bottom .bottom .check {
        position: absolute;
        left: 50%;
        margin-left: -50px;
        display: block;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        background: #0E87EF;
        border-radius: 50%;
        -webkit-box-shadow: 0px 0px 15px #21AEFF;
        -moz-box-shadow: 0px 0px 15px #21AEFF;
        box-shadow: 0px 0px 15px #21AEFF;
        font-size: 24px;
        color: #fff;
    }
    .bottom .noCheck {
        background:#888;

    }
    .content .check-num {
        padding-top: 120px;
        text-align: center;
        font-size: 14px;
    }
    .fine {
        /*height: 100%;*/
        background: #fff;
        overflow-y: auto;
        position: relative;
    }
        .fine-back {
            position: absolute;
            left: 20px;
            bottom: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #0a87f3;
            z-index: 5555;
            text-align: center;
            filter:alpha(opacity=85);
            opacity: 0.85;
            -moz-opacity:0.85;   
        }
            .fine-back img {
                width: 28px;
                height: 28px;
                margin-top: 4px;
            }
        .nodata-tip {
            text-align: center;
            font-size: 12px;
            padding-top: 15px;
            padding-bottom: 15px;
            color: #666;
        }
        .nodata-loadmore_line {
            border-top:1px solid #E5E5E5;
        }
        .nodata-loadmore {
            width:90%;
            margin:10px auto;
            line-height: 25px;
            font-size: 14px;
            text-align: center;
        }
            .nodata-loadmore_tips {
                position:relative;
                top:-13px;
                padding:10px;
                background-color: #fff;
                color:#999;
            }
    .fine-panel {
        position: relative;
        margin: 0 8px;
        padding:12px 10px;
    }
    .fine-panel:before {
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
    .fine-panel:after {
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
    .fine-panel + .fine-panel:before {
        display: none;
    }
    .fine-panel-access {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align:center;
        -webkit-align-items:center;
        align-items:center;
        width: 100%;
        z-index:10999;
    }
    .fine-panel-hd {
        z-index:100;
        -webkit-box-flex:1;
            -webkit-flex:1;
                    flex:1;
        display: -webkit-flex;
            display: -ms-flex;
                display: flex;
        -webkit-flex-direction:column;
                flex-direction:column;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
    }
    .fine-panel-hd .addr{
        font-size: 16px;
        color: #000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        padding-top:4px;
    }
    .fine-panel-hd .prv{
        font-size: 13px;
        color: #888;
        padding-top:4px; 
    }
    .typeCheck {
        padding-left: 6px;
        text-align:right;
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
      .radio-input:checked +.radio-core {
        background-color: #26a2ff;
        border-color:#26a2ff;
      }
      .radio-input:checked +.radio-core:after {
        border-style:solid;
        border-width: 0 0 2px 2px;
        border-radius: 0;
        border-color:#fff;
      }
    .smnoprint {
        display: none!important;
    }
</style>