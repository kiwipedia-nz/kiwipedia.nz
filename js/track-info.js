riot.tag2('track-info', '<div if="{infos.ids.length > 0}" class="text-center"> {getDistance()} </div>', '', '', function(opts) {
  	var self = this;

    this.init = function() {
      self.infos = {
        ids: [],
        data: {}
      }
    }

    this.getDistance = function() {
      var distance = '';
      var total = 0;
      if (self.infos.ids.length > 1) {
        distance += self.infos.ids.length + ' tracks - ';
        for (var i = 0; i < self.infos.ids.length; i++) {
          var trackDistance = self.infos.data[self.infos.ids[i]].distance;
          total += trackDistance;
          distance += self.toKm(trackDistance);
          if (self.infos.ids.length > i + 2 ) {
            distance += ', ';
          } else if (self.infos.ids.length == i + 2 ) {
            distance += ' and ';
          }
        }
        distance += ' (total distance: ' + self.toKm(total) + ')';
      } else {
        distance += 'Distance ' + self.toKm(self.infos.data[self.infos.ids[0]].distance);
      }
      return distance;
    }

    this.toKm = function(metres) {
      return (metres / 1000).toFixed(2) + 'km';
    }

    this.addTrackInfo = function(trackInfo) {
      self.infos.ids.push(trackInfo.id);
      self.infos.data[trackInfo.id] = trackInfo;
    }

    this.addTrackInfos = function(trackInfos) {
      for (var i = 0; i < trackInfos.length; i++) {
        self.addTrackInfo(trackInfos[i]);
      }
    }

    self.init();

});
