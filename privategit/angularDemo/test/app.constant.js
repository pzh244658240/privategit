/**
 * Config constant
 */
var hostname=getRootPath();
var pjpath= hostname+"/resources/src/js/portal/project/";
var pjvpath = hostname+"/resources/";
var pjvpath2 = hostname+"/portal/";
var extpath = hostname+"/resources/dist/js/portal/project/extjs/";
var hrefurl=window.location.href;
var techType;
var projectType;
var projectTypezh;
var cjType;
var rcjType;
var calType;
var timestamp=new Date().getTime();
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'modernizr': ['vendor/modernizr/modernizr.js'],
        'moment': ['vendor/moment/moment.min.js'],
        'spin': 'vendor/ladda/spin.min.js',

        //*** jQuery Plugins
        'perfect-scrollbar-plugin': ['vendor/perfect-scrollbar/perfect-scrollbar.min.js', 'vendor/perfect-scrollbar/perfect-scrollbar.min.css'],
        'chartjs': 'vendor/chartjs/Chart.min.js',
        'ckeditor-plugin': 'vendor/ckeditor/ckeditor.js',

        //*** Controllers
        'Ctrl1': pjpath+'scripts/controller1.js',
        'Ctrl2': pjpath+'scripts/controller2.js',
        'Ctrl3': pjpath+'scripts/controller3.js',
        'baseCtrl': pjpath+'projectparts2/baseControl.js',

        //*** Filters
        'htmlToPlaintext': 'assets/js/filters/htmlToPlaintext.js'
    },
    //*** angularJS Modules
    modules: [
       {
        name: 'module1',
        files: [pjpath+'components/module1/module1.js']
    }, {
        name: 'module2',
        files: [pjpath+'components/module2/module2.js']
    },  {
        name: 'module3',
        files: [pjpath+'components/module3/module3-1.js',pjpath+'components/module3/module3-2.js']
    },  {
        name: 'testdata',
        files: [pjpath+'projectparts2/data.js',
                pjpath+'projectparts2/expander_input.js',
                pjpath+'projectparts2/expander_select.js',
                pjpath+'projectparts2/expander.js',
                pjpath+'projectparts2/resources.config.js',
                pjpath+'projectparts2/ToolService.js'
                ]
    },{
    	name:'citydata',
    	files:[extpath+'city.data-3.js']
    },{
    	name:'earthdata',
    	files:[extpath+'earthwork.js?timestamp='+timestamp]
    },{
    	name:'colinit',
    	files:[extpath+'colinit.js?timestamp='+timestamp]
    }
    ]
});
