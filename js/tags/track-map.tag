<track-map>

	<div id="track-map"></div>

	<script>
		var self = this;
    self.map = null;

    self.availableLayers = {
			'NZ Topo' : L.tileLayer('http://koordinates-tiles-a.global.ssl.fastly.net/services;key=41c900490dd14c50b4ccaf01082468b0/tiles/v4/layer=1231/EPSG:3857/{z}/{x}/{y}.png',
				{
    			maxZoom: 15,
    			attribution: '',
    			id: 'NZ Topomap 50'
  			}
  		),
	    'Mapbox Street' : L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHJvaWQiLCJhIjoiUGtmUjhPayJ9.ipo2p3WLD-uTan1QFYyX7g',
	    	{
	      	maxZoom: 15,
	      	id: 'mapbox.streets'
	    	}
	    ),
	    'Open Topo' : L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', 
	    	{
					maxZoom: 15,
					attribution: 'University of Heidelberg'
				}
			),
			'Satellite' : L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
				{
					attribution: 'Esri'
				}
			)
    }

    self.displayLayers = ['Open Topo', 'Satellite', 'NZ Topo'];

    self.layers = function() {
    	var layers = [];
    	var controls = {};
    	for (var i = 0; i < self.displayLayers.length; i++) {
    		var layer = self.availableLayers[self.displayLayers[i]];
    		layers.push(layer);
    		controls[self.displayLayers[i]] = layer;
    	}
    	return { layers : layers, controls : controls}; 
    }

    this.init = function() {
			if (self.map) {
				self.map.remove();
			}
      self.marker = null;
      self.map = null;
			self.trackLocations = {
				ids: [],
				data: {}
			};
    }

		this.addTrackLocation = function(trackLocation, drawMap = true) {
			self.trackLocations.ids.push(trackLocation.id);
			self.trackLocations.data[trackLocation.id] = trackLocation;
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
	  	var layers = self.layers();
	    L.layerGroup(layers.layers).addTo(self.map);
			L.control.layers(layers.controls).addTo(self.map);

	    var features = [];
	    for (var i =0; i < self.trackLocations.ids.length; i++) {
		    var id = self.trackLocations.ids[i];
		    var location = self.trackLocations.data[id];

		    var geoJson = {
		    	type: location.type,
		    	coordinates: []
		    }

		  	RiotControl.on('track-show-marker-' + id, self.onShowMarker);

		  	RiotControl.on('track-remove-markers-' + id, function() {
		  		// marker.remove(marker);
		  	});


		    for (var x =0; x < location.points.length; x++) {
		    	var point = location.points[x];
		    	geoJson.coordinates.push([point.lng, point.lat]);
		    }

		    features.push(L.geoJSON(geoJson, {
		    	style: {
	    			"color": "#ff1616",
	    			"weight": 5,
	    			"opacity": 1
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
    	height: 300px;
		}
  </style>
</track-map>
