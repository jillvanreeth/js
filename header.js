;var header = (function(w, d, undefined) {

  'use strict';

  var s = {
      selectors: {
        theWrap: '.header',
        theTrigger: '.header__menuIcon',
        theInner: '.header__inner',
      },
      classes: {
        open: 'open',
        overflow: 'overflow-is-hidden',
        sticky: 'sticky',
      }
    },
    els = {},

    init = function() {

      if(!d.querySelectorAll(s.selectors.theWrap).length) { return false; }

      // define elements
      els.theWrap = d.querySelectorAll(s.selectors.theWrap)[0];
      els.theTrigger = d.querySelectorAll(s.selectors.theTrigger)[0];

      // bind events
      els.theTrigger.addEventListener('click', toggleMenu);

      w.addEventListener('scroll', makeItSticky);
      
    },

    makeItSticky = function() {

      var scrollOffset = w.scrollY;
      var windowHeight = w.innerHeight;

      scrollOffset >= (windowHeight / 1.5) ? els.theWrap.classList.add(s.classes.sticky) : els.theWrap.classList.remove(s.classes.sticky);
      
    },

    toggleMenu = function() {

     els.theWrap.classList.contains(s.classes.open) ? closeMenu() : openMenu();
            
    },

    closeMenu = function(cb) {

      if(els.theWrap.classList.contains(s.classes.open)) {

        els.theWrap.classList.remove(s.classes.open);
        d.getElementById('theBody').classList.remove(s.classes.overflow);
        d.body.classList.remove(s.classes.overflow);
  
        
        // callback for when header menu is opened
        if(cb && typeof cb === 'function') {
          d.querySelector(s.selectors.theInner).addEventListener('transitionend', function eventCallback(){
            cb();

            d.querySelector(s.selectors.theInner).removeEventListener('transitionend', eventCallback);
          });
        }  
      }
      else {
        if(cb && typeof cb === 'function') {
          cb();  
        }  
      }

    },

    openMenu = function() {

      els.theWrap.classList.add(s.classes.open);
      d.getElementById('theBody').classList.add(s.classes.overflow);
      d.body.classList.add(s.classes.overflow);

    };

  return {
    init:init,
    closeHeader:closeMenu
  };

}(window, window.document));

