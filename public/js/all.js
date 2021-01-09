/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/
/* 01 - letIABLES */
/* 02 - SWIPER SLIDER */
/* 03 - WINDOW LOAD */
/* 04 - MENU */
/* 05 - WINDOW SCROLL */
/* 06 - ISOTOPE */
/* 07 - GOOGLE MAP */
/* 08 - VIDEO YOUTUBE - VIMEO */
/* 09 - ACCORDEON  */
/* 10 - CLICK AND HOVER  */
/* 11 - SLIDER RANGE  */
/* 12 - COLORPICKER  */
/* 13 - TIMER */
/* 14 - TABS*/
/* 15 - COPLE SWIPER  */
/* 16 - CHECKOUT  */
/* 17 - SHOP MENU FILTER  */
/* 18 - CHOOSE ANIMATION  */

jQuery(function($) { "use strict";

	/*============================*/
	/* 01 - letIABLES */
	/*============================*/

	let swipers = [], winW, winH, winScr, _isresponsive, xsPoint = 480, smPoint = 768, mdPoint = 992, lgPoint = 1200, addPoint = 1600, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), footerHeight = $('.footer').height();

	function pageCalculations(){
		winW = $(window).width();
		winH = $(window).height();
		if ($(window).width()>992){
			$('.main-content').css({"margin-bottom":footerHeight-1});
		}else{
			$('.main-content').css({"margin-bottom":"0"});
		}
	}
	pageCalculations();

   if(_ismobile) {
	   $('body').addClass('mobile');
		$('.bg').removeClass('data-jarallax');
   }

	 if ($(window).width() < 1200) {
		 $('.swiper-container').each(function(){
			 $(this).removeAttr('data-parallax');
		 });
	 }

    initSwiper();

    if ($('.map-wrapper').length){
        setTimeout(function(){initialize();}, 1000);
    }
	$('.preloader').fadeOut();


	let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
    {
       $('.bg.ready').removeAttr('data-jarallax').addClass('fix');
    }

	function updateSlidesPerView(swiperContainer){
		if(winW>=addPoint) return parseInt(swiperContainer.attr('data-add-slides'),10);
		else if(winW>=lgPoint) return parseInt(swiperContainer.attr('data-lg-slides'),10);
		else if(winW>=mdPoint) return parseInt(swiperContainer.attr('data-md-slides'),10);
		else if(winW>=smPoint) return parseInt(swiperContainer.attr('data-sm-slides'),10);
		else return parseInt(swiperContainer.attr('data-xs-slides'),10);
	}

	function resizeCall(){
		pageCalculations();

		$('.swiper-container.initialized[data-slides-per-view="responsive"]').each(function(){
			let thisSwiper = swipers['swiper-'+$(this).attr('id')], $t = $(this), slidesPerViewlet = updateSlidesPerView($t), centerlet = thisSwiper.params.centeredSlides;
			thisSwiper.params.slidesPerView = slidesPerViewlet;
			thisSwiper.update();
			if(!centerlet){
				let paginationSpan = $t.find('.pagination span');
				let paginationSlice = paginationSpan.hide().slice(0,(paginationSpan.length+1-slidesPerViewlet));
				if(paginationSlice.length<=1 || slidesPerViewlet>=$t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
				else $t.removeClass('pagination-hidden');
				paginationSlice.show();
			}
		});
	}
	if(!_ismobile){
		$(window).resize(function(){
			resizeCall();
		});
	}else{
		window.addEventListener("orientationchange", function() {
			resizeCall();
		}, false);
	}


	/*============================*/
	/* 02 - SWIPER SLIDER */
	/*============================*/

	function initSwiper(){
		let initIterator = 0;
		$('.swiper-container').each(function(){
			let $t = $(this);
			let index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index + ' initialized').attr('id', index);
			$t.find('.pagination').addClass('pagination-'+index);

			let autoPlaylet = parseInt($t.attr('data-autoplay'),10);
            let slideEffect = $t.attr('data-effect');
			let slidesPerViewlet = $t.attr('data-slides-per-view');

			if(slidesPerViewlet == 'responsive'){
				slidesPerViewlet = updateSlidesPerView($t);
			}

            let directMode = $t.attr('data-mode');
			let looplet = parseInt($t.attr('data-loop'),10);
			let parallaxVal = parseInt($t.attr('data-parallax'),10);
			let speedlet = parseInt($t.attr('data-speed'),10);
            let centerlet = parseInt($t.attr('data-center'),10);
			let freeMode = parseInt($t.attr('data-freemode'),10);
			let space = parseInt($t.attr('space-between'),10);
			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				speed: speedlet,
				pagination: '.pagination-'+index,
				paginationHide:false,
				loop: looplet,
				paginationClickable: true,
				autoplay: autoPlaylet,
				slidesPerView: slidesPerViewlet,
				keyboardControl: true,
				simulateTouch: true,
				centeredSlides: centerlet,
				effect: slideEffect,
                coverflow: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows : false
                },
				direction: directMode,
				freeMode: freeMode,
                updateTranslate: true,
                observer:true,
                parallax:parallaxVal,
                preventClicks: false,
                longSwipesRatio: 0.1,
                spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
                onSlideChangeStart: function(swiper){
		           let activeIndex = (looplet===1)?swiper.activeLoopIndex:swiper.activeIndex;
				   if($t.closest('.slider-swiching').length){
						swipers['swiper-'+$t.closest('.slider-swiching').find('.swich-parent').attr('id')].slideTo(swiper.activeIndex);
						$t.closest('.slider-swiching').find('.slide-swich').removeClass('active');
						$t.closest('.slider-swiching').find('.slide-swich').eq(activeIndex).addClass('active');
					}

					if ( $t.hasClass('swiper-control-top') ) {
						let activeIndex = swiper.activeIndex,
						slidersWrapper = $t.closest('.swipers-wrapper');
						swipers['swiper-'+slidersWrapper.find('.swiper-control-bottom').attr('id')].slideTo(activeIndex);
						slidersWrapper.find('.swiper-control-bottom').find('.active').removeClass('active');
                    	slidersWrapper.find('.swiper-control-bottom').find('.swiper-slide').eq(activeIndex).addClass('active');
					}
				},

				onClick: function(swiper){
					let activeIndex1 =  swiper.clickedIndex;
					if ($t.closest('.checkbox-wrapp').length){
						swiper.slideTo(activeIndex1);
					}
				}

			});

			swipers['swiper-'+index].update();
			initIterator++;
		});
		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).parent().find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).parent().find('.swiper-control-top').attr('id')];
		});
	}

    $(document).on('click','.slide-swich', function(){
		let switchIndex = $(this).closest('.slider-swiching').find('.slide-swich').index(this);
		console.log(switchIndex);
		 $(this).closest('.slider-swiching').find('.slide-swich').removeClass('active');
		  $(this).addClass('active');
			swipers['swiper-'+$(this).closest('.slider-swiching').find('.container-swich').attr('id')].slideTo(switchIndex);
		  return false;
	});

    $(document).on('click', '.swiper-arrow-left', function(){
		swipers['swiper-'+$(this).closest('.arrow-closest').find('.swiper-container').attr('id')].slidePrev();
	});

	$(document).on('click', '.swiper-arrow-right', function(){
		swipers['swiper-'+$(this).closest('.arrow-closest').find('.swiper-container').attr('id')].slideNext();
	});

	/*============================*/
	/* 03 - WINDOW LOAD */
	/*============================*/

	$(window).load(function(){
        izotopInit();

       	if ($('.data-jarallax').length) {

	   		$('.data-jarallax').jarallax({
			    speed: 0.7
			});
	    }
	});

	/*============================*/
	/* 04 - MENU */
	/*============================*/

	$('.burger-menu').on('click', function(){
        if ($(this).hasClass('open-menu')) {
            $(this).removeClass('open-menu');
            $('.nav').removeClass('active');
            $('body').removeClass('overflow');
            $('.header').removeClass('open-search');
        }else{
            $(this).addClass('open-menu');
            $('.nav').addClass('active');
            $('body').addClass('overflow');
        }
    });

    $('.menu-arr').on('click', function(){
        $(this).parent().parent().find('ul').first().slideToggle(300);
        return false;
    });

    $('.search-open').on('click', function(){
       $('.header').toggleClass('open-search');
    });

    $('.close-search').on('click', function(){
       $('.header').removeClass('open-search');
    });

	/*============================*/
	/* 05 - WINDOW SCROLL */
	/*============================*/

    $(window).scroll(function() {
	   headerScroll();
        headerFixed();
		animateItem();
	});

    function headerFixed() {
       if ($(window).scrollTop() >= $('.full-height-slider').height() - 138) {
		    $('header').addClass('fixed');
		}else{
            $('header').removeClass('fixed');
        }
    }

    function headerScroll() {
       if ($(window).scrollTop() >= $('.header').height()) {
		   $('header').addClass('scrol');
		}else{
		   $('header').removeClass('scrol');
		}
    }

    $('.up-button').on('click', function(){
		$('body, html').animate({'scrollTop':'0'});
		   return false;
	});

	function animateItem(){
	   if ($('.item-animation').length) {
		 $('.item-animation').not('.animated').each(function(){
		  if($(window).scrollTop() >= $(this).offset().top - ($(window).height()*1.1))
		   {$(this).addClass('animated');}});
		}
	}

    /*============================*/
	/* 06 - ISOTOPE */
	/*============================*/

    function izotopInit() {
	  if ($('.izotope-container').length) {
	    let $container = $('.izotope-container');
			$container.isotope({
			itemSelector: '.item',
			layoutMode: 'masonry',
			masonry: {
			  columnWidth: '.grid-sizer'
			}
		  });
			$('.filter-list li').click(function() {
			  $('.izotope-container').each(function(){
				 $(this).find('.item').removeClass('animated');
			  });
				 $('.filter-list li').removeClass('active');
				 $(this).addClass('active');
				   let filterValue = $(this).attr('data-filter');
					$container.isotope({filter: filterValue});
			});
	  }
	}


    /*============================*/
	/* 07 - GOOGLE MAP */
	/*============================*/

    let marker = [], infowindow = [], map, image = $('.map-wrapper').attr('data-marker');

     function addMarker(location,name,contentstr){
        marker[name] = new google.maps.Marker({
            position: location,
            map: map,
			icon: image
        });
        marker[name].setMap(map);

		infowindow[name] = new google.maps.InfoWindow({
			content:contentstr
		});

		google.maps.event.addListener(marker[name], 'click', function() {
			infowindow[name].open(map,marker[name]);
		});
     }

	 function initialize() {

		let lat = $('#map-canvas').attr("data-lat");
		let lng = $('#map-canvas').attr("data-lng");
		let mapStyle = $('#map-canvas').attr("data-style");

		let myLatlng = new google.maps.LatLng(lat,lng);

		let setZoom = parseInt($('#map-canvas').attr("data-zoom"),10);

		let styles = "";

		if (mapStyle=="1"){
			styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
		}
		let styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

        let draggMap;
        if (!_ismobile) {
           draggMap = true;
        }else{
           draggMap = false;
        }

		let mapOptions = {
			zoom: setZoom,
			disableDefaultUI: false,
			scrollwheel: false,
			zoomControl: true,
			streetViewControl: true,
			center: myLatlng,
            draggable: draggMap
		};
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');


		$('.addresses-block a').each(function(){
			let mark_lat = $(this).attr('data-lat');
			let mark_lng = $(this).attr('data-lng');
			let this_index = $('.addresses-block a').index(this);
			let mark_name = 'template_marker_'+this_index;
			let mark_locat = new google.maps.LatLng(mark_lat, mark_lng);
			let mark_str = $(this).attr('data-string');
			addMarker(mark_locat,mark_name,mark_str);
		});
	 }

    /*============================*/
	/* 08 - VIDEO YOUTUBE - VIMEO */
	/*============================*/

	$(document).on('click', '.play-button', function(){
	   let videoLink = $(this).attr('data-video'),
		   thisAppend = $(this).closest('.video-open').find('.video-iframe');
		   $(this).closest('.video-open').find('.video-item').addClass('act');
           $('.video-open').addClass('over');
		   $('<iframe>').attr('src', videoLink).appendTo(thisAppend);
		return false;
	});

	$(document).on('click', '.close-video', function(){
		let videoClose = $(this).parent().find('.video-iframe');
	     $(this).closest('.video-open').find('.video-item').removeClass('act');
         $('.video-open').removeClass('over');
		  videoClose.find('iframe').remove();
		  return false;
	});

    /*============================*/
	/* 09 - ACCORDEON  */
	/*============================*/

	$('.accordeon-triger').on('click', function(){
		let $this = $(this),
			item = $this.closest('.accordeon-item'),
			list = $this.closest('.accordeon-list'),
			items = list.find('.accordeon-item'),
			content = item.find('.accordeon-inner'),
			otherContent = list.find('.accordeon-inner'),
			times = 300;
		if (!item.hasClass('active')){
		   items.removeClass('active');
		   item.addClass('active');
		   otherContent.stop(true, true).slideUp(times);
		   content.stop(true, true).slideDown(times);
		}else{
		   item.removeClass('active');
		   content.stop(true, true).slideUp(times);
		}
        return false;
	});

    /*============================*/
	/* 10 - CLICK AND HOVER  */
	/*============================*/

    $('.like-item').on('click', function(){
        $(this).toggleClass('active');
    });

    $(document).on('click', '.custom-input-number .cin-increment', function(e) {
         let $input = $(this).siblings('.cin-input'),
            val = parseInt($input.val()),
            max = parseInt($input.attr('max')),
            step = parseInt($input.attr('step'));
         let temp = val + step;
        $input.val(temp <= max ? temp : max);
    });
    $(document).on('click', '.custom-input-number .cin-decrement', function(e) {
        let $input = $(this).siblings('.cin-input'),
            val = parseInt($input.val()),
            min = parseInt($input.attr('min')),
            step = parseInt($input.attr('step'));
        let temp = val - step;
        $input.val(temp >= min ? temp : min);
    });

    $('.open-popup').on('click', function(){
       let indexPopup = $(this).attr('data-open');
        $('.index-'+indexPopup).addClass('active');
        $('body').addClass('overflow');
        return false;
    });

    $('.close-popup').on('click', function(){
        $('.popup').removeClass('active');
        $('body').removeClass('overflow');
    });

    $('.close-item').on('click', function(){
       $(this).parent().remove();
    });

    $('.shop-icon').on('click', function(){
        $('.shop-card-list').toggleClass('active');
    });

    $('.close-card-mobile').on('click', function(){
        $('.shop-card-list').removeClass('active');
    });

	$('.select-open').on('click', function(){
	  	$(this).toggleClass('active').next().slideToggle();
	});

    if ($(window).width() < 992){
		$('.mobile-select ul li').on('click', function(){
			$(this).closest('.mobile-select').find('.select-open .txt').text($(this).text());
			   $(this).closest('.mobile-select').find('.select-open').removeClass('active');
			    $(this).closest('.mobile-select').find('ul').slideUp(300);
			return false;
		});
	}



    /*============================*/
	/* 11 - SLIDER RANGE  */
	/*============================*/
    $('.slider-range').each(function(index) {
     	let counter = $(this).data('counter');
     	let position = $(this).data('position');
     	let from = parseInt($(this).data('from'),10);
     	let to = parseInt($(this).data('to'),10);
     	let min = parseInt($(this).data('min'),10);
     	let max = parseInt($(this).data('max'),10);
     	$(this).find('.range').attr('id','slider-range-'+index);
     	$(this).find('.amount-start').attr('id','amount-start-'+index);
     	$(this).find('.amount-end').attr('id','amount-end-'+index);
	  	$('#slider-range-'+index).slider({
			range: true,
			min: min,
			max: max,
			values: [ from , to ],
			slide: function( event, ui ) {
				console.log(document.getElementById('min-price'))
				document.getElementById('min-price').value = ui.values[ 0 ]
				document.getElementById('max-price').value = ui.values[ 1 ]
				let fromStr = ui.values[ 0 ].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

				fromStr = fromStr.substr(0, fromStr.length - 3) + 'đ'

				let toStr = ui.values[ 1 ].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

				toStr = toStr.substr(0, toStr.length - 3) + 'đ'

				$('#amount-start-'+index).text(fromStr);
				$('#amount-end-'+index).text(toStr);
			}
	    });
		$('#amount-start-'+index).text('0đ');
		$('#amount-end-'+index).text('1.000.000đ');
    });

    /*============================*/
	/* 12 - COLORPICKER  */
	/*============================*/

    $('.piker-open').on('click', function(){
        $('.color-piker').toggleClass('active');
    });

    /*============================*/
	/* 13 - TIMER */
	/*============================*/
    function initCounter(){
          if(!$('.countdown').length) return false;
          $('.countdown').not('.initialized').each(function(){
                   $(this).addClass('initialized').ClassyCountdown({
                       end: $.now() + parseInt($(this).data('end')),
                       labels: true,
                       style: {
                           element: "",
                           days: {
                                gauge: {
                                    thickness: $(this).data('line'),
                                    fgColor: $(this).data('fgcolor'),
                                    bgColor: $(this).data('bgcolor')
                                }
                            },
                            hours: {
                                gauge: {
                                    thickness: $(this).data('line'),
                                    fgColor: $(this).data('fgcolor'),
                                    bgColor: $(this).data('bgcolor')
                                }
                            },
                            minutes: {
                                gauge: {
                                    thickness: $(this).data('line'),
                                    fgColor: $(this).data('fgcolor'),
                                    bgColor: $(this).data('bgcolor')
                                }
                            },
                            seconds: {
                                gauge: {
                                    thickness: $(this).data('line'),
                                    fgColor: $(this).data('fgcolor'),
                                    bgColor: $(this).data('bgcolor')
                                }
                            }
                       }
            });
        });
     }
     initCounter();

    /*============================*/
	/* 14 - TABS*/
	/*============================*/
    $('.item-tabs li').on('click', function(){
        let indexSlTab = $('.item-tabs li').index(this);
         $('.item-tabs li').removeClass('active');
         $(this).addClass('active');
         $('.tab-container-item').fadeOut(200).removeClass('active');
         $('.tab-container-item').eq(indexSlTab).fadeIn(200).addClass('active');
            if ($('.tab-container-item').eq(indexSlTab).find('.swiper-container').length){
                setTimeout(function(){
                   initSwiper();
                },100);
            }
        return false;
    });

	/*============================*/
	/* 15 - COPLE SWIPER  */
	/*============================*/
	$('.controlTopSwiper').on('click', function(){
        let index = $(this).closest('.swiper-container').find('.swiper-slide').index($(this).parent());
        swipers['swiper-'+$(this).closest('.swipers-wrapper').find('.swiper-control-top').attr('id')].slideTo(index);
    });

	/*============================*/
	/* 16 - CHECKOUT  */
	/*============================*/
	$('.delivery').on('click', function(e){
		let $input = $(this).find('input');
		$(this).parent().find('.delivery-form').slideToggle(350);
		if($input.is( ":checked")){
			$input.prop( "checked", false );
		}
		else{
			$input.prop( "checked", true );
		}
		e.preventDefault();
	});

	/*============================*/
	/* 17 - SHOP MENU FILTER  */
	/*============================*/
    $('.filter-open').on('click', function(){
        $('.menu-filter').toggleClass('active');
    });

    $('.close-filter').on('click', function(){
        $('.menu-filter').removeClass('active');
    });

	/*============================*/
	/* 18 - CHOOSE ANIMATION  	*/
	/*============================*/
	$('.choose-animation input').on('change', function(e){
		let $value = $('input[name=1]:checked').val();
		if($value == "animation"){
			$('body').removeClass('no-animated');
		}
		else{
			$('body').addClass('no-animated');
		}
		e.preventDefault();
	});
                    
});