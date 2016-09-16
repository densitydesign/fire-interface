'use strict';

/**
 * @ngdoc service
 * @name fireInterfaceApp.dataservice
 * @description
 * # dataservice
 * Factory in the fireInterfaceApp.
 */
angular.module('fireInterfaceApp')
  .factory('dataservice', function ($q, $http) {
    // Service logic
    // ...


    // Public API here
    return {
      getFile : function(url){
        var deferred = $q.defer();
        $http.get(url).success(function(data){
          deferred.resolve(data);
        }).error(function(){

         console.log("error");

          deferred.reject("An error occured while fetching file");
        });

        return deferred.promise;
      }
    };
  });
