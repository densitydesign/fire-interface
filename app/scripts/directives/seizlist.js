'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:seizlist
 * @description
 * # seizlist
 */
angular.module('fireInterfaceApp')
  .directive('seizlist', function () {
    return {
      templateUrl: 'views/seizlist.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {


        function updateList() {
          scope.byCountry = scope.seizByCountry.group().reduce(
            function (a, d) {
              a.push(d);
              return a;
            },
            function (a, d) {
              var el = _.findIndex(function (e) {
                return e.Crime_ID == d.Crime_ID
              })
              a.splice(el, 1);
              return a;
            },
            function () {
              return [];
            }
          ).all();

          if (scope.selected != "All Countries") {
            scope.byCountry = _.filter(scope.byCountry, function (e) {
              return e.key == scope.selected
            });

          }
          if (!scope.$$phase) scope.$apply();
        }


        scope.$on("refresh", function (e) {
          updateList();
        })


        scope.$on("refresh_click", function (e) {
          updateList();
        })


        updateList();

        scope.setCrime = function (c) {
          scope.crime = c;
          scope.shootersnat = c["Actors_nat"].split(";")
          scope.shootersage = c["Actors_age"].split(";")
          scope.shooterssex = c["Actors_gen"].split(";")
          var weps = c["Firearm_Ty"].split(";")

          scope.weparr;

          if (weps.length > 63 && c["N. of fire"] == weps.length) {
            scope.weparr = {"N/A": weps.length};
          }
            else if(weps.length > 63 && c["N. of fire"] != weps.length){
            scope.weparr = {"N/A": c["N. of fire"]};
          }
          else {
            scope.weparr = _.countBy(weps);
          }
        }


      }
    }
  });
