export interface IDataSource {
    add: (datasource: any)=>void;
}

export interface IEntity {
    
}

export interface IEntityCollection {
    add: (entity: IEntity)=>IEntity;
}

export interface IJulianDate {
    fromDate: (date: Date)=>IJulianDate;
    addMinutes: (date: IJulianDate, mins: number, newInstance: IJulianDate)=>IJulianDate;
    clone: ()=>IJulianDate;
}

export interface IViewer {
    dataSources: IDataSource;
    zoomTo: (entities: any) =>void;
    entities: any;
    timeline: any;
    clock: any;
}

export interface ICesium {
    viewer: IViewer;
}