import * as Cesium from "cesium";

function updateBuildingsPosition(
  entity: Cesium.Entity,
  positionProperty: Cesium.PositionProperty
) {
  entity.position = positionProperty;
}

export function getLogLatFromPos(
  viewer: Cesium.Viewer,
  pos: Cesium.Cartesian3
) {
  const cartographic = Cesium.Cartographic.fromCartesian(
    pos,
    viewer.scene.globe.ellipsoid,
    new Cesium.Cartographic()
  );
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lng = Cesium.Math.toDegrees(cartographic.longitude);
  return [lat, lng];
}

export function registerClickEntityHanlder(viewer: Cesium.Viewer) {
  // const handler = new Cesium.ScreenSpaceEventHandler(
  //   viewer.scene.canvas as HTMLCanvasElement
  // );
  // function test(event: { position: Cesium.Cartesian2 }) {
  //   const entity = viewer.selectedEntity;
  //   if (entity) {
  //     const currentPos = entity.position.getValue(viewer.clock.currentTime);
  //     const ellipsoid = viewer.scene.globe.ellipsoid;
  //     const cartographic = ellipsoid.cartesianToCartographic(currentPos);
  //     const lat = Cesium.Math.toDegrees(cartographic.latitude);
  //     const lng = Cesium.Math.toDegrees(cartographic.longitude);
  //     const dis =
  //     entity.description = new Cesium.ConstantProperty(
  //       `<div>经度：${lng}</div><div>纬度：${lat}</div><div>最小距离: ${dis}</div>`
  //     );
  //   }
  // }
  // handler.setInputAction(test, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function registerClickHanlder(viewer: Cesium.Viewer) {
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  const handler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas as HTMLCanvasElement
  );
  function test(event: { position: Cesium.Cartesian2 }) {
    const entity = viewer.selectedEntity;

    const earthPosition = viewer.camera.pickEllipsoid(
      event.position,
      viewer.scene.globe.ellipsoid
    );
    const cartographic = Cesium.Cartographic.fromCartesian(
      earthPosition,
      viewer.scene.globe.ellipsoid,
      new Cesium.Cartographic()
    );
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const lng = Cesium.Math.toDegrees(cartographic.longitude);
    console.log(lng + "," + lat);
  }

  handler.setInputAction(test, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
