import { IDegree } from "../types/Cesium";
import { CurrentUrl } from "../constants/Server";

export const SourceBuildingsId = ["72897", "74222", "74224", "74227", "74228"];

export const ModelsPositions = [
  117.17614174,
  31.84176387,
  117.19159126,
  31.84978405,
  117.17133522,
  31.85459582,
  117.17880249,
  31.85481453,
  117.18772888,
  31.8419097,
];

// export const StationModel = {
//   id: "station",
//   position: [117.16918796871745, 31.85318321605651],
//   uri: "./assets/station.glb"
// };

// export const StationModel = {
//   id: "station",
//   position: [117.16918796871745, 31.85318321605651],
//   uri: "./assets/obj1.glb"
// };
// 117.14505697932314,31.86054516912211,
// 117.1607524616133,31.859518407806707
// 117.18909546073596,31.838277342057317
// 117.1343098933111,31.842346538067094
// 117.16459776940562,31.833809330774788
// 117.1813146608416,31.842948092551573

export const StationModelPosition = [
  117.14505697932314,
  31.86054516912211,
  117.1607524616133,
  31.859518407806707,
  117.19642403014147,
  31.825981422427784,
  117.1343098933111,
  31.842346538067094,
  117.16459776940562,
  31.833809330774788,
  117.1813146608416,
  31.842948092551573,
  117.15085815007961,
  31.847137424066084,
  117.17509847383648,
  31.86001037972251,
  117.13538155923668,
  31.836833525267576,
  117.19273320570703,
  31.86404465759285,
];

const stationModelUri = `${CurrentUrl}stationModel.glb`;

// const stationModelUri = `${CurrentUrl}compressed_station_model.glb`;
// const stationModelUri = `${CurrentUrl}compressd_station_model2.glb`;

export const StationModel = {
  id: "station",
  position: [117.16918796871745, 31.85318321605651],
  positions: StationModelPosition,
  count: 10, //10个变电站
  uri: stationModelUri,
};

export const Models = [
  // {
  //   id: "74409",
  //   position: [117.18129048229697, 31.854151240890033],
  //   //117.18129048229697,31.854151240890033
  //   // position: [117.17927456, 31.85532486],
  //   Cartesian3: [-2475668.7020411408, 4824727.014730462, 3346816.0044122054]
  // }
  {
    // 31.8518983500,117.1869134900
    index: "1",
    id: "mengyuanxiaoqu",
    //117.19197105324179,31.846943864364405
    position: [117.19197105324179, 31.846943864364405],
    // position: [117.19209696513595, 31.847049714098713],
    uri: `${CurrentUrl}mengyuanxiaoqu.glb`,
  },
  {
    index: "2",
    id: "southmengyuan",
    //117.19197105324179,31.846943864364405
    position: [117.19227625657075, 31.84341407625236],
    // position: [117.19209696513595, 31.847049714098713],
    uri: `${CurrentUrl}southmengyuan.glb`,
  },
  {
    index: "3",
    id: "haitangwan",
    //117.19197105324179,31.846943864364405
    position: [117.19758574110945, 31.84362957469665],
    // position: [117.19209696513595, 31.847049714098713],
    uri: `${CurrentUrl}haitangwan.glb`,
  },
  {
    index: "4",
    id: "huayikexueyuan",
    position: [117.19704133648504, 31.845829654074212],
    uri: `${CurrentUrl}huayikexueyuan.glb`,
  },
  {
    index: "5",
    id: "westtiantong",
    position: [117.19586691, 31.84831037],
    uri: `${CurrentUrl}westtiantong.glb`,
  },
  {
    index: "6",
    id: "easttiantong",
    position: [117.19833489130706, 31.848092662156947],
    uri: `${CurrentUrl}easttiantong.glb`,
  },
  {
    index: "7",
    id: "yuanjingtianxia",
    position: [117.191363053859, 31.850990513202344],
    uri: `${CurrentUrl}yuanjingtianxia.glb`,
  },
  {
    index: "9",
    id: "wangyuan",
    position: [117.19599123060756, 31.851317831435836],
    uri: `${CurrentUrl}wangyuan.glb`,
  },
  {
    index: "10",
    id: "shushanmingzhu",
    position: [117.18739753, 31.8508092],
    uri: `${CurrentUrl}shushanmingzhu.glb`,
  },
  {
    index: "11",
    id: "shuhuwanxiaoqu",
    position: [117.19048103, 31.85376025],
    uri: `${CurrentUrl}shuhuwanxiaoqu.glb`,
  },
  {
    index: "12",
    id: "chengshifengjing",
    position: [117.1926463470365, 31.852022509480463],
    uri: `${CurrentUrl}chengshifengjing.glb`,
  },
  {
    index: "13",
    id: "tianyiguojishangwuzhongxin",
    position: [117.19858299652155, 31.85444393142292],
    uri: `${CurrentUrl}tianyiguojishangwuzhongxin.glb`,
    //position: [117.19159126, 31.84978405]
  },
  {
    index: "14",
    id: "lvchengguihuayuan",
    position: [117.19423672, 31.84017822],
    uri: `${CurrentUrl}lvchengguihuayuan.glb`,
    //position: [117.19159126, 31.84978405]
  },
  {
    index: "15",
    id: "tianyuedasha",
    position: [117.20319561554129, 31.850600224478605],
    uri: `${CurrentUrl}tianyuedasha.glb`,
    //position: [117.19159126, 31.84978405]
  },
  {
    index: "16",
    id: "lanxizhen",
    position: [117.18665251355465, 31.83579981994325],
    uri: `${CurrentUrl}lanxizhen.glb`,
    //position: [117.19159126, 31.84978405]
  },
  {
    index: "17",
    id: "寺庙",
    position: [117.17858505, 31.83607664],
    uri: `${CurrentUrl}alou.glb`,
    //position: [117.19159126, 31.84978405]
  },
  // {
  //   id: "74224",
  //   position: [117.20179330859165, 31.85015520007622]
  //   //position: [117.17133522, 31.85459582]
  // },
  // {
  //   id: "74227",
  //   position: [117.20355595385, 31.851248589466]
  // },
  // {
  //   id: "74228",
  //   position: [117.18772888, 31.8419097]
  // }
];

export const DegreeOfDangerArray = [1000, 1500, 2500];

export const DegreeOfDanger: IDegree = {
  Degree1: 1000,
  Degree2: 1500,
  Degree3: 2500,
};

export const DegreeOfElectricPower: IDegree = {
  Degree1: 1000,
  Degree2: 1300,
  Degree3: 2000,
};

export const DegreeOfElectricPowerArray = [1000, 1300, 2000];
