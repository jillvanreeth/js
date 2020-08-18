;var scrollSpy = (function(w, d, $, undefined) {

    'use strict';

    var timer,
        s = {},
        els = {},
        body = $(d.body),

        timeOut = function() {
            
            if(!$('._scrollSpy__trigger').length) { return false; }

            // define elements
            els.scrollSpyWrap = $('._scrollSpy__wrap');
            els.scrollSpyTrigger = $('._scrollSpy__trigger');

            clearTimeout(timer);

            setTimeout(function(){ init(); }, 200);

        },

         init = function() {

            // define settings
            s.sticky = '_scrollSpy_is_sticky';

            // define elements
            els.scrollSpyWrap = $('._scrollSpy__wrap');
            els.scrollSpyTrigger = $('._scrollSpy__trigger');
            els.scrollSpyTarget = els.scrollSpyTrigger.find('._scrollSpy__target');

            if(mq.theSize() != 'xs') { els.scrollSpyTarget.removeClass('_scrollSpy_is_sticky'); }

            if(!els.scrollSpyTrigger.length) { return false; }

            // define more settings
            s.offsetTop = els.scrollSpyWrap.offset().top;

            checkOffset();
        },

         checkOffset = function() {

            // settings trigger
            var offsetTop = els.scrollSpyTrigger.offset().top,
                theHeight = 80,
                scrollOffset = $(w).scrollTop();   
                
            // get max offset
            var wrap = els.scrollSpyWrap,
                wrapOffset = wrap.offset().top,
                wrapHeight = wrap.outerHeight(true),
                bottomOffset = wrapOffset + wrapHeight;
          
            // scrollspy desktop mode
            if(mq.theSize() != 'xs') {
                
                // let the scrollspy follow the window
                if(scrollOffset >= s.offsetTop && scrollOffset < (bottomOffset - theHeight) - 20) {
                   // console.log('scroll');
                    els.scrollSpyTrigger.stop().animate({
                        top: (scrollOffset - s.offsetTop) + 20
                    }, 300);
                   
                }
                // stop the scrollspy and place at bottom
                else if(scrollOffset > s.offsetTop && scrollOffset >= (wrapHeight - theHeight)) {
                   // console.log('stop');
                    els.scrollSpyTrigger.stop().animate({
                        top: (wrapHeight - theHeight) -10
                    }, 300);

                    return false;
                }
                else {
                    //console.log('top');
                // position scrollspy back to top
                   els.scrollSpyTrigger.stop().animate( {
                        top: 0 
                    }, 300); 
                }
            }
            //scrollspy mobile mode
            else {

                (scrollOffset - 25) > offsetTop ? els.scrollSpyTarget.addClass(s.sticky) : els.scrollSpyTarget.removeClass(s.sticky);
            }

        },

        reset = function() {

             if(!$('._scrollSpy__trigger').length) { return false; }

            $('._scrollSpy__target').removeClass('_scrollSpy_is_sticky');
            s.offsetTop = els.scrollSpyTrigger.offset().top;
            els.scrollSpyTrigger.css('top', 0);

        };

        w.addEventListener('load', init);
        w.addEventListener('scroll', timeOut);
        w.addEventListener('resize', reset);

    return {};

}(window, window.document, window.jQuery));
