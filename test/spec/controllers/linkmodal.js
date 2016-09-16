'use strict';

describe('Controller: LinkmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('fireInterfaceApp'));

  var LinkmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinkmodalCtrl = $controller('LinkmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LinkmodalCtrl.awesomeThings.length).toBe(3);
  });
});
