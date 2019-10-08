;var circleNav = (function(w, d, $, undefined) {

    'use strict';

    var timer,
        s = {},
        els = {},
        body = $(d.body),
        timeOut = function() {
            
            if(!$('._circleNav__wrap').length) { return false; }

            clearTimeout(timer);

            setTimeout(function(){
              
                var newWidth = $(w).width();
              
                s.wWidth != newWidth && closeIt();
                
            }, 200);

        },
        init = function() {

            if(!$('._circleNav__wrap').length) { return false; }

            // get settings and elements
            define();

            // check url
            checkUrl();
            
            // bind events
            els.opener.on('click', toggleMenu);
            els.closer.on('click', toggleMenu);
            els.itemTrigger.on('click', showIt);

            draggable();

        },
        define = function() {

            // define settings
            s.wWidth = $(w).width();
            s.angle = 51.42857142857143;
            s.active = '_circleNav_is_active';
            s.animate = '_circleNav_is_animated';
            
            // define elements
            els.wrap = $('._circleNav__wrap');
            els.opener = $('._circleNav__opener');
            els.closer = $('._circleNav__closer');
            els.itemTrigger = $('._circleNav__itemTrigger');
            els.itemTarget = $('._circleNav__itemTarget');
            els.svg = $('._circleNav__svg');
        },

        toggleMenu = function(event) {

            if (!event) var event = window.event;
                
            event.stopPropagation();
            
            var open;
       
            !els.wrap.is(':visible') ? open = false : open = true;

            !open ? openIt() : closeIt();
            
        },
         
        openIt = function() {
           
            if(mq.theSize() == 'xs') {
                
                if(!els.opener.hasClass('scrollSpy_is_sticky')) {
                     $('html, body').stop().animate({
                        scrollTop: els.itemTarget.parents('.impacts').offset().top
                    }, 300);
                }

                positionWheel();
            
            } else {

                els.wrap.css({'top': '50%'});
                els.closer.css({'top': 0});
            }

            var tl = new TimelineLite();

                tl.to(els.wrap, 0, { display: 'block' });

                tl.set(els.itemTrigger, {transformOrigin: '-49 195' })
                tl.to(els.itemTrigger, 0.2, {scale:1, ease:Back.easeOut.config(4)}, 0.05);
               
                for(var i=0; i<els.itemTrigger.length; i++){
                  tl.to(els.itemTrigger[i], 0.7, {rotation:-i*s.angle + 'deg', ease:Bounce.easeOut}, 0.35);
                }

                // show close 
                tl.to(els.closer, .7, { display: 'block', scale: 1, ease:Back.easeIn }, 0.3);
               
                els.svg[0].style.pointerEvents = 'auto';

                els.wrap.addClass(s.animate);

        },

        closeIt = function() {
         
            var tl = new TimelineLite();
            
            for(var i=0; i<els.itemTrigger.length; i++){
              tl.to(els.itemTrigger[i], 0.3, {rotation: 0, ease:Circ.easeOut}, 0.05);
            }

            tl.to(els.closer, 0.5, { scale: 0, ease:Back.easeIn }, 0.3);
            
            tl.to(els.itemTrigger, .3, {scale:0, ease:Back.easeIn}, 0.3);

            // hide the pie
            tl.to(els.wrap, .3, { display: 'none' }, 0.3);
            
            els.svg[0].style.pointerEvents = 'none';

        },

        draggable = function() {
            
            var circle = Draggable.create(els.wrap, {
                type:'rotation', 
                throwProps: true,
                dragClickables: !0
            })[0];

            circle.addEventListener('drag', function() {
                console.log('drag');
                els.wrap.removeClass(s.animate);
            });

        },

        showIt = function(e) {
       
            e.preventDefault();

            // get impact data
            var impactData = $(this).data('circleImpact'),
                currentTarget = els.itemTarget.filter('#' + impactData),
                areaData = $('body').data('area');
            
                dataLayer.push({ 'event': 'dlExpansionWheelEvent', 'blork': areaData, 'blork2': impactData });

            if(currentTarget.is(':visible')) {
                return false;
            }
            else {

                var offsetTop = 80;

                if(mq.theSize() == 'xs') { offsetTop = 10; }

                els.itemTrigger.removeClass(s.active);
                els.itemTarget.slideUp(300).removeClass(s.active);
                
                $(this).addClass(s.active);
                currentTarget.slideDown(300);

                $('html, body').stop().animate({
                    scrollTop: els.itemTarget.parents('.impacts').offset().top
                }, 300);

                toggleMenu(e); 
                els.wrap.hide();
                els.closer.hide();

            }
        },

        checkUrl = function() {

            // check if hash is set
            var hash = window.location.hash.split('#')[1];

            if(!hash) { return false; }

            var currentTarget = els.itemTarget.filter('#' + hash);
            //console.log(currentTarget);
            if(!currentTarget.length) { return false; }

            if(currentTarget.is(':visible')) {
                console.log('visivle');
                return false;
            }
            else {

                els.itemTrigger.removeClass(s.active);
                els.itemTarget.slideUp(300).removeClass(s.active);
                
                els.itemTrigger.filter('[data-circle-impact="' + hash + '"]').addClass(s.active);
                currentTarget.slideDown(300);

                // rotate the wheel
                els.wrap.css('transform', 'matrix3d(0.890669, -0.454653, 0, 0, 0.454653, 0.890669, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');

                // check if mobile
                //if(mq.theSize() == 'xs') {
                    $('html, body').stop().animate({
                        scrollTop: currentTarget.offset().top - 10
                    }, 300);
                //} 
            }
        },

        positionWheel = function() {    
                           
            var offsetTop = els.opener.offset().top;
            
            els.wrap.css('top', offsetTop + 10);
            els.closer.css('top', offsetTop + 10 + (els.wrap.outerHeight(true) / 2));
    
        };

        w.addEventListener('load', init);
        w.addEventListener('resize', timeOut);
      
    return {};

}(window, window.document, window.jQuery));
