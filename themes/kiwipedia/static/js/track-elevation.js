riot.tag2('track-elevation', '<div id="track-elevation"></div>', 'track-elevation #track-elevation,[data-is="track-elevation"] #track-elevation{ hfeight: 400px; }', '', function(opts) {
    var self = this;
    self.trackElevations = {
      ids: [],
      data: {},

      add: function(elevations) {
        this.ids.push(elevations.id);
        this.data[elevations.id] = elevations;
      },

      findTrackIdAndElevationPoint: function(rowNumber) {
        var count = 0;
        for (var i = 0; i < this.ids.length; i++) {
          var numberOfPoints = this.data[this.ids[i]].points.length;
          if (numberOfPoints + count > rowNumber) {
            return { trackId: this.ids[i], elevationPoint: this.data[this.ids[i]].points[rowNumber - count] };
          }
          count += numberOfPoints;
        }
      }
    }
    self.chart = null;

    self.chartConfig = {
      areaOpacity:.3,
      backgroundColor:"#f5f5f5",
      chartArea:{
        width:"100%",
        height:"100%",
        top:0
      },
      colors:["#ff1616"],
      focusTarget:"category",
      hAxis:{
        title:"Distance (km)",

      },
      vAxis:{
        textPosition:"in",
        viewWindowMode:"explicit",

      },
      legend:"none",
      titleFontSize:12,
      axisFontSize:12,

    }

    this.init = function() {
      self.trackElevations.ids = [];
      self.trackElevations.data = {};
    }

    this.addTrackElevation = function(elevation, drawChart = true) {
      self.trackElevations.add(elevation);
      if (drawChart) self.drawChart();
    }

    this.addTrackElevations = function(elevations) {
      for (var i = 0; i < elevations.length; i++) {
        self.addTrackElevation(elevations[i], false);
      }
      self.drawChart();
    }

    this.initChart = function() {
      self.chart = new google.visualization.AreaChart(document.getElementById("track-elevation"));
      self.drawChart();
    }

  	this.drawChart = function() {
      var rowId = 0;
      if (self.chart && self.trackElevations.ids.length > 0) {
        google.visualization.events.removeAllListeners(self.chart);
        google.visualization.events.addListener(self.chart, 'onmouseover', function(data) {
          var trackIdAndElevationPoint = self.trackElevations.findTrackIdAndElevationPoint(data.row);
          RiotControl.trigger('track-show-marker-' + trackIdAndElevationPoint.trackId, trackIdAndElevationPoint.elevationPoint);
        });
        google.visualization.events.addListener(self.chart, 'onmouseout', function(data) {
          var trackIdAndElevationPoint = self.trackElevations.findTrackIdAndElevationPoint(data.row);
          RiotControl.trigger('track-remove-markers-' + trackIdAndElevationPoint.trackId);
        });

        var table = new google.visualization.DataTable();
        table.addColumn('string', 'Sample');
        table.addColumn('number', 'Elevation');
        for (var i = 0; i < self.trackElevations.ids.length; i++) {
          var trackId = self.trackElevations.ids[i];
          var elevation = self.trackElevations.data[trackId];

          for (var x = 0; x < elevation.points.length; x++) {
            table.addRow(['', elevation.points[x].elevation]);
          }
        }

        self.chart.draw(table, self.chartConfig);
      }
  	};

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(self.initChart);

});
