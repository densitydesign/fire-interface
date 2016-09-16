'use strict';

describe('Controller: ShootingsCtrl', function () {

  // load the controller's module
  beforeEach(module('fireInterfaceApp'));

  var ShootingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShootingsCtrl = $controller('ShootingsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ShootingsCtrl.awesomeThings.length).toBe(3);
  });
});
