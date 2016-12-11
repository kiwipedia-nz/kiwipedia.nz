riot.tag2('track-map', '<div id="track-map"></div>', 'track-map #track-map,[data-is="track-map"] #track-map{ height: 400px; }', '', function(opts) {
  	var trackId = opts.trackId;

  	drawMap = function(trackLocation) {
	  	var trackMap = L.map('track-map');
	    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHJvaWQiLCJhIjoiUGtmUjhPayJ9.ipo2p3WLD-uTan1QFYyX7g', {
	      maxZoom: 18,
	      id: 'mapbox.streets'
	    }).addTo(trackMap);

	    var geoJson = {
	    	type: trackLocation.type,
	    	coordinates: []
	    }
	    for (var i =0; i < trackLocation.points.length; i++) {
	    	var point = trackLocation.points[i];
	    	geoJson.coordinates.push([point.lng, point.lat]);
	    }

	    var feature = L.geoJSON(geoJson, {
	    	style: {
    			"color": "#ff7800",
    			"weight": 5,
    			"opacity": 0.65
    		}
    	});
	    feature.addTo(trackMap);
	    trackMap.fitBounds(feature.getBounds().pad(0.5));
  	};

  	RiotControl.on('track-location-updated-' + trackId, drawMap);
  	RiotControl.trigger('track-location-required', trackId);

});
