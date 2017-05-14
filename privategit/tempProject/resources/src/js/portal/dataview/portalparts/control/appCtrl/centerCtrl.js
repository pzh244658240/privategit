/**
 * Created by zed on 15/12/26.
 */
app.controller('centerCtrl',['$scope', '$rootScope','$state','ToolService', '$stateParams',
                         function ($scope, $rootScope,$state, ToolService,$stateParams)  {
	//单元格基础配置
	var basespace = {
		id: "0:0",//设定id规则，前面为x轴，后面位y轴
		child: [],//上下右左排列顺序，按照当前的坐标进行设计
		render:false,//是否渲染，
		sign:["green","yew"],//设计颜色
		place:{top:null,left:null}
	};
$scope.homespacelist=[];//单元格列表
var homespaceMap = {};//单元格map集合，做为排除重复用
var norederList = [basespace];//未渲染单元格列表

//中心节点位置
var baseTop = null;
var baseLeft  = null;

function init() {
	initFirstPlace();//初始化中心单元格
	/*for(var i= 0;i<xysize;i++){
		getMoreSpace($scope.homespacelist,homespaceMap);
	}*/
	for(var i=0;i<xysize;i++){
		for(var j=0;j<xysize;j++){
			boxArea(i,j);
		}
	}
	//显示所有的节点
	//showSpace($scope.homespacelist);
}
//创建一个方格效果的格子
function boxArea(x,y){
	if(x!=0||y!=0){
		if(x==0){
			var type1 = x+":"+y;
			var type2 = x+":"+(-y);
			addType(type1);
			addType(type2);
		}else if(y==0){
			var type1 = x+":"+y;
			var type2 = (-x)+":"+y;
			addType(type1);
			addType(type2);
		}else{
			var type1 = x+":"+y;
			var type2 = (-x)+":"+y;
			var type3 = x+":"+(-y);
			var type4 = (-x)+":"+(-y);
			addType(type1);
			addType(type2);
			addType(type3);
			addType(type4);
		}
	}
}
//通过id名称添加单元格
function addType(id){
	var tempspace = null;
	tempspace = JSON.parse(JSON.stringify(basespace));
	tempspace.id=id;
	var yNum = id.split(":")[1];
	var xNum = id.split(":")[0];
	var targetTop = baseTop - parseInt(yNum)*boxsize;
	var targetleft = baseLeft + parseInt(xNum)*boxsize;
	tempspace.place.top=targetTop;
	tempspace.place.left=targetleft;
	
	$scope.homespacelist.push(tempspace);
}
function initFirstPlace(){
	baseTop = Math.round($(window).height()/2);;
	baseLeft  = Math.round($(window).width()/2);;
	$("#centerspace").css("top",baseTop);
	$("#centerspace").css("left",baseLeft);
}
//获得根据传入的未渲染的列表，获取更多区域信息
function getMoreSpace(homespacelist,homespaceMap){
	var newlist = [];
	for(var i=0;i<norederList.length;i++){
		if(homespaceMap[norederList[i].id]==undefined){
			homespacelist.push(norederList[i]);
			homespaceMap[norederList[i].id] =norederList[i];
		}
		var list  = getRoundSpace(homespaceMap,norederList[i]);
		list.forEach(function(obj){
			newlist.push(obj);
		})
		
	}
	norederList = newlist;
}
//获取周围信息
function getRoundSpace(homespaceMap,norederNode){
	var idsp = norederNode.id.split(":");
	var up = parseInt(idsp[0])+":"+(parseInt(idsp[1])+1);
	var down = parseInt(idsp[0])+":"+(parseInt(idsp[1])-1);
	var left = (parseInt(idsp[0])-1)+":"+parseInt(idsp[1]);
	var right =(parseInt(idsp[0])+1)+":"+parseInt(idsp[1]);
	var tempspace = null;
	var spacelist = [];
	
	if(homespaceMap[up]==undefined){
		tempspace = JSON.parse(JSON.stringify(basespace));
		tempspace.id=up;
		spacelist.push(tempspace);
	}
	if(homespaceMap[down]==undefined){
		tempspace = JSON.parse(JSON.stringify(basespace));
		tempspace.id=down;
		spacelist.push(tempspace);
	}
	if(homespaceMap[left]==undefined){
		tempspace = JSON.parse(JSON.stringify(basespace));
		tempspace.id=left;
		spacelist.push(tempspace);
	}
	if(homespaceMap[right]==undefined){
		tempspace = JSON.parse(JSON.stringify(basespace));
		tempspace.id=right;
		spacelist.push(tempspace);
	}
	
	return spacelist;
}
//显示所有的节点
function showSpace(homespacelist){
	console.log("单元格个数:"+homespacelist.length);
	for(var i=0;i<homespacelist.length;i++){
		if(i==0){
			baseTop = Math.round($(window).height()/2);;
			baseLeft  = Math.round($(window).width()/2);;
			$("#centerspace").css("top",baseTop);
			$("#centerspace").css("left",baseLeft);
		}else{
			(function(i){
				setTimeout(function(){
					showOneSpace(homespacelist[i]);
				},i*10);
			})(i);
		}
	}
}
function showOneSpace(onespace){
	var yNum = onespace.id.split(":")[1];
	var xNum = onespace.id.split(":")[0];
	var targetTop = baseTop - parseInt(yNum)*boxsize;
	var targetleft = baseLeft + parseInt(xNum)*boxsize;
	var target = $('<div  class="node" onclick="selectArea(\''+onespace.id+'\')"></div>');
	target.css("top",targetTop);
	target.css("left",targetleft);
	$("body").append(target);
}
$scope.selectArea= function(id){
	alert();
};
init();
 }]); 