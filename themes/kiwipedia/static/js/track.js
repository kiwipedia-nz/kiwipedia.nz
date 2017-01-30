riot.tag2('track', '<div><button type="button" class="btn btn-sm pull-right" aria-label="Left Align"><i class="fa fa-map"></i></button><h4>Show detailed map</h4></div><track-map></track-map><track-elevation></track-elevation><track-info></track-info><div if="{canReverse}"> {reversed ? \'Reversed\' : \'Recommended\'} track direction <input value="reverse" type="button" onclick="{reverse}"></div>', 'track,[data-is="track"]{ padding-top: 0.5rem; display: block; }', '', function(opts) {
		var self = this;
		self.tracks = [];

		canReverse = true;
		reversed = false;

		reverse = function() {
			self.tracks.reverse();
			for (var i = 0; i < self.tracks; i++) {
				self.tracks[i].data = null;
			}

			self.tags['track-info'].init();
			self.tags['track-map'].init();
			self.tags['track-elevation'].init();

		  self.refresh();
			this.reversed = !this.reversed;
		}

		this.addTrackId = function(trackId) {
			var tokens = trackId.split("|");
			var params = {};
			if (tokens.length > 1) {
				if (tokens[1] === 'r') {
					params.reverse = true;
				}
			}
			if (tokens.length > 2) {
					this.canReverse = false;
					sub = tokens[2].split("-");
					params.start = sub[0];
					if (sub[1]) params.end = sub[1];
			}
			self.tracks.push({ id: trackId, trackId: tokens[0], params : params});
		};

		if (opts.trackId) {
			self.addTrackId(opts.trackId);
		}

		if (opts.trackIds) {
			for (var i = 0; i < opts.trackIds.length; i++) {
				self.addTrackId(opts.trackIds[i]);
			}
		}

		this.onTrackUpdated = function(trackId, trackData) {
			var allUpToDate = true;
			for (var i = 0; i < self.tracks.length; i++) {
				if (trackId == self.tracks[i].id) {
					self.tracks[i].data = trackData;
				}
				if (self.tracks[i].data == null) {
					allUpToDate = false;
				}
			}

			if (allUpToDate) {
				var trackInfos = [], trackLocations = [], trackElevations = [];
				for (var i =0; i < self.tracks.length; i++) {
					var id = self.tracks[i].id;
					trackInfos.push(self.addId(id, self.tracks[i].data.info));
					trackLocations.push(self.addId(id, self.tracks[i].data.location));
					trackElevations.push(self.addId(id, self.tracks[i].data.elevation));
				}
				if (trackElevations.length > 1) {
					self.reduceTracksElevations(trackInfos, trackElevations);
				}
				self.tags['track-info'].addTrackInfos(trackInfos);
				self.tags['track-map'].addTrackLocations(trackLocations);
				self.tags['track-elevation'].addTrackElevations(trackElevations);
				self.update();
			}
		};

		this.addId = function(id, object) {
			object.id = id;
			return object;
		}

		this.reduceTracksElevations = function(trackInfos, trackElevations) {
			var total = 0;
			for (var i = 0; i < trackInfos.length; i++) {
				total += trackInfos[i].distance;
			}
			for (var i = 0; i < trackInfos.length; i++) {
				trackElevations[i].points = self.reduceTrackElevations(trackElevations[i].points, trackInfos[i].distance / total);
			}
		};

		this.reduceTrackElevations = function(trackElevations, ratio) {
			var reduce = [];
			reduce.push(trackElevations[0]);
			for (var i = 1; i < trackElevations.length; i++) {
				if (i * ratio >= reduce.length) {
					reduce.push(trackElevations[i]);
				}
			}
			return reduce;
		};

		this.refresh = function() {
			for (var i =0; i < self.tracks.length; i++) {
		  	RiotControl.one('track-updated-' + self.tracks[i].id, self.onTrackUpdated);
	  		RiotControl.trigger('track-required', self.tracks[i].id, self.tracks[i].trackId, self.tracks[i].params);
	  	}
		}

		self.refresh();

});