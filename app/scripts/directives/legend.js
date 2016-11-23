'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:legend
 * @description
 * # legend
 */
angular.module('fireInterfaceApp')
  .directive('legend', function () {
    return {
      template: '',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the legend directive');

        function drawLegend(){

          var legend = d3.select('#'+scope.legend.id)

          legend.selectAll("*").remove();

          legend.style('height',scope.chartHeight+'px')
          		.style('position','relative')
          		.style('top','-55px')

          legend.append('h2').html('Legend').style('float','none')

          var legendSize = legend.append('div').attr('id','legend-size')
          legendSize.append('h6').html(scope.legend['size-title'])
          var sizeScale = legendSize.append('div').attr('class','size-scale')
          sizeScale.append('div').style('width',scope.legend['size-scale-1']).style('height',scope.legend['size-scale-1']).style('background', scope.legend['dots-color'])
          sizeScale.append('div').style('width',scope.legend['size-scale-2']).style('height',scope.legend['size-scale-2']).style('background', scope.legend['dots-color'])
          sizeScale.append('div').style('width',scope.legend['size-scale-3']).style('height',scope.legend['size-scale-3']).style('background', scope.legend['dots-color'])
          var sizeNumbers = legendSize.append('div').attr('class','numeric-scale')
          sizeNumbers.append('span').attr('id','legend-size-n-min').html(scope.legend['legend-size-n-min'])
          sizeNumbers.append('span').attr('id','legend-size-n-mid').html(scope.legend['legend-size-n-mid'])
          sizeNumbers.append('span').attr('id','legend-size-n-max').html(scope.legend['legend-size-n-max'])

          var legendColor = legend.append('div').attr('id','legend-color')
          legendColor.append('h6').html(scope.legend['color-title'])
          legendColor.append('div').attr('class','color-scale').style('background', scope.legend['color-gradient'])
          var numericScale = legendColor.append('div').attr('class','numeric-scale')
          numericScale.append('span').attr('id','legend-color-n-min').html(scope.legend['legend-color-n-min'])
          numericScale.append('span').attr('id','').html('&#8594;')
          numericScale.append('span').attr('id','legend-color-n-max').html(scope.legend['legend-color-n-max'])

        }

        scope.$watch('legend', function(newVal, oldVal){
        	drawLegend();
        })

      }
    };
  });
