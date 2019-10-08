;var tableSlider = (function(w, d, $) {

	var s = {},
		els = {},
		timer,
		init = function() {

			//define elements
			els.controls = $('._tableSlider__trigger').find('[data-dir]');
			els.targets = $('._tableSlider__target');
			els.swiper = $('._tableSlider__swiper');
			els.titles = $('._tableSlider__title');

			els.slide = els.targets.find('li');

			if(!els.swiper.length) { return false; }

			checkHeights();

			if(mq.theSize() == 'xs' || mq.theSize() == 's') { slider(); }

		},

		checkHeights = function() {

			var titleHeight = 0;

			$(els.titles).css('height','').each(function() {

				var targetHeight = $(this).outerHeight();

				if(targetHeight > titleHeight) { titleHeight = targetHeight; }

			}).outerHeight(titleHeight);

			var slideData = [],
			contentHeight = [];

			// find all slides
			$(els.targets).each(function() {

				var slides = $(this).find('li');

				// check height of content
				$(slides).each(function() {

					// if content is too high
					if($(this).children().height() >= 50) {

						// store nr of slide
						slideData.push($(this).data('slide'));

						// store height of slide
						contentHeight.push($(this).children().height());

					}

				});

			});

			// loop again to set the new heights
			$(els.targets).each(function(index) {

				if(mq.theSize() == 'xs' || mq.theSize() == 's') {

					// get tallest height
					var tallest = Math.max.apply(Math,contentHeight);

					if(index > 0) {

						// set tallest height on list
						$(this).css('height', tallest + 10);
						// reset heights of items
						$(this).find('li').css('height', 'auto');
					}
				}

				else {

					for(var i = 0; i < slideData.length; i ++) {

						$(this).find('li').filter('[data-slide="' + slideData[i] + '"]').css('height', contentHeight[i] + 10);
					}
				}

			});
		}

		slider = function() {

			//check controls
			controllers();

			//position the slides
			positionTheSlides();

			//bind events
			els.controls.off('click').on('click', slideIt);

			els.swiper.swipe({

				swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
					els.swiper.swipe('enable');
					//$('.swipe').text(direction);
					slideIt(direction);
				},

				swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
					els.swiper.swipe('enable');
					//$('.swipe').text(direction);
					slideIt(direction);
				},

				swipeDown:function(event, direction, distance, duration, fingerCount, fingerData) {
					//$('.swipe').text(direction);
					els.swiper.swipe('disable');

				},

				swipeUp:function(event, direction, distance, duration, fingerCount, fingerData) {
					//$('.swipe').text(direction);
					els.swiper.swipe('disable');

				}

			});
		},

		timeout = function() {

			clearTimeout(timer);

			setTimeout(function(){

				//check if bp changed
				var newbp = mq.theSize();
				s.bp != newbp && resetSlider(newbp);
				s.bp = newbp;

				//enable slider
				els.swiper.swipe('enable');

			}, 500);

		},

		controllers = function(btn) {

			if(btn == undefined) {
				els.controls.removeClass('_is_disabled');
				els.controls.filter('[data-dir="-"]').addClass('_is_disabled');
				return false;
			}
			else if(btn.data('dir') == '+' && !els.activeSlide.next().next().length > 0 ) {

				btn.addClass('_is_disabled');
				return false;

			}
			else if(btn.data('dir') == '-' && !els.activeSlide.prev().prev().length > 0) {

				btn.addClass('_is_disabled');
				return false;
			}


		},

		positionTheSlides = function() {

			var offset = 0;

			//position all the slider
			$(els.targets).each(function() {

				var slides,
					theOffset = offset;

				//get slides
				slides = $(this).find('li');

				//calculate position of slides
				$(slides).each(function() {

					theOffset = theOffset;

					$(this).css({'position' : 'absolute', 'left' : theOffset + '%'});

					theOffset = theOffset + 100;
				});

			});
		},

		slideIt = function(swipeDirection) {

			var btn, direction;

			els.slide.stop( true, true );

			//get direction
			if(swipeDirection == 'left') {

				btn = els.controls.filter('[data-dir="+"]');
				direction = '+';
			}
			else if(swipeDirection == 'right') {

				btn = els.controls.filter('[data-dir="-"]');
				direction = '-';

			}
			else {

				btn = $(this);
				direction = btn.data('dir');
			}


			//get current active slide
			els.activeSlide = els.targets.find('._is_active');

			if(btn.hasClass('_is_disabled')) {

				/*var bp = mq.theBp();
				if(bp == 'mobile') {*/

					/*if(direction == '+' ) {	*/

					  	for (var i=1; i<=2; i++) {
							els.targets.animate({left: 15},100);
							els.targets.animate({left: 0},100);
						}

					/*}*/
				/*}*/

				return false;
			}

			els.controls.removeClass('_is_disabled');

			//get next slide
			els.nextSlide = els.activeSlide.next(els.slide);

			//get prev slide
			els.prevSlide = els.activeSlide.prev(els.slide);

			//get position of each slide and recalculate posistion
			$(els.slide).each(function() {

				els.activeSlide.removeClass('_is_active');

				var pos = $(this).get(0),
					leftPos = parseInt(pos.style.left),
					newPos;

				direction == '+' ? (newPos = leftPos - 100, els.nextSlide.addClass('_is_active')) : (newPos = leftPos + 100, els.prevSlide.addClass('_is_active'));

				$(this).animate({ 'left' : newPos + '%'}, 500);

			});

			//check controls
			controllers(btn);

		},

		resetSlider = function(newbp) {

			if(!$('._tableSlider__swiper').length) { return false; }

			$(els.slide).removeClass('_is_active');

			$(els.targets).each(function() {

				var slides = $(this).find('li');

				slides.first().addClass('_is_active');

			});

			if(mq.theSize() != 's' && mq.theSize() != 'xs') {
				$(els.slide).css({ 'position': 'static', 'height' : 50 });
				els.targets.css('height', 'auto');
				checkHeights();
			}
			else {
				$(els.slide).css({ 'position': 'absolute', 'height': 50 });
				slider();
				checkHeights();
			}

		}

	$(d).on('ready', init);
	$(w).resize(resetSlider);
	$(w).on('scroll',timeout);

}(window, window.document, window.jQuery));