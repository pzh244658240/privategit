app.config(['$stateProvider', '$urlRouterProvider', '$provide','$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $provide ,$ocLazyLoadProvider, jsRequires) {

        app.constant = $provide.constant;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        $urlRouterProvider.otherwise("center");
     
        //基本参数
        $stateProvider.state('center', {
            url: "/center",
            templateUrl: basePath+"/portal/application/center.html?timestamp="+timestamp,
            controller:"centerCtrl",
            resolve: loadSequence('citydata'),
        }).state('app.home', {
            url: "/home",
            templateUrl: pjvpath2+"info/parts/base.html?timestamp="+timestamp,
            controller:"BusinessCtrl",
            resolve: loadSequence('citydata'),
            title:'xxx'
        }).state('app.line', {
            url: "/line",
            templateUrl: pjvpath2+"info/parts/line.html?timestamp="+timestamp,
            controller:"lineCtrl",
            resolve: loadSequence('module2','Ctrl2'),
            title: 'xxx'
        })

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return console.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }
    }]);
angular.bootstrap(document,['APP']);