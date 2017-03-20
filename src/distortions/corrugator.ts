import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import{BufferGeometry,
       Vector3,
       Vector2} from 'three'

const UP = new Vector3(0,1,0);

export class Corrugator extends BufferDistortion{

  constructor(){
    super("Corrugation", UIDefinition);
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
    let direction = normal.lerp(out, this["angle"]);


		return direction.multiplyScalar((Math.sin(i/(i2+1))*Math.cos(j))*this["amplitude"]);
  }

}


let UIDefinition:any = {
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
