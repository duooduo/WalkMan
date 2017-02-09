/**
 * Created by Ly on 2017/2/9.
 */
'use strict';
var music = document.getElementById("music");
//禁止橡皮筋效果
var ua = navigator.userAgent.toLowerCase();
if(/iphone|ipad|ipod/.test(ua)) {
	document.addEventListener( 'touchstart' , stopScrolling , false );
	document.addEventListener( 'touchmove' , stopScrolling , false );
}
function stopScrolling( touchEvent ) {
	touchEvent.preventDefault();
}

//加载图片列表
var pics = [];

function _loadImages(pics, callback, len){
	len = len || pics.length;
	if(pics.length){
		var IMG = new Image(),
			picelem = pics.shift();

		if(window._pandaImageLoadArray){
			window._pandaImageLoadArray = window._pandaImageLoadArray
		}else{
			window._pandaImageLoadArray = [];
		}
		window._pandaImageLoadArray.push(picelem);
		IMG.src = picelem;
		// 从数组中取出对象的一刻，就开始变化滚动条
		_drawLoadProgress(window._pandaImageLoadArray.length/(len*len));
		// 缓存处理
		if (IMG.complete) {
			window._pandaImageLoadArray.shift();
			return _loadImages(pics,callback, len);
		}else{
			// 加载处理
			IMG.onload = function() {
				window._pandaImageLoadArray.shift();
				IMG.onload = null;  // 解决内存泄漏和GIF图多次触发onload的问题
			}
			// 容错处理 todo 应该如何处理呢?
			// 目前是忽略这个错误，不影响正常使用
			IMG.onerror = function(){
				window._pandaImageLoadArray.shift();
				IMG.onerror = null;
			}
			return _loadImages(pics, callback, len);
		}
		return;
	}
	if(callback) _loadProgress(callback, window._pandaImageLoadArray.length, len);
}

// 监听实际的加载情况
function _loadProgress(callback, begin, all){
	var loadinterval = setInterval(function(){
		if(window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin){
			_drawLoadProgress((begin - window._pandaImageLoadArray.length )/all);
		}else if(window._pandaImageLoadArray.length == 0){
			_drawLoadProgress(1)
			setTimeout(function(){
				callback.call(window);
			},500);
			clearInterval(loadinterval);
		}
	},300);
}

//加载百分比
function _drawLoadProgress(w){
	var num = Math.floor(w*100) >= 100 ? 100 : Math.floor(w*100);
}

//加载完成回调
music.play();
_loadImages(pics, function(){
	setTimeout(function(){
		$(".music_icon").show();
		$(".ld_page").fadeOut(800);
		$(".pageHome").fadeIn(800)
	},3000)
});

//音频
// $(".music_icon").on("touchstart",function(){
// 	if($(this).hasClass("mute")){
// 		music.play();
// 		$(this).removeClass("mute");
//
// 	}else{
// 		music.pause();
// 		$(this).addClass("mute");
// 	}
// });