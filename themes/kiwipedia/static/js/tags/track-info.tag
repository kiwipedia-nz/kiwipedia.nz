<track-info>

<div if={info}>
	distance: { info.distance }
</div>

	<script>
  	var self = this;
    self.trackId = opts.trackId;
    self.info = null;

  	RiotControl.on('track-info-updated-' + trackId, function(trackInfo) {
      self.info = trackInfo;
      self.update();
    });

  	RiotControl.trigger('track-info-required', trackId);

  </script>

  <style>
  </style>
</track-info>
