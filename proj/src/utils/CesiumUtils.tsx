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
// #TODO: refactor
export const Hello = (props: HelloProps) => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjgzZWU4ZS0zNDMxLTRlM2EtODg5Yi01ODcxY2EzZTc4YjIiLCJpZCI6MjE0NzUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzk2NjQ2NDR9.ZM8dJsvr-vdTpTK1PvZVznEsHVRIC7nyvFyw3yYngtE";
  const name = "cesiumContainer";
  const startDate = new Date(2020, 2, 2, 16, 1, 3); //
  const endDate = new Date(2020, 2, 2, 22, 1, 3);
  const minuteInterval = 10;

  return (
    <div
      ref={() => {
        new Cesium.Viewer(name, {
          //temporarily disable animation widget
          animation: false
        });
      }}
      id={name}
    ></div>
  );
};
