'use strict';

describe('Directive: modaldir', function () {

  // load the directive's module
  beforeEach(module('fireInterfaceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<modaldir></modaldir>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the modaldir directive');
  }));
});
