import {Vector2,
        Vector3,
        BufferGeometry,
        Geometry} from "three"

import {BufferDistortion} from "./bufferDistortion"

export class DistortionAggregator{

  protected _geometry:BufferGeometry;
  protected _distortions:BufferDistortion[];

  private _vertexAttribute:THREE.BufferAttribute;
  private _startPositions:any[];

  private _positions:any[];
  private _normals:any[];
  private _uvs:any[];

  constructor(geometry:BufferGeometry){
    this.setGeometry(geometry);
    this._distortions = [];
  }

  public setGeometry(geometry:BufferGeometry){
    this._geometry = geometry;
    this._vertexAttribute = (<THREE.BufferAttribute>this._geometry.getAttribute('position'));
    this._vertexAttribute.dynamic = true;

    this._positions = <any[]>this._vertexAttribute.array;
    this._normals = <any[]>this._geometry.getAttribute('normal').array;
		this._uvs = <any[]>this._geometry.getAttribute('uv').array;
    this._startPositions = this._positions.slice();
  }

  public addDistortion(distortion:BufferDistortion){
    this._distortions.push(distortion);
    distortion.updateFunction(this.apply)
  }

  public apply = () => {
    let index:number;
    let position:Vector3, normal:Vector3, uv:Vector2;
    let newPosition:Vector3, multipliedPosition:Vector3;
    newPosition = new Vector3();
    
    for(let i = 0; i < this._positions.length; i+=3){
      index = i/3;
      position = new Vector3(this._startPositions[i], this._startPositions[i+1], this._startPositions[i+2]);
      newPosition.copy(position)
      normal = new Vector3(this._normals[i], this._normals[i+1], this._normals[i+2]);
      uv = new Vector2(this._uvs[index*2], this._uvs[index*2+1]);

      for(var j = 0; j < this._distortions.length; ++j){
        multipliedPosition = this._distortions[j].vertexDistortionFunction(position, normal, uv, index).multiplyScalar(this._distortions[j].multiplier);
        newPosition.add(multipliedPosition);
      }

      this._positions[i] = newPosition.x;
      this._positions[i+1] = newPosition.y;
      this._positions[i+2] = newPosition.z;
    }

    this._vertexAttribute.needsUpdate = true;
  }


}
