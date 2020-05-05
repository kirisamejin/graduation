import * as Cesium from "cesium";

function calcPos(pos1: Cesium.Cartesian3, vec: Cesium.Cartesian3) {
  const pos2 = Cesium.Cartesian3.add(pos1, vec, new Cesium.Cartesian3());
  return pos2;
}

(function() {
  let origin = [117.17927456, 31.85532486];
  const pos1 = Cesium.Cartesian3.fromDegrees(origin[0], origin[1]);

  const vec = [1219.36228, 932.92275];
  const pos2 = calcPos(pos1, new Cesium.Cartesian3(vec[0], vec[1]));
  console.log(pos2);
})();
