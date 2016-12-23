<track-info>

<div if={ infos.data }>
	<div each={ info in infos.data }>
    distance: { info.distance }
  </div>
</div>

	<script>
  	var self = this;
    self.infos = {
      ids: [],
      data: {}
    }

    this.addTrackInfo = function(trackInfo) {
      self.infos.ids.push(trackInfo.trackId);
      self.infos.data[trackInfo.trackId] = trackInfo;
    }

    this.addTrackInfos = function(trackInfos) {
      for (var i = 0; i < trackInfos.length; i++) {
        self.addTrackInfo(trackInfos[i]);
      }
    }

  </script>

  <style>
  </style>
</track-info>
