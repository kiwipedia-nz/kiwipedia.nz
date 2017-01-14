riot.tag2('track-photos-gallery', '<div class="photo"></div><div if="{photos && photos.length > 0}" class="photos-gallery"><div each="{photo in thumbnails}" class="photo"><img riot-src="{photo.url}=h{photoThumbnailHeight}" width="{photo.thumbnailWidth}" height="{photo.thumbnailHeight}"></div></div>', 'track-photos-gallery,[data-is="track-photos-gallery"]{ } track-photos-gallery .photos .photo,[data-is="track-photos-gallery"] .photos .photo{ float: left; margin: 1px; font-size:0px; }', '', function(opts) {
		var self = this;
		self.region = '';
		self.tracks = [];
		self.photos = [];
		self.preview = [];
		self.photoThumbnailHeight = 165;
		self.gallery = false;

		if (opts.region) {
			self.region = opts.region;
		}

		if (opts.photos) {
			self.photos = photos;
		}

		this.generateThumbnails = function() {
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