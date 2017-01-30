'use strict';

function TrackStore() {
    var self = this;
    riot.observable(self);

    self.getTrack = function(id, trackId, trackParams) {
        var urlParams = "";
        if (trackParams) {
            urlParams += "?";
            urlParams += trackParams.reverse ? "reverse=true" : "";
            urlParams += trackParams.start ? "&start=" + trackParams.start : "";
            urlParams += trackParams.end ? "&end=" + trackParams.end : "";
        }
        ajax.get('http://api-kiwipedia-nz.appspot.com/tracks/' + trackId + urlParams, function (response) {
            if (response) {
                self.trigger('track-updated-' + id, id, response);
            }
        });
    }

    self.on('track-required', function (id, trackId, trackParams) {
        self.getTrack(id, trackId, trackParams);
    });

};

RiotControl.addStore(new TrackStore());
