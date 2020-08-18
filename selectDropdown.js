// FAKE DROPDOWN FOR NATIVE SELECT MENU'S

;var selectDropdown = (function(w, d, undefined) {

  'use strict';

  var s = {
    debug: true,
      selectors: {
        theWrap: '.selectDropdown',
        theTrigger: '.selectDropdown__selectedOption',
        theTarget: '.selectDropdown__select',
        theItems: '.selectDropdown__option',
        symbol: '.selectDropdown__symbol',
        theHiddenInput: 'input[name="subject"]',
      },
      classes: {
        open: 'selectDropdown-is-open',
        selected: 'selectDropdown-is-selected',
        hasValue: 'has-value',
        isInvalid: 'is-invalid',
      },
    },
    els = {},

    init = function() {

        if(!d.querySelectorAll(s.selectors.theWrap).length) { return false; }

        // define elements
        els.theWrap = d.querySelector(s.selectors.theWrap);
        els.theTrigger = d.querySelectorAll(s.selectors.theTrigger);
        els.theTargets = d.querySelectorAll(s.selectors.theTargets);
        els.theItems = d.querySelectorAll(s.selectors.theItems);        
        els.theHiddenInput = d.querySelector(s.selectors.theHiddenInput);

        // get the trigger
        Array.prototype.slice.call(els.theTrigger).forEach(function(theTrigger) {
          
          // bind events
          theTrigger.addEventListener('click', function(e) {
            var currentTrigger = this;
            var theParent = getParent(currentTrigger);
            toggleIt(theParent);
          });
        });

        // get the targets
        Array.prototype.slice.call(els.theItems).forEach(function(theItem) {

          // bind events
          theItem.addEventListener('click', function(e) {
            var currentItem = this;
            swapIt(currentItem);
          });
        });
    },

    swapIt = function(theItem) {
     
        // reset it
      resetClasses();

      var currentItem = theItem;
      var theParent = getParent(currentItem);
     
      // get the trigger / placeholder
      var thePlaceholder = theParent.querySelectorAll(s.selectors.theTrigger)[0].children[1];

      // swap the contents
      thePlaceholder.innerHTML = currentItem.innerHTML;

      // set the input type hidden
      els.theHiddenInput.value = currentItem.innerHTML;
      
      // hide the selected item
      currentItem.classList.add(s.classes.selected);
      
      els.theWrap.classList.add(s.classes.hasValue); 
      els.theWrap.classList.remove(s.classes.isInvalid);

      // close the menu
      toggleIt(theParent);

    },

    toggleIt = function(theParent) {
     
      // toggle it
      theParent.classList.toggle(s.classes.open);

    },

    getParent = function(theChild) {
   
      //define variables
      var theParents,
          theParentElement;

      // no params
      if(!theChild || !s.selectors.theWrap) { console.error('Missing arguments!'); return false; }

      // If no parentSelector defined will bubble up all the way to *document*
      theParents    = d.querySelectorAll(s.selectors.theWrap);
      theParents    = theParents.length ? Array.prototype.slice.call(theParents) : [];
      theParentElement = theChild.parentElement;

      // no parentElement
      if(!theParentElement) { return false; }

      // loop as long as the element is not the body or the element is not in the nodelist
      while(theParentElement && theParentElement !== d.body && theParents.indexOf(theParentElement) === -1) {
          theParentElement = theParentElement.parentElement;
      }

      return theParentElement || false;
    },

    resetClasses = function() {

      Array.prototype.slice.call(els.theItems).forEach(function(theItem) {
        theItem.classList.remove(s.classes.selected);
      });

    };

  return {
    init: init
  } 

}(window, window.document));

export { selectDropdown };