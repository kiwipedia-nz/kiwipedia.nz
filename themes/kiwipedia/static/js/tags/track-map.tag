<track-map>

	<div id="track-map"></div>

	<script>
		var self = this;
    self.map = null;

    this.init = function() {
      self.marker = null;
			self.trackLocations = {
				ids: [],
				data: {}
			};
    }

		this.addTrackLocation = function(trackLocation, drawMap = true) {
			self.trackLocations.ids.push(trackLocation.trackId);
			self.trackLocations.data[trackLocation.trackId] = trackLocation;
			if (drawMap) self.drawMap();
		}

		this.addTrackLocations = function(trackLocations) {
			for (var i = 0; i < trackLocations.length; i++) {
				self.addTrackLocation(trackLocations[i], false);
			}
			self.drawMap();
		}

  	this.drawMap = function() {
	  	self.map = self.map || L.map('track-map');
	    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHJvaWQiLCJhIjoiUGtmUjhPayJ9.ipo2p3WLD-uTan1QFYyX7g', {
	      maxZoom: 18,
	      id: 'mapbox.streets'
	    }).addTo(self.map);
	    
	    
	    var features = [];
	    for (var i =0; i < self.trackLocations.ids.length; i++) {
		    var trackId = self.trackLocations.ids[i];
		    var location = self.trackLocations.data[trackId];

		    var geoJson = {
		    	type: location.type,
		    	coordinates: []
		    }

		  	RiotControl.on('track-show-marker-' + trackId, self.onShowMarker);

		  	RiotControl.on('track-remove-markers-' + trackId, function() {
		  		// marker.remove(marker);
		  	});


		    for (var x =0; x < location.points.length; x++) {
		    	var point = location.points[x];
		    	geoJson.coordinates.push([point.lng, point.lat]);
		    }

		    features.push(L.geoJSON(geoJson, {
		    	style: {
	    			"color": "#ff7800",
	    			"weight": 5,
	    			"opacity": 0.65
	    		}
	    	}));
		  }

			var featureGroup = L.featureGroup(features).addTo(self.map);
	    self.map.fitBounds(featureGroup.getBounds().pad(0));
  	};

  	this.onShowMarker = function(point) {
  		if (self.map && point) {
  			if (self.marker == null) {
  				self.marker = L.marker([point.lat, point.lng]);	
  				self.marker.addTo(self.map);
  			} else {
  				self.marker.setLatLng([point.lat, point.lng]);
  			}
  		}
  	}

  	self.init();

  </script>

  <style>
  	#track-map {
    	height: 400px;
		}
  </style>
</track-map>
