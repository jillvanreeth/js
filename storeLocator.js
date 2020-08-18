// STORE LOCATOR FOR GMAPS

;var storeLocator = (function(w, d, $) {

	var map = {
		s: {},
		els: {},
		init: function() {

			// if no map, pls leave
			if(!$('#_storeLocator__map').length) { return false; }

			// add Google maps api
			var script;
			script = document.createElement('script');
			script.setAttribute('async', true);
			script.setAttribute('defer', true);
			script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPqlpvupZDH3rVfIkzuxBH7-9GFEHvbpk&callback=storeLocator.setupMap&signed_in=false';
			document.getElementsByTagName('head')[0].appendChild(script);

			// define settings
			map.s.defLat = 50.85034;
			map.s.defLng = 4.469936;
			map.s.search = false;

			// define elements
			map.els.triggerSlider = $('._trigger__storeLocator__slider');
			map.els.targetSlider = $('._target__storeLocator__slider');
			map.els.triggerSliderMore = $('._trigger__storeLocator__slider__more');
			map.els.triggerSliderClose = $('._trigger__storeLocator__slider__close');
			map.els.resultsList = $('._storeLocator__results');
			map.els.zoom = $('._trigger__storeLocator__zoom');
			map.els.search = $('._trigger__storeLocator__search');

			map.els.markerCollection = [];

			// bind events
			map.els.zoom.off('click').on('click', map.zoomIt);
			map.els.search.on('submit', map.getFilters);
			map.els.triggerSlider.off('click').on('click', map.slideResults);

		},

		zoomIt: function() {

			// check if + or -
			var thisZoom = $(this).data('zoom');

			// get current zoom level
			var zoomLevel = map.els.storeLocator.getZoom();

			thisZoom == '-' ? map.els.storeLocator.setZoom(zoomLevel -1) : map.els.storeLocator.setZoom(zoomLevel +1);

		},

		getFilters: function() {

			map.s.search = false;

			// define form fields
			var theForm = $(this),
				location = theForm.find('input[type="text"]').val(),
				productTags = theForm.find('input[type="checkbox"]');

			// define filters
			var filters = {};

			// check for tags
			$(productTags).each(function() {
				if($(this).is(':checked')) {
					filters.productTags = [];
					filters.productTags.push($(this).val());
				}
			});

			// check location
			if(location != '' ) {

				// geocode it
				map.geoCodeIt(location, function(geoLocation) {
					filters.lat = geoLocation.lat();
					filters.lng = geoLocation.lng();

					map.s.search = true;

					// check after geocoder is finished - with lat & long
					!$.isEmptyObject(filters) && map.getMarkers(filters);
				});
			}
			else {

				map.s.search = true;

				// check after geocoder is finished - without lat & long
				!$.isEmptyObject(filters) && map.getMarkers(filters);
			}

			return false;

		},

		geoCodeIt: function(location, geoLocation) {

			var geocoder = new google.maps.Geocoder({
				map: map.els.storeLocator
			});

			if(typeof location != 'undefined' && location != null) {

		        geocoder.geocode( { address: location, }, function(results, status) {

		          if (status == google.maps.GeocoderStatus.OK) { geoLocation(results[0].geometry.location); }
		        });
		    }

		},

		setupMap: function() {

			// map options
			var options = {
			    center: new google.maps.LatLng(map.s.defLat, map.s.defLng),
			    zoom: 10,
			    scrollwheel: false,
			    zoomControl: false,
			    disableDefaultUI: true,
			};

			// get map
 			var theMap = document.getElementById('_storeLocator__map');

 			// define map
 			map.els.storeLocator = new google.maps.Map(theMap, options);

    		// get user location
    		map.getUserLocation(location);

		},

		getUserLocation: function(location, userLocation) {

			// get user location
    		navigator.geolocation && navigator.geolocation.getCurrentPosition(showPosition, hidePosition);


	        function showPosition(position) {

				myLocation = {
	              	lat: position.coords.latitude,
	              	lng: position.coords.longitude
	            };

		       	// get markers with user location
    			map.getMarkers(userLocation);
	        }

	        function hidePosition() {

	        	// get markers withouth user location
				map.getMarkers();
				  /*switch(error.code)
				    {
				    case error.PERMISSION_DENIED:
				      console.log("User denied the request for Geolocation.");

				      break;
				    case error.POSITION_UNAVAILABLE:
				      console.log("Location information is unavailable.");
				      break;
				    case error.TIMEOUT:
				      console.log("The request to get user location timed out.");
				      break;
				    case error.UNKNOWN_ERROR:
				      console.log("An unknown error occurred.");
				      break;
				    }*/
			}

		},

		getMarkers: function(data) {
			console.log('get markers');
			// check if location is provided
    		var url = data && data.lat ? '/resources/data/slrData.json?lat=' + data.lat + '&lng=' + data.lng : '/resources/data/slrData.json?lat=' + map.s.defLat + '&lng=' + map.s.defLat;

    		// check if products are chosen
    		data && data.productTags && url.concat('&tags=' + data.productTags);

    		$.ajax({
                dataType: 'json',
                url: url,
                type: 'GET',
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('REQUEST FAILED', XMLHttpRequest, textStatus, errorThrown);
                },

                success: function (data) {

                	// remove markers from map
					for (var i = 0; i < map.els.markerCollection.length; i++) {
			          	map.els.markerCollection[i].setMap(null);
			        }

                   	map.setMarkers(data.slrData);
                }

            });

    	},

    	setMarkers: function(data) {

    		// clear collection
			map.els.markerCollection = [];


    		var marker,
    			markerData = data,
    			bounds;

    		// get bounds
    		bounds = map.getNewBounds();

    		// data mapping
    		for(var i = 0; i < markerData.length; i++ ) {

    			var mapData = {
    				resultsIndex : i,
    				distance: markerData[i].distance,
    				store: markerData[i].store,
    				city: markerData[i].city,
    				address: markerData[i].address,
    				postal: markerData[i].postal,
    				phone: markerData[i].phone,
    				fax: markerData[i].fax,
    				products: markerData[i].products,
    				lat: markerData[i].lat,
    				lon: markerData[i].lon
    			};

    			// define LatLng
    			var loc = new google.maps.LatLng(parseFloat(mapData.lat), parseFloat(mapData.lon))

    			// define marker
    			marker = new google.maps.Marker({
	              	position: loc,
	              	resultsIndex : mapData.resultsIndex,
	             	map: map.els.storeLocator,
	             	icon: map.getIcon('normal'),
	              	animation: google.maps.Animation.DROP
	            });

		        // extend bounds each time a marker is added
		        bounds.extend(loc);

				// push marker to collection
            	map.els.markerCollection.push(marker);

            	// fill results
				map.fillResults(mapData);

				// bind marker events
				if(mq.theSize() != 'xs') {

					google.maps.event.addListener(marker, 'mouseover', function() { map.highlightResult(this, this.resultsIndex); });
					google.maps.event.addListener(marker, 'mouseout', function() { this.setIcon(map.getIcon('normal')); $('._storeLocator__result').removeClass('_is_hovered'); });
				}

				google.maps.event.addListener(marker, 'click', function() {

					if(mq.theSize() == 'xs') {

						// center map on marker a bit higher on mobile
						map.els.storeLocator.setCenter({lat: this.getPosition().lat() - 0.5, lng: this.getPosition().lng() });
					}

					else if(mq.theSize() == 'l' || mq.theSize() == 'm') {

						// center the map a bit more to the right on tablet
						map.els.storeLocator.setCenter({lat: this.getPosition().lat(), lng: this.getPosition().lng() - 0.5 });
					}
					else {
						// center map on marker
						map.els.storeLocator.setCenter(this.getPosition());
						console.log(this.getPosition());
					}

					// set markerclick true
					var markerClick = true;

					// slide results
					map.slideResults(markerClick, this, this.resultsIndex);

	    		});

    		}

			// set view
			map.setView(bounds);

    	},

    	animateIcons: function(index) {

    		var currentMarker;

    		// find matching marker
    		for (var i = 0; i < map.els.markerCollection.length; i ++ ) {

    			if(map.els.markerCollection[i].resultsIndex === index) {
    				currentMarker = map.els.markerCollection[i];
    			}
    		};

    		// set active icon
    		currentMarker.setIcon(map.getIcon('active'));

    		// bounce current marker
    		currentMarker.setAnimation(google.maps.Animation.BOUNCE);

    		if(mq.theSize() == 'l' || mq.theSize() == 'm' || mq.theSize() == 's') {

				// center the map a bit more to the right on tablet
				map.els.storeLocator.setCenter({lat: currentMarker.getPosition().lat(), lng: currentMarker.getPosition().lng() - 0.5 });
			} else {

				// center map to current marker
				map.els.storeLocator.setCenter(currentMarker.getPosition());
			}


    	},

    	getIcon: function(state) {

    		if(mq.theSize() != 'xs') {
    			var icon = {
	    			normal: '/resources/img/general/marker-normal.png',
    				active: '/resources/img/general/marker-active.png'
    			}
    		}
    		else {
    			var icon = {
	    			normal: '/resources/img/general/marker-normal-small.png',
    				active: '/resources/img/general/marker-active-small.png'
    			}
    		}

    		return icon[state];
    	},

    	fillResults: function(data) {

    		// define optional info
    		var distance = data.distance != undefined ? '<p class="vab__storeLocatorResult__distance vab__float--xs-right vab__fc--neutrals-1 vab__ff--special-1">' + data.distance + '</p>' : '';
			var products = data.products.join(', ');
			var fax = data.fax != undefined ? '<p class="vab__fc--neutrals-3 vab__fs--5">' + data.fax + '</p>' : '';

			// strip phone number
			var phone = data.phone.replace(/[^0-9]/g, '')

    		map.els.resultsList.append(
				'<li class="vab__storeLocatorResult__list__item _storeLocator__result" data-index="' + data.resultsIndex + '">' +
					'<div class="vab__grid">' +
						'<div class="vab__box--xs-w100p vab__layout--xs-mb-xxsmall-m-mb-xsmall">' +
							'<h4 class="vab__storeLocatorResult__store vab__float--xs-left vab__heading--4">' + data.store + '</h4>' +
							distance +
							'<p class="vab__clear vab__fs--6">' + products + '</p>' +
						'</div>' +
						'<div class="vab__box--xs-w100p vab__layout--xs-mb-xxsmall-m-mb-xsmall">' +
							'<p class="vab__fc--neutrals-3">' + data.address + ', ' + data.postal + ' ' + data.city + '</p>' +
						'</div>' +
					'</div>' +
					'<div class="vab__grid vab__storeLocatorResult__bottom">' +
						'<div class="vab__box--xs-w100p-m-w50p">' +
							'<a href="tel:+' + phone + '" class="vab__link vab__fc--neutrals-3 vab__fs--5">' + data.phone + '</a>' +
							fax +
						'</div>' +
						'<div class="vab__box--xs-w100p-m-w50p vab__storeLocatorResult__route">' +
							'<a href="#0" class="vab__link--directional-primair-2 vab__fs--6">Routebeschrijving</a>' +
						'</div>' +
					'</div>'+
				'</li>'
    		);

			// bind events
			if(mq.theSize() != 'xs') {
				$('._storeLocator__result').on('mouseover', function(event) { map.animateIcons($(this).data('index')); });
			}

			$('._storeLocator__result').on('mouseleave', function(event) { for (var i = 0; i < map.els.markerCollection.length; i ++ ) { map.els.markerCollection[i].setIcon(map.getIcon('normal')); map.els.markerCollection[i].setAnimation(null); } });

    	},

    	slideResults: function(markerClick, marker, index) {

    		if(!map.els.targetSlider.parent().hasClass('_slide_is_open') ) {

    			map.els.targetSlider.parent().addClass('_slide_is_open');
	    		map.els.targetSlider.stop().slideDown(300);

    		} else {

    			// prevent closing slider when clicking on a marker
    			if(markerClick != true) {

    				map.els.targetSlider.parent().removeClass('_slide_is_open');
		    		map.els.targetSlider.stop().slideUp(300);
    			}
    		}

    		// highlight result in list
    		marker && map.highlightResult(marker, index);

    		// show more results
    		map.els.triggerSliderMore.off('click').on('click', function() {
    			map.els.targetSlider.parent().addClass('_slide_show_more');
    			map.highlightResult(marker, index, 45);
    		});

    		// close slider
    		map.els.triggerSliderClose.off('click').on('click', function() {
    			map.els.targetSlider.parent().removeClass('_slide_is_open');
				map.els.targetSlider.removeClass('_slide_show_more');
				map.els.targetSlider.stop().slideUp(300);

				marker.setIcon(map.getIcon('normal'));
    		});

    	},

    	highlightResult: function(marker, index, offset) {

    		for (var i = 0; i < map.els.markerCollection.length; i ++ ) {
    			map.els.markerCollection[i].setIcon(map.getIcon('normal'));
    		}

    		marker && marker.setIcon(map.getIcon('active'));

    		// remove hover classes
    		$('._storeLocator__result').removeClass('_is_hovered');

    		// get current result
    		var currentResult = $('._storeLocator__result[data-index="' + index + '"]');

    		// get offset
    		var thisOffset = offset ? offset : map.els.resultsList.parent().css('padding-top').replace(/[^-\d\.]/g, '');

    		// add hover class to current result
    		currentResult.addClass('_is_hovered');

    		map.els.resultsList.scrollTop(map.els.resultsList.scrollTop() + currentResult.position().top - thisOffset);

    	},

    	getNewBounds: function() {

    		var bounds  = new google.maps.LatLngBounds();

    		return bounds;
    	},

    	setView: function(bounds) {

    		// set view after all markers have been added
			map.els.storeLocator.fitBounds(bounds);

			// center map
			map.els.storeLocator.panToBounds(bounds);
    	}
	};

	$(d).on('ready', map.init);

	return {
		setupMap: map.setupMap
	}

}(window, window.document, window.jQuery));

