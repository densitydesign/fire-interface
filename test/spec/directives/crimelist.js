'use strict';

describe('Directive: crimelist', function () {

  // load the directive's module
  beforeEach(module('fireInterfaceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<crimelist></crimelist>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the crimelist directive');
  }));
});
