'use strict';

describe('Filter: mynumber', function () {

  // load the filter's module
  beforeEach(module('fireInterfaceApp'));

  // initialize a new instance of the filter before each test
  var mynumber;
  beforeEach(inject(function ($filter) {
    mynumber = $filter('mynumber');
  }));

  it('should return the input prefixed with "mynumber filter:"', function () {
    var text = 'angularjs';
    expect(mynumber(text)).toBe('mynumber filter: ' + text);
  });

});
