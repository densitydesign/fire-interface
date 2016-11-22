'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('fireInterfaceApp')
  .directive('timeline', function ($rootScope) {
    return {
      template: '<svg></svg>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var emptymonths = createMonthInterval("2010-01","2015-03");
        var monthref = _.map(emptymonths,"key");
        var bymonth;

        function createMonthInterval(start,end){
          var arr = [];
          var s = moment(start);
          var e = moment(end);

          while (s.isBefore(e)) {
            s.add(1,"months");
            arr.push({key:s.toISOString().substring(0,7),value:0});
          }
          arr.push({key:end, value:0});
          return arr;
        }


        function computeData() {

          bymonth = scope.shootByDate.group(function(d){
            return d.substring(0,7)
          }).top(Infinity)

          scope.monthdata = [];

          monthref.forEach(function(d,i){
            var found = _.find(bymonth, function(e){return e.key == d})
            if(found) {
              scope.monthdata.push(found);
            }
            else scope.monthdata.push(emptymonths[i]);
          })
        }

        scope.$watch("selected",function(n,o){
          if(n) {
            computeData();
            draw();
          }
        })

        scope.$on("refresh",function(){
          computeData();
          draw();
        })


        var chart = d3.select(element[0]);

        var margin = { top: 10, right: 10, bottom: 40, left: 40 };
        var chartWidth = element[0].clientWidth + margin.left;
        var chartHeight = element[0].clientHeight - margin.bottom;

        var width = chartWidth - margin.left*2 - margin.right*2;
        var height = chartHeight - margin.top - margin.bottom;

        var posl = 0, posr = width;



        var parseTime = d3.timeParse("%Y-%m");

        var x = d3.scaleTime()
          .range([0, width]);

        var y = d3.scaleLinear()
          .range([height, 0]);

        var line = d3.line()
          .x(function(d) { return x(parseTime(d.key)); })
          .y(function(d) { return y(d.value); });

        var svg = chart.select("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var graph = svg.append("g")
          .attr("class","graph")

        var brushsq = svg.append("rect")
          .attr("class","brush brush-sq")
          .attr("x",d3.min([posl,posr]))
          .attr("y",0)
          .attr("width",Math.abs(posl-posr))
          .style("fill","#BA5D4A")
          .style("stroke","none")
          .style("opacity",0.2)
          .attr("height",height);


        var brushl = svg.append("g")
          .attr("class","brush brush-l")
          .attr("transform","translate("+posl+",0)")
          .call(d3.drag()
            .on("drag", dragged)
          .on("end", dragEnd));



          brushl.append("line")
            .attr("class","brush")
            .attr("x1",0)
          .attr("x2",0)
          .attr("y1",0)
          .attr("y2",height)
          .style("stroke","black")
          .style("stroke-width",2)

        brushl.append("line")
          .attr("class","brush")
          .attr("x1",0)
          .attr("x2",0)
          .attr("y1",30)
          .attr("y2",height-30)
          .style("stroke","black")
          .style("stroke-width",10)

        var brushr = svg.append("g")
          .attr("class","brush brush-r")
          .attr("transform","translate("+posr+",0)")
          .call(d3.drag()
            .on("drag", dragged)
            .on("end", dragEnd));

          brushr.append("line")
            .attr("class","brush")
          .attr("x1",0)
          .attr("x2",0)
          .attr("y1",0)
          .attr("y2",height)
          .style("stroke","black")
          .style("stroke-width",2)

        brushr.append("line")
          .attr("class","brush")
          .attr("x1",0)
          .attr("x2",0)
          .attr("y1",30)
          .attr("y2",height-30)
          .style("stroke","black")
          .style("stroke-width",10)





       function draw() {

         graph.selectAll("*:not(.brush)").remove();

          x.domain(d3.extent(scope.monthdata, function(d) { return parseTime(d.key); }));
          y.domain([0,d3.max(scope.monthdata, function(d) { return d.value; })]);

         graph.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

         graph.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickPadding(12))


         graph.append("path")
            .datum(scope.monthdata)
            .attr("class", "line")
            .attr("d", line);
        }

        function dragged(d) {

          var el = d3.select(this);
          var side = el.attr("class").indexOf("brush-l") < 0 ? "r" : "l";

          var mousex = d3.event.x;
          if (mousex < 0) mousex = 0;
          if (mousex > width) mousex = width;
          var snap = d3.timeMonth.round(x.invert(mousex))

          var diff = side == "l" ? snap - x.invert(posr) : snap - x.invert(posl)
          if (Math.abs(diff) > 0) {
            if (side == "r") {
              posr = x(snap);
              d3.select(this).attr("transform", "translate(" + posr + ",0)");
            }
            else {
              posl = x(snap);
              d3.select(this).attr("transform", "translate(" + posl + ",0)");
            }
          }

          d3.select(".brush-sq")
            .attr("x", d3.min([posl, posr]))
            .attr("y", 0)
            .attr("width", Math.abs(posl - posr))
        }


          function dragEnd(d) {

            var bounds = [posl,posr].sort()
            bounds = [x.invert(bounds[0]).toISOString().substring(0,7),x.invert(bounds[1]).toISOString().substring(0,7)];
            scope.$emit("dates", bounds);

          }





      }
    };
  });
