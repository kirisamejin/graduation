import * as Cesium from "cesium";
const { Color } = Cesium;

export const DangerColorCss = ["#FF0033", "#FF6600", "#FFAA00", "#11CCFF"];

export const DangerColor = [
  Color.fromCssColorString(DangerColorCss[0]),
  Color.fromCssColorString(DangerColorCss[1]),
  Color.fromCssColorString(DangerColorCss[2]),
  // new Color(0, 0, 0, 0.2)
  Color.fromCssColorString(DangerColorCss[3])
];

export const MaterialColor = {
  // firewire: new Color(255, 153, 0, 155),
  firewire: new Color(1, 0.3, 0.2, 1),
  firewire2: new Color(1, 0, 0, 1)
};

export const LightmaterialColor = {
  firewire: new Color(1, 0.3, 0.2, 0.6),
  firewire2: new Color(1, 0, 0, 0.5)
};

export const SilhouetteColor = Cesium.Color.NAVY;

export const ElectricPowerColorCss = [
  "#58D68D",
  "#EB984E",
  "#C0392B",
  "#1c0d42"
];

export const ElectricPowerColor = [
  Color.fromCssColorString(ElectricPowerColorCss[0]),
  Color.fromCssColorString(ElectricPowerColorCss[1]),
  Color.fromCssColorString(ElectricPowerColorCss[2]),
  Color.fromCssColorString(ElectricPowerColorCss[3])
];
