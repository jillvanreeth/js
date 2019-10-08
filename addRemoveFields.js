var addRemoveFields = (function(w, d, $) {

	'use strict';

	var s = {},
		els = {},
		init = function() {

			//bind events
			bindTriggers();

		},

		addIt = function() {

			var currentTrigger = currentTrigger != undefined ? currentTrigger : $(this),
				theParent = currentTrigger.parents('._addRemoveFields__group'),
				theCode = theParent.find('._addRemoveFields__code:last'),
				counter = theCode.find('._addRemoveFields__counter');

			var copy = theCode.clone(true);

			// add delete button
			//copy.append('<div class="vab__input__delete _trigger__remove">-</div>');

			// remove copied error and oke classes
			copy.find('.vab__error').removeClass('vab__error');
			copy.find('._has_value').removeClass('_has_value');

			// remove datepickers
			copy.find('._datepicker__trigger').datepicker('destroy');
			copy.find('._datepicker__trigger').removeClass('hasDatepicker').removeAttr('id');

			// find text that needs to be updated
			if($('._addRemoveFields__counter').length) { 
				var updatedCount = parseInt(copy.find('._addRemoveFields__counter')[0].innerText) + 1; 
				copy.find('._addRemoveFields__counter')[0].innerText = updatedCount;
			}
			
			// find name attr that needs to be updated
			var names = copy.find('[name]');
			
			for(var i = 0; i < names.length; i ++) {

				var name = names[i].name.split('-').reverse();
				name[0] = parseInt(name[0]) + 1;
				
				var newName = name.reverse().join('-');	

				//names.value = newName;
				names[i].name = newName;
			}
		
			var theHtml = copy[0].outerHTML;
			
			// add item
			$(theHtml).insertAfter(theCode);

			// bind new element
			bindTriggers();

			// bind other scripts
			forms.length && forms.init();
			inputs.length && inputs.init();
			funnelMultipakketCalculator.length && funnelMultipakketCalculator.init();

		},

		bindTriggers = function() {

			els.adder = $('._addRemoveFields__trigger__add');
			els.remover = $('._addRemoveFields__trigger__remove');

			els.adder.off('click').on('click', addIt);
			els.remover.off('click').on('click', removeIt);

		},

		removeIt = function(){

			var currentTrigger = $(this),
				theParent = currentTrigger.parents('._addRemoveFields__code');

			if($('._addRemoveFields__code').length <= 1) { return false; }

			theParent.remove();

			funnelMultipakketCalculator.length && funnelCalculator.init();

		};

		w.addEventListener('load', init);

	return {};

}(window, window.document, window.jQuery));


