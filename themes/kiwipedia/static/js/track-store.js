'use strict';

function TrackStore() {
    var self = this;
    riot.observable(self);

    self.getTrack = function(trackId, trackParams) {
        var urlParams = "";
        if (trackParams) {
            urlParams += "?";
            urlParams += trackParams.reverse ? "reverse=true" : "";
            urlParams += trackParams.start ? "&start=" + trackParams.start : "";
            urlParams += trackParams.end ? "&end=" + trackParams.end : "";
        }
        ajax.get('http://api-kiwipedia-nz.appspot.com/track/' + trackId + urlParams, function (response) {
            if (response) {
                self.trigger('track-updated-' + trackId, response);
            }
        });
    }

    self.on('track-required', function (trackId, trackParams) {
        self.getTrack(trackId, trackParams);
    });

};

RiotControl.addStore(new TrackStore());