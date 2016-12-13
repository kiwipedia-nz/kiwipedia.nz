riot.tag2('track-info', '<div if="{info}"> distance: {info.distance} </div>', '', '', function(opts) {
  	var self = this;
    self.trackId = opts.trackId;
    self.info = null;

  	RiotControl.on('track-info-updated-' + trackId, function(trackInfo) {
      self.info = trackInfo;
      self.update();
    });

  	RiotControl.trigger('track-info-required', trackId);

});
