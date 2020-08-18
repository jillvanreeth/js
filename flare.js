// CURSOS ANIMATION

;var flare = (function(w, d, undefined) {

  'use strict';

  var s = {
    debug: false,
      selectors: {
        theFlare: '.flareWrap.animate',
      },
      classes: {},
      settings: {
        animation: false,
      },
    },  
    els = {},

    init = function() {


      if(!d.querySelectorAll(s.selectors.theFlare).length) { return false; }
      s.debug && console.log('FLARE INIT');

      // define elements
      els.theFlares = d.querySelectorAll(s.selectors.theFlare);
      els.activeFlare = {};
      
      if(getWindowSize.theSize() == 'medium' || getWindowSize.theSize() == 'small') { return false; }

      // add the flares
      Array.prototype.slice.call(els.theFlares).forEach(function(theFlare) {
        var theParent = theFlare.parentNode;
        
         const intersectionObserver = new IntersectionObserver((entries, observer) => {
          Array.prototype.slice.call(entries).forEach((entry) => {
            if(entry.isIntersecting) {
              els.activeFlare = {
                animation: true,
                theElement: theFlare
              };
              
              animateIt();
            
             s.debug && console.log('FLARE:', entry.target, 'parent intersecting');
            
            }
            else {
            	// kill the animation
              theFlare.innerHTML = '';
           
              s.debug && console.log('FLARE:', entry.target, 'parent is NOT intersecting');
            }
          });
        }, {rootMargin: '0px'});

        intersectionObserver.observe(theParent);
      });

     },

    animateIt = function() { 
   
      var cb = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000)};

      function animate() {
        if(!els.activeFlare.animation) { return false; }
        s.debug && console.log('FLARE: ANIMATE');
        draw();
         
        requestAnimationFrame(animate);
      }
     
      if(els.activeFlare.animation) { cb(animate); }

      var dots = [],
          mouse = {
            x: 0,
            y: 0
          };

      var Dot = function() {
        this.x = 0;
        this.y = 0;
        this.node = (function(){
          var n = document.createElement("div");
          n.className = "flare";
          els.activeFlare.theElement.appendChild(n);
          return n;
        }());
      };
    
      Dot.prototype.draw = function() {
        this.node.style.left = this.x + "px";
        this.node.style.top = this.y + "px";
      };
     
      for (var i = 0; i < 4; i++) {
        var d = new Dot();
        dots.push(d);
      }

      function draw() { 
       
        var parentTop = els.activeFlare.theElement.getBoundingClientRect().top;
        var x = mouse.x,
            y = mouse.y - (w.pageYOffset + parentTop);
        
        Array.prototype.slice.call(dots).forEach(function(dot, index, dots) {
          var nextDot = dots[index + 1] || dots[0];
          
          dot.x = x;
          dot.y = y;
          dot.draw();
          x += (nextDot.x - dot.x) * .8;
          y += (nextDot.y - dot.y) * .8;
        });
      }

      addEventListener("mousemove", function(event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
      });


    };

  return {
    init: init,
  };


}(window, window.document));

export { flare };