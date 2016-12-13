'use strict';

function TrackStore() {
    var self = this;
    riot.observable(self);

    self.getLocation = function(trackId) {
        ajax.get('http://api-kiwipedia-nz.appspot.com/track/' + trackId + '/location', function (response) {
            if (response) {
                self.trigger('track-location-updated-' + trackId, response);
            }
        });
    }

    self.getElevation = function(trackId) {
        ajax.get('http://api-kiwipedia-nz.appspot.com/track/' + trackId + '/elevation', function (response) {
            if (response) {
                self.trigger('track-elevation-updated-' + trackId, response);
            }
        });
    }

    self.getInfo = function(trackId) {
        ajax.get('http://api-kiwipedia-nz.appspot.com/track/' + trackId + '/info', function (response) {
            if (response) {
                self.trigger('track-info-updated-' + trackId, response);
            }
        });
    }

    self.on('track-location-required', function (trackId) {
        self.getLocation(trackId);
    });

    self.on('track-elevation-required', function (trackId) {
        self.getElevation(trackId);
    });

    self.on('track-info-required', function (trackId) {
        self.getInfo(trackId);
    });

};

RiotControl.addStore(new TrackStore());