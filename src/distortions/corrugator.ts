import {BufferDistortion} from "../BJ3D/geometry/bufferDistortion"
import {BJMath} from "bj-utils"
import{BufferGeometry,
       Vector3,
       Vector2} from 'three'

const UP = new Vector3(0,1,0);

export class Corrugator extends BufferDistortion{

  constructor(){
    super("Corrugation", UIDefinition);
  }


   public vertexDistortionFunction = (position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3 => {
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


      let pinch_value = 1;

      if(this._pinch)
        pinch_value = this._pinch.value(uv)*this._pinch.pinch_points_value(uv);

      return direction.multiplyScalar((Math.sin(i/(i2+1))*Math.cos(j))*this["amplitude"] * (1+(((Math.sin(uv.x*TWO_PI*this["waveWaves"])+1.0)/2.0)*this["waveWaveAmplitude"]))).multiplyScalar(pinch_value);
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
  },
  "wave-waves":{
    "variable":"waveWaves",
    "label":"wave waves",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":10,
        "value":3,
        "step":1
    }
  },
  "wave-wave-amplitude":{
    "variable":"waveWaveAmplitude",
    "label":"wave wave amplitude",
    "listener":"input",
    "attributes":{
      "type":"range",
        "min":0,
        "max":10,
        "value":0,
        "step":0.001
    }
  }
}
