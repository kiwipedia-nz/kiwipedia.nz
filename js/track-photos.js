riot.tag2('track-photos', '<div if="{photos && photos.length > 0}"><div><button click="{toggleGallery}" type="button" class="btn btn-sm pull-right" aria-label="Left Align"><i class="fa fa-th"></i></button><h4>Show all {photos.length} photos</h4></div></div><div if="{hasNoPhotos()}"><h4>No photos available</h4> Maybe you would like to add some of yours? <button type="button" class="btn upload" aria-label="Left Align"> Upload photos <i class="fa fa-cloud-upload"></i></button></div><div class="photos"><div each="{photo in preview}" class="photo"><img riot-src="{photo.url}=h{photoThumbnailHeight}" width="{photo.thumbnailWidth}" height="{photo.thumbnailHeight}"></div></div>', 'track-photos,[data-is="track-photos"]{ padding-top: 0.5rem; display: block; } track-photos .upload,[data-is="track-photos"] .upload{ margin-top: 10px; } track-photos .photos .photo,[data-is="track-photos"] .photos .photo{ float: left; margin: 1px; font-size:0px; }', '', function(opts) {
		var self = this;
		self.region = '';
		self.tracks = [];
		self.photos = [];
		self.preview = [];
		self.photoThumbnailHeight = 165;
		self.gallery = false;

		this.toggleGallery = function() {
			self.gallery = !self.gallery;
			if (self.gallery) {
				$(".track-description").hide();
				$(".track-photos").hide();
				$(".track-map").hide();
				riot.mount('photo-gallery', { photos : self.photos });
			} else {
				$(".track-description").show();
				$(".track-photos").show();
				$(".track-map").show();
				riot.unmount('photo-gallery');
			}
		}

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
			for (var i = 0; i < self.tracks.length; i++) {
				if (typeof self.tracks[i].count == 'undefined') {
					return;
				}
			}
			self.showGrid();
		};

		this.refresh = function() {
			for (var i =0; i < self.tracks.length; i++) {
		  	var trackId = self.tracks[i].id;
		  	RiotControl.one('track-photos-updated-' + trackId, self.onTrackPhotosUpdated);
	  		RiotControl.trigger('track-photos-required', self.region, trackId);
	  	}
		}

		this.showGrid = function() {
			self.preview = [];
			if (!self.photos || self.photos.length == 0) {
				return;
			}

			var width = $(".photos").width();

			var x = 0;
			var row = 0;
			var start = 0;
			var i =0;
			var randomized = {};
			var randomizedLength = 0;

			while (row <= 2) {
				var found = false;
				while (!found) {
					if (self.photos.length == randomizedLength) {
						self.update();
						return;
					}

					var random = Math.floor(Math.random() * self.photos.length);
					if (!randomized[random]) {
						found = true;
						randomized[random] = true;
						randomizedLength++;
					}
				}
				var photo = self.photos[random];
				photo.thumbnailHeight = self.photoThumbnailHeight;
				photo.thumbnailWidth = Math.ceil(photo.width / (photo.height / photo.thumbnailHeight));
				self.preview.push(photo);

				x += photo.thumbnailWidth + 2;
				if (x > width) {
					var resize = width / x;
					var height = Math.floor(self.preview[start].thumbnailHeight * resize);
					var adjustment = 0;
					for (start; start <= i; start++) {
						photo = self.preview[start];
						var ratio = photo.thumbnailWidth / photo.thumbnailHeight;
						photo.thumbnailHeight = height;
						photo.thumbnailWidth = Math.floor(height * ratio);
						adjustment += photo.thumbnailWidth + 2;
						if (start == i && adjustment < width) {
							photo.thumbnailWidth += width - adjustment;
						}
					}

					start = i + 1;
					x = 0;
					row++;
				}
				i++;
			}
			self.update();
		}

		self.refresh();

});