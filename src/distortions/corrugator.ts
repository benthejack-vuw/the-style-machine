import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import {BJMath} from "bj-utils"
import{BufferGeometry,
       Vector3,
       Vector2} from 'three'

import SimplexNoise from "simplex-noise";

const UP = new Vector3(0,1,0);

export class Corrugator extends BufferDistortion{

  private noise:SimplexNoise;

  constructor(){
    super("Corrugation", UIDefinition);
    this.noise = new SimplexNoise();
  }

  public vertexDistortionFunction(position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3{
    let TWO_PI = 6.2831852;

		let i = uv.y;
		let j = uv.x;
		let i2 = ((i*(i/this["stretchAmount"]))*this["stretchStrength"]) + 1.0;
		let j2 = 1.0;
		i*=TWO_PI*this["yWaves"];
		j*=TWO_PI*this["xWaves"];


    let out = new Vector3(position.x, 0, position.z);
    out.normalize();
    let direction = normal.lerp(out, this["angle"]);


    let pi = 3.14159;
    let nx=Math.cos(uv.x*2*pi)*this["liquifyFrequency"]
    let ny=Math.cos(uv.y*2*pi)*this["liquifyFrequency"]
    let nz=Math.sin(uv.x*2*pi)*this["liquifyFrequency"]
    let nw=Math.sin(uv.y*2*pi)*this["liquifyFrequency"]
    let noise = this.noise.noise4D(nx,ny,nz,nw)*this["liquifyMultiplier"];



    return direction.multiplyScalar((Math.sin(noise+i/(i2+1))*Math.cos(noise+j))*this["amplitude"]);
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
        "max":10,
        "value":1.0,
        "step":0.001
    }
  },

  "x-waves":{
    "variable":"xWaves",
    "label":"x waves",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":50,
        "value":10,
        "step":1
    }
  },
  "y-waves":{
    "variable":"yWaves",
    "label":"y waves",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":-1,
        "max":50,
        "value":10,
        "step":1
    }
  },
  "angle":{
    "variable":"angle",
    "label":"angle",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":1,
        "value":0,
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
        "max":1,
        "value":0.1,
        "step":0.01
    }
  },
  "stretchAmount":{
    "variable":"stretchAmount",
    "label":"stretch amount",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":2,
        "value":1,
        "step":0.001
    }
  },
  "stretchStrength":{
    "variable":"stretchStrength",
    "label":"stretch strength",
    "listener":"input",
    "attributes":{
      "type":"range",
      "min":-2,
      "max":2,
      "value":1,
      "step":0.001
    }
  }
}
