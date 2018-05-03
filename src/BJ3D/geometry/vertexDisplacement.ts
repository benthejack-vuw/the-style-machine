import {Vector2,
        Vector3,
        BufferGeometry,
        Geometry,
        Mesh,
        MeshBasicMaterial,
        MeshPhongMaterial,
        DoubleSide,
        FlatShading,
        Scene} from "three"

import {BJMath} from "bj-utils"

import {BufferDistortion} from "./bufferDistortion"
import {UIObject} from "../UI/uiObject"



export class VertexDistortion{

  private _geometry:BufferGeometry;

  private _position:Vector3, _new_position:Vector3;
  private _normal:Vector3;
  private _uv:Vector2;

  constructor(geometry:BufferGeometry, vertex_index:number){
    _geometry = geometry;

    _position = vector3_from_array(position_array(), vertex_index);
    _normal = vector3_from_array(normal_array(), vertex_index);
    _uv = vector2_from_array(uv_array(), vertex_index);

  }

  private vector2_from_array = (data_array:number[], index:number):Vector2{
    return new Vector2(data_array[index], data_array[index+1]);
  }

  private vector3_from_array = (data_array:number[], index:number):Vector3{
    return new Vector3(data_array[index], data_array[index+1], data_array[index+2]);
  }

}
