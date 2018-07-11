//require("./md5.js");//引入MD5插件
try{
  require("./md5.js");//引入MD5插件
}catch(e){
//console.log(e);
}

!function(system){
    var reg = new RegExp();
    if(!system){
      try{
        system = wx;
      }catch(e){
        try{
          system = window;
        }catch(e){
          return;
        }
      }
    }

    system.myUtils = {
      wxToast: function (title,icon) {
        //消息提示框
        icon = icon || 'none';
        title = title || '提示消息';
        wx.showToast({
          icon: icon,
          title: title,
        });
      },
      telFormat:function (tel) {
        //格式化手机
        tel = tel + '';
        var ltel = tel.slice(0, 3);
        var rtel = tel.slice(-4);
        return ltel + '****' + rtel;
      },
      arrRepeat:function(arr){
        arr = arr || [];
        var setArr = new Set();
        for(var i = 0; i < arr.length; i++){
          setArr.add(arr[i]);
        }
        return setArr;
      },
      toLower:function(str,bool){
        /**
         * 字母转换为小写，去掉所有的空格
         * 参数str：传入的字符串
         * 参数bool：是否去掉所有的空格(默认是)
         */
        bool = bool!==false ? true : false;
        return bool ? this.trima(str).toLowerCase() : str.toLowerCase();
      },
      typeOf:function(obj){
        // 判断对象是什么类型的
        if (typeof obj == 'object'){
          var strObj = Object.prototype.toString.call(obj).toLowerCase();
          strObj = strObj.split(' ')[1].split(']')[0];
          if (strObj === 'object'){
            return 'json';
          }else{
            return strObj.toLowerCase();
          }
        }else{
          return (typeof obj).toLowerCase();
        }
      },
      objCopy:function(p, c) {
        /**
         * 拷贝(克隆)对象或数组
         * 参数p：传入的数组或对象
         * 参数c：要拷贝成数组或对象(可省略)
         */
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object' && p[i] !== null) {
              c[i] = (p[i].constructor === Array) ? [] : {};
              this.objCopy(p[i], c[i]);
          } else {
            c[i] = p[i];
          }
        }
        return c;
      },

      supMoney: function (num) {
        /**
         * 将数字转化成货币（向下舍去）
         * 该方法适合输入框输入内容的事件
         */
        if (!(num * 1)){
          return num;
        }
        var tempNum = num.substring(num.indexOf(".") + 1);
        if (tempNum.length > 0) {
          return this.floor(num);
        } else {
          return num;
        }
      },
      floor: function (num, point){
        /**
         * 默认保留两位小数（向下舍去）
         */
        if (typeof point != 'number'){
          point = 100;
        }else{
          point = Math.pow(10, Math.abs(point));
        }
        var money = (Math.floor(num * point) / point)+'';
        var index = money.lastIndexOf('.') + 1;
        // if (money*1 < 0){
        //   money = 0;
        // }
        money = (money * 1).toFixed(2);
        return money*1;
      },
      money:function(num){
        /**
         * 将数字转化成货币（四舍五入）
         * eg:myUtils.money(12.549) 结果 12.55
         */
        var sign,cents;
        num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num)) num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
        cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
        // num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
          num = num.substring(0,num.length-(4*i+3))+''+num.substring(num.length-(4*i+3));
        }
        return (((sign)?'':'-') + num + '.' + cents) * 1;
      },
      notNull:function(str){
        /**
         * 返回一个boolean类型
         * 如果字符串为空或者只有空格则返回false
         * 如果不是一个字符串对象则返回false
         */
        var str_type = this.typeOf(str);//判断对象是什么类型的
        if (str_type != "string"){
          return false;
        } else{
          str = this.trims(str);
          return str == "" ? false : true;
        }
      },
      trim:function (str) {
        //清除两边的空格
        return str.replace(/(^\s*)|(\s*$)/g, '');
      },
      trima:function (str) {
        /*----------------------------------------
        * 清除字符串空格，包含换行符、制表符
        * ---------------------------------------*/
        return str.replace(/[\s\n\t]/g, "");
      },
      triml:function (str) {
        /*----------------------------------------
        * 清除字符串左侧空格，包含换行符、制表符
        * ---------------------------------------*/
        return str.replace(/^[\s\n\t]+/g, "");
      },
      trimr:function (str) {
        /*----------------------------------------
        * 清除字符串右侧空格，包含换行符、制表符
        *----------------------------------------*/
        return str.replace(/[\s\n\t]+$/g, "");
      },
      trims:function (str) {
        /*---------------------------------------
        * 清除字符串两端空格，包含换行符、制表符
        *---------------------------------------*/
        return str.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
      },
      replace_date: function (str, reg, rep){
        //将传入的str中的-替换成/
        str = str || '';
        reg = reg || /-/g;
        rep = rep || '/';
        return str.replace(reg, rep);
      },
      replace_path: function (str, reg, rep){
        //将传入的str中的\替换成/
        str = str || '';
        reg = reg || /\\/g;
        rep = rep || '/';
        return str.replace(reg, rep);
      },
      time_ms: function (format){
        /**
         * 返回指定日期的时间搓（毫秒）
         * 当format为空时则表示当前时间
         */
        format = format || '';
        return format == '' ? new Date().getTime() : new Date(format).getTime();
      },
      time_rub: function (format) {
        /**
         * 返回指定日期的时间搓（秒）
         * 当format为空时则表示当前时间
         */
        format = format || '';
        return format == '' ? Date.parse(new Date()) / 1000 : Date.parse(new Date(format)) / 1000;
      },
      time_tamp: function (timestamp,format) {
        //返回指定时间搓的日期
        timestamp = timestamp ||  0;
        format = format || 'yyyy/MM/dd';

        var strTime = timestamp+'';
        if (strTime.length == 10){
          timestamp*=1000;
        }
        return (new Date(timestamp)).format(format);
      },
      time_min: function (mss,format,g){
        /*
          * 将传入(mss)的秒数换算成时分秒
          * format:格式('hhmm','hhmmss')
          * eg:time_min(120,'hhmm')
          * 
        */
        format = format || '';
        if(g == "ms"){
          mss = parseInt(mss / 1000);
        }
        var days = parseInt(mss / (60 * 60 * 24));
        var hours = parseInt((mss % (60 * 60 * 24)) / (60 * 60));
        var minutes = parseInt((mss % ( 60 * 60)) / (60));
        var seconds = parseInt(mss % (60));
        var hour_str = (days * 24 + hours) > 0 ? (days * 24 + hours) + "小时" : '';
        if (mss<1){
          return '0秒';
        } else if (mss<60){
          return seconds+"秒";
        } else if (format === 'hhmm'){
          var mm = parseInt((minutes * 60 + seconds) / 60);
          return hour_str + mm + "分钟";
        } else if (format === 'hhmmss'){
          var seconds = seconds > 0 ? seconds + '秒' : '';
          return hour_str + minutes + "分钟" + seconds;
        } else if (days > 0) {
          return days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
        } else if (hours > 0) {
          return hours + "小时" + minutes + "分钟" + seconds + "秒";
        } else if (minutes > 0){
          return minutes + "分钟" + seconds + "秒";
        } else {
          return seconds + "秒";
        }
      },
      getSetting: function (scope){
        /**
         * 是否授权指定的权限（传入一个json）
         * scope.str:指定的权限字符串(查看API 'scope.userLocation'表示地理位置 )
         * scope.success():指定要授权的函数
         */
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.'+scope.str]) {
              scope.success();
            }
          }
        });
      },
      accredit: function (scope){
        /**
         * 当用户拒绝授权的时候调用可重新授权
         */
        scope.title = scope.title ? scope.title : '警告';
        scope.content = scope.content ? scope.content : '如不授权微信登陆, 将无法使用更多的功能';
        scope.cancelText = scope.cancelText ? scope.cancelText : '不授权';
        scope.confirmText = scope.confirmText ? scope.confirmText : '重新授权';
        scope.showCancel = scope.showCancel ? true : scope.showCancel;//是否显示取消按钮(默认为true)
        wx.showModal({
          title: scope.title,
          content: scope.content,
          cancelText: scope.cancelText,
          confirmText: scope.confirmText,
          showCancel: scope.showCancel,
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.openSetting({
                success:function(){
                  if (typeof scope.success == 'function'){
                    scope.success();//重新授权的方法
                  }
                }
              });
            }
          }
        });
      },
      dateWeek: function (date,format){
        date = date || '';
        format = format || '-';
        /**
         * eg：dateWeek("2017-5-10");
         * 获取指定日期的星期
         * 没有传入任何参数代表当前的日期
         */
        var weekArr = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        var weekIndex = new Date().getDay();
        var week = weekArr[weekIndex];
        if (date != "" && date) {
          weekIndex = new Date(date).getDay();
          week = weekArr[weekIndex];
        }
        if (!week) {
          return "传入的日期有误:调用格式('2011-10-5')";
        } else {
          return week;
        }
      },

      dateDay: function (mat, num, delay) {
          mat = mat || 'yyyy/MM/dd';
          num = num || 0;
          delay = delay || 0;
          /**
           * 获取指定显示的多少天的日期
           * eg:dateDay("-",20,1);
           * @mat
           *  设置日期的间隔符
           *  默认为yyyy/MM/dd
           * @param num
           *  需要显示多少天
           *  默认为当天
           *  为正数则是从当天前往明天开始
           *  为负数则是从当天前往昨天开始
           * @delay
           *  延后天数
           * @return
           *  返回一个指定多少天的集合
           */
          var t = new Date();
          var iToDay = t.getDate();
          var iToMon = t.getMonth();
          var iToYear = t.getFullYear();
          var iArray = [];
          var bool = num>=0 ? 1 : -1;
          if (mat.length == 1){
              if (!reg.myReg.letter.test(mat)){
                  mat = "yyyy"+mat+"MM"+mat+"dd";
              }
          } else if(mat.length <= 0){
              mat = "yyyy/MM/dd";
          }
          for (var i = 0; i <= Math.abs(num); i++) {
              var newDay = new Date(iToYear, iToMon, (iToDay + i * bool + delay*bool));
              var data_set = newDay.format(mat);
              iArray.push(data_set);
          }
          if(iArray.length == 1){
              return iArray[0];
          }else {
              return iArray;
          }
      },

      dateMonth: function (mat,num,month) {
          mat = mat || 'yyyy/MM/dd';
          num = num || 0;
          delay = delay || 0;
          /**
           * 获取指定显示的多少月的日期
           * eg:dateDay("-",20,1);
           * @mat
           *  设置日期的间隔符
           *  默认为yyyy/MM
           * @param num
           *  需要显示多少月
           *  默认为当月
           *  为正数则是从当月前往下月开始
           *  为负数则是从当月前往上月开始
           * @delay
           *  延后月数
           * @return
           *  返回一个指定多少月的集合
           */
          var t = new Date();
          var iToDay = t.getDate();
          var iToMon = t.getMonth();
          var iToYear = t.getFullYear();
          var iArray = [];
          var bool = num>=0 ? 1 : -1;
          if (mat.length == 1){
              if (!reg.myReg.letter.test(mat)){
                  mat = "yyyy"+mat+"MM"+mat+"dd";
              }
          } else if(mat.length <= 0){
              mat = "yyyy/MM/dd";
          }
          for (var i = 0; i <= Math.abs(num); i++) {
              var newDay = new Date(iToYear, (iToMon + i * bool + month*bool), 1);
              var data_set = newDay.format(mat);
              iArray.push(data_set);
          }
          if(iArray.length == 1){
              return iArray[0];
          }else {
              return iArray;
          }
      },

      dateStr: function (AddDayCount) {
        AddDayCount = AddDayCount || 0
          /**
           *
           * @param AddDayCount
           * 延后的天数（可以为负数）
           * @returns {string}
           */
          var dd = new Date();
          dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
          var y = dd.getFullYear();
          var m = dd.getMonth() + 1;//获取当前月份的日期
          var d = dd.getDate();
          var a = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日");
          var week = new Date().getDay() + AddDayCount;
          var w = a[week];
          return m + "月" + d + "日 " + w;
      },
      
      resetBlank:function () {
        // 合并多个空白为一个空白 
        var regEx = /\s+/g;
        return this.replace(regEx, ' ');
      },
			
			upFile:function(e,fun){
				var files=e.files;
        var formData = new FormData();
        
        formData.append('img1',files[0]);
        
        var img_format = myUtils.file_format(files[0].name);
        
        if(img_format.length > 0){
        		var img_formats = "jpeg,jpg,bmp,png,gif,ico";
            if(img_formats.indexOf(img_format) >= 0){
                var img = myUtils.getFileUrl(files[0]);
                
                $.ajax({
                    url: "http://zcczcc.com:8090/api/uploadImg.html",
                    type: "POST",
                    data: formData,
                    dataType:"json",
                    /**
                    *必须false才会自动加上正确的Content-Type
                    */
                    contentType: false,
                    /**
                    * 必须false才会避开jQuery对 formdata 的默认处理
                    * XMLHttpRequest会对 formdata 进行正确的处理
                    */
                    processData: false,
                    success: function (data) {
                    	var dataJson = {
                    		bool:true,
	    									msg:"成功",
	    									data:data
                    	}
                    	if(typeof fun == "function"){
                    		fun(dataJson);
                    	}
                    },
                    error: function () {
                        alert("上传失败！");
                    }
                });
            }else{
            	if(typeof fun == "function"){
		        		fun({
			        		bool:false,
			        		msg:"请上传图片文件"
			        	});
		        	}
            }
        }else{
        	if(typeof fun == "function"){
        		fun({
	        		bool:false,
	        		msg:"失败"
	        	});
        	}
        }
			},

			file_format:function(str = "",search = "."){
			/**
			 * 获取文件的后缀名
			 * 返回的都是小写的字母
			 */
	        var index = str.lastIndexOf(search);
	        if(index >= 0){
	            return (str.substr(index+1)).toLocaleLowerCase();
	        }else{
	            return "";
	        }
	    },
			
			getFileUrl:function(file){
				/**
			 * 获取上传文件的地址
			 * 由于浏览器的不同需要做兼容性
			 */
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
			},
      fileFormat:function(str,search){
          str = str || "";
          search = search || ".";
          /*
          * 传入文件名
          * 获取某个文件的扩展名
          * 0)返回一个字符串
          * 1)没有扩展名则返回""空字符串
          * 2)返回的扩展名都是小写的
          * */
          var index = str.lastIndexOf(search);
          if(index >= 0){
              return (str.substr(index+1)).toLocaleLowerCase();
          }else{
              return "";
          }
      },
      randomWord:function (randomFlag, min, max) {
        /**
         * randomWord 产生任意长度随机字母数字组合
         * randomFlag-布尔类型；是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
         */
        if (!randomFlag){
          randomFlag = randomFlag == undefined ? true : randomFlag == null ? true : false;
        }
        min = min || 20;
        max = max || 36;
        var pos = 0;
        var str = "",
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      }
    };

    system.regObj = {
        chinese : /^[\u4e00-\u9fa5]$/, /*仅中文*/
        CED : /^([A-Za-z\d]|[\u4E00-\u9FA5])+$/, /*中文、字母、数字*/
        chiEng : /^([A-Za-z]|[\u4E00-\u9FA5])+$/, /*中文和字母*/
        numEng : /^[A-Za-z0-9]+$/, /*^[A-Za-z0-9]{4,40}$/;英文和数字*/
        pass:/^[A-Za-z0-9]{6,16}$/,/*英文和数字最少6位最多16位*/
        posnum : /^[1-9]\d*$/, /*正整数*/
        num : /^\d{1}$/, /*只能有数字切不能为空*/
        personName : /[\u4E00-\u9FA5]{2,10}(?:·[\u4E00-\u9FA5]{2,10})*/, /*人的姓名*/
        letter : /^[A-Za-z]+$/, /*字母*/
        notnulls : /\S/, /*不能为空*/
        filsenulls : /^\S/, /*第一个字符不能为空格*/
        notspan : /^[^\s]+$/, /*不能有空格*/
        notnull : /^\S+$/, /*不能有空格并且不能为空*/
        notspe : new RegExp("[\^\\`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"), /*不能有特殊字符*/
        tel: /^1[1-9]\d{9}$/, /*手机号*/
        email : /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/, /*邮箱*/
        
    };

    
}(window);

