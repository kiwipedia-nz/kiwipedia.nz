riot.tag2('track-photos', '<div if="{photos && photos.length > 0}"><div><button type="button" class="btn btn-sm pull-right" aria-label="Left Align"><i class="fa fa-th"></i></button><h4>Show all {photos.length} photos</h4></div><div class="row no-gutters pull-right"><div each="{photo in preview}" class="col-6"><img riot-src="{photo.url}=c-w165" class="img-fluid"></div></div></div><div if="{hasNoPhotos()}"><h4>No photos available</h4> Maybe you would like to add some of yours? <button type="button" class="btn upload" aria-label="Left Align"> Upload photos <i class="fa fa-cloud-upload"></i></button></div>', 'track-photos,[data-is="track-photos"]{ padding-top: 0.5rem; display: block; } track-photos img,[data-is="track-photos"] img{ padding-bottom: 4px; } track-photos .upload,[data-is="track-photos"] .upload{ margin-top: 10px; }', '', function(opts) {
		var self = this;
		self.region = '';
		self.tracks = [];
		self.photos = [];
		self.preview = [];

		this.hasNoPhotos = function() {
			if (self.photos.length > 0) {
				return false;
			}
			for (var i = 0; i < self.tracks.length; i++) {
				if (self.tracks[i].count === undefined) {
					return false;
				}
			}
			return true;
		}

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
					var photos = trackPhotos.photos;
					track.count = photos ? photos.length : 0;
					if (!photos) {
						continue;
					}
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

});