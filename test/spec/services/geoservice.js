'use strict';

describe('Service: geoservice', function () {

  // load the service's module
  beforeEach(module('fireInterfaceApp'));

  // instantiate service
  var geoservice;
  beforeEach(inject(function (_geoservice_) {
    geoservice = _geoservice_;
  }));

  it('should do something', function () {
    expect(!!geoservice).toBe(true);
  });

});
