import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import {BJMath} from "bj-utils"
import{BufferGeometry,
       Vector3,
       Vector2} from 'three'

import SimplexNoise from "simplex-noise";

const UP = new Vector3(0,1,0);

export class Liquify extends BufferDistortion{

  private noise:SimplexNoise;

  constructor(){
    super("Surface Liquify", UIDefinition);
    this.noise = new SimplexNoise();
  }

  public vertexDistortionFunction(position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3{

    let pi = 3.14159;
    let nx=Math.cos(uv.x*2*pi)*this["liquifyFrequency"]
    let ny=Math.cos(uv.y*2*pi)*this["liquifyFrequency"]
    let nz=Math.sin(uv.x*2*pi)*this["liquifyFrequency"]
    let nw=Math.sin(uv.y*2*pi)*this["liquifyFrequency"]
    let distorted = this.noise.noise4D(nx,ny,nz,nw)*this["liquifyMultiplier"];

    return normal.multiplyScalar((Math.sin(distorted + uv.x*30*6.28318)*Math.cos(distorted + uv.y*10*6.28318))*this["amplitude"]);
  }
}


let UIDefinition:any = {
  "liquifyFreq":{
    "variable":"liquifyFrequency",
    "label":"Ben says: liquify frequency",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0.01,
        "max":0.75,
        "value":0.375,
        "step":0.001
    }
  },

  "liquifyMult":{
    "variable":"liquifyMultiplier",
    "label":"liquify strength",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":20,
        "value":20,
        "step":0.001
    }
  },

  "amplitude":{
    "variable":"amplitude",
    "label":"amplitude",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":0.05,
        "value":0.01,
        "step":0.001
    }
  }
}
