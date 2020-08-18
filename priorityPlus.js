// MENU FOR A LOT OF MENU ITEMS, IN CASE OF TOO MANY ITEMS, THE ITEMS GET HIDDEN UNDER A PLUS MENU ICON

;var priorityPlus = (function(w, d, $, undefined) {

    'use strict';

    var s = {},
        els = {},
        body = $(d.body),
        timer,
        timeout = function() {

            clearTimeout(timer);

            setTimeout(function() {
                 prioritize();

                // if mobile, empty the hidden items
                mq.theSize() == 'xs' && clearIt();

            }, 300);

        },

        init = function() {

            // define settings
            s.tracker = [];

            // define elements
            els.theWrap = $('._priorityPlus');
            els.trigger = $('._priorityPlus__trigger');
            els.visibles = $('._priorityPlus__visibles');

            if(!els.theWrap.length) { return false; }

            // run on init
            prioritize();

            //bind events
            els.trigger.off('click').on('click', toggleIt);
        },

        prioritize = function() {

            $(els.theWrap).each(function() {

                var currentTrigger = $(this).find(els.trigger),
                    hiddens = $(this).find('._priorityPlus__hiddens'),
                    // check if the trigger takes up space
                    outerSize = currentTrigger.parent().is(':first-child') ? $(this).width() - currentTrigger.outerWidth(true) : $(this).width();

                // check if outersize is still wide enough
                if(outerSize < 0) { return false; }

                // vars to store new sizes after items moved
                var newSize = 0,
                    afterSize = 0;

                // get width of all elements
                var innerSize = getSize($(this));

                //there's overflow
                if(innerSize > outerSize) {

                    //append last child into the hidden links menu
                    $(this).find(els.visibles).children().last().prependTo(hiddens);

                    //get new width
                    newSize = getSize($(this));

                    //store current width of visible items
                    s.tracker.push(newSize);

                    //show the trigger
                    currentTrigger.addClass('_priorityPlus_active');

                // there's enough space
                } else {

                    if(outerSize > s.tracker[s.tracker.length - 1]) {

                        // append item back to outer
                        hiddens.children().first().appendTo($(this).find(els.visibles));

                        //remove last size and return newest
                        s.tracker.pop();

                        // hide the trigger if hiddens empty
                        !hiddens.children().length && currentTrigger.removeClass('_priorityPlus_active');
                    }
                }

                // do it again if there's still overflow
               afterSize = getSize($(this)) > outerSize && prioritize();

            });
        },

        getSize = function(el) {

            var thesize = 0;

            $(el.find(els.visibles).children(':visible')).each(function() {
                thesize += $(this).outerWidth();
            });

            return thesize;
        },

        toggleIt = function() {

            // close other menus
            subMenu.subMenuReset();

            var currentTrigger = $(this),
                currentWrap = currentTrigger.parents('._priorityPlus');

                currentWrap.toggleClass('_priorityPlus__open');

            return false;
        },

        closeIt = function() {

            $('._priorityPlus').removeClass('_priorityPlus__open');
        },

        clearIt = function() {

             $(els.theWrap).each(function() {

                var hiddens = $(this).find('._priorityPlus__hiddens');

                // append item back to outer
                hiddens.children().appendTo($(this).find(els.visibles));

            });

        }

     w.addEventListener('load', init);
     w.addEventListener('resize', timeout);

    return {

        closeMenu: closeIt

    };

}(window, window.document, window.jQuery));