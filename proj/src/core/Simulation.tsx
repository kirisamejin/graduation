import * as React from "react";
import "./Simulation.scss";

import { Legend } from "./Legend";
import { StationSimulator } from "./StationSimulator";
import { FireSimulator } from "./FireSimulator";

interface ISimulationProps {
  onSubmit: (stationId: number) => void;
}

function getIcon(isOn: boolean) {
  const downIcon = (
    <svg
      t="1590244521022"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4523"
      width="16"
      height="16"
    >
      <path
        d="M512 610.88L930.88 192 1024 285.12l-512 512-512-512L93.12 192z"
        p-id="4524"
      ></path>
    </svg>
  );
  const rightIcon = (
    <svg
      t="1590244594262"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4909"
      width="16"
      height="16"
    >
      <path
        d="M610.88 512L192 93.12 285.12 0l512 512-512 512L192 930.88z"
        p-id="4910"
      ></path>
    </svg>
  );

  return isOn ? downIcon : rightIcon;
}

export const Simulation = (props: ISimulationProps) => {
  const [isOn, setOn] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const onClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.log(e.currentTarget.dataset);
    setCurrentIndex(~~e.currentTarget.dataset.index);
  };
  return (
    <div className="simucontainer">
      <div id="header">
        <h3>模拟器</h3>
        <div
          className="switch"
          onClick={() => {
            setOn((isOn) => !isOn);
          }}
        >
          {getIcon(isOn)}
        </div>
      </div>
      {/* <div id="animationPlayer">
        <p>动画播放</p>
      </div> */}
      {isOn && (
        <>
          <ul id="navTab">
            <li
              key={0}
              data-index={0}
              className={`tab ${currentIndex === 0 ? "active" : "inactive"}`}
              onClick={onClick}
            >
              火灾模拟
            </li>
            <li
              data-index={1}
              key={1}
              className={`tab ${currentIndex === 1 ? "active" : "inactive"}`}
              onClick={onClick}
            >
              断电模拟
            </li>
          </ul>
          {currentIndex === 0 ? (
            <FireSimulator />
          ) : (
            <StationSimulator onSubmit={props.onSubmit} />
          )}
        </>
      )}
    </div>
  );
};
