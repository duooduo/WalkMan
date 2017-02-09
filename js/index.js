/**
 * Created by Liu Jia on 2017/2/9.
 */
'use strict';
// var music = document.getElementById("music");

!function () {
	var picLength = 3;
	//禁止橡皮筋效果
	var ua = navigator.userAgent.toLowerCase();
	if(/iphone|ipad|ipod/.test(ua)) {
		document.addEventListener( 'touchstart' , stopScrolling , false );
		document.addEventListener( 'touchmove' , stopScrolling , false );
	}
	function stopScrolling( touchEvent ) {touchEvent.preventDefault();}

	// run
	loadImages([
		"http://localhost:63342/walk/img/go_right_bottom.png",
		"http://localhost:63342/walk/img/go_left_bottom.png",
		"http://localhost:63342/walk/img/stand.png"
	], function(){
		setTimeout(function(){
			$(".ld_page").css('opacity','0');
			$(".mainWrap").css('opacity','1');
		},30)
	});

	// 图片加载
	function loadImages(pics, callback, len){
		len = pics.length;
		if(pics.length){
			var IMG = new Image(),
				picelem = pics.shift();
			if(window._pandaImageLoadArray){
				window._pandaImageLoadArray = window._pandaImageLoadArray
			}else{
				window._pandaImageLoadArray = [];
			}
			window._pandaImageLoadArray.push(picelem);
			// 从数组中取出对象的一刻，就开始变化滚动条
			drawLoadProgress((picLength-pics.length)/(picLength));
			// 缓存处理
			if (IMG.complete) {
				window._pandaImageLoadArray.shift();
				return loadImages(pics,callback);
			} else {
				// 加载处理
				IMG.src = picelem;
				IMG.onload = function() {
					console.log('onload');
					window._pandaImageLoadArray.shift();
					IMG.onload = null;
					return loadImages(pics, callback);
				};
				IMG.onerror = function(){
					console.log('onerror');
					window._pandaImageLoadArray.shift();
					IMG.onerror = null;
					return loadImages(pics, callback);
				};
			}
		} else {
			if(callback) return loadProgress(callback, window._pandaImageLoadArray.length, len);
		}
	}
	// 监听实际的加载情况
	function loadProgress(callback, begin, all){
		var loadinterval = setInterval(function(){
			if(window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin){
				drawLoadProgress((begin - window._pandaImageLoadArray.length )/all);
			}else if(window._pandaImageLoadArray.length == 0){
				drawLoadProgress(1);
				setTimeout(function(){
					callback.call(window);
				},500);
				clearInterval(loadinterval);
			}
		},300);
	}
	//加载百分比
	function drawLoadProgress(w){
		var num = Math.floor(w*100) >= 100 ? 100 : Math.floor(w*100);
		console.log(num);
		$('.l_num1').text(num);
	}
}();