!function () {
    //设置原生对象    
    RegExp.prototype.myReg = {
        letter:/^[A-Za-z]+$/,//字母
        chinese:/^[\u4e00-\u9fa5]$/,/*中文*/
        posnum:/^[1-9]\d*$/,/*正整数*/
        tel:/^1[1-9]\d{9}$/,/*手机号*/
        notnull:/^\S+$/,/*不能有空格并且不能为空*/
    };

    /**
     * 字符串原型链
     */
    String.prototype.trim=function () {
      //清除两边的空格
      return this.replace(/(^\s*)|(\s*$)/g, '');
    };
    String.prototype.trima = function () {
      /*----------------------------------------
      * 清除字符串空格，包含换行符、制表符
      * ---------------------------------------*/
      return this.replace(/[\s\n\t]/g, "");
    };
    String.prototype.triml = function () {
      /*----------------------------------------
      * 清除字符串左侧空格，包含换行符、制表符
      * ---------------------------------------*/
      return this.replace(/^[\s\n\t]+/g, "");
    };
    String.prototype.trimr = function () {
      /*----------------------------------------
      * 清除字符串右侧空格，包含换行符、制表符
      *----------------------------------------*/
      return this.replace(/[\s\n\t]+$/g, "");
    };
    String.prototype.trims = function () {
      /*---------------------------------------
      * 清除字符串两端空格，包含换行符、制表符
      *---------------------------------------*/
      return this.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
    };

    /**
     * 数组
     */
    Array.prototype.myUnique = function(isReform){
        /**
         * 数组去重(返回去掉重复的新数组)
         * 参数：isReform(是否改变原数组)
         * 默认会改变原数组
         */
        isReform = isReform != false ? true : isReform;
        var res = [this[0]];
        for(var i = 1; i < this.length; i++){
          var repeat = false;
          for(var j = 0; j < res.length; j++){
            if(this[i] == res[j]){
              repeat = true;
              break;
            }
          }
          if(!repeat){
            res.push(this[i]);
          }
        }
        if(isReform){
          this.splice(0,this.length);
          for(var k = 0; k < res.length; k++){
            this.push(res[k]);
          }
        }
        return res;
    };
    Date.prototype.format = function (format) {
      format = format || 'yyyy/MM/dd';
      /**
       * 日期格式化
       * eg:format="yyyy-MM-dd hh:mm:ss";
       */
      var o = {
          "M+": this.getMonth() + 1, // month
          "d+": this.getDate(), // day
          "h+": this.getHours(), // hour
          "m+": this.getMinutes(), // minute
          "s+": this.getSeconds(), // second
          "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
          "S": this.getMilliseconds()
          // millisecond
      };
      if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
              - RegExp.$1.length));
      }
      for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length));
          }
      }
      return format;
    };
}();
