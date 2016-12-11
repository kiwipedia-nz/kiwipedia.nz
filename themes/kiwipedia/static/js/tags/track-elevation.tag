<track-elevation>

	<div id="track-elevation"></div>

	<script>
  	var trackId = opts.trackId;

  	drawElevation = function(trackElevation) {
	    var chart = new google.visualization.ColumnChart(document.getElementById("track-elevation"));

	    var data = new google.visualization.DataTable();
      
      data.addColumn('string', 'Sample');
      data.addColumn('number', 'Elevation');
      for (var i = 0; i < trackElevation.points.length; i++) {
        data.addRow(['', trackElevation.points[i].elevation]);
      }

      // Draw the chart using the data within its DIV.
      chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)'
      });
  	};
  	
  	RiotControl.on('track-elevation-updated-' + trackId, drawElevation);
  	RiotControl.trigger('track-elevation-required', trackId);

  </script>

  <style>
  	#track-elevation {
    	hfeight: 400px;
		}
  </style>
</track-elevation>
