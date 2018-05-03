import{Vector2,
       Vector3,
       BufferGeometry} from "three"

import {UIObject} from "../UI/uiObject"
import {Pinch} from "../../distortions/pinch"

export class BufferDistortion extends UIObject{

  public multiplier;
  protected _pinch:Pinch;

  constructor(title:string, uiParameters:any){
    super(title);
    uiParameters["multiplier"] = multiplierParams;
    super.buildUI(uiParameters);
  }

  public set pinch(pinch:Pinch){
    this._pinch = pinch;
    console.log("pinch added?");
  }

  public vertexDistortionFunction = (position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3 => {
    return position;
  }

}


let multiplierParams = {
  "variable":"multiplier",
  "label":"multiplier",
  "listener":"input",
  "attributes":{
    "type":"range",
    "min":0,
    "max":1,
    "step":0.01,
    "value":1.0
  }
};
