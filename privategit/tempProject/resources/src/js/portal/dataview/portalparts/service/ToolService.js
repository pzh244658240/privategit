var timemsg = null;
var p1 = /^N??\d*$/;
var p2 = /^N??\[\d*,\d*\]$/;
var p3 = /^N??\[\d*,\d*\]\d+$/;
var p4 = /^Reg(\[\/.*?\/]){1}?$/;
var p5 = /^Reg\[\/.*?\/]Err\[([^\[\]])*?\]$/;
var p6 = /^Reg\[\/.*?\/]Err\[([^\[\]])*?\]Fmt\[([^\[\]])*?\]$/;
var jq1 = /\[\d*,\d*\]\d+$/; 
var jq2 = /\[\d*,\d*\]/; 
var jq3 = /\[\/.*?\/]/;
var jq4 = /Err\[.*?\]/;
var jq5 = /Fmt\[.*?\]/;
//保留n位小数src=数据源,pos=n
var fomatFloat = function(src,pos){
 	 return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos); 
 };
//工具服务
app.factory('ToolService', ['$http',function ($http) {
	//检测返回的数据
    var checkResponse = function (data) {
    	showMsg(data.level,data.message);
    	if(data.success==true){
    	  
    	   return true;
       }else{
    	   return false;
       }
    };
    //继承分页数据
    var extendData = function(from,to){
    	to.items = from.recordList;
    	to.currentPage = from.pageNow;
    	to.offset = from.offset;
    	to.totalPage = from.pageCount;
    	to.endPage = from.totalPage;
    	to.pageSize = from.pageSize;
    	to.statsData = from.statsResultMap;
    	to.pages =[];
    	//生成数字链接
        for(var i =from.beginPageIndex; i<=from.endPageIndex;i++){
        	to.pages.push(i);
        };
    	return to;
    };
    //打印数据
    var print = function(data){
    	 console.log("打印数据："+JSON.stringify(data));
    };
    //检测当前复选匡
    var checkSelect = function(data){
    	//控制全选按钮
   	 	var num=0;
        for(var i = 0; i<data.items.length;i++){
        	if(data.ids.get(data.items[i][data.keyid])){
        		num++;
        	}
        };
         if(num==data.items.length){
        	 data.check = true;
    	 }else{
    		 data.check = false;
    	 }
    };
    //将本地数据同步到列表中
    var recheckSelect = function(data){
        for(var i = 0; i<data.items.length;i++){
        	if(data.ids.get(data.items[i][data.keyid])){
        		data.items[i].select=true;
        	}
        }
    };
    //将selects里面的数据同步到ids里面
    var rebackSelect = function(data){
    	for(var i =0; i<data.selects.length;i++){
    		data.ids.put(data.selects[i][data.keyid] ,data.selects[i]);
    	}
     };
    //全选
    var selectAll = function(data){
    	//全选
    	if(data.check==true){
    		for(var i =0 ;i<data.items.length;i++){
		    	  if(!data.ids.get(data.items[i][data.keyid])){
		    		  data.ids.put(data.items[i][data.keyid], data.items[i]);
		    		  data.items[i].select=true;
		           }
				 }
    	}else{//取消全部
        	for(var i =0 ;i<data.items.length;i++){
          	  if(data.ids.get(data.items[i][data.keyid])){
          		  data.ids.remove(data.items[i][data.keyid]);
          		  data.items[i].select=false;
          		 }
          	}
    	}
    };
    //开始载入
    var startLoading = function(){
        	$("body").before("<div class='nowLoading' id='nowLoading'></div>");
    };
    //停止载入
    var endLoading = function(){
    	$("#nowLoading").remove();
    };
    //根据提交的数据查询新数据
    var loadData = function (originalData,params) {
    	startLoading();
    	 var tempparams = {
    	         	pageNow: originalData.currentPage,
    	            pageSize: originalData.pageSize
    	     };
    	 $.extend(tempparams,originalData.search);
    	 $.extend(tempparams,params);
    	//给提交数据赋值
       $http({ params:tempparams, url: basePath+originalData.url}).success(function (data){
    	     endLoading();
    	  if(checkResponse(data)){
    	     extendData(data.data,originalData);
       	     recheckSelect(originalData);
   	    	 checkSelect(originalData);
	    	}
	    	
	    });
    };
    var loadUrl = function(url,params){
    	startLoading();
    	var tempparams = {
	    };
		$.extend(tempparams,params);
		return $http({ params:tempparams, url: basePath+url});
    };

    //清理一个数据内容
    var clearOneData = function(data){
    	for (var c in data) {
            if (c.toString() != "pt" && c.toString() != "pv" && c.toString() != "tn") {
            	delete data[c.toString()];
            }
        }
    	return data;
    };
    //清理列表
    var clearLineDate = function(datalist){
    	var templist = new Array();
    	for(var i =0;i<datalist.length;i++){
    		if(datalist[i].ed==true){
    			templist.push(clearOneData(datalist[i]));
    		}
    	}
    	return templist;
    };
    //清理二维表
    var clearLine2Date = function(datalist2){
    	var templist = new Array();
    	for(var i =0; i<datalist2.length;i++){
    			templist = templist.concat(clearLineDate(datalist2[i]));
    	}
    	return templist;
    };
    //在请求数据之前需要先获取一些必要的数据，如果必要的数据已经存在就直接请求
    var loadUrlBack = function(url,params,fn){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(columnMap==null){
    		localStorage.clear();//清空数据
    		if(localStorage.columnMap==null){
    			 var columnMapurl = "/project/loadColumns";
    		       $http({url: basePath+columnMapurl}).success(function (data){
    		    	    endLoading();
    		    	 	columnMap = new Map();
    				 	for(o in data.data){
    				 		columnMap.put(o,data.data[o]);
    				 	}
    				 	localStorage.columnMap =JSON.stringify(columnMap);
    				 	
    				 	startLoading();
    			    	var tempparams = {
    				    };
    					$.extend(tempparams,params);
    					$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
    						  endLoading();
    				    	  if(checkResponse(data)){
    				    		  fn(data);
    					      }
    					});
    			    	
    			    });
    		}else{
    			var tempcolumnMap = JSON.parse(localStorage.columnMap);
    				columnMap = new Map();
    			for(o in tempcolumnMap){
    				columnMap.put(o,tempcolumnMap[o]);
    			}
    			startLoading();
		    	var tempparams = {
			    };
				$.extend(tempparams,params);
				$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
					  endLoading();
			    	  if(checkResponse(data)){
			    		  fn(data);
				      }
				});
    		}
		}else{
			 startLoading();
		     var tempparams = {
			    };
				$.extend(tempparams,params);
				$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
					  endLoading();
			    	  if(checkResponse(data)){
			    		  fn(data);
				      }
				});
		}
    };
    //提交数据增加回调
    var loadUrlBackHide =  function(url , params , fn){
    	var tempparams = {
	    };
		$.extend(tempparams,params);
		$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
	    	  if(checkResponse(data)){
	    		  fn(data);
		      }
		});
    };

    //提交表单
    var submitposturl = function(url ,params) {
    	startLoading();
    	return  $http({
    	  method : 'POST',
    	  url  : basePath+url,
    	  data : JSON.stringify(params), // pass in data as strings
    	  headers : { 'Content-Type': 'application/json','projectId':projectId } // set the headers so angular passing info as form data (not request payload)
    	 });
    };
 
    var submitposturlBack =  function(url , param , fn){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	startLoading();
    	$http({
      	  method : 'POST',
      	  url  : basePath+url,
      	  data : JSON.stringify(param),
      	  headers : { 'Content-Type': 'application/json','projectId':projectId }
      	 }).success(function (data){
			  endLoading();
	    	  if(checkResponse(data)){
	    		  fn(data);
		      }
		 });
    };
    //编辑提交
    var submitpost =  function(url , param ,info, fn){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	startLoading();
    	$http({
      	  method : 'POST',
      	  url  : basePath+url,
      	  data : JSON.stringify(param),
      	  headers : { 'Content-Type': 'application/json','projectId':projectId }
      	 }).success(function (data){
			  endLoading();
	    	  if(checkResponse(data)){
	    		  fn(data);
		      }else{
		    	  if(info.checkbox!=undefined && info.tn.split("_")[0]=="调整系数"){
		    		  info.checkbox = false;
		    	  }else if(info.it=="inputText-num"){
		    		  info.node['计算式']=info.copynum;
		    	  }else{
		    		  info.pv=info.copypv;
		    	  }
		      }
		 });
    };
    //post请求
    var posturlBack =  function(url , param , fn){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	$http.post(basePath+url, JSON.stringify(param)).success(function (data){
			  endLoading();
	    	  if(checkResponse(data)){
	    		  fn(data);
		      }
		 });
    };
    //在请求数据之前需要先获取一些必要的数据，如果必要的数据已经存在就直接请求
    var loadUrlBack = function(url,params,fn){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	if(columnMap==null){
    		localStorage.clear();//清空数据
    		if(localStorage.columnMap==null){
    			 var columnMapurl = "/project/loadColumns";
    		       $http({url: basePath+columnMapurl}).success(function (data){
    		    	    endLoading();
    		    	 	columnMap = new Map();
    				 	for(o in data.data){
    				 		columnMap.put(o,data.data[o]);
    				 	}
    				 	localStorage.columnMap =JSON.stringify(columnMap);
    				 	
    				 	startLoading();
    			    	var tempparams = {
    				    };
    					$.extend(tempparams,params);
    					$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
    						  endLoading();
    				    	  if(checkResponse(data)){
    				    		  fn(data);
    					      }
    					});
    			    	
    			    });
    		}else{
    			var tempcolumnMap = JSON.parse(localStorage.columnMap);
    				columnMap = new Map();
    			for(o in tempcolumnMap){
    				columnMap.put(o,tempcolumnMap[o]);
    			}
    			startLoading();
		    	var tempparams = {
			    };
				$.extend(tempparams,params);
				$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
					  endLoading();
			    	  if(checkResponse(data)){
			    		  fn(data);
				      }
				});
    		}
		}else{
			 startLoading();
		     var tempparams = {
			    };
				$.extend(tempparams,params);
				$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
					  endLoading();
			    	  if(checkResponse(data)){
			    		  fn(data);
				      }
				});
		}
    };
    //get请求
    var startLoadURL= function(url,params,fn,fn2){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	    startLoading();
		    var tempparams = {};
			$.extend(tempparams,params);
			$http({ params:tempparams, url: basePath+url,headers:{'projectId':projectId,timestamp:new Date().getTime()}}).success(function (data){
				 endLoading();
				 if(checkResponse(data)){
		    		  fn(data);
			      }else{
			    	  fn2(data);
			      }
			});
    };
    //post请求
    var startPostURL =  function(url , param , fn,fn2){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	startLoading();
    	$http({
      	  method : 'POST',
      	  url  : basePath+url,
      	  data : JSON.stringify(param),
      	  headers : { 'Content-Type': 'application/json','projectId':projectId,timestamp:new Date().getTime() }
      	 }).success(function (data){
			  endLoading();
	    	  if(checkResponse(data)){
	    		  fn(data);
		      }else{
		    	  fn2(data);
		      }
		 });
    };
    //get 
    var getURL = function(url , param , fn){
        startLoading();
        
        $.ajax({
        	  url: basePath+url,
        	  data: param,
        	  headers: {
        		  projectId: projectId
        	    },
        	  success: function(data){
        		  endLoading();
	      			if(data.success==true){
	      				  fn(data);
	      		      }else{
	      		    	   return false;
	      		      }
        	  },
        	  dataType: "json"
        	});
		/*$http({ params:param, url: basePath+url,headers:{'projectId':projectId}}).success(function (data){
			 endLoading();
			if(data.success==true){
				  fn(data);
		      }else{
		    	   return false;
		      }
		});*/
    };
    //获取物料表头
    var loadMaterial = function(url , param , fn,fn2){
    	if(getCookie("pw_accountId")==undefined||getCookie("pw_accountId")==null||getCookie("pw_accountId")==""){
    		showMsg("error","登录信息有误，请重新登录！");
      		return false;
      	}
    	if(visitPower==false){
    		showWindow('userTargetWin',true);
    		return false;
    	}
    	         localStorage.clear();//清空数据
    		     var columnMapurl = "/project/material/loadMaterialColumns";
    			 $http({url: basePath+columnMapurl,headers:{'projectId':projectId}}).success(function (data){
    		    	    endLoading();
    		    	 	columnMap = new Map();
    				 	for(o in data.data){
    				 		columnMap.put(o,data.data[o]);
    				 	}
    				 	localStorage.columnMap =JSON.stringify(columnMap);
    				 	startLoading();
    				 	$http({
    				      	  method : 'POST',
    				      	  url  : basePath+url,
    				      	  data : JSON.stringify(param),
    				      	  headers : { 'Content-Type': 'application/json','projectId':projectId }
    				      	 }).success(function (data){
    						  endLoading();
    				    	  if(checkResponse(data)){
    				    		  fn(data);
    					      }else{
    					    	  fn2(data);
    					      }
    					});
    				 	
    			    	
    			    });
    };
    //获取工程名
    var getpro = function(){
		 var url = "/project/baseparam/loadPrjInfo";
	     loadUrlBack(url ,{},function(data){
	    	 projectName.name=data.data["工程名称"];
	     });
	   
    };
   //提交正则验证
    var regTest =  function(data){
        var str = data.vp;
    	if(data.tpv==undefined){
    		data.tpv=data.pv;
    	}
    	if(str==""){
    		data.pv=data.tpv;
    		return data;
    	}
    	if(str=='S'){
    		if(data.tpv==""){
    			 showMsg("error","此项不能为空！");
				 return false;
			 }
    	}
    	if(str =='K'){//代码校验
			 var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
			 if(reg.test(data.tpv)){
				 data.tpv=data.tpv.toUpperCase();
			 }else{
				 showMsg("error","代码必须为字母或字母+数字！");
				 return false;
			 }
		}
        if(str =='N'){
        	 data.tpv=isNaN(data.tpv)?data.tpv:new Number(data.tpv);
			 var reg = /^\d+(?=\.{0,1}\d+$|$)/;
			 if(reg.test(data.tpv)){
				 var num = new Number(data.tpv);
				 if(num>2147483647){
					 data.tpv=2147483647;
				 }else{
					 data.tpv = fomatFloat(num,0);
				 }
			 }else if(data.tpv==""){
				  data.tpv=0;
			 }else{
				  showMsg("error","必须为数值型！");
				  return false;
			 }
				 
		}
    	if(p1.test(str)){
    		 data.tpv=isNaN(data.tpv)?data.tpv:new Number(data.tpv);
    		 var reg = /^\d+(?=\.{0,1}\d+$|$)/;
			 if(reg.test(data.tpv)){
				 var num = new Number(data.tpv);
				 var n = str.substring(1);
				 if(num>2147483647){
					 data.tpv=2147483647;
				 }else{
                     data.tpv = fomatFloat(num,n);
				 }
			 }else if(data.tpv==""){
				  data.tpv=0;
			 }else{
				  showMsg("error","必须为数值型！");
				  return false;
			 }
    	}
        if(p2.test(str)){
        	 data.tpv=isNaN(data.tpv)?data.tpv:new Number(data.tpv);
    		 var reg = /^\d+(?=\.{0,1}\d+$|$)/;
    		 var subStr = jq2.exec(str)[0];
			 var xy = subStr.substring(1,subStr.length-1);
			 var str1= xy.split(",");
			 if(reg.test(data.tpv)){
				 var num = new Number(data.tpv);
				 if(!(num>=str1[0] && num<=str1[1])){
					 showMsg("error","必须在"+str1[0]+"-"+str1[1]+"区间内");
					 return false;
				 }
			 }else if(data.tpv==""){
				  data.tpv=str1[0];
			 }else{
				  showMsg("error","必须为数值型！");
				  return false;
			 }
    	}
    	if(p3.test(str)){
    		 data.tpv=isNaN(data.tpv)?data.tpv:new Number(data.tpv);
    		 var reg = /^\d+(?=\.{0,1}\d+$|$)/;
    		 var subStr = jq2.exec(jq1.exec(str))[0];
			 var xy = subStr.substring(1,subStr.length-1);
			 var str1 = xy.split(",");
			 if(reg.test(data.tpv))
			 {
				 var num = new Number(data.tpv);
				 if(!(num>=str1[0] && num<=str1[1])){
					 showMsg("error","必须在"+str1[0]+"-"+str1[1]+"区间内");
					 return false;
				 }else{
					 var n = jq1.exec(str)[0].substring(subStr.length);
					 data.tpv = fomatFloat(num,n);
				 }
			 }else if(data.tpv==""){
				  data.tpv=str1[0];
			 }else{
				  showMsg("error","必须为数值型！");
				  return false;
			 }
    	}
    	if(p4.test(str)){
    		var subStr = jq3.exec(str)[0];
    		var reg = subStr.substring(1,subStr.length-1);
			 if(reg.test(data.tpv)){
			 }else{
				 showMsg("error","输入错误！");
				 return false;
			 }
    	}
    	if(p5.test(str)){
    		var subStr = jq3.exec(str)[0];
    		var reg = subStr.substring(1,subStr.length-1);
			 if(reg.test(data.tpv)){
			 }else{
				 var err=jq4.exec(str)[0];
				 var esmg=err.substring(4,err.length-1);
				 showMsg("error",esmg);
				 return false;
			 }
    	}
    	if(p6.test(str)){
    		var subStr = jq3.exec(str)[0];
    		var reg = subStr.substring(1,subStr.length-1);
			 if(reg.test(data.tpv)){
			 }else{
				 var err=jq4.exec(str)[0];
				 var esmg=err.substring(4,err.length-1);
				 showMsg("error",esmg);
				 return false;
			 }
    	}
    	data.pv=data.tpv;
    	return data;
    };
    //消息弹框
    var showMsg =  function(type,msg){
    	$('.msg-div .alert').hide();
    	clearTimeout(timemsg);
    	$(".msg-div .alert").find("strong").html(msg);
    	if(type=="info"){
    		$(".msg-div .alert").removeClass("alert-danger").addClass("alert-success"); 
    		$(".msg-div .alert").show();
         	timemsg = setTimeout("$('.msg-div .alert').hide();", 3000);
        }else if(type=="error"){
        	$(".msg-div .alert").removeClass("alert-success").addClass("alert-danger");
        	$(".msg-div .alert").show();
         	timemsg = setTimeout("$('.msg-div .alert').hide();", 3000);
        }else if(type=="debug"){
        	/*$(".msg-div .alert").removeClass("alert-danger").addClass("alert-success"); 
    		$(".msg-div .alert").show();
         	timemsg = setTimeout("$('.msg-div .alert').hide();", 3000);*/
        }
     };
     //重名校验
     var checkname = function(data,info,num){
    	  if(info.pv==""){
			       showMsg ("error","此项不能为空，请重新修改！");
				   info.pv=info.copypv;
				   return false;
		   }
  		   var nameMap = new Map();
  		   for(i in data){
  			   nameMap.put(data[i][num].pv,data[i][num].pv);
  		 	}
  		   var len=0;
  		   for(var i=1;i<data.length;i++){
  			   if(nameMap.get(data[i][num].pv)==info.pv){
  				   len++;
  			   }
  		   }
  		   if(len>1){
  			      showMsg ("error","'"+info.pv+"'重名，这可能导致费用计算有误，请重新修改！");
  				   info.pv=info.copypv;
  				   return false;
  			      //info.pv=info.pv+1;
  			      //checkname(data,info,num);
  		   }
  		 return info;
  	};
  	
   //获取报表高度
    var getheight = function(){
		//var h=$(".foot").height()+$(".trtop").height+$(".trhead").height+145;
		//var h2=$(".foot").height()+45;
		if($(".trhead").css("display")=="none"){
			$("td.form-nav .form-items").css("height","580px");
			$(".formdata").css("height","630px");
		}else{
			$("td.form-nav .form-items").css("height","500px");
			$(".formdata").css("height","550px");
		}	

    };
 // 添加指定名称的cookie的值
    var addCookie = function(objName, objValue, objHours) {// 添加cookie
			var str = objName + "=" + escape(objValue);
			if (objHours > 0) {// 为0时不设定过期时间，浏览器关闭时cookie自动消失
				var date = new Date();
				var ms = objHours * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString();
			}
			str += ";path=/";
			document.cookie = str;
	};
	// 获取指定名称的cookie的值
	var getCookie = function(objName) {// 获取指定名称的cookie的值
		var arrStr = document.cookie.split("; ");
		for (var i = 0; i < arrStr.length; i++) {
			var temp = arrStr[i].split("=");
			if (temp[0] == objName){
				return unescape(temp[1]);
			}
				
		}
	};
    return {
    	checkResponse: function (data){
            return checkResponse(data);
        },
        extendData :function(from , to){
        	return extendData(from , to);
        },
        print:function(data){
        	return print(data);
        },
        checkSelect :function(data){
        	return checkSelect(data);
        },
        loadData : function(originalData,params){
        	return loadData(originalData,params);
        },
        selectAll : function(data){
        	return selectAll(data);
        },
        recheckSelect : function(data){
        	return recheckSelect(data);
        },
        rebackSelect : function(data){
        	return rebackSelect(data);
        },
        loadUrl : function(url , params){
        	return loadUrl(url , params);
        },
        startLoading :function(){
        	return startLoading(); 
        },
        endLoading : function(){
        	return endLoading();
        },
        clearOneData :function(data){
        	return clearOneData(data);
        },
        submitposturl : function(url ,param){
        	return submitposturl(url ,param);
        },
        loadUrlBack : function(url ,param,fn){
        	return loadUrlBack(url ,param,fn);
        },
        loadURL : function(url ,param,fn){
        	return loadURL(url ,param,fn);
        },
        loadUrlBackHide : function(url ,param,fn){
        	return loadUrlBackHide(url ,param,fn);
        },
        submitposturlBack : function(url ,param,fn){
        	return submitposturlBack(url , param , fn);
        },
        submitpost: function(url ,param,info,fn){
        	return submitpost(url , param ,info, fn);
        },
        posturlBack : function(url ,param,fn){
        	return posturlBack(url , param , fn);
        },
        startPostURL : function(url ,param,fn,fn2){
        	return startPostURL(url ,param,fn,fn2);
        },
        startLoadURL: function(url ,param,fn,fn2){
        	return startLoadURL(url ,param,fn,fn2);
        },
        loadMaterial: function(url ,param,fn,fn2){
        	return loadMaterial(url ,param,fn,fn2);
        },
        getURL : function(url ,param,fn){
        	return  getURL(url ,param,fn);
        },
        clearLineDate : function(datalist){
        	return clearLineDate(datalist);
        },
        clearLine2Date : function(datalist2){
        	return clearLine2Date(datalist2);
        },
        fomatFloat : function(src,pos){
        	return fomatFloat(src,pos);
        },
        regTest : function(data){
        	return regTest(data);
        },
	    showMsg : function(type,msg){
	    	return showMsg(type,msg);
	    },
	    checkname : function(data,info,num){
	    	return checkname(data,info,num);
	    },
	    getpro: function(){
	    	return getpro();
	    },
	    getheight: function(){
	    	return getheight();
	    },
	    addCookie: function(objName, objValue, objHours){
	    	return addCookie(objName, objValue, objHours);
	    },
	    getCookie: function(objName){
	    	return getCookie(objName);
	    },
    };
}]);
//输出url
app.filter('trustUrl', function ($sce) {
        return function (input) {
            return $sce.trustAsResourceUrl(input);;
        }
});
//输出html
app.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});
//输出格式化
app.filter("format",function(){
    return function(input){
      if(input==""){
    		return input;
      }else if(input!="" && input!=" " && input!=null){
    	 if(input.vp==undefined){
      		var str="";
      	 }else{
      		var str =input.vp;
      	 }
       
       	if(input.pv!="" && input.vp!="" && input.pv!=undefined){
       		if(str =='N'){
      			// var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      			// if(reg.test(input.pv)){
      				 var num = new Number(input.pv);
      				 input.pv = fomatFloat(num,0);
                     if(isNaN(input.pv)){
      		       		input.pv = "";
      		       	 }
      			// }
      		}
       		if(p1.test(str)){
          		 //var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      			// if(reg.test(input.pv)){
      				 var num = new Number(input.pv);
      				 var n = str.substring(1);
      				 input.pv = fomatFloat(num,n);
      				 if(isNaN(input.pv)){
      		       		input.pv = "";
      		       	 }
      			// }
          	}
       		if(p2.test(str)){
         		    // var reg = /^\d+(?=\.{0,1}\d+$|$)/;
     			   //  if(reg.test(input.pv)){
     				    var num = new Number(input.pv);
     				     input.pv = fomatFloat(num,0);
     				     if(isNaN(input.pv)){
          		       		input.pv = "";
          		       	 }
     			  //    }
         	    }
       		if(p3.test(str)){
          		// var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      			// if(reg.test(input.pv))
      			// {
      				 var num = new Number(input.pv);
      				 var subStr = jq2.exec(jq1.exec(str))[0];
      				 var xy = subStr.substring(1,subStr.length-1);
      				 var str1 = xy.split(",");
      				 var n = jq1.exec(str)[0].substring(subStr.length);
      				 input.pv = fomatFloat(num,n);
      				 if(isNaN(input.pv)){
      		       		input.pv = "";
      		       	 }
      			// }
          	}
       		
       	}else{
       		input.pv=input.pv;
       	}
       	return input.pv;
    	  
      }
    	
    }
});