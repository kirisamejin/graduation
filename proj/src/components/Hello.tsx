import * as React from "react";
// @ts-ignore
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// @ts-ignore
import CesiumNavigation from "cesium-navigation-es6";

import { IViewer, IJulianDate, IEntity } from "../types/Cesium";
export interface HelloProps {
  compiler: string;
  framework: string;
}

declare type IPathname = "firewire" | "firewire2";

const materialColor = {
  // firewire: new Cesium.Color(255, 153, 0, 155),
  firewire: new Cesium.Color(1, 0.6, 0, 1),
  firewire2: new Cesium.Color(1, 0, 0, 1)
};

const lightmaterialColor = {
  firewire: new Cesium.Color(1, 0.6, 0, 0.6),
  firewire2: new Cesium.Color(1, 0, 0, 0.5)
};
// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
export class Hello extends React.Component<HelloProps, {}> {
  public viewer: IViewer | undefined;
  public name: string;
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly minuteInterval: number;
  constructor(props: HelloProps) {
    super(props);
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjgzZWU4ZS0zNDMxLTRlM2EtODg5Yi01ODcxY2EzZTc4YjIiLCJpZCI6MjE0NzUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzk2NjQ2NDR9.ZM8dJsvr-vdTpTK1PvZVznEsHVRIC7nyvFyw3yYngtE";
    this.name = "cesiumContainer";
    this.startDate = new Date(2020, 2, 2, 16, 1, 3); //
    this.endDate = new Date(2020, 2, 2, 22, 1, 3);
    this.minuteInterval = 10;
  }

  public readonly componentDidMount = (): void => {
    console.log("d", Cesium.Color.YELLOW);
    this.viewer = new Cesium.Viewer(this.name, {
      imageryProvider: new Cesium.MapboxImageryProvider({
        mapId: "mapbox.streets.v8"
      })
    });
    CesiumNavigation(this.viewer, {
      defaultResetView: Cesium.Rectangle.fromDegrees(80, 22, 130, 50),
      enableCompass: true,
      enableZoomControls: true,
      enableDistanceLegend: true,
      enableCompassOuterRing: true
    });

    // this.addLines();
    this.setDate();
    this.readData("firewire")
      .then(() => this.readData("firewire2"))
      .then(() => {
        this.viewer.zoomTo(this.viewer.entities);
      });
  };

  public readData = (pathname: IPathname): Promise<void> => {
    const { endDate } = this;
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

    return fetch(url, {
      method: "GET",
      mode: "cors"
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        for (const [i, positions] of res.entries()) {
          const index = i + 1;
          const flag = index % 6 == 0;
          addCorridorEntity(
            positions.map((pos: string) => parseFloat(pos)),
            start,
            flag ? Cesium.JulianDate.fromDate(endDate) : stop,
            flag ? materialColor[pathname] : lightmaterialColor[pathname],
            flag ? `${index / 6}h` : undefined
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
    clock.endTime = stop.clone();

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
    start: IJulianDate,
    stop: IJulianDate,
    color: any,
    label?: string
  ): IEntity => {
    const viewer = this.viewer;
    let index = positions.length;
    index = index / 2;
    if (index % 2 == 1) {
      index--;
    }

    return viewer.entities.add({
      // name: 'Yellow line on the surface',
      position: Cesium.Cartesian3.fromDegrees(
        positions[index],
        positions[index + 1],
        20
      ),
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray(positions),
        width: 3,
        material: color
      },
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start, stop })
      ]),
      label: !!label
        ? {
            text: label,
            showBackground: true,
            scale: 0.6,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              10.0,
              8000.0
            ),
            disableDepthTestDistance: 100.0
          }
        : undefined
    });
  };

  public render(): React.ReactNode {
    console.log("r");
    return (
      <div
        id={this.name}
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      ></div>
    );
  }
}
