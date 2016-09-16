'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:crimelist
 * @description
 * # crimelist
 */
angular.module('fireInterfaceApp')
  .directive('crimelist', function () {
    return {
      templateUrl: 'views/crimelist.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {


        function updateList () {
          scope.byCountry = scope.shootByCountry.group().reduce(
            function(a, d) {
              a.push(d);
              return a;
            },
            function(a, d) {
              var el = _.findIndex(function(e){return e.Crime_ID == d.Crime_ID})
              a.splice(el,1);
              return a;
            },
            function() {
              return  []; }
          ).all();

          if(scope.selected != "All Countries") {
            scope.byCountry = _.filter(scope.byCountry,function(e){return e.key == scope.selected});

          }
          if (!scope.$$phase) scope.$apply();
        }


        scope.$on("refresh",function(e){
          updateList();
        })


        scope.$on("refresh_click",function(e){
          updateList();
        })


        updateList();

        scope.setCrime = function(c) {
          scope.crime = c;
          scope.shootersnat = c["Shooters_n"].split(";")
          scope.shootersage = c["Shooters_a"].split(";")
          scope.shooterssex = c["Shooters_g"].split(";")
          scope.injunat = c["Injured_na"].split(";")
          scope.injuage = c["Injured_ag"].split(";")
          scope.injusex = c["Injured_ge"].split(";")
          scope.victnat = c["Victims_na"].split(";")
          scope.victage = c["Victims_ag"].split(";")
          scope.victsex = c["Victims_ge"].split(";")
          scope.weptype = c["Firearm_ty"].split(";")
          scope.wepposs = c["Possession"].split(";")
          scope.wepseiz = c["Seized"].split(";")
        }
        

      }
    };
  });
