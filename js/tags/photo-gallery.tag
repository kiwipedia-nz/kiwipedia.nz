<photo-gallery>

	<div class="photo">
	
	</div>

	<div class="gallery">
		<div each="{ photo in gallery }" class="photo">
			<img src="{ photo.url }=h{ photo.thumbnailHeight }" width="{ photo.thumbnailWidth }" height="{ photo.thumbnailHeight }">
		</div>
	</div>

	<script>
		var self = this;
		self.photos = [];
		self.rows = 3;
		self.gallery = [];
		self.firstThumb;
		self.lastThumb;

		if (opts.photos) {
			self.photos.push.apply(self.photos, opts.photos);
		}

		if (opts.rows) {
			self.rows = opts.rows;
		}

		this.refresh = function() {
			self.generateGallery();
			self.update();
		}

		this.generateGallery = function() {
			if (!self.photos || self.photos.length == 0) {
				return;				
			}

			self.gallery = [];

			var width = $("body").width() - 10;
			var height = $("body").height() - 10;

			var row = 0;
			var index = self.firstThumb || 0;
			var initialThumbHeight = Math.floor((height - self.rows * 2) / self.rows);
			var x = 0;
			var start = 0;
			self.firstThumb =null;
			self.lastThumb = null;

			while (row < self.rows) {
				if (index == self.photos.length) {
					break;
				}

				var photo = self.photos[index]; 
				
				if (self.firstThumb == null) {
					self.firstThumb = index;
				}
				self.lastThumb = index;

				photo.thumbnailHeight = initialThumbHeight;
				photo.thumbnailWidth = Math.floor(photo.width / photo.height * initialThumbHeight);

				self.gallery.push(photo);
				x += photo.thumbnailWidth + 2;
				if (x > width) {
					var adjustedThumbHeight = Math.floor(photo.thumbnailHeight * (width / x));
					var realRowWidth = 0;

					for (start; start <= index; start++) {
						photo = self.gallery[start];
						var ratio = photo.thumbnailWidth / photo.thumbnailHeight;
						photo.thumbnailHeight = adjustedThumbHeight;
						photo.thumbnailWidth = Math.floor(adjustedThumbHeight * ratio);
						realRowWidth += photo.thumbnailWidth + 2;
						if (start == index && realRowWidth < width) {
							photo.thumbnailWidth += width - realRowWidth;
						} 
					}
					
					start = index + 1;
					x = 0;
					row++;
				}
				index++;
			}
		}

		this.on('mount', self.refresh);

	</script>

	<style type="text/css">
		:scope { 
		}
		.gallery {
		}
		.gallery .photo {
			float: left;
			margin: 1px;
			font-size:0px;
		}
	</style>
</photo-gallery>