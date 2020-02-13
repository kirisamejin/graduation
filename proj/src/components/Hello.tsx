import * as React from "react";

import * as Cesium from "cesium";
const { ConstantProperty } = Cesium;
import "cesium/Build/Cesium/Widgets/widgets.css";

// @ts-ignore
import CesiumNavigation from "cesium-navigation-es6";

// import { IViewer, IJulianDate, IEntity } from "../types/Cesium";
import ModelChanger from "./ModelChanger";
import { ModelsPositions } from "../data/ModelsPositions";

import "./Hello.scss";
export interface HelloProps {
  compiler: string;
  framework: string;
}

declare type IPathname = "firewire" | "firewire2";

// 0 1 2 3
const DangerColor = [
  new Cesium.Color(1, 0, 0.2, 1),
  new Cesium.Color(1, 0.4, 0, 1),
  new Cesium.Color(1, 0.6, 0, 1),
  new Cesium.Color(0.1, 0.68, 1, 1)
];

const materialColor = {
  // firewire: new Cesium.Color(255, 153, 0, 155),
  firewire: new Cesium.Color(1, 0.3, 0.2, 1),
  firewire2: new Cesium.Color(1, 0, 0, 1)
};

const lightmaterialColor = {
  firewire: new Cesium.Color(1, 0.3, 0.2, 0.6),
  firewire2: new Cesium.Color(1, 0, 0, 0.5)
};

const Data = {
  firewire: new Array(),
  firewire2: new Array()
};

const Longitude = 117.17210532567749;
const Latitude = 31.850840820176757;

// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
export class Hello extends React.Component<HelloProps, {}> {
  public viewer: Cesium.Viewer | undefined;
  public name: string;
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly minuteInterval: number;
  public modelsId: string[];
  constructor(props: HelloProps) {
    super(props);
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjgzZWU4ZS0zNDMxLTRlM2EtODg5Yi01ODcxY2EzZTc4YjIiLCJpZCI6MjE0NzUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzk2NjQ2NDR9.ZM8dJsvr-vdTpTK1PvZVznEsHVRIC7nyvFyw3yYngtE";
    this.name = "cesiumContainer";
    this.startDate = new Date(2020, 2, 2, 16, 1, 3); //
    this.endDate = new Date(2020, 2, 2, 22, 1, 3);
    this.minuteInterval = 10;
    this.modelsId = [];
  }

