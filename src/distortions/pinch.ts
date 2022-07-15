import {Vector2} from "three"
import {BJMath} from "bj-utils"

export class Pinch{

  private _top:number;
  private _bottom:number;
  private _pinch_points:any[];

  constructor(){
    this._top = 0;
    this._bottom = 0;
  }

  public pinch_points(points:any[]){
    this._pinch_points = points;
  }

  public value(uv:Vector2):number{
    return (this._top == 0 ? 1 : BJMath.smoothStep(0, this._top,  1-uv.y)) * (this._bottom == 0 ? 1 : BJMath.smoothStep(0, this._bottom,  uv.y))
  }

  public pinch_points_value(uv:Vector2):number{
    let point_space = 1.0/(this._pinch_points.length-1);
    let result = 1;

    for(let i = 0; i < this._pinch_points.length; ++i){
      let d = this._pinch_points[i]/this._pinch_points.length;
      result *= (this._pinch_points[i] == 0 ? 1 : BJMath.smoothStep(0, d,  Math.abs((i)*point_space-uv.y)));
    }

    return result;
  }

  public set top(top:number){
    this._top = top;
  }

  public set bottom(bottom:number){
    this._bottom = bottom;
  }

}
