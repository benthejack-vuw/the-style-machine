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

  public vertexDistortionFunction = (position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3 => {
      return normal.normalize().multiplyScalar(1.0-uv.y * this["xp"]);
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
