var updateCss;

$(function(){
  
       function convertHex(hex,opacity){
            hex = hex.toString().replace('#','');
            r = parseInt(hex.substring(0,2), 16);
            g = parseInt(hex.substring(2,4), 16);
            b = parseInt(hex.substring(4,6), 16);
            var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
            return result;
        };
    
        updateScheme = function(color){
            $('img.color-overlay').each(function () {
              this.src = changeIconColor(this, '#'+color, '1', this.naturalWidth, this.naturalHeight);
            });
            
            $('#dynamic-css').html('.page-style-5 .title,  .header-menu > li > ul li:hover > a,  .login-item a:hover,  .button-style-3:not(.type-2),  .button-style-4:not(.type-2),  .button-style-1.type-2,  .checkbox-entry-wrap .checkbox-entry input:checked + span p,  .page-navigation a:hover,  .copyright span a,  .link-hover:hover,  .f-twitt a,  .caption-inst a span, .link-hover-line:hover, .main-col, .button-style-1.type-4:hover,  .countdown-type .ClassyCountdown-value div, .page-color-style-1 .item-tabs li.active .link-hover-line, .page-color-style-6 .item-tabs li.active .link-hover-line, .checkbox-entry-wrap .checkbox-entry input:checked + .content-check .simple-text p, .page-color-style-6 .button-style-1.type-3, .blog-info li a:hover, .text-block-wrapp .title-blog:hover, .post-navigation .h5.color-2 a:hover, .popup .forgot a:hover, .popup .reg-now a:hover, .item-tabs li.active .link-hover-line {color: #'+color+'!important;}  .button-style-1:before,  .header-menu > li > a:before,  .header-style-2 .header-menu > li:before,  .header-style-2 .header-menu > li:after,  .shop-number,  .button-style-3:not(.type-2):before,  .button-style-3:not(.type-2):after,  .button-style-3:not(.type-2) i:after,  .button-style-3:not(.type-2) i:before,  .button-style-4:not(.type-2) i:before,  .button-style-4:not(.type-2) i:after,  .checkbox-entry i:before,  .subscribe-form:not(.form-type-2) .sub-submit,  .form-type-2 .sub-submit:hover,  .ui-slider .ui-slider-range,  .ui-slider .ui-slider-handle:before,  .link-hover-line:before, .page-style-1 .page-span-1:before, .page-style-1 .page-span-1:after, .page-style-1 .page-span-2:before, .page-style-1 .page-span-2:after,  .list-style-4 li:hover:before,  .page-span:before,  .page-span:after, .page-style-2 .simple-item-style-2.color-type-1, .swiper-container-horizontal> .swiper-pagination-2.swiper-pagination-bullets .swiper-pagination-bullet:after, .post-navigation .prev:hover:before, .post-navigation .next:hover:after, .item-tabs.type-2 li.active span, .item-tabs.type-2 li.active span:before, .item-tabs.type-2 li.active span:after, .item-tabs.type-2 li:hover span, .item-tabs.type-2 li:hover span:before, .item-tabs.type-2 li:hover span:after {background: #'+color+'!important;}  .follow a:hover path,  .search-open:hover path,  .close-search:hover path,  .submit-search:hover path,  .header .right-block .like-item.active path,  .header .right-block .like-item:hover path,  .page-navigation a:hover path,  .f-twitt path, .main-fill-col path, .main-fill-hover:hover path, .contact-icon path, .coming-address li path, .blog-info .icon a:hover path, .close-popup.type-2:hover path, .main-fill-col * {fill: #'+color+'!important;}  .button-style-4:not(.type-2):before,  .button-style-4:not(.type-2):after,  .button-style-1.type-2,  .checkbox-entry input:checked + span i,  .page-navigation a:before,  .ui-slider .ui-slider-handle,  .page-style-2 .simple-item-style-1.color-type-2,  .button-style-1.type-4:after,  .button-style-1.type-2:after, .cin-input.input-field:focus, .checkbox-entry-wrap .checkbox-entry .content-check:after, .focus, .sideBarSwiper .swiper-slide .content:after, .button-style-1.type-3:after, .subscribe-form .input-field:focus, .page-color-style-7 .focus, .input-field-icon .input-field:focus {border-color: #'+color+'!important;} .page-style-2 .testimonials-item .text:after {border-color: #'+color+' transparent transparent transparent!important;} .page-style-2 .testimonials-item .text:before {box-shadow: 0 0 0 20px #'+color+'!important;} @media (max-width: 480px) {.page-style-2 .testimonials-item .text:before {box-shadow: 0 0 0 10px #'+color+'!important;}}');

        };

        var changeIconColor = function (iconElement, color, alpha, width, height) {
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                context.drawImage(iconElement, 0, 0, width, height);
                context.globalCompositeOperation = "source-atop";
                context.globalAlpha = alpha;
                context.fillStyle = color;
                context.fillRect(0, 0, width, height);
                context.globalAlpha = 1.0;
                return canvas.toDataURL("image/png", 1);
         };


});