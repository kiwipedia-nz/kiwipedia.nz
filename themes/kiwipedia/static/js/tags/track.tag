<track>

	<div>
		<button type="button" class="btn btn-sm pull-right" aria-label="Left Align">
			<i class="fa fa-map"></i>
		</button>
		<h4>Show detailed map</h4>
	</div>

	<track-map></track-map>

	<track-elevation></track-elevation>

	<track-info></track-info>

	<div if={ canReverse }>
		{ reversed ? 'Reversed' : 'Recommended' } track direction <input value="reverse" type="button" onclick={ reverse }>
	</div>

	<script>
		var self = this;
		self.tracks = {
			ids: [],
			params: [],
			data: {},
			size: 0
		}

		canReverse = true;
		reversed = false;
		reverse = function() {
			self.tracks.ids.reverse();
			self.tracks.params.reverse();
			self.tracks.data = {};
			for (var i = 0; i < self.tracks.ids.length; i++) {
				self.tracks.params[i].reverse = !self.tracks.params[i].reverse;
			}
			self.tracks.size = 0;
			 self.tags['track-info'].init();
			self.tags['track-map'].init();
			self.tags['track-elevation'].init();
	
		  self.refresh();
			this.reversed = !this.reversed;
		}

		this.addTrackId = function(trackId) {
			var tokens = trackId.split("|");
			self.tracks.ids.push(tokens[0]);
			var params = {}
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
			self.tracks.params[self.tracks.ids.length - 1] = params;
		};

		if (opts.trackId) {
			self.addTrackId(opts.trackId);
		}
		if (opts.trackIds) {
			for (var i = 0; i < opts.trackIds.length; i++) {
				self.addTrackId(opts.trackIds[i]);
			}
		}

		this.onTrackUpdated = function(track) {
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
					self.reduceTracksElevations(trackInfos, trackElevations);
				}
				self.tags['track-info'].addTrackInfos(trackInfos);
				self.tags['track-map'].addTrackLocations(trackLocations);
				self.tags['track-elevation'].addTrackElevations(trackElevations);
				self.update();
			}
		};

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
			for (var i =0; i < self.tracks.ids.length; i++) {
		  	RiotControl.one('track-updated-' + self.tracks.ids[i], self.onTrackUpdated);
	  		RiotControl.trigger('track-required', self.tracks.ids[i], self.tracks.params[i]);
	  	}  	
		}

		self.refresh();

	</script>

	<style>
		:scope { 
			padding-top: 0.5rem;
			display: block;
		}
		</style>
</track>