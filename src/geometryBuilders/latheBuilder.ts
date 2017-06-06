import {Point} from "bj-utils/lib/geometry/point"
import {Spline} from "quick-canvas/lib/geometry/spline"
import {Stage} from "quick-canvas/lib/canvas/stage"
import {DraggablePoint} from "quick-canvas"
import {GeometryBuilder} from "../BJ3D/geometry/geometryBuilder"
import {Vector2,
        BufferGeometry,
        LatheBufferGeometry} from "three"

export class LatheBuilder extends GeometryBuilder{


  private _releaseCallback;

  private _geometry:BufferGeometry;
  private _splineUI:Stage;
  private _spline:Spline;
  private _points:DraggablePoint[];


  constructor(parentElement:HTMLElement){
    super("Lathe Geometry", uiParams);
    this.displayUIOn(parentElement);
    this._splineUI = new Stage(this._id, new Point(300, 300));
    this._points = [];

    let p;
    for(var i = 0; i < this["pointCount"]; ++i){
      p = new Point(this._splineUI.size.x/3, i*this._splineUI.size.y/this["pointCount"]);
      this._points.push(new DraggablePoint(p, 10));
      this._points[i].updateFunction = this._updateCallback;
      this._splineUI.addChild(this._points[i]);
    }

    this.rebuildSpline();
  }

  public build = (resolutionDivider?:number):BufferGeometry => {
    this.rebuildPoints();
    return this.rebuildGeometry(resolutionDivider);
  }

  protected rebuildPoints(){
    if(this._points.length != this["pointCount"]){

      for(let i = 0; i < this._points.length; ++i){
        this._splineUI.removeChild(this._points[i]);
      }

      this._points = [];
      let newPts = this._spline.spline(this["pointCount"]);

      let p;
      for(var i = 0; i < newPts.length; ++i){
        p = new Point(newPts[i][0], newPts[i][1]);
        this._points.push(new DraggablePoint(p, 10));
        this._points[i].updateFunction = this._updateCallback;
        this._points[i].releaseFunction = this._releaseCallback;
        this._splineUI.addChild(this._points[i]);
      }
    }
    this.rebuildSpline();
  }

  public updateFunctions(update, release){
    super.updateFunction(update);
    this._releaseCallback = release;
    for(let i = 0; i < this._points.length; ++i){
      this._points[i].updateFunction = update;
      this._points[i].releaseFunction = this._releaseCallback;
    }
    this._updateCallback();
  }

  public runCallbacks(){
    this._updateCallback();
    this._releaseCallback();
  }

  protected rebuildSpline(){
    this._splineUI.removeChild(this._spline);
    this._spline = new Spline(new Point(0,0), new Point(this._splineUI.size.x, this._splineUI.size.y), this._points);
    this._splineUI.addChildAt(0, this._spline);
  }

  protected rebuildGeometry(resolutionDivider?:number):BufferGeometry{

    let divide:number = resolutionDivider || 1;

    let splinePoints = this._spline.spline(this["horizontalSlices"]/divide, 1.0);
    let lathePoints = [];
    let maxY = -100000000000;
    for(let i = splinePoints.length-1; i >= 0 ; --i){
        maxY = Math.max(splinePoints[i][1], maxY);
        lathePoints.push(new Vector2(splinePoints[i][0], splinePoints[i][1]).multiplyScalar(this["scale"]));
    }
    maxY *= this["scale"];
    for(let i = lathePoints.length-1; i >= 0 ; --i){
        lathePoints[i].y = maxY-lathePoints[i].y;
    }

    this._geometry = new LatheBufferGeometry(lathePoints , this["verticalSlices"]/divide );
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
  }
}
