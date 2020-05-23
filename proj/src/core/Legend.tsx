import * as React from "react";
import { DangerColorCss, ElectricPowerColorCss } from "../constants/Colors";
import {
  DegreeOfDangerArray,
  DegreeOfElectricPowerArray,
} from "../constants/Models";
import "./Legend.scss";

export const Legend = (props: { Style: string }) => {
  const style = props.Style;
  let options;
  if (style === "danger") {
    options = [DangerColorCss, DegreeOfDangerArray, "危险距离图例"];
  } else {
    options = [ElectricPowerColorCss, DegreeOfElectricPowerArray, "供电图例"];
  }
  let [colors, array, name] = options;

  const nodes = colors.map((v, index) => {
    const text =
      index === colors.length - 1
        ? ` > ${array[index - 1]}m`
        : ` <= ${array[index]}m`;

    console.log(v);
    return (
      <div key={index} className="legend">
        <div
          className="rectangle"
          style={{
            backgroundColor: v,
          }}
        ></div>{" "}
        {text}
      </div>
    );
  });
  return (
    <div id="legendContainer">
      <p>{name}</p>
      <>{nodes}</>
    </div>
  );
};
