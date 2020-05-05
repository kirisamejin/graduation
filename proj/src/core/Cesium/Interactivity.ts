import * as Cesium from "cesium";

export function changeSelectorStyle(viewer: Cesium.Viewer) {
  // @ts-ignore
  const svg = viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName(
    "svg:svg"
  )[0];
  // svg.innerHTML ='<g transform="translate(80,80)"><path data-bind="attr: { transform: _transform }" d="你自定义的path代码" transform="scale(1)"></path></g>'; //修改选择器外观
  svg.style.fill = "#BCBCBC"; //还可
}
