export default {
  install(Vue, options) {
    Vue.prototype.message = function (val, msg) {
      switch (val) {
        case 'success':
          this.$message.success({
            duration: 1500,
            message: msg
          });
          break;
        case 'warning':
          this.$message.warning({
            duration: 1500,
            message: msg,
          });
          break;
        case 'error':
          this.$message.error({
            duration: 1500,
            message: msg,
          });
          break;
        case 'info':
          this.$message.info({
            duration: 1500,
            message: msg,
          });
          break;
      }
    };
    Vue.prototype.formatDate = function (fmt, val) {
      // let str = val.replace(/-/g,"/")
      // str = str.split('.')[0]
      let date = new Date(val)
      if(date == "Invalid Date"){
        let str = val.replace(/-/g,"/")
        str = str.split('.')[0]
        date = new Date(str)
        console.log(date)
      }
      var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "H+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };

    Vue.prototype.splitStr = function (str, arr, http) {
      let strArr = str.split('^')
      strArr.splice(strArr.length - 1, 1)
      
      strArr.map(val => {
        let obj = {}
        obj.name = val.split('~')[1]
        val = val.substring(1)
        obj.href = http + val
        arr.push(obj)
        
      })
      return arr
    }
  }

}
