<track-photos>

	<figure each={ photo in preview } class="column image is-128x128 is-4">
		<img src="{ photo.url }=c-w165">
	</figure>

	<script>
		var self = this;
		self.region = '';
		self.tracks = [];
		self.photos = [];
		self.preview = [];

		/**
		* Crazy logic to create randomized preview list where each track has the same count of pictures
		* and they are all sorted too.
		**/
		this.createPreview = function(trackPhotos) {
			if (!trackPhotos.photos) {
				return;
			}

			var numberOfPreviewImages = 6;
			var calculatedNumberOfPreviewImages = numberOfPreviewImages;

			for (var i = 0; i < self.tracks.length; i++) {
				if (self.tracks[i].id != trackPhotos.trackId && self.tracks[i].count > 0) {
					calculatedNumberOfPreviewImages = Math.ceil(numberOfPreviewImages / 2);
				}
			}

			self.preview.splice(0, calculatedNumberOfPreviewImages);

			var hit = {};
			var photos = trackPhotos.photos;
			var i = 0;

			while (i < calculatedNumberOfPreviewImages && i < photos.length) {
				var index = photos.length > calculatedNumberOfPreviewImages ? -1 : i;
				if (index < 0) {
					index = Math.floor(Math.random() * photos.length);
					if (hit[index]) {
						continue;
					}
					hit[index] = true;
				}
				self.preview.push(photos[index]);
				i++;
			}
		}

		this.addTrackId = function(trackId) {
			if (trackId.indexOf('|') > 0) {
				trackId = trackId.substring(0, trackId.indexOf('|'));
			}
			self.tracks.push({ id: trackId });
		};

		if (opts.trackId) {
			self.addTrackId(opts.trackId);
		}
		if (opts.trackIds) {
			for (var i = 0; i < opts.trackIds.length; i++) {
				self.addTrackId(opts.trackIds[i]);
			}
		}
		if (opts.region) {
			self.region = opts.region;
		}

		this.onTrackPhotosUpdated = function(trackPhotos) {
			var index = 0;
			for (var i = 0; i < self.tracks.length; i++) {
				var track = self.tracks[i];
				if (track.id == trackPhotos.trackId) {
					if (!trackPhotos.photos) {
						continue;
					}
					var photos = trackPhotos.photos;
					track.count = photos.length;
					for (var x = 0; x < photos.length; x++) {
						var photo = photos[x];
						photo.trackId = trackPhotos.trackId;
						self.photos.splice(index + x, 0, photo);
					}
				} else {
					index += (track.count ? track.count : 0);
				}
			}
			self.createPreview(trackPhotos);
			self.update();
		};

		this.refresh = function() {
			for (var i =0; i < self.tracks.length; i++) {
		  	var trackId = self.tracks[i].id;
		  	RiotControl.one('track-photos-updated-' + trackId, self.onTrackPhotosUpdated);
	  		RiotControl.trigger('track-photos-required', self.region, trackId);
	  	}  	
		}

		self.refresh();

	</script>

	<style type="text/css">
		ul {
			padding-right: 5px;
		}
		li {
			float: right;
			margin: 0 2px;
			padding: 0;
		}

	</style>
</track-photos>