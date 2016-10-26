'use strict';

/**
 * @ngdoc function
 * @name fireInterfaceApp.controller:SeizuresCtrl
 * @description
 * # SeizuresCtrl
 * Controller of the fireInterfaceApp
 */
angular.module('fireInterfaceApp')
  .controller('SeizuresCtrl', function ($scope, seizures) {
    $scope.seizures = d3.tsvParse(seizures);
    $scope.links = [];

    // console.log($scope.seizures);

    var cfshoot = crossfilter($scope.seizures);
    $scope.seizById = cfshoot.dimension(function(d) { return d.Crime_ID; });
    $scope.seizByCountry = cfshoot.dimension(function(d) { return d.Country; });
    $scope.seizByDate = cfshoot.dimension(function(d) { return d["Event_date"]; });
    $scope.seizByCity = cfshoot.dimension(function(d) { return d["Seizure_ci"]; });
    $scope.seizByNUTS = cfshoot.dimension(function(d) { return d["NUTS_ID"]; });

    $scope.countries = _.uniq(_.map($scope.seizures, "Country"));
    $scope.countries.unshift("All Countries");
    $scope.selected = $scope.countries[0];
    $scope.clicked = false;

    $scope.setCountry = function(s){

      $scope.selected = s;
      $scope.clicked = false;
      $scope.crime = null;
      $scope.seizById.filterAll();
      if(s!="All Countries") {
        $scope.seizByCountry.filterExact(s);
      }
      else {
        $scope.seizByCountry.filterAll();
      }

      $scope.$broadcast("refresh");
    }



    $scope.$on("dates",function(e,dates){
      $scope.seizByDate.filterRange(dates);

      $scope.$broadcast("refresh");
    })



    $scope.$on("click",function(e,country,ids) {

      $scope.clicked = true;
      $scope.seizById.filter(function(e){
        return ids.indexOf(e) > -1;
      });
      $scope.seizByCountry.filterExact(country);

      $scope.$broadcast("refresh");

    })

    $scope.$on("deselect",function(){

      $scope.clicked = false;
      $scope.seizById.filterAll();
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



