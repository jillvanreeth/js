// A SLIDER THAT, DRAGS, SWIPES AND SCROLLS

;var draggslider = (function(w, d, undefined) {

  'use strict';

  var s = {
    debug: false,
      selectors: {
        theWrap: '.draggslider',
        theSlider: '.draggslider__itemWrap',
        theItems: '.draggslider__item',
        progressBar: '.draggslider__bar',
      },
      classes: {
        active: 'draggslider-is-active',
        isHidden: 'bar-is-hidden',
      },
      settings: {
        isDown: false,
        startX: 0,
        scrollLeft: 0,
      },
    },
    timer,
    els = {},

    timeout = function() {

      clearTimeout(timer);
      setTimeout(function(){
        calcBar();
      }, 300); 

    },

    init = function() {

      if(!d.querySelectorAll(s.selectors.theWrap).length) { return false; }
      s.debug && console.log('DRAGGSLIDER INIT');

      // define elements
      els.theWrap = d.querySelectorAll(s.selectors.theWrap);
      els.theSlider = d.querySelectorAll(s.selectors.theSlider);
      els.progressBar = d.querySelectorAll(s.selectors.progressBar);

      // do stuff on init
      calcBar();

      // no dragging on mobile
      if(getWindowSize.theSize() == 'small' && !els.theWrap[0].parentNode.classList.contains('sliderSwitch')) { return false; } 
      
      // bind events
      w.addEventListener('resize', timeout);

      Array.prototype.slice.call(els.theSlider).forEach(function(theSlider) {
        // MOUSE UP
        theSlider.addEventListener('mouseup', inactiveState);
        
        // MOUSE LEAVE
        theSlider.addEventListener('mouseleave', inactiveState);

        // ON SCROLL
        theSlider.onscroll = function(e) { moveBar(e.target); }

        // MOUSE DOWN
        theSlider.addEventListener('mousedown', function(e) {

          s.debug && console.log('DRAGGSLIDER: MOUSE DOWN');

          activeState(theSlider);

          s.settings.startX = e.pageX - theSlider.offsetLeft;
          s.settings.scrollLeft = theSlider.scrollLeft;
        });

        // MOUSE MOVE
        theSlider.addEventListener('mousemove', function(e) {  
         
          if(!s.settings.isDown) return; // prevent scrolling when hovering over the slider
          
          s.debug && console.log('DRAGGSLIDER: MOUSE MOVE', e);

          e.preventDefault();
               
          var x = e.pageX - theSlider.offsetLeft;
          var walk = (x - s.settings.startX) * 3; //scroll-fast
           
          theSlider.scrollLeft = s.settings.scrollLeft - walk;

          moveBar(e.target.offsetParent);
        });

      });
     
    },

    inactiveState = function() {

      s.debug && console.log('DRAGGSLIDER: INACTVE STATE',this);
      
      s.settings.isDown = false;
      this.classList.remove(s.classes.active);
    },

    activeState = function(theSlider) {

      s.debug && console.log('DRAGGSLIDER: ACTVE STATE');

      s.settings.isDown = true;
      theSlider.classList.add(s.classes.active);
    },

    calcBar = function() {

      
      Array.prototype.slice.call(els.progressBar).forEach(function(progressBar) {
  
        // get parent 
        var theParent = progressBar.parentNode;

        // get the items
        var theItems = theParent.querySelectorAll(s.selectors.theItems);
       
        if(theItems.length <= 2 && getWindowSize.theSize() !== 'small' && getWindowSize.theSize() !== 'medium' ) {
          theParent.classList.add(s.classes.isHidden);
          return false;
        }
        
        // get params for width calc
        var itemWidth = theItems[0].clientWidth;
        var numSlides = theItems.length;
        var barWidth = progressBar.clientWidth;
  
        progressBar.firstElementChild.style.width = ((barWidth / numSlides) * (barWidth / itemWidth)) + 'px';
      });
    },

    moveBar = function(target) {
      
      if(!target) { return false; }

      var theOffset = target.scrollLeft;
      var theParent = target.parentNode.parentNode;
      var progressBar = theParent.querySelector(s.selectors.progressBar);
      
      // get max left pos
      var maxLeftPos = progressBar.clientWidth - progressBar.firstElementChild.clientWidth;
  
      maxLeftPos > theOffset && (progressBar.firstElementChild.style.left = (theOffset * 1.5) + 'px');
       
    };
  
  return {
    init: init,
  };


}(window, window.document));

export { draggslider };