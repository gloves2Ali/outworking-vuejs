<template>
    <div class="template">
        <header class="header fixed">
            <span class="is-left" v-on:click="orgShow">
                <img src="../../assets/img/out_org.svg" alt="">
            </span>
            <div class="is-center">
                <span class="changeDate" v-if="is_day_month" v-on:click="selectDay(01)">
                    <img src="../../assets/img/back.svg" alt="">
                </span>
                <span class="changeDate" v-else v-on:click="selectDay(11)">
                    <img src="../../assets/img/back.svg" alt="">
                </span>
                <!-- v-on:click="openPicker" -->
                <span  class="fs-15" v-on:click="openPicker">{{applyCurDateTime}}</span>
                <span v-if="applyCurDateTime != curDateTime">
                    <span class="changeDate" v-if="is_day_month" v-on:click="selectDay(02)">
                        <img src="../../assets/img/prew.svg" alt="">
                    </span>
                    <span class="changeDate" v-else v-on:click="selectDay(12)">
                        <img src="../../assets/img/prew.svg" alt="">
                    </span>
                </span>
            </div>
            <div class="is-right time-filter">
                <span v-bind:class="!is_day_month?active:''" v-on:click="dateTypeToggle">月</span>
                <span v-bind:class="is_day_month?active:''" v-on:click="dateTypeToggle">日</span>
            </div>
        </header>
        <div class="fixed screen" >
            <div class="item" 
                v-for="items in selects" 
                v-bind:class="items.bClass"
                @click="statics(items.bType,$event)"
                :title="items.bType">
                {{items.iden}}
            </div>
        </div>
        <!-- 组织架构的背景 -->
        <div :class="willBg?bgon:''" class="org_wrapper" v-on:click="orgHide"></div>
        <div :class="willShow?on:''" class="cnt_wrapper" v-on:click="orgHide">
            <div class="cnt_scroller org-list" id="OrgBox">
                <div class="org-head border-bottom">
                    组织架构
                </div>
                <!-- 组织架构：TopLev是顶级菜单 FirLev,SecLev,ThiLev,FourLev,FiveLev -->
                <ul class="" v-for="items in depttree" style="overflow:hidden;">
                    <!-- <li class="TopLev on" :ids="items.deptChild"  v-if="items.level == 1"><a><span>{{items.name}}</span></a></li> 
                    <li class="FirLev" :ids="items.deptChild"  v-else-if="items.level == 2"><a class="select-list-dept-top-a"><span class="select-list-dept-top">{{items.name}}</span></a></li>    
                    <li class="SecLev" :ids="items.deptChild"  v-else-if="items.level == 3"><a><span class="select-list-dept-top-second">{{items.name}}</span></a></li>
                    <li class="ThiLev" :ids="items.deptChild"  v-else-if="items.level == 4"><a><span>{{items.name}}</span></a></li> 
                    <li class="FourLev" :ids="items.deptChild"  v-else-if="items.level == 5"><a><span>{{items.name}}</span></a></li>
                    <li class="FiveLev" :ids="items.deptChild"  v-else-if="items.level == 6"><a><span>{{items.name}}</span></a></li>  -->
                    <li class="TopLev on" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-if="items.level == 1">{{items.name}}</li> 
                    <li class="FirLev" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-else-if="items.level == 2">{{items.name}}</li>    
                    <li class="SecLev" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-else-if="items.level == 3">{{items.name}}</li>
                    <li class="ThiLev" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-else-if="items.level == 4">{{items.name}}</li> 
                    <li class="FourLev" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-else-if="items.level == 5">{{items.name}}</li>
                    <li class="FiveLev" :ids="items.deptChild"  v-on:click="statics(4,$event)" v-else-if="items.level == 6">{{items.name}}</li> 
                </ul>
            </div>
        </div>
        <div class="tep" v-if="isApply">
            <div v-for="cell in showAll" class="tep-cell" >
                    <div class="dept">
                        <span class="fl">{{depts[cell.dept_id].name}}</span>
                        <span class="fr">{{cell.people.length}}人</span>
                    </div>
                    <router-link class="tep-cell-a" v-for="item in cell.people"
                     :to="{ name: 'foot', params: {
                        type: staticType,id:item.staff_id,date:applyCurDateTime,date_type:(is_day_month?'day':'month')
                     } }">
                        <mt-cell
                            :title="staffs[item.staff_id].staff_name"
                            :id="item.staff_id"
                            is-link
                            value="">
                        </mt-cell>
                    </router-link>
            </div>
            <div v-if="hasData" class="nodata">
                <img src="http://assets.xxkj.com/images/nodata.png" alt="" class="nodata-img">
                <div class="t-c">不用再刷新啦~~就是空的 #T.T#</div>  
            </div>
        </div>
        <side-bar></side-bar>
        <mt-datetime-picker
            ref="picker"
            type="date"
            v-model="pickerValue">
        </mt-datetime-picker>
        <!-- <router-link :to="{ name: 'static' }">跳转到static页面</router-link> -->
    </div>
