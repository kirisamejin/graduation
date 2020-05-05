"use strict";
exports.__esModule = true;
var Cesium = require("cesium");
function calcPos(pos1, vec) {
    var pos2 = Cesium.Cartesian3.add(pos1, vec, new Cesium.Cartesian3());
    return pos2;
}
(function () {
    var origin = [117.17927456, 31.85532486];
    var pos1 = Cesium.Cartesian3.fromDegrees(origin[0], origin[1]);
    var vec = [1219.36228, 932.92275];
    var pos2 = calcPos(pos1, new Cesium.Cartesian3(vec[0], vec[1]));
    console.log(pos2);
})();
