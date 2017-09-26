import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import {BJMath} from "bj-utils"
import{BufferGeometry,
       Vector3,
       Vector2,
       Box3} from 'three'

export class PerspectiveWarp extends BufferDistortion{

  private _bounds:Box3;

  constructor(){
    super("Perspective Warp", UIDefinition);
  }

  public set boundingBox(bb:Box3){
    this._bounds = bb;
  }

  public vertexDistortionFunction(position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3{



    if(!this._bounds.containsPoint( new Vector3(this["xp"], 0.01, 0.0))){
      let bx = 0;
      if(this["xp"] > this._bounds.max.x) bx = this._bounds.max.x;
      if(this["xp"] < this._bounds.min.x) bx = this._bounds.min.x;

      let dx = bx - this["xp"];
      let bh = this._bounds.max.y - this._bounds.min.y;
      let theta = Math.atan2(bh, dx);
      let yw = Math.tan(theta)*(position.x - this["xp"]);
      let ratioY = yw/bh;

      let bd = this._bounds.max.z - this._bounds.min.z;
      let theta2 = Math.atan2(bd, dx);
      let zw = Math.tan(theta2)*(position.x - this["xp"]);
      let ratioZ = zw/bd;

      return new Vector3(0, position.y - (ratioY*position.y), position.z - (ratioZ*position.z));
    }

    return new Vector3(0, 0, 0);
  }
}


let UIDefinition:any = {
  "perspectiveX":{
    "variable":"xp",
    "label":"perspective X position",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":-30,
        "max":30,
        "value":5,
        "step":0.1
    }
  }
}
