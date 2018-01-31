// import Vue from 'vue'
// import store from '../../store';

// this.$store.dispatch('getStateTime').then(function(){
//     // context.depts = context.$store.getters.allDepts;
//     console.log('当前时间',this.$store.getters.getStateTime);
// })

//获取当前年月日时分秒
var DateTime = {}; // 返回对象
var YearMonth =''; //年月
var YearMonthDay ='';//年月日 '-' 连接
var HoursMS = ''; //时分秒
var YMD = '';//年月日  连接
exports.curDate = function (Tsss){//获取当前时间 type 0为all 1为hms
    var Td = new Date();
    var Tyy = Td.getFullYear();
    var Tmm = (Td.getMonth()+1)>9 ? (Td.getMonth()+1) : '0' + (Td.getMonth()+1);
    var Tdd = Td.getDate()>9 ? Td.getDate() : '0'+Td.getDate();
    var Thh = Td.getHours()>9 ? Td.getHours() : '0'+Td.getHours();
    var Tmi = Td.getMinutes()>9 ? Td.getMinutes() : '0'+Td.getMinutes();
    var Tss = Td.getSeconds()>9 ? Td.getSeconds() : '0'+Td.getSeconds();
    var week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[Td.getDay()];
    //var Twk = '&nbsp;星期'+'日一二三四五六'.charAt(Td.getDay());
    Tsss = Tyy+'年'+Tmm+'月'+Tdd+'日   '+Thh+':'+Tmi+':'+Tss;
    YearMonth = Tyy+'-'+Tmm;
    YearMonthDay = Tyy+'-'+Tmm+'-'+Tdd;
    HoursMS = Thh+':'+Tmi+':'+Tss;
    YMD = Tyy+'年'+Tmm+'月'+Tdd+'日';
    //console.log(Tsss);
    DateTime['checkDate'] = Tsss;
    DateTime['ym'] = YearMonth;
    DateTime['ymd'] = YearMonthDay;
    DateTime['hms'] = HoursMS;
    DateTime['week'] = week;
    DateTime['YMD'] = YMD;
    // console.log(DateTime);
    return DateTime;

}

exports.addDate =function(date,days) {  // 当前日期 1/-1
    var d = new Date(date); 
    d.setDate(d.getDate()+days); 
    var month=d.getMonth()+1; 
    var day = d.getDate(); 
    if(month<10){ 
        month = "0"+month; 
    } 
    if(day<10){ 
        day = "0"+day; 
    } 
    DateTime['ymd'] = d.getFullYear()+"-"+month+"-"+day; 
    return DateTime; 
}

exports.addMonth = function(date,months) {
    date = date+'-01';
    var d=new Date(date); 
    d.setMonth(d.getMonth()+months); 
    var month=d.getMonth()+1; 
    if(month<10){ 
        month = "0"+month; 
    }
    DateTime['ym'] = d.getFullYear()+"-"+month; 
    return DateTime; 
}