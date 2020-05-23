import * as React from "react";
import { StationModel } from "../constants/Models";
import { Legend } from "./Legend";

export const StationSimulator = (props: any) => {
  const [id, useId] = React.useState(-1);
  const modelCount = StationModel.count;
  const modelList = Array(modelCount);
  for (let i = 0; i < modelCount; ++i) modelList[i] = i;

  const optionsNode = modelList.map((v, i) => {
    return (
      <option key={i} value={v}>
        {`${i}号`}
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
    <>
      <div id="tripContainer">
        <select className="checkbox" onChange={onChange}>
          {optionsNode}
        </select>
        <p>变电站</p>
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
      <Legend Style="" />
    </>
  );
};
