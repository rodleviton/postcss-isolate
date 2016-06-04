var expect = require('chai').expect;
var webpack = require('../../../index');
var sinon = require('sinon');

describe('plugin', function () {    
  it('should exist', function () {
    expect(webpack).to.be.a('Function');
  });
});
