//包装函数
module.exports = function(grunt) {
	//任务配置，所有插件的配置信息
	grunt.initConfig({
		//获取package.json的信息
		pkg: grunt.file.readJSON('package.json'),
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
			css: {
				src: '<%=pkg.webresources%>src/css/parts/*.less',
				dest: '<%=pkg.webresources%>src/css/<%=pkg.name%>.less'
			},
			errorcss: {
				src: '<%=pkg.webresources%>src/css/error/*.less',
				dest: '<%=pkg.webresources%>src/css/error.less'
			},
			toolcss: {
				src: '<%=pkg.webresources%>src/css/tool/*.less',
				dest: '<%=pkg.webresources%>src/css/tool.less'
			},
			js: {
				src: '<%=pkg.webresources%>src/js/parts/*.js',
				dest: '<%=pkg.webresources%>src/js/<%=pkg.name%>.js'
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
						dest: '<%=pkg.webresources%>dist/css/iconfont',
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
			}
		},
		// 自动雪碧图
		// 自动雪碧图
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
		},
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
		//watch插件的配置信息
		watch: {
			js: {
				files: [
					'<%=pkg.webresources%>src/js/parts/*.js'
				],
				tasks: [
					'concat',
					'jshint',
					'uglify',
					'copy'
				],
				options: {
					spawn: false
				}
			},
			css: {
				files: [
					'<%=pkg.webresources%>src/css/parts/*.less',
					'<%=pkg.webresources%>src/css/error/*.less',
					'<%=pkg.webresources%>src/css/tool/*.less'
				],
				tasks: [
					'concat',
					'less',
					'sprite',
					'jshint',
					'uglify',
					'cssmin',
					'copy',
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
					'concat',
					'less',
					'sprite',
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
		}

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
	//告诉grunt当我们在终端中输入grunt时需要做些什么，注意现有顺序
	grunt.registerTask('default', [
		//注意下面注册任务的前后顺序
		'concat',
		'less',
		'sprite',
		'jshint',
		'uglify',
		'cssmin',
		'copy',
		'watch'
	]);
};