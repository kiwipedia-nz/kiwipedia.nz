<track-photos>

	<ul each={ photo in photos }>
		<li><img src="{ photo.thumbUrl }">
	</ul>

	<img src="https://lh3.googleusercontent.com/-LD-VX6DSBbc/WGNnWAVHlII/AAAAAAAAACY/TWY8WtJz6Z4k2RTvcUKzY6sZoMFaVp7zQCHM/s180/2016-10-18%2B17.16.28.jpg">
	<script>
		console.log('kurva');
		var self = this;
		self.tracks = [];
		self.photos = [];

		addTrackId = function(trackId) {
			self.tracks.push({ id: trackId });
		};

		if (opts.trackId) {
			addTrackId(opts.trackId);
		}
		if (opts.tracks) {
			for (var i = 0; i < opts.tracks.length; i++) {
				addTrackId(opts.tracks[i]);
			}
		}

		onTrackPhotosUpdated = function(trackId, photos) {
			var index = 0;
			for (var i = 0; i < self.tracks.length; i++) {
				var track = self.tracks[i];
				if (track.id == trackId) {
					track.count = photos.length;
					for (var x = 0; x < photos.length; x++) {
						var photo = photos[x];
						photo.trackId = trackId;
						self.photos.splice(index + x, 0, photo);
					}
					self.update();
				} else {
					index += (track.count ? track.count : 0);
				}
			}
		};

		refresh = function() {
			for (var i =0; i < self.tracks.length; i++) {
		  	var trackId = self.tracks[i].id;
		  	RiotControl.one('track-photos-updated-' + trackId, onTrackPhotosUpdated);
	  		RiotControl.trigger('track-photos-required', trackId, 1600, 180);
	  	}  	
		}

		refresh();

	</script>

</track-photos>