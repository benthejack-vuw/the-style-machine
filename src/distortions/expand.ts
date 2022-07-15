import {BJMath} from "bj-utils"

import {Pinch} from "./pinch"

import{BufferGeometry,
       Vector3,
       Vector2} from 'three'


export class Expand{

  public static expand_function(amount:number, pinch:Pinch){

    return (position:Vector3, normal:Vector3, uv:Vector2, index:number):Vector3 => {
      let pinch_value = pinch.value(uv);
      return normal.multiplyScalar(amount*pinch_value);
    }

  }

}
