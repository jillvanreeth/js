// A TABLE THAT TURNS INTO SOMETHING MORE MOBILE FRIENDLY

var responsiveTable = (function(w, d, undefined) {

  'use strict';

  var s = {
        selectors: {
          theWrap: '.responsiveTable',
          theTable: 'table',
          theWindowWidth: w.innerWidth,
        },
        classes: {
          isVisible: 'is-visible',
        },
        timer: null
      },
      els = {},
      init = function() {

        // define elements
        els.theWrap = d.querySelectorAll(s.selectors.theWrap);

        // no element
        if(!els.theWrap) { return; }
       
        // do stuff on init
        checkViewPort();
        getContent();

        // bind events
        w.addEventListener('resize', resizeIt);

      },

      resizeIt = function() {
        
        clearTimeout(s.timer);
        s.timer = setTimeout(function() {

          if(s.selectors.theWindowWidth === w.innerWidth) { return; }

          s.selectors.theWindowWidth = w.innerWidth;

          checkViewPort();

        }, 300);

      },

      checkViewPort = function() {  
       
        // get data when
        Array.prototype.slice.call(els.theWrap).forEach(function(theTarget) {

          var when = theTarget.dataset.when;
        
          when.length && ~~when >= s.selectors.theWindowWidth ? theTarget.classList.add(s.classes.isVisible) : theTarget.classList.remove(s.classes.isVisible);

        });

      },

      getContent = function() {

        Array.prototype.slice.call(els.theWrap).forEach(function(theTarget) {

          var divTable;
          var ths = [];

          // get the table headers
          Array.prototype.slice.call(theTarget.querySelectorAll('thead th')).forEach(function(theHeader) {
            theHeader.innerHTML.length && ths.push(theHeader.innerHTML);
          });

          // open the table
          divTable = '<div class="responsiveTable__table">';

          // get the table rows
          Array.prototype.slice.call(theTarget.querySelectorAll('tbody tr')).forEach(function(theRow) {
            
            // build table for each tr
            divTable += '<div class="responsiveTable__table__inner">';

            // build header for each first td
            divTable += '<div class="responsiveTable__thead"><span class="responsiveTable__theader">' + theRow.firstElementChild.innerHTML + '</span></div>';

            // build tbody
            divTable += '<div class="responsiveTable__tbody">';

            // get all the tds
            var tds = [];
            tds.push(theRow.querySelectorAll('td'));
            
            // convert nodelist to array
            var tdsArray = Array.prototype.slice.call(tds[0]);
            
            // remove the first td
            tdsArray.splice(0,1);
            
            // add the tds to each row
            for(var i = 0; i < tdsArray.length; i++) {
              divTable += '<div class="responsiveTable__trow">';
              divTable += '<span class="responsiveTable__td">' + ths[i] + '</span>';
              divTable += '<span class="responsiveTable__td">' + tdsArray[i].innerHTML + '</span>';
              divTable += '</div>';
            }

            // close the table
            divTable += '</div></div>';

          });
        
          // append the divTable
          theTarget.innerHTML += divTable;

        });

      };

  return {
    init: init
  };

} (window, window.document));