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

import {saveAs} from 'file-saver';
import {saveScene} from "../scene/saveScene"


let distortionParams = {

 "save":{
    "attributes":{
      "type":"button",
      "value":"save",
      "style":"width:100%;"
    },
    "callbacks":{
      "click":"saveSTL"
    }
  },
  "outerShell":{
    "attributes":{
      "type":"button",
      "value":"toggle outer shell"
    },
    "callbacks":{
      "click":"toggleOuterShell"
    }
  },

  "innerShell":{
    "attributes":{
      "type":"button",
      "value":"toggle inner shell"
    },
    "callbacks":{
      "click":"toggleInnerShell"
    }
  },
  "outer-expand":{
    "variable":"expandOuter",
    "label":"expand outer shell",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":-1,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "inner-expand":{
    "variable":"expandInner",
    "label":"expand inner shell",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":-1,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "top-convergence":{
    "variable":"topConvergence",
    "label":"pinch shells top",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "bottom-convergence":{
    "variable":"bottomConvergence",
    "label":"pinch shells bottom",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
}


export class DistortionAggregator extends UIObject{

  protected _geometry:BufferGeometry;
  protected _innerShell:BufferGeometry;
  protected _outerShell:BufferGeometry;

  protected _distortions:BufferDistortion[];

  private _vertexAttribute:THREE.BufferAttribute;
  private _innerAttribute:THREE.BufferAttribute;
  private _outerAttribute:THREE.BufferAttribute;


  private _positions:any[];
  private _startPositions:any[];

  private _shellPositions:any[];
  private _shellNormals:any[];
  private _shellUVs:any[];
  private _innerPositions:any[];
  private _outerPositions:any[];
  private _normals:any[];
  private _uvs:any[];

  private _scene:Scene;
  private _bodyMesh:Mesh;
  private _innerMesh:Mesh;
  private _outerMesh:Mesh;
  private _bodyMaterial:MeshPhongMaterial;
  private _innerMaterial:MeshBasicMaterial;
  private _outerMaterial:MeshBasicMaterial;

  constructor(geometry:BufferGeometry){
    super("distortions");
    this.buildUI(distortionParams);

    this._distortions = [];

    this._bodyMaterial = new MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: DoubleSide,
            shading: FlatShading
          } );

    this._innerMaterial = new MeshBasicMaterial( {
          color: 0xFFFFFF,
          side: DoubleSide,
          wireframe: true
    } );

    this._outerMaterial = this._innerMaterial.clone();

    this._bodyMesh = new Mesh(this._geometry, this._bodyMaterial);
    this._innerMesh = new Mesh(this._innerShell, this._innerMaterial);
    this._outerMesh = new Mesh(this._outerShell, this._outerMaterial);

    this.geometry = geometry;
    this.updateFunction(this.apply);

  }

  public set geometry(geometry:BufferGeometry){
    this._geometry = geometry;
    this._innerShell = this._geometry.clone();
    this._outerShell = this._geometry.clone();

    this._vertexAttribute = (<THREE.BufferAttribute>this._geometry.getAttribute('position'));
    this._vertexAttribute.dynamic = true;

    this._positions = <any[]>this._vertexAttribute.array;
    this._normals = <any[]>this._geometry.getAttribute('normal').array;
		this._uvs = <any[]>this._geometry.getAttribute('uv').array;
    this._startPositions = this._positions.slice();

    this.shells = geometry;
    this._bodyMesh.geometry = this._geometry;
  }

  public set scene(scene:Scene){
    this._scene = scene;
  }

  public get innerMesh():Mesh{
    return this._innerMesh;
  }

  public get bodyMesh():Mesh{
    return this._bodyMesh;
  }

  public get outerMesh():Mesh{
    return this._outerMesh;
  }

  public set shells(buffer:BufferGeometry){
    this._innerShell = buffer;
    this._outerShell = buffer.clone();

    this._innerAttribute = (<THREE.BufferAttribute>this._innerShell.getAttribute('position'));
    this._innerAttribute.dynamic = true;
    this._outerAttribute = (<THREE.BufferAttribute>this._outerShell.getAttribute('position'));
    this._outerAttribute.dynamic = true;


    this._shellUVs = <any[]>this._innerShell.getAttribute('uv').array;
    this._innerPositions = <any[]>this._innerAttribute.array;
    this._outerPositions = <any[]>this._outerAttribute.array;
    this._shellPositions = this._innerPositions.slice();
    this._shellNormals = <any[]>this._innerShell.getAttribute('normal').array;

    this._innerMesh.geometry = this._innerShell;
    this._outerMesh.geometry = this._outerShell;

  }

  public saveSTL = () =>{
    const buffer = saveScene(this._scene);
    const blob = new Blob([buffer], {type: 'text/plain'});

    saveAs(blob, 'style_machine.stl');
  }


  public toggleOuterShell = ()=>{
    this._outerMesh.visible = !this._outerMesh.visible;
  }

  public toggleInnerShell = ()=>{
    this._innerMesh.visible = !this._innerMesh.visible;
  }

  public get innerShell():BufferGeometry{
    return this._innerShell;
  }

  public get outerShell():BufferGeometry{
    return this._outerShell;
  }

  public addDistortion(distortion:BufferDistortion){
    this._distortions.push(distortion);
    distortion.updateFunction(this.apply)
  }

  public apply = () => {
    console.log(this["expandInner"], this["expandOuter"])

    let index:number;
    let position:Vector3, normal:Vector3, uv:Vector2;
    let newPosition:Vector3, multipliedPosition:Vector3;
    newPosition = new Vector3();
    let maxOffset = -10000000000;
    let minOffset = 10000000000;
    let accumulator;
    let pinch:number;
    let distortion;

    for(let i = 0; i < this._positions.length; i+=3){
      index = i/3;
      position = new Vector3(this._startPositions[i], this._startPositions[i+1], this._startPositions[i+2]);
      newPosition.copy(position)
      normal = new Vector3(this._normals[i], this._normals[i+1], this._normals[i+2]);
      let n = normal.clone();
      n.normalize();
      uv = new Vector2(this._uvs[index*2], this._uvs[index*2+1]);
      accumulator = 0;

      pinch = (this["topConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["topConvergence"],  1-uv.y)) * (this["bottomConvergence"] == 0 ? 1 :BJMath.smoothStep(0, this["bottomConvergence"],  uv.y));

      for(var j = 0; j < this._distortions.length; ++j){

        distortion = this._distortions[j].vertexDistortionFunction(position, normal, uv, index).multiplyScalar(this._distortions[j].multiplier);
        distortion.multiplyScalar(pinch);
        multipliedPosition = distortion;
        accumulator +=  multipliedPosition.dot(n);
        newPosition.add(multipliedPosition);
      }

      minOffset = Math.min(minOffset, accumulator);
      maxOffset = Math.max(maxOffset, accumulator);

      this._positions[i] = newPosition.x;
      this._positions[i+1] = newPosition.y;
      this._positions[i+2] = newPosition.z;
    }

    for(let i = 0; i < this._innerPositions.length; i+=3){
      index = i/3;
      position = new Vector3(this._shellPositions[i], this._shellPositions[i+1], this._shellPositions[i+2]);
      uv = new Vector2(this._shellUVs[index*2], this._shellUVs[index*2+1]);
      normal = new Vector3(this._shellNormals[i], this._shellNormals[i+1], this._shellNormals[i+2]);
      pinch = (this["topConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["topConvergence"],  1-uv.y)) * (this["bottomConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["bottomConvergence"],  uv.y));
      let n = normal.clone();
      n.normalize();
      let innerPos = position.clone();
      let n_i = n.clone();
      let n_t = n.clone();
      n_i.multiplyScalar(minOffset*pinch);
      n_t.multiplyScalar(this["expandInner"]*pinch);
      n_i.add(n_t);
      innerPos.add(n_i);

      let outerPos = position.clone();
      let n_o = n.clone();
      n_t = n.clone();
      n_o.multiplyScalar(maxOffset*pinch);
      n_t.multiplyScalar(this["expandOuter"]*pinch);
      n_o.add(n_t);
      outerPos.add(n_o);



      this._innerPositions[i] = innerPos.x;
      this._innerPositions[i+1] = innerPos.y;
      this._innerPositions[i+2] = innerPos.z;

      this._outerPositions[i] = outerPos.x;
      this._outerPositions[i+1] = outerPos.y;
      this._outerPositions[i+2] = outerPos.z;
    }

    this._vertexAttribute.needsUpdate = true;
    this._innerAttribute.needsUpdate = true;
    this._outerAttribute.needsUpdate = true;
  }


}
