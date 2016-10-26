'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:seizmap
 * @description
 * # seizmap
 */
angular.module('fireInterfaceApp')
  .directive('seizmap', function () {
    return {
      template: '<svg id="seizmap"></svg>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var aggregation = scope.seizByNUTS;
        var zoomlvl = 1 << 12;


        getData();


        var xscale = d3.scaleSqrt()
          .range([2, 15])
          .domain([0,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.count})])


        var colscale = d3.scaleQuantize()
          .domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.seized})])
          .range(["#FECA28", "#FFA914","#FD8F01","#FF5024","#FB2744"])

        var pi = Math.PI,
          tau = 2 * pi;

        var width = element[0].clientWidth,
          height = element[0].clientHeight;

// Initialize the projection to fit the world in a 1×1 square centered at the origin.
        var projection = d3.geoMercator()
          .scale(1 / tau)
          .translate([0, 0]);

        var path = d3.geoPath()
          .projection(projection);

        var tile = d3.tile()
          .size([width, height]);

        var zoom = d3.zoom()
          .scaleExtent([1 << 12, 1 << 16])
          .on("zoom", zoomed);

        var svg = d3.select("#seizmap")
          .attr("width", width)
          .attr("height", height);

        var raster = svg.append("g")
          .on("click",function(){
            scope.$emit("deselect");
          })

        var vector = svg.append("path");


        // Compute the projected initial center.
        var center = projection([18.933333,48.733333]);

        // Apply a zoom transform equivalent to projection.{scale,translate,center}.
        svg
          .call(zoom)
          .call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(zoomlvl)
            .translate(-center[0], -center[1]));



        drawMap();


        function zoomed() {
          var transform = d3.event.transform;

          if(transform.k > 1 << 13 && zoomlvl <= 1 << 13) {
            aggregation = scope.seizByCity;
            getData();
            //colscale.domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.victims})])
            drawMap();


          }
          else if (transform.k < 1 << 13 && zoomlvl >= 1 << 13) {
            aggregation = scope.seizByNUTS;
            getData();
            //colscale.domain([1,d3.max(_.map(scope.cityByCount,"value"),function(d){return d.victims})])
            drawMap();
          }

          zoomlvl = transform.k;

          var tiles = tile
            .scale(transform.k)
            .translate([transform.x, transform.y])
            ();

          projection
            .scale(transform.k / tau)
            .translate([transform.x, transform.y]);

          vector
            .attr("d", path);

          var image = raster
            .attr("transform", stringify(tiles.scale, tiles.translate))
            .selectAll("image")
            .data(tiles, function(d) { return d; })



          svg.selectAll(".city")
            .attr("transform",function(d){return"translate("+projection([d.lon,d.lat])[0]+","+projection([d.lon,d.lat])[1]+")"})


          image.exit().remove();



          //https://api.mapbox.com/styles/v1/fenicento/ciskc3xy200dr2xp8s7wieg8d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmVuaWNlbnRvIiwiYSI6ImNpbmhsenNqeDAwMmd3ZGx5MXVmcjNrdTAifQ.D1nRFjJRXUR7PMk5eDJzHQ

          image.enter().append("image")
            .attr("xlink:href", function(d) { return "https://api.mapbox.com/styles/v1/fenicento/ciskc3xy200dr2xp8s7wieg8d/tiles/256/" + d[2] + "/" + d[0] + "/" + d[1] + "?access_token=pk.eyJ1IjoiZmVuaWNlbnRvIiwiYSI6ImNpbmhsenNqeDAwMmd3ZGx5MXVmcjNrdTAifQ.D1nRFjJRXUR7PMk5eDJzHQ"; })
            .attr("x", function(d) { return d[0] * 256; })
            .attr("y", function(d) { return d[1] * 256; })
            .attr("width", 257)
            .attr("height", 257);

        }

        function stringify(scale, translate) {
          var k = scale / 256, r = scale % 1 ? Number : Math.round;
          return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
        }



        scope.$on("refresh",function(){
          getData();
          drawMap();
        })


        function getData() {

          scope.cityByCount = aggregation.group().reduce(

            function(a, d) {
              a.count++;
              a.ids.push(d.Crime_ID)
              if (!a.lat) {a.lat = parseFloat(d['Y']); a.lon = parseFloat(d['X'])}
              if(!isNaN(parseInt(d["N. of fire"]))) {a.known++; a.seized+=parseInt(d["N. of fire"])}
              return a;
            },
            function(a, d) {
              a.count--;
              var pos = _.findIndex(a,function(e){return e.Crime_ID == d.Crime_ID})
              a.ids.slice(pos,1);
              if(!isNaN(parseInt(d["N. of fire"]))) {a.known--; a.seized-=parseInt(d["N. of fire"])}

              return a;
            },
            function() {
              return  {count:0, known:0, seized:0, ids:[]}; }

          ).all();
        }

        function drawMap() {

          var data = _.map(scope.cityByCount,"value").filter(function(d){return d.count > 0});

          var circles = svg.selectAll(".city").data(data,function(d){return d.key})

          var newc = circles.enter().append("g")
            .attr("class","city")


          newc.append("circle")
            .attr("cx",0)
            .attr("cy",0)
            .attr("r",function(d){return xscale(d.count)})
            .style("fill",function(d){return colscale(d.seized)})
            .style("opacity",0.2)
            .on("click", function(d){
              console.log(d);
              scope.$emit("click", d["Country"], d.ids);

            });


          newc.append("circle")
            .attr("cx",0)
            .attr("cy",0)
            .attr("r",function(d){return xscale(d.known)})
            .style("fill",function(d){return colscale(d.seized)})
            .style("opacity",0.9)
            .on("click", function(d){
              console.log(d);
              scope.$emit("click", d["Country"], d.ids);

            });



          svg.selectAll(".city")
            .attr("transform",function(d){return"translate("+projection([d.lon,d.lat])[0]+","+projection([d.lon,d.lat])[1]+")"})
            //.attr("cx",function(d){return projection([d.lon,d.lat])[0]})
            //.attr("cy",function(d){return projection([d.lon,d.lat])[1]})
            //.attr("r",function(d){return xscale(d.count)})
            //.style("fill",function(d){return colscale(d.seized)})
            //.style("opacity",0.7);

          circles.exit().remove();
        }
      }
    };
  });