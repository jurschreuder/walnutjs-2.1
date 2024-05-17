"use strict";

var _network = require("./network/network.js");
test('basic network', () => {
  const network = new _network.Network("test");
  expect(network.name).toBe("test");
});