'use strict';

function PhotoStore() {
    var self = this;
    riot.observable(self);
    // http://www.svenbluege.de/picasa/v1.1/#
    self.getTrackPhotos = function(trackId, fullSize, thumbSize) {
        var urlParams = "";
        if (fullSize || thumbSize) {
            urlParams += "?";
            urlParams += fullSize ? "&fullSize=" + fullSize : "";
            urlParams += thumbSize ? "&thumbSize=" + thumbSize : "";
        }
        ajax.get('http://localhost:8080/photos/album/' + trackId + urlParams, function (response) {
            if (response) {
                self.trigger('track-photos-updated-' + trackId, trackId, response);
            }
        });
    }

    self.on('track-photos-required', function (trackId, fullSize, thumbSize) {
        self.getTrackPhotos(trackId, fullSize, thumbSize);
    });

};

RiotControl.addStore(new PhotoStore());