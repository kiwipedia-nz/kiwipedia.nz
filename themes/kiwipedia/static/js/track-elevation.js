riot.tag2('track-elevation', '<div id="track-elevation"></div>', 'track-elevation #track-elevation,[data-is="track-elevation"] #track-elevation{ hfeight: 400px; }', '', function(opts) {
  	var trackId = opts.trackId;

  	drawElevation = function(trackElevation) {
	    var chart = new google.visualization.ColumnChart(document.getElementById("track-elevation"));

	    var data = new google.visualization.DataTable();

      data.addColumn('string', 'Sample');
      data.addColumn('number', 'Elevation');
      for (var i = 0; i < trackElevation.points.length; i++) {
        data.addRow(['', trackElevation.points[i].elevation]);
      }

      chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)'
      });
  	};

  	RiotControl.on('track-elevation-updated-' + trackId, drawElevation);
  	RiotControl.trigger('track-elevation-required', trackId);

});
