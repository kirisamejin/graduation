import * as React from "react";
// @ts-ignore
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { IViewer, IJulianDate, IEntity } from "../types/Cesium";
export interface HelloProps {
  compiler: string;
  framework: string;
}
interface ImaterialColor {
  firewire: any;
  firewire2: any;
}
type IPathname = keyof ImaterialColor;

const materialColor: ImaterialColor = {
  // firewire: new Cesium.Color(255, 153, 0, 155),
  firewire: new Cesium.Color(1, 0.6, 0, 0.4),
  firewire2: new Cesium.Color(1, 0, 0, 0.4)
};
// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
export class Hello extends React.Component<HelloProps, {}> {
  public viewer: IViewer | undefined;
  public name: string;
  public readonly startDate: Date;
  public readonly minuteInterval: number;
  constructor(props: HelloProps) {
    super(props);
    // Cesium.Ion.defaultAccessToken =
    this.name = "cesiumContainer";
    this.startDate = new Date(2020, 2, 2, 16, 1, 3);
    this.minuteInterval = 10;
  }

  public readonly componentDidMount = (): void => {
    console.log("d", Cesium.Color.YELLOW);
    this.viewer = new Cesium.Viewer(this.name);

    // this.addLines();
    this.setDate();
    this.readData("firewire")
      .then(() => this.readData("firewire2"))
      .then(() => {
        this.viewer.zoomTo(this.viewer.entities);
      });
  };

  public readData = (pathname: IPathname): Promise<void> => {
    const startDate = this.startDate;
    const minuteInterval = this.minuteInterval;
    const addCorridorEntity = this.addCorridorEntity;

    const url = `http://127.0.0.1:3000/${pathname}`;
    let start = Cesium.JulianDate.fromDate(startDate);
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
        console.log(res.status);
        return res.json();
      })
      .then(res => {
        console.log(res);
        for (const [i, positions] of res.entries()) {
          addCorridorEntity(
            positions.map((pos: string) => parseFloat(pos)),
            start,
            stop,
            pathname,
            i % 6 === 0 ? `${i / 5}h` : undefined
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
    const stop = Cesium.JulianDate.addHours(start, 5, new Cesium.JulianDate());
    viewer.timeline.zoomTo(start, stop);

    clock.startTime = start.clone();
    clock.endTime = stop.clone();
    clock.currentTime = start.clone();
    // CLAMPED/ LOOP_STOP/ UNBOUNDED Cesium.ClockRange.LOOP_STOP
    // clock.clockRange = Cesium.ClockRange.CLAMPED;
    // 1s -> 5min
    // clock.multiplier = 300;
  };

  public addCorridorEntity = (
    positions: Array<number>,
    start: IJulianDate,
    stop: IJulianDate,
    color: IPathname,
    label?: string
  ): IEntity => {
    const viewer = this.viewer;
    return viewer.entities.add({
      // name: 'Yellow line on the surface',
      position: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], 20),
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray(positions),
        width: 3,
        material: materialColor[color]
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