</template>

<script>
import Vue from 'vue'
import { Cell,DatetimePicker,Indicator } from 'mint-ui'
import SideBar from '../comm/SideBar'
import API from '../../api'
import * as dateTime from '../../assets/js/time'

Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Cell.name, Cell);

Vue.component('Cell', {
  props: ['title','id']
});
export default {
    name: 'show',
    components: {
      SideBar,
    },
    computed: { // 实时变化

    },
    mounted () {
        var context = this;
        var initPageSize = function() { 
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var height4 = h + 'px';
            $('#OrgBox').css({
                "max-height": height4
            });
        }
        window.addEventListener('resize',initPageSize);
        initPageSize();

        // 获取部门 员工
        var getAllStore = function() {
                context.$store.dispatch('getAllDepts').then(function(){
                    context.depts = context.$store.getters.allDepts;
                })
                context.$store.dispatch('getAllStaffs').then(function(){
                    context.staffs = context.$store.getters.allStaffs;
                })
                context.$store.dispatch('getDeptTree').then(function(){
                    context.depttree = context.$store.getters.deptTree;
                })
        }
        getAllStore();

        // 页面渲染做判断：
        // 如果 depts和staffs为空，tips  200ms跑一次
        // 成功后返回渲染
        var init = function() {
            if(context.depts.length == 0 || context.staffs.length == 0 || context.depttree.length == 0 ){
                context.isApply = false;
                // Indicator.open({
                //   text: '加载中',
                //   spinnerType: 'double-bounce'
                // });
                setTimeout(init,1000);
            }else{
                context.isApply = true;
                clearTimeout(init);
                // Indicator.close();
            }
        }
        init();        
    },
    data() {
        return {
            storeAll:[], // 存储全部数据 日
            showAll:[],  // 页面渲染
            curDateTime:'', // 存放当前日期 2016-12-18 / 2016-12
            applyCurDateTime:'', // 专门用来渲染页面
            is_day_month:true, // 默认day->true / month->false
            staticType:0, // 类型 1 2 3
            selects:[
                {iden:'全部',bClass:'',bType:'0'},
                {iden:'外出公干',bClass:'',bType:'1'},
                {iden:'外访客户',bClass:'',bType:'2'},
                {iden:'出差',bClass:'',bType:'3'}
            ],
            depts:[], // 全局部门
            staffs:[], // 全局员工
            depttree:[], // 全局部门组织架构
            willShow:false,  // 组织架构 判断
            on:'showToggle', // 组织架构 类
            willBg:false,  // 组织架构背景
            bgon:'org-bg', // 组织架构背景 类
            isApply:false,  // 渲染页面的判断
            active:'active', // 日 月切换类
            params: {}, // 参数
            deptChild:[], // 所有子部门
            hasData:false, //是否有数据
        }
    },
    created:function() {
        this.initCurDate();
        this.isCookie();      
    },
    methods: {
        openPicker() {
            this.$refs.picker.open();
        },
        // 判断是否存在cookie
        isCookie:function() {
            var context = this;
            var strCookie=document.cookie;
            var arrCookie=strCookie.split("; ");
            if(strCookie){
                for (var i = 0; i < arrCookie.length; i++) {
                    var arr = arrCookie[i].split("=");
                    if("type" == arr[0]) {
                        context.staticType = arr[1];
                        context.selects.bType = arr[1];
                        context.deleteCookie("type",arr[1]);
                    }else if("dm" == arr[0]){
                        if(arr[1] == "true") {
                            context.is_day_month = true;
                        }else {
                            context.is_day_month = false;
                        }
                        if(context.is_day_month) {
                            context.curDateTime = dateTime.curDate().ymd;
                        }else{
                            context.curDateTime = dateTime.curDate().ym;
                        }
                        context.deleteCookie("dm",arr[1]);
                    }else if("days" == arr[0]){
                        // alert(arr[1]);
                        context.applyCurDateTime = arr[1];
                        // alert("cookie里的日期"+context.applyCurDateTime);
                        context.deleteCookie("days",arr[1]);
                    }
                }
                context.loadSelectDate();
            }else{
                // console.log('haha');
                context.statics(0); 
            }
            var itemTimeout=function() {
                var item = document.querySelectorAll('.item');
                if(item.length != 0){
                    context.toggleItem();
                    clearTimeout(itemTimeout);
                }  
            }
            // itemTimeout();
            setTimeout(itemTimeout,100);
        },
        // 清楚cookie
        deleteCookie:function(name,vla) {
            var date = new Date(); 
            date.setTime(date.getTime() - 1000);
            if(vla!=null){
                document.cookie=name+"="+vla+"; expires="+date.toGMTString();
            }
        },
        //初始化日期
        initCurDate() {
            if(this.is_day_month) {
                this.curDateTime = dateTime.curDate().ymd;
            }else{
                this.curDateTime = dateTime.curDate().ym;
            }
            this.applyCurDateTime = this.curDateTime;
            //console.log(this.applyCurDateTime+','+this.curDateTime);
        },

        // 切换 上日，下日，上月，下月
        selectDay:function (prms) {
            if(prms == '01') {
                this.applyCurDateTime = dateTime.addDate(this.applyCurDateTime,-1).ymd; 
            }else if(prms == '02') {
                this.applyCurDateTime = dateTime.addDate(this.applyCurDateTime,1).ymd;
            }else if(prms == '11') {
                this.applyCurDateTime = dateTime.addMonth(this.applyCurDateTime,-1).ym;
            }else if(prms == '12') {
                 this.applyCurDateTime = dateTime.addMonth(this.applyCurDateTime,1).ym;
            }
            this.loadSelectDate();
        },
        // 日期类型切换
        dateTypeToggle:function() {
            // if(this.is_day_month==true){
            //     this.is_day_month=false;
            // }else{
            //   this.is_day_month=true;
            // }
            this.is_day_month = !this.is_day_month;
            this.initCurDate();  // 初始化 日/月
            this.loadSelectDate(); // 加载日/月数据
        },
        // 筛选
        filterByType:function(type,storeAll) {
            var showResult={};
            var inArray = function(value,arr) { 
                if(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if(value == arr[i])
                            return true;
                    }
                }
                return false;
            }
            //console.log(storeAll.length);
            if(!this.isEmptyObject(storeAll)) {
                for(var temp in storeAll){
                    var result=[];
                    var p = storeAll[temp].people;
                    if(p) {
                        for (var i = p.length - 1; i >= 0; i--) {
                            // console.log(this.deptChild);
                            if(this.deptChild == ''){
                                if(type == 0 || inArray(type, p[i].type_data)) {
                                    result.push(p[i]);
                                }
                            }else{
                            //console.log(typeof(this.deptChild));
                            //console.log(this.deptChild);
                            //console.log(type+'----'+p[i].type_data +'----'+p[i].dept_id+'----'+this.deptChild);
                            //console.log(inArray(type, p[i].type_data) , inArray(p[i].dept_id, this.deptChild.split(",")));
                            //console.log(this.deptChild.indexOf(',') < 0 && p[i].dept_id == this.deptChild)
                            //console.log(this.deptChild.indexOf(',') != -1 && inArray(p[i].dept_id, this.deptChild.split(",")))
                                if((type == 0 || inArray(type, p[i].type_data)) && (!this.isEmptyObject(this.deptChild) && ((this.deptChild.indexOf(',') < 0 && p[i].dept_id == this.deptChild) || (this.deptChild.indexOf(',') != -1 && inArray(p[i].dept_id, this.deptChild.split(",")))))) {
                                    result.push(p[i]);
                                }
                            }                        
                        }
                    }
                    if (result.length) {
                        showResult[temp] = {};
                        showResult[temp].people = result;
                        showResult[temp].dept_id = storeAll[temp].dept_id;
                    }
                }
                return showResult;  
            }else {
                return false;
            }          
        },
        orgShow:function() {
            //组织架构
            //组织架构背景
            this.willShow = !this.willShow;
            this.willBg = !this.willBg;
        },
        //点击关闭组织架构
        orgHide:function(){
            this.willShow=false;
            this.willBg=false;
        },
        // 切换item
        toggleItem:function(){
            var context = this;
            // console.log("第几个:",context.staticType);
            var item = document.querySelectorAll('.item');
            // console.log("item",item);
            for (var i = 0; i < item.length; i++) {
                if(i == context.staticType){
                    if($(item[i]).hasClass('on') == false){
                        $(item[i]).addClass('on');
                        // console.log($(item[i]));
                    }
                } else{
                    $(item[i]).removeClass('on');
                }                
            }
        },
        // 默认加载 日 -> 全部
        statics: function(type,evt) { 
            if(type != 4){
                this.staticType = type;
            }            
            var context = this;
            context.showAll = [];
            context.toggleItem();

            var result=(evt && evt.target);
            Indicator.open({
              text: '加载中',
              spinnerType: 'double-bounce'
            });
            if(type == 0) {
                // console.log("走到0了");
                //console.log(context.applyCurDateTime);
                //console.log(context.initType(context.is_day_month));
                //console.log(Object.keys(context.storeAll).length);
                if(Object.keys(context.storeAll).length === 0){
                    context.$http.jsonp(API.STATIC,{
                        params:{date:context.applyCurDateTime,date_type:context.initType(context.is_day_month)}
                        }).then((res) => {
                        context.storeAll = res.data.data.dept_records;
                        context.showAll = context.filterByType(type,context.storeAll);                        
                        context.hasData = context.isEmptyObject(context.showAll);
                    }, function (res) {
                        // console.log('错误');
                    });
                }else {
                    context.showAll = context.filterByType(type,context.storeAll);
                    context.hasData = context.isEmptyObject(context.showAll);
                }
                // console.log("111");
                Indicator.close();
            } else if(type == 4){
                // console.log("走到4了");
                if(result.getAttribute("ids") !== ''){
                    context.deptChild = result.getAttribute("ids");
                    context.showAll = context.filterByType(context.staticType, context.storeAll);
                    context.hasData = context.isEmptyObject(context.showAll);
                    // 组织架构选中:on
                    var lis = document.getElementById('OrgBox').getElementsByTagName("ul");
                    for (var i = 0; i < lis.length; i++) {
                        var lia = $(lis[i].getElementsByTagName("li")[0]);
                        if(lia.hasClass('on')){
                            lia.removeClass('on');
                            break;
                        }
                    }
                    if(!$(result).hasClass('on')){
                        $(result).addClass('on');
                    }
                }
                context.willShow=false;
            Indicator.close();
             } else {
            // console.log("走到其他了");
                context.showAll = context.filterByType(type,context.storeAll);
                context.hasData = context.isEmptyObject(context.showAll);
            Indicator.close();
            }

            Indicator.close();
            //console.log(222,context.hasData);
            // tab切换
        },
        /* 日期,类型 参数 */
        initType:function(idDayMth) {
            var res =  '';
            if(idDayMth) res = 'day'
            else res = 'month'
            return res;
        },

        /* 选择日期 */
        loadSelectDate:function(){
            var context = this;
            var paramA = context.applyCurDateTime;
            var paramB = context.initType(context.is_day_month);
            // alert("方法里的日期"+paramA);
            Indicator.open({
              text: '加载中',
              spinnerType: 'double-bounce'
            });
            context.$http.jsonp(API.STATIC,{
                params:{date:paramA,date_type:paramB}
            }).then((res) => {
                Indicator.close();
                context.storeAll = res.data.data.dept_records;
                context.showAll = context.filterByType(context.staticType, context.storeAll);
                context.hasData = context.isEmptyObject(context.showAll);
            },function(res){
                // console.log('日期筛选出错了');
            });
        },
        isEmptyObject:function(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        },
   }
}
</script>

