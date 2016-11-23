'use strict';

/**
 * @ngdoc function
 * @name fireInterfaceApp.controller:ShootingsCtrl
 * @description
 * # ShootingsCtrl
 * Controller of the fireInterfaceApp
 */
angular.module('fireInterfaceApp')
  .controller('ShootingsCtrl', function ($scope, shootings) {

    $scope.legend = {
      'size-title':'Number of [shot/seiz]',
      'size-scale-1': '10px',
      'size-scale-2': '40px',
      'size-scale-3': '20px',
      'legend-size-n-min': 'min',
      'legend-size-n-mid': 'mid',
      'legend-size-n-max': 'max',
      'color-title':'Number of [deaths/guns]',
      'color-gradient': 'linear-gradient(to right, yellow, red)',
      'legend-color-n-min': 'min',
      'legend-color-n-max': 'max'
    }

    $scope.shootings = d3.tsvParse(shootings);
    $scope.links = [];

    var cfshoot = crossfilter($scope.shootings);
    $scope.shootById = cfshoot.dimension(function(d) { return d.Crime_ID; });
    $scope.shootByCountry = cfshoot.dimension(function(d) { return d.Country; });
    $scope.shootByDate = cfshoot.dimension(function(d) { return d["Event Date"]; });
    $scope.shootByCity = cfshoot.dimension(function(d) { return d["Event_city"]; });
    $scope.shootByNUTS = cfshoot.dimension(function(d) { return d["NUTS_ID"]; });


    $scope.countries = _.uniq(_.map($scope.shootings, "Country"));
    $scope.countries.unshift("All Countries");
    $scope.selected = $scope.countries[0];
    $scope.clicked = false;

    $scope.setCountry = function(s){

      $scope.selected = s;
      $scope.clicked = false;
      $scope.crime = null;
      $scope.shootById.filterAll();
      if(s!="All Countries") {
        $scope.shootByCountry.filterExact(s);
      }
      else {
        $scope.shootByCountry.filterAll();
      }

      $scope.$broadcast("refresh");
    }



    $scope.$on("dates",function(e,dates){
      $scope.shootByDate.filterRange(dates);

      $scope.$broadcast("refresh");
    })



    $scope.$on("click",function(e,country,ids) {

      $scope.clicked = true;
      $scope.shootById.filter(function(e){
        return ids.indexOf(e) > -1;
      });
      $scope.shootByCountry.filterExact(country);

      $scope.$broadcast("refresh");

    })

    $scope.$on("deselect",function(){

      $scope.clicked = false;
      $scope.shootById.filterAll();
      $scope.setCountry($scope.selected);
    })

    $scope.$watch("crime",function(n,o){
      if(n!=o) {
        console.log(n);
      }
    })

    $scope.modalShown = false;
    $scope.toggleModal = function(links) {

      console.log(links);
      $scope.links = links.split(";")
      $scope.modalShown = !$scope.modalShown;
    };



  });
