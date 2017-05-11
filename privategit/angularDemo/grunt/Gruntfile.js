//包装函数
module.exports = function(grunt) {
	var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var css2js=transport.css2js.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    
	//任务配置，所有插件的配置信息
	grunt.initConfig({
		//获取package.json的信息
		pkg: grunt.file.readJSON('package.json'),
		transport : {
               options : {
			               	//是否创建调试文件 默认true
			        		debug:false,               
			        		parsers:{
			        			//设置各类型文件的编译器          			
			                    //'.css': [style.cssParser],
			                    //'.css': [css2js.cssParser], //将css转换成js文件
			                    //'.html' : [text.htmlParser], //将html转换成js文件
			                    '.js':[script.jsParser]
			        		},
			                paths:["<%=pkg.webresources%>transport"],//提取依赖后，依赖模块的存放根目录
			                alias:"<%=pkg.alias%>"
               },
               build:{
                files:[
                    {
                        expand:true,
                        cwd:"<%=pkg.webresources%>src",
                        src:[
		                        "js/**/*",
		                        "css/**/*",
		                        "img/**/*",
		                        "slice/**/*",
		                        "html/**/*"
                        	],//要指定到需要提取依赖的文件
                        filter:"isFile",
                        dest:"<%=pkg.webresources%>transport"
                    }
                ]
            }
          },
		//uglify插件的配置信息
		uglify: {
			options: {
				stripBanners: true,
				banner: '/*!<%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd")%>*/\n'
			},
			build: {
				src: '<%=pkg.webresources%>src/js/*.js',
				dest: '<%=pkg.webresources%>dist/js/<%=pkg.name%>-<%=pkg.version%>.js.min.js'
			}
		},
		//less插件的配置信息
		less: {
			editor: {
				expand: true,
				cwd: '<%=pkg.webresources%>src/css',
				src: ['*.less'],
				dest: '<%=pkg.webresources%>dist/css',
				ext: '.css'
			}
		},
		//cssmin插件的配置信息
		cssmin: {
			options: {
				stripBanners: true,
				banner: '/*!  <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				expand: true,
				cwd: '<%=pkg.webresources%>src/css',
				src: ['*.css', '!*.min.css'],
				dest: '<%=pkg.webresources%>dist/css',
				ext: '.min.css'
			},
			buildsprite: {
				expand: true,
				cwd: '<%=pkg.webresources%>src/css',
				src: ['icon.sprite.css'],
				dest: '<%=pkg.webresources%>dist/css',
				ext: 'icon.sprite.min.css'
			}
		},
		//jshint插件的配置信息，检测js是否正确
		jshint: {
			build: ['Gruntfile.js', '<%=pkg.webresources%>src/js/*.js', '<%=pkg.webresources%>src/js/parts/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		concat: {
			errorcss: {
				src: '<%=pkg.webresources%>src/css/error/*.less',
				dest: '<%=pkg.webresources%>src/css/error.less'
			},
			toolcss: {
				src: '<%=pkg.webresources%>src/css/tool/*.less',
				dest: '<%=pkg.webresources%>src/css/tool.less'
			},
			layout:{
				src: '<%=pkg.webresources%>src/css/layout/*.less',
				dest: '<%=pkg.webresources%>src/css/layout.less'
			},
			portal:{
				src: '<%=pkg.webresources%>src/css/portal/*.less',
				dest: '<%=pkg.webresources%>src/css/portal.less'
			},
			form:{
				src: '<%=pkg.webresources%>src/css/form/*.less',
				dest: '<%=pkg.webresources%>src/css/form.less'
			},
			start:{
				src: '<%=pkg.webresources%>src/css/start/*.less',
				dest: '<%=pkg.webresources%>src/css/start.less'
			},
			index:{
				src: '<%=pkg.webresources%>src/css/index/*.less',
				dest: '<%=pkg.webresources%>src/css/index.less'
			},
			js: {
				src:  ['<%=pkg.webresources%>src/js/portal/projectparts/app.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/app.constant.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/TreeService.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/ToolService.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/service/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/expander/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/data.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/resources.config.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/control/appCtrl/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/control/calculateCtrl/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/control/buildCtrl/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/control/materialCtrl/*.js',
				'<%=pkg.webresources%>src/js/portal/projectparts/control/statementCtrl/*.js',
					'<%=pkg.webresources%>src/js/portal/projectparts/app.router.js'
				],
				dest: '<%=pkg.webresources%>src/js/portal/projectinfo.js'
			},
			commonjs:{
				src: '<%=pkg.webresources%>src/js/common/commonparts/*.js',
				dest: '<%=pkg.webresources%>src/js/common/common.js'
			},
			all:{
				src:['<%=pkg.webresources%>bower_components/bootstrap/dist/css/bootstrap.css',
				'<%=pkg.webresources%>dist/css/iconfont.css',
				'<%=pkg.webresources%>dist/css/tool.css',
				'<%=pkg.webresources%>dist/css/layout.css',
				'<%=pkg.webresources%>dist/css/portal.css',
				'<%=pkg.webresources%>dist/css/lhgcalendar.css'
				],
				dest: '<%=pkg.webresources%>dist/css/all.css'
			},
			startall:{
				src:['<%=pkg.webresources%>bower_components/bootstrap/dist/css/bootstrap.css',
				'<%=pkg.webresources%>dist/css/iconfont.css',
				'<%=pkg.webresources%>dist/css/tool.css',
				'<%=pkg.webresources%>dist/css/layout.css',
				'<%=pkg.webresources%>dist/css/portal.css',
				'<%=pkg.webresources%>dist/css/start.css'
				],
				dest: '<%=pkg.webresources%>dist/css/startall.css'
			}
		},
		//copy插件的配置信息
		copy: {
			main: {
				files: [
					//js
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/js/*.js'],
						dest: '<%=pkg.webresources%>dist/js/',
						filter: 'isFile'
					}, {
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/js/lib'],
						dest: '<%=pkg.webresources%>dist/js/lib',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/project/*.js','<%=pkg.webresources%>src/js/portal/project/*.html'],
						dest: '<%=pkg.webresources%>dist/js/portal/project/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/project/projectparts/extjs/**'],
						dest: '<%=pkg.webresources%>dist/js/portal/project/extjs/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/project/projectparts/*.js'],
						dest: '<%=pkg.webresources%>dist/js/portal/project/projectparts/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/project/controller/*.js'],
						dest: '<%=pkg.webresources%>dist/js/portal/project/controller/',
						filter: 'isFile'
					},
					{ 
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/project/template/**'],
						dest: '<%=pkg.webresources%>dist/js/portal/project/template/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true, 
						src: ['<%=pkg.webresources%>src/js/portal/*.js'],
						dest: '<%=pkg.webresources%>dist/js/portal/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/js/common/dev/*.js'],
						dest: '<%=pkg.webresources%>dist/js/common/dev/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/js/common/*.js'],
						dest: '<%=pkg.webresources%>dist/js/common/',
						filter: 'isFile'
					},
					//less
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/css/*.less'],
						dest: '<%=pkg.webresources%>dist/css/',
						filter: 'isFile'
					},
					//css
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/css/*.css'],
						dest: '<%=pkg.webresources%>dist/css/',
						filter: 'isFile'
					},
					//字体图标库
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/css/iconfont/**'],
						dest: '<%=pkg.webresources%>dist/css',
						filter: 'isFile'
					},
					//图片
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/img/**'],
						dest: '<%=pkg.webresources%>dist/img',
						filter: 'isFile'
					}
					/*	//js第三方插件,非bower
						,{
							expend: true, 
							flatten: true,
							src: ['src/js/plugin/**'],
							dest: 'plugin/', 
							filter: 'isFile'
						} */
				]
			},
			html:{
				files:[{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webroot%>srchtml/index.html'],
						dest: '<%=pkg.webroot%>',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webroot%>srchtml/start.html'],
						dest: '<%=pkg.webroot%>',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%=pkg.webresources%>src/css/iconfont/**'],
						dest: '<%=pkg.webresources%>dist/css',
						filter: 'isFile'
					}]
			}
		},
		// 自动雪碧图
		/*// 自动雪碧图
		sprite: {
			options: {
				// sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
				imagepath: '<%=pkg.webresources%>src/slice/',
				// 映射CSS中背景路径，支持函数和数组，默认为 null
				imagepath_map: null,
				// 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
				spritedest: '<%=pkg.webresources%>dist/img/sprite/',
				// 替换后的背景路径，默认 ../images/
				spritepath: '../img/sprite/',
				// 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
				padding: 2,
				// 是否使用 image-set 作为2x图片实现，默认不使用
				useimageset: false,
				// 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
				newsprite: false,
				// 给雪碧图追加时间戳，默认不追加
				spritestamp: true,
				// 在CSS文件末尾追加时间戳，默认不追加
				cssstamp: true,
				// 默认使用二叉树最优排列算法
				algorithm: 'binary-tree',
				// 默认使用`pngsmith`图像处理引擎
				engine: 'pngsmith'
			},
			autoSprite: {
				files: [{
					// 启用动态扩展
					expand: true,
					// css文件源的文件夹
					cwd: '<%=pkg.webresources%>src/css/',
					// 匹配规则
					src: '*.css',
					// 导出css和sprite的路径地址
					dest: '<%=pkg.webresources%>src/css/',
					// 导出的css名
					ext: '.sprite.css'
				}]
			}
		},*/
		bower: {
			install: {
				options: {
					"targetDir": "<%=pkg.webresources%>src/js/lib",
					"layout": "byComponent",
					"install": true,
					"verbose": false,
					"cleanTargetDir": false
				}
			}
		},
		filerev: {//下面三个都是表示在原文件上直接修改
			css: {
			  src: ['<%=pkg.webresources%>dist/css/all.css','<%=pkg.webresources%>dist/css/startall.css'],
			},
			image:{
				src:['<%=pkg.webresources%>dist/img/*.{png,jpg,gif}']
			}
		},
	    useminPrepare: {
			html: ['<%=pkg.webroot%>*.html'],  //要处理的文件，我是将原始文件复制到build/index.html的，千万不要对原始文件直接作处理。
			options: {
			  dest: "<%=pkg.webroot%>"  //build的文件夹
			}
        },
		usemin: { 
			html: ['<%=pkg.webroot%>*.html'], //将HTML中的静态资源进行文件名替换
			css: ['<%=pkg.webresources%>dist/css/*.css'],//将CSS中的静态资源进行文件名替换，如果需要替换JS，可以在下面加一条。
			options: {
			   assetsDirs: ['<%=pkg.webroot%>','<%=pkg.webresources%>dist/img'],//告诉usemin去哪里找filerev处理过的静态文件
			}
        },
		//watch插件的配置信息
		watch: {
			js: {
				files: [
					'<%=pkg.webresources%>src/js/parts/*.js',
					'<%=pkg.webresources%>src/js/*.js',
					'<%=pkg.webresources%>src/**',
					'<%=pkg.webresources%>src/js/common/*.js',
					'<%=pkg.webresources%>src/js/portal/*.js',
					'<%=pkg.webresources%>src/js/portal/project/*.js',
					'<%=pkg.webresources%>src/js/portal/project/*.html',
					'<%=pkg.webresources%>src/js/portal/project/projectparts/*.js'
				],
				tasks: [
					'clean',
					'concat',
					'less',
					'jshint',
					'uglify',
					'cssmin',
					'copy',
					'watch'
				],
				options: {
					spawn: false
				}
			},
			css: {
				files: [
					'<%=pkg.webresources%>src/css/parts/*.less',
					'<%=pkg.webresources%>src/css/error/*.less',
					'<%=pkg.webresources%>src/css/tool/*.less',
					'<%=pkg.webresources%>src/css/layout/*.less',
					'<%=pkg.webresources%>src/css/portal/*.less',
					'<%=pkg.webresources%>src/css/start/*.less',
					'<%=pkg.webresources%>src/css/index/*.less'
					
				],
				tasks: [
					'clean',
					'concat',
					'less',
					'jshint',
					'uglify',
					'cssmin',
					'copy',
					'watch'
				],
				options: {
					spawn: false
				}
			},
			//配置文件
			grunt: {
				files: [
					'Gruntfile.js'
				],
				tasks: [
				'clean',
				'concat',
				'less',
				'jshint',
				'uglify',
				'cssmin',
				'copy',
				'watch'
				],
				options: {
					spawn: false
				}
			}
		},
		//清除临时文件夹
        clean:["<%=pkg.webresources%>transport","<%=pkg.webresources%>dist"]

	});
	//告诉grunt我们将使用插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-css-sprite');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	
	//告诉grunt当我们在终端中输入grunt时需要做些什么，注意现有顺序
	grunt.registerTask('default', [
		//注意下面注册任务的前后顺序
		'clean',
		'concat',
		'less',
		'jshint',
		'uglify',
		'cssmin',
		'copy',
		'copy:html',
		'useminPrepare',
		'concat', 
		'filerev',
		'usemin',
		'watch'
		
	]);
};