<track-map>

	<div id="track-map"></div>

	<script>
  	var trackId = opts.trackId;
  	var marker = null;
		var trackMap = null;

  	drawMap = function(trackLocation) {
	  	trackMap = L.map('track-map');
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
	    trackMap.fitBounds(feature.getBounds().pad(0));
  	};

  	RiotControl.on('track-location-updated-' + trackId, drawMap);
  	RiotControl.trigger('track-location-required', trackId);

  	RiotControl.on('track-show-marker-' + trackId, function(point) {
  		if (trackMap && point) {
  			if (marker == null) {
  				marker = L.marker([point.lat, point.lng]);	
  				marker.addTo(trackMap);
  			} else {
  				marker.setLatLng([point.lat, point.lng]);
  			}
  		}
  	});

  	RiotControl.on('track-remove-markers-' + trackId, function() {
  		// marker.remove(marker);
  	});

  </script>

  <style>
  	#track-map {
    	height: 400px;
		}
  </style>
</track-map>
