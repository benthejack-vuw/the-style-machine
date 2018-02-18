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

    let shape = (Math.cos((1.0 - Math.min(Math.abs(uv.y-this["centre"])*2* (2.1-this["cupWidth"]), 1.0)) * 3.14159)+1)/2.0;
    let twist = this["twist"] * Math.pow(d, this["curve"]) * (shape+d/this["bulge"]);//Math.pow(d, this["pow"]);
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
  },
  "curvyness":{
    "variable":"curve",
    "label":"curvyness",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0.01,
        "max":3.0,
        "value":1,
        "step":0.001
    }
  },
  "centrePoint":{
    "variable":"centre",
    "label":"centre point",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0.0,
        "max":1.0,
        "value":0.5,
        "step":0.001
    }
  },
  "cupWidth":{
    "variable":"cupWidth",
    "label":"cup width",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0.1,
        "max":2.0,
        "value":1,
        "step":0.001
    }
  },
  "cupBulge":{
    "variable":"bulge",
    "label":"cup bulge",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":1.0,
        "max":10.0,
        "value":1,
        "step":0.001
    }
  }
}
