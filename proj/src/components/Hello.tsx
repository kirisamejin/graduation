import * as React from "react";
// @ts-ignore
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";


import { IViewer, IJulianDate } from "../types/Cesium";
export interface HelloProps { compiler: string; framework: string; }

// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;
export class Hello extends React.Component<HelloProps, {}> {
    public viewer: IViewer | undefined;
    public name: string;
    public readonly startDate: Date;
    public readonly minuteInterval: number;
    constructor(props: HelloProps) {
        super(props);
        this.name = "cesiumContainer";
        this.startDate = new Date(2020, 2, 2, 16, 1, 3);
        this.minuteInterval = 10;
    }

    public readonly componentDidMount = (): void => {
        console.log("d")
        this.viewer = new Cesium.Viewer(this.name);

        // this.addLines();
        this.setDate();
        this.readData();
        
    }

    public readData = (): void => {
        const startDate = this.startDate;
        const minuteInterval = this.minuteInterval;
        const addCorridorEntity = this.addCorridorEntity;

        const url = `http://127.0.0.1:3000/firewire`;
        let start = Cesium.JulianDate.fromDate(startDate);
        let stop = Cesium.JulianDate.addMinutes(start, minuteInterval, new Cesium.JulianDate());

        fetch(url, {
            method: 'GET',
            mode: 'cors',
        })
        .then((res) => {
            return res.json();
        })
        .then(res => {
            console.log(res);
            for(const positions of res) {
                addCorridorEntity(positions.map((pos: string) => parseFloat(pos)), start, stop);
                start = Cesium.JulianDate.addMinutes(start, minuteInterval, new Cesium.JulianDate());
                stop = Cesium.JulianDate.addMinutes(stop, minuteInterval, new Cesium.JulianDate());
            }
            this.viewer.zoomTo(this.viewer.entities);
        }).catch(err => {
            console.log(err);
        }

        );
    }

    public setDate = (): void => {

        const viewer = this.viewer;
        const clock = viewer.clock;
        // 30 / 5h = 6 / 1h  60min/6=10min
        // 
        const start = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 16, 1, 3));
        const stop = Cesium.JulianDate.addHours(start, 5, new Cesium.JulianDate());
        viewer.timeline.zoomTo(start, stop);
        
        clock.startTime = start.clone();
        clock.endTime = stop.clone();
        clock.currentTime = start.clone();
        // CLAMPED/ LOOP_STOP/ UNBOUNDED Cesium.ClockRange.LOOP_STOP
        // clock.clockRange = Cesium.ClockRange.CLAMPED;
        // 1s -> 5min
        // clock.multiplier = 300;
    }

    public addCorridorEntity = (positions: Array<number>, start: IJulianDate, stop: IJulianDate): void => {
        const viewer = this.viewer;
        return viewer.entities.add({
            name: 'Yellow line on the surface',
            corridor: {
                positions: Cesium.Cartesian3.fromDegreesArray(positions),
                width: 3,
                material: Cesium.Color.YELLOW,
            },
            availability: new Cesium.TimeIntervalCollection(
                [new Cesium.TimeInterval({start,stop})]
            )
        });
    }

    // public addLines = (): void => {
    //     const viewer = this.viewer;
    //     let start = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 16, 1, 3));
    //     let stop = Cesium.JulianDate.addMinutes(start, 10, new Cesium.JulianDate());
    //     console.log(start,stop);

    //     const y = viewer.entities.add({
    //         name: 'Yellow line on the surface',
    //         corridor: {
    //             positions: Cesium.Cartesian3.fromDegreesArray([
    //                 117.16918796871745,31.85318321605651,
    //                 117.16938611707407,31.852764140684513,
    //                 117.1698206703775,31.852806011641874,
    //                 117.17004085117813,31.853231501785483,
    //                 117.16958774998982,31.853162441318396,
    //                 117.16918796871745,31.85318321605651
    //             ]),
    //             width: 2,
    //             material: Cesium.Color.YELLOW,
    //         },
    //         availability: new Cesium.TimeIntervalCollection(
    //             [new Cesium.TimeInterval({
    //                 start: start,
    //                 stop: stop,
    //             })]
    //         )
    //     });

    //     start = Cesium.JulianDate.addMinutes(start, 10, new Cesium.JulianDate());
    //     stop = Cesium.JulianDate.addMinutes(stop, 10, new Cesium.JulianDate());
    //     console.log(start,stop);

    //     const r = viewer.entities.add({
    //         name: 'Red line on the surface',
    //         corridor: {
    //             positions: Cesium.Cartesian3.fromDegreesArray([
    //                 117.16918796871745,31.85318321605651,
    //                 117.16927233047485,31.852858589218027,
    //                 117.16935669223227,31.852533962379542,
    //                 117.16965903638774,31.85260815506204,
    //                 117.1699613805432,31.852682347744533,
    //                 117.17000111586067,31.85295692476501,
    //                 117.17004085117813,31.853231501785483,
    //                 117.16958774998982,31.853162441318396,
    //                 117.16918796871745,31.85318321605651,
    //             ]),
    //             width: 2,
    //             material: Cesium.Color.RED
    //         },
    //         availability: new Cesium.TimeIntervalCollection(
    //             [new Cesium.TimeInterval({
    //                 start: start,
    //                 stop: stop,
    //             })]
    //         )
    //     });

    //     viewer.zoomTo(y).then(() => {
    //         console.log("zoom");
    //     });
    // }

    public render(): React.ReactNode {
        console.log("r");
        return (<div id={this.name} style={{  width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            overflow: "hidden"}}></div>);
    }
}