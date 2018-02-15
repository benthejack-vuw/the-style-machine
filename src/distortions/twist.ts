import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import {BJMath} from "bj-utils"
import{BufferGeometry,
       Vector3,
       Vector2} from 'three'

const UP = new Vector3(0,1,0);

export class Twist extends BufferDistortion{

  constructor(){
    super("Twist", UIDefinition);
  }

  public vertexDistortionFunction(position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3{

    let d = new Vector3(position.x, 0, position.z).length();

    let twist = this["twist"] * d;//Math.pow(d, this["pow"]);
    let theta = Math.atan2(position.z, position.x) + twist;

    return new Vector3(Math.cos(theta)*d, position.y, Math.sin(theta)*d);
  }
}

let UIDefinition:any = {
  "twist":{
    "variable":"twist",
    "label":"twist",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":1.0,
        "value":0,
        "step":0.001
    }
  }
}
