export interface IDataSource {
  add: (datasource: any) => void;
}

export interface IEntity {}

export interface IEntityCollection {
  add: (entity: IEntity) => IEntity;
  getById: (id: string) => IEntity;
}

export interface IJulianDate {
  fromDate: (date: Date) => IJulianDate;
  addMinutes: (
    date: IJulianDate,
    mins: number,
    newInstance: IJulianDate
  ) => IJulianDate;
  clone: () => IJulianDate;
}

interface IViewerMixin {}
interface IPrimitive {}
interface ICesium3DTileset {}
interface IPrimitiveCollection {
  add(tileset: ICesium3DTileset): void;
}

interface IScene {
  primitives: IPrimitiveCollection;
  pickPositionSupported: boolean;
  canvas: any;
  globe: any;
  pickPosition(pos: any): void;
  pick(pos: any): void;
}

export interface IViewer {
  dataSources: IDataSource;
  trackedEntity: IEntity;
  scene: IScene;
  zoomTo: (entities: any) => any;
  extend: (mixin: IViewer | IViewerMixin, options?: object) => void;
  entities: any;
  timeline: any;
  clock: any;
  canvas: any;
  camera: any;
}

export interface ICesium {
  viewer: IViewer;
}

export interface IDegree {
  Degree1: number;
  Degree2: number;
  Degree3: number;
}
