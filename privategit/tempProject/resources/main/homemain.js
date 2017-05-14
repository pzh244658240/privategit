requirejs.config({
    baseUrl: basePath+'/resources/dist/',
    paths: {
    	  jquery : basePath+'/bower_components/jquery/dist/jquery.min',
    	  bootstrap : basePath+'/bower_components/bootstrap/dist/js/bootstrap.min',
    	  lhgcalendar : basePath+'/bower_components/privategit/privategit/lib/lhgcalender/lhgcalendar.min',
    	  stats : basePath+'/bower_components/stats.js/build/stats.min',
    	  respond : basePath+'/bower_components/respond/dest/respond.min',
    	  jqueryserialize : basePath+'/bower_components/jqueryserialize/dist/jquery.serialize-object.min',
    	  jsonutil : basePath+'/bower_components/privategit/privategit/lib/JSON',
    	  angular : basePath+'/bower_components/angular/angular.min',
    	  angularRoute : basePath+'/bower_components/angularjs-route/angular-route.min',
    	  angularUiRouter : basePath+'/bower_components/angular-ui-router/release/angular-ui-router.min',
    	  ocLazyLoad : basePath+'/bower_components/oclazyload/dist/ocLazyLoad.min',
    	  map : basePath+'/bower_components/privategit/privategit/lib/map',
    	  popupWindow : basePath+'/common/popupWindow',
    	  ace : basePath+'/bower_components/ace/ace'
    },
    shim: {
        angular : { exports : 'angular'},
        jquery:{exports:'jquery'},
        bootstrap:{exports:'bootstrap'},
        lhgcalendar:{exports:'lhgcalendar'},
        stats:{exports:'stats'},
        respond:{exports:'respond'},
        jqueryserialize:{exports:'jqueryserialize'},
        jsonutil:{exports:'jsonutil'},
        map:{exports:'map'},
        "angular-route":{exports:"angular-route"},
        "angular-ui-router":{exports:"angular-ui-router"},
        ocLazyLoad:{exports:"ocLazyLoad"},
        formjs:{exports:"formjs"},
       // colResizable:{ exports : 'colResizable'}
    }
}); 
var pathname = location.pathname;
var timestamp=new Date().getTime();
var projectpath = basePath.substring(1,basePath.length)+"/portal";
requirejs([ 'jquery','angular','bootstrap','map','popupWindow','lhgcalendar'],
function ($,b,canvas,mp) {
	requirejs([basePath+'/resources/dist/js/portal/dataview.all.js?ver='+version], function (d) {

	});
});

//require("js/portal/project/controller/baseControl");

/*// Start the main app logic.,'js/common/dev/statemain'
requirejs(['bootstrap', 'map', 'js/portal/project/projectinfo'],
function ($,b,canvas,sub) {
   
});
requirejs(['bootstrap', 'map', 'js/common/popupWindow'],
		function ($,b,canvas,sub) {
	inintWindowPopup('differenceWin', 'differenceTargetWin', true, true);
    inintWindowPopup('spanWin', 'spanTargetWin', true, true);
    inintWindowPopup('transportWin', 'transportTargetWin', true, true);
});*/