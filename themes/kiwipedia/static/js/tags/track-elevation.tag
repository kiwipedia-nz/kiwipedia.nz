<track-elevation>

	<div id="track-elevation"></div>

	<script>
  	var trackId = opts.trackId;
    var trackElevation = null;
    var chart = null;

    initChart = function() {
      chart = new google.visualization.AreaChart(document.getElementById("track-elevation"));
      google.visualization.events.addListener(chart, 'onmouseover', function(data) {
        RiotControl.trigger('track-show-marker-' + trackId, trackElevation.points[data.row]);
      });
      google.visualization.events.addListener(chart, 'onmouseout', function(data) {
        RiotControl.trigger('track-remove-markers-' + trackId);
      });
      drawChart();
    }

  	drawChart = function() {
      if (chart && trackElevation) {

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
      }
  	};
  	
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(initChart);
  	
    RiotControl.on('track-elevation-updated-' + trackId, function(data) {
      trackElevation = data;
      drawChart();
    });
  	
    RiotControl.trigger('track-elevation-required', trackId);

  </script>

  <style>
  	#track-elevation {
    	hfeight: 400px;
		}
  </style>
</track-elevation>
