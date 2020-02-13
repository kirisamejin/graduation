import * as React from "react";
// @ts-ignore
import * as Cesium from "cesium";
import { IViewer } from "../types/Cesium";

interface ModelChangeProps {
  viewer: IViewer;
}

interface ModelChangeState {
  longitude: number;
  latitude: number;
  longitude2: number;
  latitude2: number;
  distance: number;
}

export default class ModelChange extends React.Component<
  ModelChangeProps,
  ModelChangeState
> {
  constructor(props: ModelChangeProps) {
    super(props);
    this.state = {
      longitude: 0,
      latitude: 0,
      longitude2: 0,
      latitude2: 0,
      distance: 0
    };
  }

  public handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    // @ts-ignore
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // change
    const { longitude, latitude, longitude2, latitude2 } = this.state;
    // const entity = this.props.viewer.entities.getById("house");
    // entity.positon = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
    const distance = Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(longitude, latitude),
      Cesium.Cartesian3.fromDegrees(longitude2, latitude2)
    );
    this.setState({
      distance
    });
    console.log(distance);
    event.preventDefault();
  }

  public render() {
    const { longitude, latitude, longitude2, latitude2, distance } = this.state;
    return (
      <>
        <label>
          longitude
          <textarea
            value={longitude}
            onChange={this.handleChange}
            name="longitude"
          />
        </label>
        <label>
          latitude
          <textarea
            value={latitude}
            onChange={this.handleChange}
            name="latitude"
          />
        </label>
        <label>
          longitude2
          <textarea
            value={longitude2}
            onChange={this.handleChange}
            name="longitude2"
          />
        </label>
        <label>
          latitude2
          <textarea
            value={latitude2}
            onChange={this.handleChange}
            name="latitude2"
          />
        </label>
        <p>{distance}</p>
        <button value="get" onClick={this.handleSubmit} />
      </>
    );
  }
}
