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

    let uvx = (BJMath.smoothStep(0.9, 1.0, uv.x)) * BJMath.smoothStep(0.9, 1.0, 1.0-uv.x);
    let ny = this.noise.noise2D(uvx*this["distortionDensity"],uv.y*this["distortionDensity"]);
    let nx = this.noise.noise2D(uv.x*this["distortionDensity"],uv.y*this["distortionDensity"]) * BJMath.smoothStep(0.0, (10.0-this["distortionDensity"])/100.0+0.02, uv.x)* BJMath.smoothStep(0.0, (10.0-this["distortionDensity"])/100.0+0.02, 1.0-uv.x);


    return direction.multiplyScalar((Math.sin(nx+i/(i2+1))*Math.cos(ny+j))*this["amplitude"]);
  }

}


let UIDefinition:any = {
  "distortion-density":{
    "variable":"distortionDensity",
    "label":"Ben says: liquify",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":2.0,
        "max":8.0,
        "value":3,
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