<style scoped>
    .header {
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        /* 09版 */
        -webkit-box-align: center;
        box-sizing:border-box;
        background-color: #26a2ff;
        color:#fff;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        display: box;
        display: -webkit-box;
        display: -moz-box;
        font-size: 14px;
        height:50px;
        line-height: 1;
        padding: 0 10px;
        text-align: center;
        white-space: nowrap;      
    }
    .fixed {
        position: absolute;
        top: 0;
        left:0;
        right: 0;
        z-index:1; 
    }
    .header .is-center {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
    }
        .is-center .changeDate img{
            vertical-align: middle;
            padding: 0 12px;
        }
    .header .is-left {
        -webkit-flex: .5;
        -ms-flex: .5;
        flex: .5;
        -webkit-box-flex: .5;
        -moz-box-flex: .5;
        text-align: left;
    }
    .header .is-right {
        -webkit-flex: .5;
        -ms-flex: .5;
        flex: .5;
        -webkit-box-flex: .5;
        -moz-box-flex: .5;
        text-align: right;
    }
    .is-right.time-filter span {
        float:right;
        background: transparent;
        padding: 8px 8px;
        font-size: 13px;
        color: #fff;
        border:1px solid #fff;
    }
    .is-right.time-filter span.active {
        background: #fff;
        color: #26a2ff;
    }
    .screen {
        top: 50px;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        display: box;
        display: -webkit-box;
        display: -moz-box;
        text-align: center;
        height: 40px;
        background-color: #fbf9fe;
    }
    .item {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        display: box;
        display: -webkit-box;
        display: -moz-box;
        box-sizing:border-box;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        /* 09版 */
        -webkit-box-align: center;
        /* 12版 */
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -ms-justify-content: center;
        -o-justify-content: center;
        justify-content: center;
        /* 09版 */
        -webkit-box-pack: center;
        text-decoration: none;
        /*border-right:1px solid #e1e1e1;*/
        /*border-bottom:1px solid #e1e1e1;*/
        font-size: 14px;
        width: auto;
        color: #8e8e8e;
    }
    /*.item:last-child {
        border-right:none;
    }*/
    .item.on {
        /*color:#26a2ff;*/
        border-bottom-color: #26a2ff;
        color:#000;
        font-weight: bold;
        position: relative;
    }
    .item.on:before {
        content: " ";
        position: absolute;
        bottom:0;
        height: 4px;
        line-height: 4px;
        border-radius: 4px;
        background-color: #f78f00;
        /*background-color: #26a2ff;*/
        width: 40px;
        left: 50%;
        margin-left: -20px;
    }
    .tep-cell .tep-cell-a .mint-cell {
        background-image: none;
    }
    .tep-cell .tep-cell-a:last-child .mint-cell {
        background-image: -webkit-linear-gradient(bottom, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
    }
    .dept {
        height: 30px;
        line-height: 30px;
        padding:0 10px;
        overflow: hidden;
        font-weight: bold;
        color: #888;
        /*background:#e4e4e4;*/
    }
    .mint-cell .mint-cell-title{
        color:#666;
    }
    .tep {
        overflow: auto;
        height: 100%;
        box-sizing:border-box;
        padding-top: 90px;
        padding-bottom: 54px;
    }
    /*组织架构*/
    .cnt_wrapper{
        position:absolute;
        top:0;
        bottom:0px;
        left:0;
        width: 100%;
        height:100%;
        /* z-index: 2002; */
        opacity: 0;
        -moz-opacity: 0;
        filter: alpha(opacity=0);
        /* display: none; */
         -webkit-transition:.5s ease-in-out;
            transition:.5s ease-in-out;
        -webkit-transform:translate3d(-200%,0,0);
            transform:translate3d(-200%,0,0);
    }
    .showToggle {
        z-index: 2;
        opacity: 1;
        -moz-opacity: 1;
        filter: alpha(opacity=100);
        display: block;
        height:auto;
        -webkit-transform:translate3d(0,0,0);
            transform:translate3d(0,0,0);
    }
    .cnt_wrapper .org-list{
        -webkit-transform:translate3d(150%,0,0);
            transform:translate3d(150%,0,0);
        -webkit-transition:.5s ease-in-out;
            transition:.5s ease-in-out;
    }
    .showToggle .org-list{
        -webkit-transform:translate3d(0,0,0);
            transform:translate3d(0,0,0);
    }
    .org-head {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        margin-bottom: 10px;
        font-size: 16px;
        color: #26a2ff;
        font-weight: bold;
    }
    .org_wrapper{
        position:absolute;
        top:0;
        bottom:0px;
        left:0;
        width: 100%;
        height:100%;
        z-index: 2;
        background: #000;
        background: rgba(0,0,0,.6)!important;
        filter: alpha(opacity=60);
        display: none;
        -webkit-transition:.5s ease-in-out;
            transition:.5s ease-in-out;
    }
    .org-bg{
        /* z-index: 2001; */
        display: block;
        -webkit-transition:.5s ease-in-out;
            transition:.5s ease-in-out;
    }
    .cnt_scroller{
        position:absolute;
        -webkit-tap-highlight-color:transparent;
        width:100%;
        -webkit-transform:translateZ(0);
        -moz-transform:translateZ(0);
        -ms-transform:translateZ(0);
        -o-transform:translateZ(0);
        transform:translateZ(0);
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        -webkit-text-size-adjust:none;
        -moz-text-size-adjust:none;
        -ms-text-size-adjust:none;
        -o-text-size-adjust:none;
        text-size-adjust:none;
    }
    .org-list{
        font-size: 13px;
        color: #777;
        background-color: #fff;
        overflow:auto;
        width: 187px;
        height:auto;
        -webkit-transition:.5s ease-in-out;
        transition:.5s ease-in-out;
        position: absolute;
        top:0;
        left: 0;
    }
    .org-list::-webkit-scrollbar{
        width: 6px;
        height: 6px;
        background-color: #f5f5f5;
    }
    /*定义滑块，内阴影及圆角*/
    .org-list::-webkit-scrollbar-thumb{
        /*width: 10px;*/
        height: 6px;
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #eee;
    }
    .org-list li.TopLev{
        text-indent:0px;  
    }
    .org-list li.FirLev{
        position: relative;
        text-indent:0px;
    }
    .org-list li.SecLev{
        text-indent:15px;
    }
    .org-list li.ThiLev{
        text-indent:30px;
        position: relative;
    }
    .org-list li.FourLev{
        text-indent:45px;
        position: relative;
    }
    .org-list li.FiveLev{
        text-indent:60px;
        position: relative;
    }
    .org-list li{
        position:relative;
        color: #777;
        text-align: left;
        display: block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        padding:0 5px;
        line-height: 30px;
    }
    .org-list li a{
        position:relative;
        color: #777;
        text-align: left;
        display: block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        padding:0 5px;
        line-height: 30px;
    }

    .org-list li.on {
        color: #000;
        font-weight: 700;
        background-color: #f1f1f1;
    }
    .org-list li.FirLev a:before{
        content: '';
        position: absolute;
        display: inline-block;
        top: 12px;
        left: 0;
        width: 3px;
        height: 3px;
        background:#666;
        border-radius: 50%;
    }
    .org-list li.FirLev a::after{
        content: '';
        position: absolute;
        display: inline-block;
        top:12px;
        right:5px;
        width: 100%;
        height:1px;
        border-bottom:1px solid #ddd;
        z-index:-1;
    }
    .org-list ul>li>ul>li>a{
        padding-left: 20px;
    }
    .org-list>ul>li>ul>li>ul>li>a{
        padding-left: 30px;
    }
    .org-list>ul>li>ul>li>ul>li>ul>li>a{
        padding-left: 40px;
    }
    .org-list>ul>li>ul>li>ul>li>ul>li>ul>li>a{
        padding-left: 50px;
    }
    .org-list>ul>li>ul>li>ul>li>ul>li>ul>li>ul>li>a{
        padding-left: 60px;
    }
    .org-list a.cur{
        background-color: #f5f5f5;
    }
    .select-list li a:hover{
        background-color:#f9f9f9;
        color:#666;
    }
    .select-list-dept-top-a{
        position: relative;
        height: 30px;
        padding-left: 0!important;
        margin-left: 10px;
    }
    .select-list-dept-top{
        background: #fff;
        padding-right: 10px;
        padding-left: 10px;
    }
    .select-list-dept-top:hover,.select-list-dept-top-second:hover,.select-list li a:hover .select-list-dept-top,.select-list li a:hover .select-list-dept-top-second{
        background-color: #f9f9f9;
    }
    .select-list-dept-top-second{
        background: #fff;
        padding-left: 10px;
        position: relative;
    }
    .select-list-dept-top-second::before{
        content: '';
        position: absolute;
        display: inline-block;
        top: 5px;
        left: 0;
        width: 4px;
        height:1px;
        border-bottom:1px solid #666;
    }
    .mint-indicator {
        z-index: 99999!important;
    }
</style>