import {Point} from "bj-utils/lib/geometry/point"
import {Spline} from "quick-canvas/lib/geometry/spline"
import {Stage} from "quick-canvas/lib/canvas/stage"
import {DraggablePoint} from "quick-canvas"
import {Vector2} from "three"


export class SplineUI{
  private _updateFunction;
  private _releaseFunction;

  private _canvas:Stage;
  private _spline:Spline;
  private _points:DraggablePoint[];

  constructor(parent_id:string, point_count:number){
    this._canvas = new Stage(parent_id, new Point(300, 300));

     let point_at = i => new Point(this._canvas.size.x/3, i*this._canvas.size.y/point_count);
     this._points = Array.from(new Array(point_count), (item, i) => this.create_draggable_point(point_at(i)));
     this.rebuildSpline();
  }

  public updateFunctions(update, release){
    this._updateFunction  = update;
    this._releaseFunction = release;
    this._points.forEach(function(pt){
      pt.updateFunction  = update;
      pt.releaseFunction = release;
    });
  }

  protected create_draggable_point(pt:Point):DraggablePoint{
    let dpt = new DraggablePoint(pt, 10);
    dpt.updateFunction  = this._updateFunction;
    dpt.releaseFunction = this._releaseFunction;
    this._canvas.addChild(dpt);

    return dpt;
  }

  public rebuildPoints(point_count:number){

    if(this._points.length != point_count){
      this._points.forEach(pt => this._canvas.removeChild(pt));
      let newPts     = this._spline.spline(point_count);
      let point_from = pt_arr => new Point(pt_arr[0], pt_arr[1]);
      this._points   = Array.from(newPts, (item, i) => this.create_draggable_point(point_from(item)));
    }

    this.rebuildSpline();
  }

  public visible(_visible:boolean){
    this._canvas.visible(_visible);
  }

  protected rebuildSpline(){
    this._canvas.removeChild(this._spline);
    this._spline = new Spline(new Point(0,0), new Point(this._canvas.size.x, this._canvas.size.y), this._points);
    this._canvas.addChildAt(0, this._spline);
  }

  public points(slices:number):Vector2[]{
    let splinePoints = this._spline.spline(slices, 1.0);
    let maxY = Math.max(...(splinePoints.map(pt => pt[1])))
    return splinePoints.map(pt => new Vector2(pt[0], maxY-pt[1]));
  }


}
