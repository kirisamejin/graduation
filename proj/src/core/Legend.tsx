import * as React from "react";
import { DangerColorCss } from "../constants/Colors";
import { DegreeOfDangerArray } from "../constants/Models";
import "./Legend.scss";

export const Legend = (props: {}) => {
  const colors = DangerColorCss;
  const nodes = colors.map((v, index) => {
    const text =
      index === colors.length - 1
        ? ` > ${DegreeOfDangerArray[index - 1]}m`
        : ` <= ${DegreeOfDangerArray[index]}m`;
    return (
      <div key={index} className="legend">
        <div
          className="rectangle"
          style={{
            backgroundColor: DangerColorCss[index],
          }}
        ></div>{" "}
        {text}
      </div>
    );
  });
  return (
    <div id="legendContainer">
      <p>危险距离图例</p>
      <>{nodes}</>
    </div>
  );
};
