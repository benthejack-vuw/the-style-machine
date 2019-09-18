import {GeometryBuilder} from "../BJ3D/geometry/geometryBuilder"
import {BufferGeometry} from "three"
import {BJMath} from "bj-utils"
import {SplineUI} from "./splineUI"
import {SewnLatheBufferGeometry} from "./sewnLatheBufferGeometry"


export class LatheBuilder extends GeometryBuilder{


  private _releaseCallback;

  private _geometry:BufferGeometry;
  private _UIX:SplineUI;
  private _UIZ:SplineUI;
  private _profilesActive:boolean;

  constructor(parentElement:HTMLElement){
    super("Lathe Geometry", uiParams);
    this.displayUIOn(parentElement);
    this._UIX = new SplineUI(this._id, this["pointCount"]);
    this._UIX.updateFunctions(this._updateCallback, this._releaseCallback);
    this._UIZ = new SplineUI(this._id, this["pointCount"]);
    this._UIZ.updateFunctions(this._updateCallback, this._releaseCallback);
    this._profilesActive = true;
  }

  public build = (resolutionDivider?:number):BufferGeometry => {
    this._UIX.rebuildPoints(this["pointCount"]);
    this._UIZ.rebuildPoints(this["pointCount"]);
    return this.rebuildGeometry(resolutionDivider);
  }

  public get numPoints(){
    return this["pointCount"];
  }

  public updateFunctions(update, release){
    super.updateFunction(update);
    this._releaseCallback = release;
    this._UIX.updateFunctions(update, release);
    this._UIZ.updateFunctions(update, release);
    this._updateCallback();
  }

  public runCallbacks(){
    this._updateCallback();
    this._releaseCallback();
  }

  public toggleProfiles = () => {
    this._profilesActive = !this._profilesActive;
    this._UIZ.visible(this._profilesActive);
    this._updateCallback();
  }

  protected rebuildGeometry(resolutionDivider?:number):BufferGeometry{
    let ptsX = this._UIX.points(this["horizontalSlices"]/(resolutionDivider||1));
    ptsX.forEach(pt => pt.multiplyScalar(this["scale"]));

    let ptsZ = this._UIZ.points(this["horizontalSlices"]/(resolutionDivider||1));
    ptsZ.forEach(pt => pt.multiplyScalar(this["scale"]));

    let divide:number = resolutionDivider || 1;
    this._geometry = new SewnLatheBufferGeometry(ptsX, this._profilesActive ? ptsZ : ptsX, (this["verticalSlices"]/divide), 0, BJMath.TWO_PI );

    return <BufferGeometry> this._geometry;
  }

}

let uiParams = {
  "pointCount":{
    "variable":"pointCount",
    "label":"point count",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":2,
        "max":20,
        "value":6,
        "step":1
    }
  },
  "scale":{
    "variable":"scale",
    "label":"scale",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0.001,
        "max":1,
        "value":0.01,
        "step":0.001
    }
  },
  "verticalSlices":{
    "variable":"verticalSlices",
    "label":"vertical slices",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":10,
        "max":400,
        "value":100,
        "step":1
    }
  },
  "horizontalSlices":{
    "variable":"horizontalSlices",
    "label":"horizontal slices",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":10,
        "max":200,
        "value":100,
        "step":1
    }
  },

  "toggleProfiles":{
    "attributes":{
      "type":"button",
      "value":"toggle profiles",
      "style":"width:100%;"
    },
    "callbacks":{
      "click":"toggleProfiles"
    }
  },
}
