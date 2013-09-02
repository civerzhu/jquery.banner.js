/**
 * @fileOverview 图片轮播组件 banner plugin
 *		基于jQuery。
 *		配置的数据格式详细见https://github.com/zhuboss/jquery.banner.js
 * @example  $(".container").banner({
				data: [
					{
						"src" : "img/1.jpg",
						"link" : "http://www.baidu.com",
						"text" : "test test test test"
					}
				]
			});
 * @version 1.0
 * @author zhuxiaohua
 */

(function($){
	$.extend($.fn, {
		banner: function(options, callback){
			var that = this;
			
			var _banner = {
				/**
				 * 初始化
				 * @param {object} opt 设置参数，包括如下：
				 *					{array} data 输入框DOM元素
				 */
				init: function(options, callback){
					var defaults = {
						data: [],
						duration: 5,
						loop: true,
						imgObj: [],
						isPlaying: true,
						container: that,
						width: 600,
						height: 400,
						currentIndex: 0,
						fx: "fade",
						animation_duration: 800
					};
					var opts = $.extend(defaults, options);
					$.extend(this, opts);

					this.formDom();
					this.ImgLoader(this.data);

					// 先显示第一张图片
					this.firstShow();

					var index = 1;
					var timeStamp = this.duration * 1000;
					window.loopInterval = setInterval(function(){
						if(_banner.isPlaying){
							if(index > _banner.data.length - 1){
								if(!_banner.loop){
									_banner.pause();
									clearInterval(window.loopInterval);
								}else{
									index = 0;
								}
							}
							_banner.showByIndex(index);
							index = _banner.currentIndex + 1;
						}
					}, timeStamp);

					if(callback){
						callback();
					}
				},

				/**
				 * 开始播放
				 *
				 */
				start: function(){
					if(!this.isPlaying){
						this.isPlaying = true;
					}
				},

				/**
				 * 暂停播放
				 *
				 */
				pause: function(){
					if(this.isPlaying){
						this.isPlaying = false;
					}
				},

				/**
				 * 构建基本的Dom节点，包括容器、按钮。
				 *
				 */
				formDom: function(){
					this.container.css({
						"display" : "block",
						"position" : "relative",
						"width" : this.width,
						"height" : this.height,
						"background" : "#F2F2F2"
					});
					var z_index = this.data.length + 200;
					var $btnBar = $("<div>").css({
						"position": "absolute",
						"bottom" : 0,
						"right" : 0,
						"z-index" : z_index
					});

					for(var i in this.data){
						var $btn = $("<a>").css({
							"display" : "inline-block",
							"width" : "20px",
							"height" :  "20px",
							"background" : "rgba(0, 0, 0, .5)",
							"border" : "2px solid #FFF",
							"border-radius" : "100%",
							"box-shadow" : "0 0 10px rgba(0, 0, 0, .7)",
							"margin" : "4px"
						});
						$btn.hover(function(){
							$(this).css({
								"background" : "rgba(255, 255, 255, .5)",
								"border" : "2px solid #2C84CB"
							});
							$(this).trigger("click");
							_banner.pause();
						}, function(){
							$(this).css({
								"background" : "rgba(0, 0, 0, .5)",
								"border" : "2px solid #FFF"
							});
							_banner.start();
						});
						$btn.attr("data-index", i);
						$btn.click(function(e){
							var index = $(e.target).attr("data-index");
							_banner.showByIndex(parseInt(index));
						});
						$btnBar.append($btn);
					}

					var centerHeight = (this.height / 2 - 30) + "px";

					var $preBtn = $("<a>").css({
						"display" : "block",
						"position" : "absolute",
						"top" : centerHeight,
						"left" : "4px",
						"width" : "40px",
						"height" : "60px",
						"background" : "rgba(0, 0, 0, .2)",
						"color" : "rgba(255, 255, 255, .2)",
						"font-size" : "50px",
						"line-height" : "60px",
						"text-align" : "center",
						"cursor" : "pointer",
						"z-index" : z_index
					}).html("&lt;").hover(function(){
						$(this).css({
							"background" : "rgba(0, 0, 0, .6)",
							"color" : "#2C84CB"
						});
					}, function(){
						$(this).css({
							"background" : "rgba(0, 0, 0, .2)",
							"color" : "rgba(255, 255, 255, .2)"
						});
					}).click(function(){
						_banner.showPreImg();
					});

					var $nextBtn = $("<a>").css({
						"display" : "block",
						"position" : "absolute",
						"top" : centerHeight,
						"right" : "4px",
						"width" : "40px",
						"height" : "60px",
						"background" : "rgba(0, 0, 0, .2)",
						"color" : "rgba(255, 255, 255, .2)",
						"font-size" : "50px",
						"line-height" : "60px",
						"text-align" : "center",
						"cursor" : "pointer",
						"z-index" : z_index})
					.html("&gt;")
					.hover(function(){
						$(this).css({
							"background" : "rgba(0, 0, 0, .6)",
							"color" : "#2C84CB"
						});
					}, function(){
						$(this).css({
							"background" : "rgba(0, 0, 0, .2)",
							"color" : "rgba(255, 255, 255, .2)"
						});
					}).click(function(){
						_banner.showNextImg();
					});

					this.container.append($btnBar);
					this.container.append($preBtn).append($nextBtn);
				},

				/**
				 * 图片加载器
				 *
				 */
				ImgLoader: function(imgSrc){
					imgSrc = $.makeArray(imgSrc);
					for(var i in imgSrc){
						this.imgObj[i] = {
							"ele": null,
							"src": imgSrc[i].src,
							"link": imgSrc[i].link,
							"text": imgSrc[i].text,
							"isloaded": false
						};
					}
					
					var textWidth = this.width - 12;
					for(var i in this.imgObj){
						var $_link = $("<a>").attr({
							"href" : this.imgObj[i].link,
							"target" : "_blank"
						}).css({
							"position" : "absolute",
							"top" : 0,
							"left" : 0,
							"display" : "none"
						});

						var $_img = $("<img>").attr({
							"src" : this.imgObj[i].src,
							"data-index" : i,
							"width" : this.width,
							"height" : this.height
						});
						$_img.bind("load", function(e){
							var index = $(e.target).attr("data-index");
							_banner.imgObj[index].isloaded = true;
							_banner.container.append($(e.target).parent());
						});
						
						var $_text = $("<span>").html(this.imgObj[i].text).css({
							"position" : "absolute",
							"display" : "block",
							"bottom" : 0,
							"left" : 0,
							"width" : textWidth,
							"height" : "30px",
							"margin" : 0,
							"padding" : "6px",
							"background" : "rgba(0, 0, 0, .6)",
							"font-size" : "16px",
							"color" : "#FFF",
							"line-height" : "30px"
						}).hover(function(){
							$(this).css("color", "#2C84CB");
						}, function(){
							$(this).css("color", "#FFF");
						});

						$_link.append($_img).append($_text);
						this.imgObj[i].ele = $_link;
					}
				},

				/**
				 * 通过下标来显示第几张图片
				 *
				 */
				showByIndex: function(index){
					if(this.isPlaying){
						if(index != this.currentIndex){
							if(this.imgObj[index].isloaded){
								this.hide(this.imgObj[this.currentIndex].ele);
								this.show(this.imgObj[index].ele);
								this.currentIndex = index;
							}else{
								this.ImgLoader(this.data[index]);
								window.intervalIndex = setInterval(function(){
									if(_banner.imgObj[index].isloaded){
										_banner.hide(_banner.imgObj[_banner.currentIndex].ele);
										_banner.show(_banner.imgObj[index].ele);
										_banner.currentIndex = index;
										clearInterval(window.intervalIndex);
									}
								}, 20);
							}
						}
					}
				},

				/**
				 * 显示上一张图片
				 *
				 */
				showPreImg: function(){
					var _index = this.currentIndex - 1;
					if(_index < 0){
						_index = this.data.length - 1;
					}
					this.showByIndex(_index);
				},

				/**
				 * 显示下一张图片
				 *
				 */
				showNextImg: function(){
					var _index = this.currentIndex + 1;
					if(_index > this.data.length - 1){
						_index = 0;
					}
					this.showByIndex(_index);
				},

				/**
				 * 显示第一张图片
				 *
				 */
				firstShow: function(){
					this.ImgLoader(this.data[0]);
					window.intervalIndex2 = setInterval(function(){
						if(_banner.imgObj[0].isloaded){
							_banner.show(_banner.imgObj[0].ele);
							_banner.crrentIndex = 0;
							clearInterval(window.intervalIndex2);
						}
					}, 20);
				},

				/**
				 * 图片显示的方法
				 *
				 */
				show: function($ele){
					switch (this.fx) {
						case "fade": 
							$ele.fadeIn(this.animation_duration);
							break;
						case "slide":
							$ele.slideUp(this.animation_duration);
						default:
							$ele.fadeIn(this.animation_duration);
							break;
					}
				},

				/**
				 * 图片隐藏的方法
				 *
				 */
				hide: function($ele){
					switch (this.fx) {
						case "fade": 
							$ele.fadeOut(this.animation_duration);
							break;
						case "slide":
							$ele.slideDown(this.animation_duration);
						default:
							$ele.fadeOut(this.animation_duration);
							break;
					}
				}
			};
			
			_banner.init(options, callback);

			return _banner; //返回_banner对象，以方便链式调用
		}
	});
})(jQuery)