  public readonly componentDidMount = (): void => {
    console.log("d", Cesium.Color.YELLOW);
    const MAPBOX_ACCESS_TOKEN =
      "pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g";
    const MAPBOX_STYLE_ID = "streets-v11";
    const MAPBOX_USERNAME = "mapbox";
    const DEFAULT_MAPURL = `https://api.mapbox.com/styles/v1/${MAPBOX_USERNAME}/${MAPBOX_STYLE_ID}/tiles/512/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    this.viewer = new Cesium.Viewer(this.name, {
      // imageryProvider: new Cesium.UrlTemplateImageryProvider({
      //   url: DEFAULT_MAPURL
      // })
      imageryProvider: new Cesium.MapboxImageryProvider({
        mapId: "mapbox.dark",
        accessToken: MAPBOX_ACCESS_TOKEN
      })
      //temporarily disable animation widget
      // animation: false
    });
    // this.viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);

    CesiumNavigation(this.viewer, {
      defaultResetView: Cesium.Rectangle.fromDegrees(
        Longitude,
        Latitude,
        130,
        50
      ),
      enableCompass: true,
      enableZoomControls: true,
      enableDistanceLegend: true,
      enableCompassOuterRing: true
    });
    // this.showLongitutde();
    // this.addLines();
    this.setDate();
    this.readData("firewire")
      //.then(() => this.readData("firewire2"))
      .then(() => {
        console.log(this.viewer.entities);
        return this.viewer.zoomTo(this.viewer.entities);
        // return this.readModel();
      })
      .then(() => {
        return this.readModel();
      })
      .then(() => {
        for (let i = 0; i < this.modelsId.length; ++i) {
          const id = this.modelsId[i];
          const longitude = ModelsPositions[i * 2];
          const latitude = ModelsPositions[i * 2 + 1];
          this.changeOverTime(id, longitude, latitude);
        }

        console.log("load finish");
      });
    // .then(() => {
    //   this.viewer.zoomTo(this.viewer.entities);
    //   this.changeOverTime("firewire");
    // });
  };

  public showLongitutde = () => {
    const { viewer } = this;
    const handler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas as HTMLCanvasElement
    );
    handler.setInputAction(function(event: any) {
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
      const height = cartographic.height;
      console.log("[Lng=>" + lng + ",Lat=>" + lat + ",H=>" + height + "]");
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  public changeOverTime = (id: string, log: number, lat: number) => {
    const pathname = "firewire";
    const { viewer, startDate, minuteInterval } = this;
    const entity = viewer.entities.getById(id);
    // console.log(entity);
    if (entity) {
      const colorProperty = new Cesium.TimeIntervalCollectionProperty();
      let start = Cesium.JulianDate.fromDate(startDate);
      console.log(start);
      let stop = Cesium.JulianDate.addMinutes(
        start,
        minuteInterval,
        new Cesium.JulianDate()
      );

      colorProperty.intervals.addInterval(
        new Cesium.TimeInterval({
          start,
          stop,
          isStartIncluded: true,
          isStopIncluded: true,
          data: DangerColor[3]
        })
      );

      start = Cesium.JulianDate.addMinutes(
        start,
        minuteInterval,
        new Cesium.JulianDate()
      );
      stop = Cesium.JulianDate.addMinutes(
        start,
        minuteInterval,
        new Cesium.JulianDate()
      );
      let distance;
      for (const positions of Data[pathname]) {
        distance = 2147483647;
        for (let i = 0; i < positions.length; i += 2) {
          const longitude = positions[i];
          const latitude = positions[i + 1];
          distance = Math.min(
            Cesium.Cartesian3.distance(
              Cesium.Cartesian3.fromDegrees(longitude, latitude),
              Cesium.Cartesian3.fromDegrees(log, lat)
            ),
            distance
          );
        }
        let color = DangerColor[3];
        if (distance < 100) {
          color = DangerColor[0];
        } else if (distance < 300) {
          color = DangerColor[1];
        } else if (distance < 500) {
          color = DangerColor[2];
        }
        // console.log(distance);
        start = Cesium.JulianDate.addMinutes(
          start,
          minuteInterval,
          new Cesium.JulianDate()
        );
        stop = Cesium.JulianDate.addMinutes(
          stop,
          minuteInterval,
          new Cesium.JulianDate()
        );
        colorProperty.intervals.addInterval(
          new Cesium.TimeInterval({
            start,
            stop,
            isStartIncluded: true,
            isStopIncluded: false,
            data: color
          })
        );
        // console.log(colorProperty._intervals.length);
        //console.log(diff, leaps, distance);
      }
      // console.log(colorProperty);
      if (id === "m") {
        entity.model.color = colorProperty;
      } else {
        entity.box.material = new Cesium.ColorMaterialProperty(colorProperty);
      }
    } else {
      console.log("no this id");
    }
  };

  public readModel = (): Promise<Cesium.IonResource> => {
    const { viewer, modelsId } = this;
    // 随机一些楼和地点
    const maxHeight = 100;
    const minHeight = 10;
    const maxLength = 50;
    const minLength = 20;
    const maxWidth = 50;
    const minWidth = 20;
    for (let i = 0; i < ModelsPositions.length; i += 2) {
      const height =
        Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
      const length =
        Math.floor(Math.random() * (maxLength - minLength)) + minLength;
      const width =
        Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
      const longitude = ModelsPositions[i];
      const latitude = ModelsPositions[i + 1];
      const entity = viewer.entities.add(
        new Cesium.Entity({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
          //#TODO model
          box: new Cesium.BoxGraphics({
            dimensions: new Cesium.Cartesian3(length, width, height)
          })
        })
      );
      modelsId.push(entity.id);
    }

    // 载入模型
    return Cesium.IonResource.fromAssetId("72897")
      .then((resource: any) => {
        console.log(resource);
        const entity = viewer.entities.add(
          new Cesium.Entity({
            id: "m",
            position: Cesium.Cartesian3.fromDegrees(Longitude, Latitude, 0),
            //	model: { uri: resource, scale: 4.0 }
            model: new Cesium.ModelGraphics({ uri: resource, scale: 4.0 })
          })
        );
        modelsId.push(entity.id);
      })
      .otherwise((error: any) => {
        console.log(error);
      });
  };

  public readData = (pathname: IPathname): Promise<void> => {
    const { endDate, viewer } = this;
    const startDate = this.startDate;
    const minuteInterval = this.minuteInterval;
    const addCorridorEntity = this.addCorridorEntity;

    const url = `http://127.0.0.1:3000/${pathname}`;
    let start = Cesium.JulianDate.fromDate(startDate);
    start = Cesium.JulianDate.addMinutes(
      start,
      minuteInterval,
      new Cesium.JulianDate()
    );
    let stop = Cesium.JulianDate.addMinutes(
      start,
      minuteInterval,
      new Cesium.JulianDate()
    );
    const positionsProperty = new Cesium.TimeIntervalCollectionProperty();

    return fetch(url, {
      method: "GET",
      mode: "cors"
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        // cacheData(pathname, res);
        Data[pathname] = res;

        for (const [i, positions] of res.entries()) {
          let index = i + 1;
          positionsProperty.intervals.addInterval(
            new Cesium.TimeInterval({
              start,
              stop,
              isStartIncluded: true,
              isStopIncluded: false,
              data: positions.map((pos: string) => parseFloat(pos))
            })
          );
          addCorridorEntity(
            positions.map((pos: string) => parseFloat(pos)),
            start,
            stop,
            materialColor[pathname],
            `${(index / 6).toFixed(2)}h`
          );
          start = Cesium.JulianDate.addMinutes(
            start,
            minuteInterval,
            new Cesium.JulianDate()
          );
          stop = Cesium.JulianDate.addMinutes(
            stop,
            minuteInterval,
            new Cesium.JulianDate()
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  public setDate = (): void => {
    const { viewer, startDate } = this;
    const clock = viewer.clock;
    // 30 / 5h = 6 / 1h  60min/6=10min
    //
    const start = Cesium.JulianDate.fromDate(startDate);
    const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
    // const stop = Cesium.JulianDate.addHours(start, 5, new Cesium.JulianDate());
    viewer.timeline.zoomTo(start, stop);

    clock.startTime = start.clone();
    clock.stopTime = stop.clone();
    console.log("start", clock.startTime);
    // clock.currentTime = start.clone();
    clock.currentTime = Cesium.JulianDate.addMinutes(
      start,
      10,
      new Cesium.JulianDate()
    );
    // CLAMPED/ LOOP_STOP/ UNBOUNDED Cesium.ClockRange.LOOP_STOP
    // clock.clockRange = Cesium.ClockRange.CLAMPED;
    // 1s -> 5min
    clock.multiplier = 600;
  };

  public addCorridorEntity = (
    positions: Array<number>,
    start: Cesium.JulianDate,
    stop: Cesium.JulianDate,
    color: any,
    label?: string
  ): Cesium.Entity => {
    const viewer = this.viewer;
    let index = positions.length;
    index = index / 2;
    if (index % 2 == 1) {
      index--;
    }

    return viewer.entities.add(
      new Cesium.Entity({
        // name: 'Yellow line on the surface',
        position: Cesium.Cartesian3.fromDegrees(
          positions[index],
          positions[index + 1],
          20
        ),
        corridor: new Cesium.CorridorGraphics({
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: new Cesium.ConstantProperty(3),
          material: color
        }),
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({ start, stop })
        ]),
        label: new Cesium.LabelGraphics({
          text: new ConstantProperty(label),
          showBackground: new ConstantProperty(true),
          scale: new ConstantProperty(0.6),
          horizontalOrigin: new ConstantProperty(
            Cesium.HorizontalOrigin.CENTER
          ),
          verticalOrigin: new ConstantProperty(Cesium.VerticalOrigin.BOTTOM),
          distanceDisplayCondition: new ConstantProperty(
            new Cesium.DistanceDisplayCondition(10.0, 8000.0)
          )
          //disableDepthTestDistance: new ConstantProperty(100.0)
        })
      })
    );
  };

  public render(): React.ReactNode {
    console.log("r");
    return (
      <>
        <div id={this.name}></div>
        <ModelChanger viewer={this.viewer} />
      </>
    );
  }
}
