jquery.banner.js
================

The javascript source code for banner by jQuery.   
jquery.banner.js是一个图片轮播的jQuery插件。基于jQuery，优化了图片加载的效率，配置简单，使用方便。   
## 使用方法：   
    $(".container").banner({
         "data" : [{
    		"src" : "img/1.jpg",
			"link" : "http://www.baidu.com",
			"text" : "test test test test"
		}]
    });
注：.container是你要放置图片轮播组件的容器，可以是一个空的div，你可以自己设置容器的宽度和高度，如果你没有设置，程序将会自动使用宽600px高400px的尺寸。   
   
## 配置参数：   
* data      （数组类型，必要）图片数据，内含参数src图片地址，link图片链接，text图片的说明文字。
* duration  （整数类型，非必要）图片切换间隔时间，单位为秒。
* fx        （自定义类型，非必要）图片切换的效果，有fade淡入淡出、slide滑动切换，以后将增加更多的效果。
* loop      （boolean类型，非必要）是否循环播放，默认为true。
* animation_duration （整数类型，非必要）动画的持续时间，单位为毫秒。
   
## 参考例子：
代码中的index.html就是简单的效果展示例子。