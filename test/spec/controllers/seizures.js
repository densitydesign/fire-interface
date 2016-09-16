'use strict';

describe('Controller: SeizuresCtrl', function () {

  // load the controller's module
  beforeEach(module('fireInterfaceApp'));

  var SeizuresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeizuresCtrl = $controller('SeizuresCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeizuresCtrl.awesomeThings.length).toBe(3);
  });
});
