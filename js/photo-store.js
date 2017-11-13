'use strict';

function PhotoStore() {
    var self = this;
    riot.observable(self);
    self.getTrackPhotos = function(region, trackId) {
        ajax.get('http://img-kiwipedia-nz.appspot.com/track/' + (region ? region + '/' : '') + trackId, function (response) {
            if (response) {
                self.trigger('track-photos-updated-' + trackId, response);
            }
        });
    }

    self.on('track-photos-required', function (region, trackId) {
        if (region && trackId) {
            self.getTrackPhotos(region, trackId);
        }
    });

};

RiotControl.addStore(new PhotoStore());