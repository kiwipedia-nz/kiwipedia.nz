riot.tag2('track', '{reversed ? \'Reversed\' : \'Recommended\'} track direction <input value="reverse" type="button" onclick="{reverse}"><track-info trackid="{trackId}"></track-info><track-map trackid="{trackId}"></track-map><track-elevation trackid="{trackId}"></track-elevation>', '', '', function(opts) {
		var self = this;
		self.tracks = {
			ids: [],
			params: [],
			data: {},
			size: 0
		}

		reversed = false;
		reverse = function() {
			self.tracks.ids.reverse();
			self.tracks.params.reverse();
			self.tracks.data = {};
			for (var i = 0; i < self.tracks.ids.length; i++) {
				self.tracks.params[i].reverse = !self.tracks.params[i].reverse;
			}
			self.tracks.size = 0;

			self.tags['track-map'].init();
			self.tags['track-elevation'].init();

			refresh();
			this.reversed = !this.reversed;
		}

		addTrackId = function(trackId) {
			var tokens = trackId.split("|");
			self.tracks.ids.push(tokens[0]);
			var params = {}
			if (tokens.length > 1) {
				if (tokens[1] === 'r') {
					params.reverse = true;
				}
			}
			if (tokens.length > 2) {
					sub = tokens[2].split("-");
					params.start = sub[0];
					if (sub[1]) params.end = sub[1];
			}
			self.tracks.params[self.tracks.ids.length - 1] = params;
		};

		if (opts.trackId) {
			addTrackId(opts.trackId);
		}
		if (opts.trackIds) {
			for (var i = 0; i < opts.trackIds.length; i++) {
				addTrackId(opts.trackIds[i]);
			}
		}

		onTrackUpdated = function(track) {
			self.tracks.data[track.trackId] = track;
			self.tracks.size++;

			if (self.tracks.size === self.tracks.ids.length) {
				var trackInfos = [], trackLocations = [], trackElevations = [];
				for (var i =0; i < self.tracks.ids.length; i++) {
					trackInfos.push(self.tracks.data[self.tracks.ids[i]].info);
					trackLocations.push(self.tracks.data[self.tracks.ids[i]].location);
					trackElevations.push(self.tracks.data[self.tracks.ids[i]].elevation);
				}
				if (trackElevations.length > 1) {
					reduceTracksElevations(trackInfos, trackElevations);
				}
				self.tags['track-info'].addTrackInfos(trackInfos);
				self.tags['track-map'].addTrackLocations(trackLocations);
				self.tags['track-elevation'].addTrackElevations(trackElevations);
				self.update();
			}
		};

		reduceTracksElevations = function(trackInfos, trackElevations) {
			var total = 0;
			for (var i = 0; i < trackInfos.length; i++) {
				total += trackInfos[i].distance;
			}
			for (var i = 0; i < trackInfos.length; i++) {
				trackElevations[i].points = reduceTrackElevations(trackElevations[i].points, trackInfos[i].distance / total);
			}
		};

		reduceTrackElevations = function(trackElevations, ratio) {
			var reduce = [];
			reduce.push(trackElevations[0]);
			for (var i = 1; i < trackElevations.length; i++) {
				if (i * ratio >= reduce.length) {
					reduce.push(trackElevations[i]);
				}
			}
			return reduce;
		};

		refresh = function() {
			for (var i =0; i < self.tracks.ids.length; i++) {
		  	RiotControl.one('track-updated-' + self.tracks.ids[i], onTrackUpdated);
	  		RiotControl.trigger('track-required', self.tracks.ids[i], self.tracks.params[i]);
	  	}
		}

		refresh();

});