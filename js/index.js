/**
 * Created by Liu Jia on 2017/2/9.
 */
'use strict';
!function () {
	// todo 例子：http://www.w3cmark.com/2016/434.html
	//原来是在微信易信执行Ready之前，先注册事件，所以放在所有请求的最前面
	document.addEventListener("WeixinJSBridgeReady", function () {
		audioAutoPlay('music');//给个全局函数
	}, false);
	document.addEventListener('YixinJSBridgeReady', function() {
		audioAutoPlay('music');//给个全局函数
	}, false);
	// 全局控制播放函数
	function audioAutoPlay(id){
		var audio = document.getElementById(id),
			play = function(){
				audio.play();
				document.removeEventListener("touchstart",play, false);
			};
		audio.play();
		document.addEventListener("touchstart",play, false);
	}
	var isAppInside=/micromessenger/i.test(navigator.userAgent.toLowerCase())||/yixin/i.test(navigator.userAgent.toLowerCase());
	// 非微信易信浏览器
	if(!isAppInside){
		audioAutoPlay('music');
	}

	// todo 例子：http://huodong.lianjia.com/newicon/?from=groupmessage&isappinstalled=0
	var music = document.getElementById("music");
	music.play();
	$("#l_musicIcon").on("click touchend",function(){
		var music = document.getElementById("music");
		if($(this).hasClass("mute")){
			music.play();
			$(this).removeClass("mute");
		}else{
			music.pause();
			$(this).addClass("mute");
		}
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
			drawLoadProgress((picLength-pics.length)/(picLength));

			IMG.src = picelem;
			// 缓存处理
			if (IMG.complete) {
				window._pandaImageLoadArray.shift();
				// $('#img').get(0).src = IMG.src;
				log('complete：'+IMG.src);
				return loadImages(pics,callback);
			} else {
				// 加载处理
				IMG.onload = function() {
					window._pandaImageLoadArray.shift();
					IMG.onload = null;
					// $('#img').get(0).src = IMG.src;
					log('onload：'+IMG.src);
					return loadImages(pics, callback);
				};
				IMG.onerror = function(){
					window._pandaImageLoadArray.shift();
					IMG.onerror = null;
					// $('#img').get(0).src = IMG.src;
					log('onerror：'+IMG.src);
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
	// 加载百分比
	function drawLoadProgress(w){
		var num = Math.floor(w*100) >= 100 ? 100 : Math.floor(w*100);
		log('加载中。。。 '+num);
		$('.l_num1').text(num);
	}
	// Man Object
	function Man(objCl,actCl) {
		this.saveClassName = {
			obj: objCl,
			act: actCl
		};
		this.$obj = $('.'+this.saveClassName.obj);
		this.$act = $('.'+this.saveClassName.act);
	}
	Man.prototype = {
		init: function (st) {
			st = st || 'stand';
			this.setAct(st);
		},
		setAct: function (actState) {
			// this.$act.get(0).className = this.saveClassName.act+' '+actState;
			this.$act.hide();
			$('.'+this.saveClassName.act+'.'+actState).show();
		},
		toLeft: function () {
			this.setAct('toLeft');
		},
		toRight: function () {
			this.setAct('toRight');
		},
		toStand: function () {
			this.setAct('stand');
		},
		toJump: function () {
			this.setAct('jump');
		},
		holdOn: function () {
			this.setAct('holdOn');
		}
	};
	// Background Object
	function Background(cl) {
		this.$obj = $('.'+cl);
	}
	Background.prototype = {
		init: function (x) {
			x = x || 0;
			this.$obj.attr('style','-webkit-transform: translate3d('+x+'rem,0,0);transform: translate3d('+x+'rem,0,0);');
			this.$obj.get(0).dataset.x = x;
		},
		slideTo: function (x, t) {
			// log(this.$obj.get(0).dataset.x);
			x = x || this.$obj.get(0).dataset.x;
			t = t || 1;
			this.$obj.attr('style','-webkit-transform: translate3d('+x+'rem,0,0);transform: translate3d('+x+'rem,0,0); -webkit-transition-duration: '+t+'s; transition-duration: '+t+'s;');
			this.$obj.get(0).dataset.x = x;
		}
	};
	// Slide Object
	function Slide() {
		this.bg = new Background('slide');
		this.man = new Man('l_man','l_act');
		this.$gonext = $('.l_btn.gonext');
	}
	Slide.prototype = {
		init: function () {
			this.bg.init(0);
			this.man.init('stand');
			// this.man.init('toRight');
		},
		goToNext: function (n, t, fnS, fnE) {
			var This = this;
			if(n>=This.$gonext.length) {
				fnS && fnS(n);
				fnE && fnE(n);
				return -1;
			}
			fnS && fnS(n);
			This.bg.slideTo(-15*n,t);
			This.man.toRight();
			var timer = window.setTimeout(function () {
				clearTimeout(timer);
				// 到达默认动作
				This.man.toStand();

				fnE && fnE(n);
			}, t*1000+500);
			return n;
		}
	};


	//---* run
	var picLength = 3;
	// 禁止橡皮筋
	var ua = navigator.userAgent.toLowerCase();
	function stopScrolling( touchEvent ) {touchEvent.preventDefault();}
	if(/iphone|ipad|ipod/.test(ua)) {
		document.addEventListener( 'touchstart' , stopScrolling , false );
		document.addEventListener( 'touchmove' , stopScrolling , false );
	}
	// 图片预加载
	loadImages([
		"/walk/img/go_right_bottom.png",
		"/walk/img/go_left_bottom.png",
		"/walk/img/stand.png"
	], function(){
		setTimeout(function(){
			$(".ld_page").css({'opacity': '0'});
			$(".mainWrap").css({'opacity': '1'});
			$(".l_btn.gonext").eq(0).css({
				'opacity': '1',
				'display': 'block'
			});
		},30);
	});

	// 初始化
	var sliceObj = new Slide();
	sliceObj.init();

	// bind
	$('.l_btn.gonext').on('touchend click', function () {
		var x = this.dataset.goto;
		var $btn = $(this);
		$btn.css('opacity',0);
		window.setTimeout(function () {$btn.hide();},400);

		sliceObj.goToNext(x, 2, function(n){
			var This = sliceObj;

			log('开始：'+n);
			switch(n){
				case "1":
					// 1
					break;
				case "2":
					// 2
					break;
				case "3":
					// 3
					break;
				default:
					// 封底
			}
		},function(n){
			var This = sliceObj;

			log('到达：'+n+':动作');
			switch(n){
				case "1":
					// 动作1
					This.$gonext.eq(n).css({
						'opacity': '1',
						'color':   '#000',
						'display': 'block'
					});
					break;
				case "2":
					// 动作2
					This.$gonext.eq(n).css({
						'opacity': '1',
						'color':   '#fff',
						'display': 'block'
					});
					break;
				case "3":
					// 动作3
					This.$gonext.eq(n).css({
						'opacity': '1',
						'color':   '#fff',
						'display': 'block'
					});
					break;
				default:
					// 封底
					log('封底动作');
			}
		});
		return false;
	});

}();

// --- log
function log(str) {
	var o = $('.log');
	o.html('<p>'+str+'</p>'+o.html());
}