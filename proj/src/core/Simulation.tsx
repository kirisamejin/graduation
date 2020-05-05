import * as React from "react";
import "./Simulation.scss";
import { StationModel } from "../constants/Models";
import { Legend } from "./Legend";

interface ISimulationProps {
  onSubmit: (stationId: number) => void;
}

export const Simulation = (props: ISimulationProps) => {
  const [id, useId] = React.useState(-1);
  const modelCount = StationModel.count;
  const modelList = Array(modelCount);
  for (let i = 0; i < modelCount; ++i) modelList[i] = i;

  const optionsNode = modelList.map((v, i) => {
    return (
      <option key={i} value={v}>
        {`${i}号变电站`}
      </option>
    );
  });

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      useId(parseInt(e.target.value));
    },
    []
  );

  return (
    <div className="simucontainer">
      <h3>火灾模拟</h3>
      {/* <div id="animationPlayer">
        <p>动画播放</p>
      </div> */}
      <div id="tripContainer">
        <select className="checkbox" onChange={onChange}>
          {optionsNode}
        </select>
        <button
          className="defultbtn"
          onClick={(e) => {
            e.preventDefault();
            props.onSubmit(id);
          }}
        >
          <p>跳闸</p>
        </button>
      </div>
      <Legend />
    </div>
  );
};
