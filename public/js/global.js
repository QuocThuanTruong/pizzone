/*-------------------------------------------------------------------------------------------------------------------------------*/
/*This is main JS file that contains custom style rules used in this template*/
/*-------------------------------------------------------------------------------------------------------------------------------*/
/* Template Name: "EX ZO"*/
/* Version: 1.0 Initial Release*/
/* Build Date: 06-02-2016*/
/* Author: UnionAgency*/
/* Copyright: (C) 2016 */
/*-------------------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/
/* 01 - VARIABLES */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

$(function() {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, headerH, winScr, footerTop, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
		headerH = $('.header-empty-space').height();
		$('.page-height').css({'height':(winH-headerH<=500)?500:(winH-headerH)});
	};
	_functions.initSelect = function(){
		if(!$('.SlectBox').length) return false;
		$('.SlectBox').SumoSelect({ csvDispCount: 3, search: true, searchText:'Search', noMatch:'No matches for "{0}"', floatWidth: 0 });
	};
	_functions.initCounter = function(){
		if(!$('.countdown').length) return false;
		$('.countdown').not('.initialized').each(function(){
           $(this).addClass('initialized').ClassyCountdown({
               theme: ($(this).hasClass('light'))?'light':(($(this).hasClass('light-green'))?'light-green':''),
               end: (new Date($(this).data('end'))).getTime()
           }); 
        });
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/
	if(_ismobile) $('body').addClass('mobile');
	_functions.pageCalculations();
	_functions.initSelect();

	/*============================*/
	/* 04 - function on page load */
	/*============================*/
	$(window).load(function(){
		_functions.initSwiper();
		_functions.initCounter();
		$('body').addClass('loaded');
		$('#loader-wrapper').fadeOut();
	});

	/*==============================*/
	/* 05 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 06 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
		if(winScr>300) $('header').addClass('scrolled');
		else $('header').removeClass('scrolled');
	};

	/*=====================*/
	/* 07 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	_functions.initSwiper = function(){
		$('.swiper-container-detail').not('.initialized').each(function(){
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('>.swiper-pagination').addClass('swiper-pagination-'+index);
			// $t.find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			// $t.find('>.swiper-button-next').addClass('swiper-button-next-'+index);
			if($t.find('>.swiper-button-prev').length){
				$t.find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
				$t.find('>.swiper-button-next').addClass('swiper-button-next-'+index);
			}
			else{
				$t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
				$t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);
			}

			var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1,
				loopVar = ($t.data('loop'))?parseInt($t.data('loop'), 10):0;
			if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: slidesPerViewVar,
		        autoHeight: ($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
		        loop: loopVar,
				autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
				centeredSlides: ($t.is('[data-center]'))?parseInt($t.data('center'), 10):0,
		        breakpoints: ($t.is('[data-breakpoints]'))? { 767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10) }, 991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10) }, 1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10) }, 1370: { slidesPerView: parseInt($t.attr('data-lt-slides'), 10) } } : {},
		        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
		        watchSlidesProgress: true,
		        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
		        parallax: ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
		        slideToClickedSlide: ($t.is('[data-click]'))?parseInt($t.data('click'), 10):0,
		        keyboardControl: true,
		        mousewheelControl: ($t.data('mousewheel'))?parseInt($t.data('mousewheel'), 10):0,
		        mousewheelReleaseOnEdges: false,
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
		        preloadImages: false,
		        lazyLoading: true,
		        lazyLoadingInPrevNext: ($t.data('direction')=='vertical')?true:false,
		        lazyLoadingInPrevNextAmount: ($t.data('direction')=='vertical')?100:1,
		        spaceBetween: ($t.is('[data-space]'))?$t.data('space'):0,
		        touchEventsTarget:($t.is('[data-touch]'))?'wrapper':'container'

			});
			swipers['swiper-'+index].update();
			initIterator++;
		});
		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')];
		});

	};

	/*==============================*/
	/* 08 - buttons, clicks, hovers */
	/*==============================*/

	//open and close responsive menu
	$('.hamburger-icon, .nav-close-layer').on('click', function(){
		$('.nav-wrapper').toggleClass('active');
	});

	//toggle menu in responsive mode
	$('.menu-toggle').on('click', function(){
		$(this).toggleClass('active').next().slideToggle();
	});

	//toggle geader search
	$('.toggle-search, .header-search-wrapper .button-close').on('click', function(){
		$('.header-search-wrapper').toggleClass('active');
	});

	//open and close popup
	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	});

	$(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(e){
		e.preventDefault();
		if($('.video-popup').hasClass('active')) $('.video-popup .popup-iframe').html('');
		$('.popup-wrapper, .popup-content').removeClass('active');
		$('html').removeClass('overflow-hidden');
		return false;
	});

	//open ajax product popup
	//preload
    function showprogress() {
        if (document.images.length === 0) {return false;}
        var loaded = 0;
        for (var i=0; i<document.images.length; i++) {
            if (document.images[i].complete) {
                loaded++;
            }
        }
        percentage  = (loaded / document.images.length);
    }
    var ID, percentage;

	$(document).on('click', '.open-popup-ajax', function(e){
		e.preventDefault();
		$('html').addClass('overflow-hidden');
		$('.popup-content').removeClass('active');
		$('.popup-wrapper').addClass('active');
		var url = $(this).attr('href');
		$.ajax({
			type:"GET",
			async:true,
			url: url,
			success:function(response){
				var responseObject = $($.parseHTML(response));
				$('.ajax-popup .swiper-container').each(function(){
					swipers['swiper-'+$(this).attr('id')].destroy();
					delete swipers['swiper-'+$(this).attr('id')];
				});
				$('.ajax-popup').remove();
				$('.popup-wrapper').append(responseObject.addClass('ajax-popup'));
				ID = window.setInterval(function(){
					showprogress();
					if (percentage == 1) {
						window.clearInterval(ID);
						percentage = 0;
						_functions.initSwiper();
						_functions.initSelect();
						responseObject.addClass('active');
					}
				}, 300);
			}
		});
		return false;
	});

	//video popup
	$('.open-video').on('click', function(e){
		e.preventDefault();
		$('.video-popup .popup-iframe').html('<iframe src="'+$(this).data('src')+'"></iframe>');
		$('.popup-wrapper').addClass('active');
		$('.video-popup').addClass('active');
	});

	//slider - product preview shortcode
	$(document).on('click', '.product-preview-shortcode .sidebar .entry', function(){
		var index = $(this).closest('.sidebar').find('.entry').index(this);
		$(this).closest('.sidebar').find('.active').removeClass('active');
		$(this).addClass('active');
		$(this).closest('.product-preview-shortcode').find('.preview .entry.active').removeClass('active');
		$(this).closest('.product-preview-shortcode').find('.preview .entry').eq(index).addClass('active');
	});

	//product shortcode 1 color click
	$(document).on('click', '.color-selection .entry', function(){
		$(this).parent().find('.entry').removeClass('active');
		$(this).addClass('active');
	});

	//tabs
	var tabsFinish = 0;
	$(document).on('click', '.tabs-block .tab-menu', function() {
		if($(this).hasClass('active') || tabsFinish) return false;
		tabsFinish = 1;
        var tabsWrapper = $(this).closest('.tabs-block'),
        	tabsMenu = tabsWrapper.find('.tab-menu'),
        	tabsItem = tabsWrapper.find('.tab-entry'),
        	index = tabsMenu.index(this);
        tabsWrapper.find('.tabulation-title').text($(this).text());
        tabsItem.filter(':visible').fadeOut(function(){
        	tabsItem.eq(index).css({'display':'block', 'opacity':'0'});
        	tabsItem.eq(index).find('.swiper-container').each(function(){
        		swipers['swiper-'+$(this).attr('id')].update();
        	});
        	$(window).resize();
        	tabsItem.eq(index).animate({'opacity':'1'}, function(){
        		tabsFinish = 0;
        	});
        });
        tabsMenu.removeClass('active');
        $(this).addClass('active');
    });

    $(document).on('click', '.tabulation-title', function(){
    	$(this).toggleClass('active');
    });

    //categories
    $('.categories-menu .toggle').on('click', function(){
    	$(this).toggleClass('active').next().slideToggle();
    });

    //products view toggle
    $('.toggle-products-view').on('click', function(){
    	if($(this).hasClass('active')) return false;
    	$(this).parent().find('.active').removeClass('active');
    	$(this).addClass('active');
    	$('.products-content').addClass('notransition');
    	$('.products-content').toggleClass('view-inline');
    	setTimeout(function(){$('.products-content').removeClass('notransition');},0);
    });

    //quantity selector
    $(document).on('click', '.quantity-select .minus', function(){
    	var newValue = parseInt($(this).parent().find('.number').text(), 10);
    	$(this).parent().find('.number').text(newValue>1?(newValue-1):newValue);
    });

    $(document).on('click', '.quantity-select .plus', function(){
    	var newValue = parseInt($(this).parent().find('.number').text(), 10);
    	$(this).parent().find('.number').text(newValue+1);
    });

    //rating
    $(document).on('click', '.rate-wrapper.set .fa', function(){
    	$(this).parent().find('.fa-star').removeClass('fa-star').addClass('fa-star-o');
    	$(this).removeClass('fa-star-o').prevAll().removeClass('fa-star-o');
    	$(this).addClass('fa-star').prevAll().addClass('fa-star');
    });

    //remove item from cart
    $('.cart-entry-description .button-close').on('click', function(){
    	if($(this).closest('.cart-overflow').find('.cart-entry').length==1) $(this).closest('.cart-entry').replaceWith('<h4 class="h4">Your shopping cart is empty</h4>');
    	else $(this).closest('.cart-entry').remove();
    });

    //file remove button in input file block
    $('.input-file-wrapper .file-remove').on('click', function(){
    	var filewrapper = $(this).closest('.input-file-wrapper'),
    		textwrapper = filewrapper.find('.simple-input');
		filewrapper.removeClass('active');
		textwrapper.text(textwrapper.data('placeholder'));
		filewrapper.find('input').val('');
	});

	//checkout - toggle wrapper checkbox
	$('.checkbox-toggle-title input').on('change', function(){
		$('.checkbox-toggle-wrapper').slideToggle();
	});

});