import * as Cesium from "cesium";
// 火线模拟的开始的时间
// year, month, date?, hours?, minutes?, seconds?, ms
export const FirewireStartDate = new Date(2020, 2, 2, 10, 1, 3);
// add six hours 2020 2 2 16 1 3
export const FirewireEndDate = new Date(2020, 2, 2, 16, 1, 3); // ????

const FirewireStartJulianData = Cesium.JulianDate.fromDate(FirewireStartDate);
const FirewireEndJulianData = Cesium.JulianDate.addHours(
  FirewireStartJulianData,
  6,
  new Cesium.JulianDate()
);
// 火线模拟时间之后是跳匝模拟，再加一个时间加入跳匝后当前的颜色
// const PowerStartDate = FirewireEndDate;
// const PowerEndDate = new Date(2020, 2, 2, 17, 1, 3);
export const PowerStartJulianDate = FirewireEndJulianData.clone();
export const PowerEndJulianDate = Cesium.JulianDate.addHours(
  PowerStartJulianDate,
  1,
  new Cesium.JulianDate()
);

export const MinuteInterval = 10;
