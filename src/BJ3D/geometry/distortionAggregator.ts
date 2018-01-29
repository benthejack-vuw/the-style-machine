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
  "skinShell":{
    "attributes":{
      "type":"button",
      "value":"toggle skin shell",
      "style":"width:100%;"
    },
    "callbacks":{
      "click":"toggleSkinShell"
    }
  },

  "shell material":{
     "attributes":{
       "type":"button",
       "value":"swap materials",
       "style":"width:100%;"
     },
     "callbacks":{
       "click":"swapMaterials"
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

  "skin-expand":{
    "variable":"expandSkin",
    "label":"expand skin shell",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":-0.2,
        "max":0.2,
        "value":0.05,
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
  protected _surfaceDistortions:BufferDistortion[];

  private _startPositions:any[];
  private _shellPositions:any[];

  private _scene:Scene;
  private _bodyMesh:Mesh;
  private _innerMesh:Mesh;
  private _outerMesh:Mesh;
  private _skinMesh:Mesh;
  private _bodyMaterial:MeshPhongMaterial;
  private _shellMaterial:MeshBasicMaterial;

  private _minOffset:number;
  private _maxOffset:number;

  private _displaySolidShells:boolean;

  constructor(geometry:BufferGeometry){
    super("distortions");
    this.buildUI(distortionParams);

    this._distortions = [];
    this._surfaceDistortions = [];

    this._bodyMaterial = new MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: DoubleSide,
            shading: FlatShading
          } );

    this._shellMaterial = new MeshBasicMaterial( {
          color: 0xFFFFFF,
          side: DoubleSide,
          wireframe: true
    } );

    this._displaySolidShells = false;
    this._bodyMesh = new Mesh(this._geometry, this._bodyMaterial);
    this._skinMesh = new Mesh(this._geometry, this._bodyMaterial);
    this._innerMesh = new Mesh(this._innerShell, this._shellMaterial);
    this._outerMesh = new Mesh(this._outerShell, this._shellMaterial);

    this.geometry = geometry;
    this.updateFunction(this.apply);

  }

  public set geometry(geometry:BufferGeometry){
    this._geometry = geometry.clone();

    let vert_attr = <THREE.BufferAttribute>this._geometry.getAttribute('position')
    this._startPositions = (<any[]>vert_attr.array).slice();

    this.shells = this._geometry;
    this._bodyMesh.geometry = this._geometry;
    this._skinMesh.geometry = this._geometry.clone();

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

  public get skinMesh():Mesh{
    return this._skinMesh;
  }

  public get outerMesh():Mesh{
    return this._outerMesh;
  }

  public set shells(buffer:BufferGeometry){
    this._innerShell = buffer.clone();;
    this._outerShell = buffer.clone();
    this._innerMesh.geometry = this._innerShell;
    this._outerMesh.geometry = this._outerShell;

    let shellAttr = (<THREE.BufferAttribute>this._innerShell.getAttribute('position'));
    this._shellPositions = (<any[]>shellAttr.array).slice();

    this.toggleOuterShell();
    this.toggleInnerShell();

  }

  public swapMaterials = () => {

    this._displaySolidShells = !this._displaySolidShells;


    if(this._displaySolidShells){
      this._innerMesh.material = this._bodyMaterial;
      this._outerMesh.material = this._bodyMaterial;
      this._bodyMesh.material = this._shellMaterial;
    }
    else{
      this._outerMesh.material = this._shellMaterial;
      this._innerMesh.material = this._shellMaterial;
      this._bodyMesh.material = this._bodyMaterial;
    }


  }

  public saveSTL = () =>{
    const buffer = saveScene(this._scene);
    const blob = new Blob([buffer], {type: 'text/plain'});

    saveAs(blob, 'style_machine.stl');
  }


  public toggleOuterShell = ()=>{
    this._outerMesh.visible = !this._outerMesh.visible;
  }

  public toggleSkinShell = ()=>{
    this._skinMesh.visible = !this._skinMesh.visible;
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

  public addSurfaceDistortion(distortion:BufferDistortion){
    this._surfaceDistortions.push(distortion);
    distortion.updateFunction(this.apply)
  }

  public apply = () => {
    this.apply_distortions(this._geometry, this._startPositions, this._distortions, true);
    this._skinMesh.geometry = this._geometry.clone();
    this.expand_shells();

    let outerAttr = (<THREE.BufferAttribute>this._outerShell.getAttribute('position'));
    let temp_start = (<any[]>outerAttr.array).slice();
    this.apply_distortions(this._outerShell, temp_start, this._surfaceDistortions, true);

    let innerAttr = (<THREE.BufferAttribute>this._innerShell.getAttribute('position'));
    temp_start = (<any[]>innerAttr.array).slice();
    this.apply_distortions(this._innerShell, temp_start, this._surfaceDistortions, true);



  //  this.apply_distortions(this._geometry, positions, [this._expand], false);

  }

  public apply_distortions = (geometry:BufferGeometry, startPositions:any[], distortions:any[], doOffset:boolean = false) => {
    let vert_attr = (<THREE.BufferAttribute>geometry.getAttribute('position'));
    vert_attr.dynamic = true;

    let positions = <any[]>vert_attr.array;
    let normals = <any[]>geometry.getAttribute('normal').array;
    let uvs = <any[]>geometry.getAttribute('uv').array;

    let index:number;
    let position:Vector3, normal:Vector3, uv:Vector2;
    let newPosition:Vector3, multipliedPosition:Vector3;
    newPosition = new Vector3();

    if(doOffset){
      this._maxOffset = -10000000000;
      this._minOffset = 10000000000;
    }

    let accumulator;
    let pinch:number;
    let distortion;

    for(let i = 0; i < positions.length; i+=3){
      index = i/3;
      position = new Vector3(startPositions[i], startPositions[i+1], startPositions[i+2]);
      newPosition.copy(position)
      normal = new Vector3(normals[i], normals[i+1], normals[i+2]);
      let n = normal.clone();
      n.normalize();
      uv = new Vector2(uvs[index*2], uvs[index*2+1]);
      accumulator = 0;

      pinch = (this["topConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["topConvergence"],  1-uv.y)) * (this["bottomConvergence"] == 0 ? 1 :BJMath.smoothStep(0, this["bottomConvergence"],  uv.y));

      for(var j = 0; j < distortions.length; ++j){
        distortion = distortions[j].vertexDistortionFunction(position, normal, uv, index).multiplyScalar(distortions[j].multiplier);
        distortion.multiplyScalar(pinch);
        multipliedPosition = distortion;
        accumulator +=  multipliedPosition.dot(n);
        newPosition.add(multipliedPosition);
      }

      if(doOffset){
        this._minOffset = Math.min(this._minOffset, accumulator);
        this._maxOffset = Math.max(this._maxOffset, accumulator);
      }

      positions[i] = newPosition.x;
      positions[i+1] = newPosition.y;
      positions[i+2] = newPosition.z;
    }

    vert_attr.needsUpdate = true;
  }

  public expand_shells = () => {

    let innerAttr = (<THREE.BufferAttribute>this._innerShell.getAttribute('position'));
    innerAttr.dynamic = true;
    let outerAttr = (<THREE.BufferAttribute>this._outerShell.getAttribute('position'));
    outerAttr.dynamic = true;


    let shellUVs = <any[]>this._innerShell.getAttribute('uv').array;
    let innerPositions = <any[]>innerAttr.array;
    let outerPositions = <any[]>outerAttr.array;
    let shellNormals = <any[]>this._innerShell.getAttribute('normal').array;

    let index:number;
    let position:Vector3, normal:Vector3, uv:Vector2;
    let pinch:number;

    for(let i = 0; i < innerPositions.length; i+=3){
      index = i/3;
      position = new Vector3(this._shellPositions[i], this._shellPositions[i+1], this._shellPositions[i+2]);
      uv = new Vector2(shellUVs[index*2], shellUVs[index*2+1]);
      normal = new Vector3(shellNormals[i], shellNormals[i+1], shellNormals[i+2]);
      pinch = (this["topConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["topConvergence"],  1-uv.y)) * (this["bottomConvergence"] == 0 ? 1 : BJMath.smoothStep(0, this["bottomConvergence"],  uv.y));
      let n = normal.clone();
      n.normalize();
      let innerPos = position.clone();
      let n_i = n.clone();
      let n_t = n.clone();
      n_i.multiplyScalar(this._minOffset*pinch);
      n_t.multiplyScalar(this["expandInner"]*pinch);
      n_i.add(n_t);
      innerPos.add(n_i);

      let outerPos = position.clone();
      let n_o = n.clone();
      n_t = n.clone();
      n_o.multiplyScalar(this._maxOffset*pinch);
      n_t.multiplyScalar(this["expandOuter"]*pinch);
      n_o.add(n_t);
      outerPos.add(n_o);

      innerPositions[i] = innerPos.x;
      innerPositions[i+1] = innerPos.y;
      innerPositions[i+2] = innerPos.z;

      outerPositions[i] = outerPos.x;
      outerPositions[i+1] = outerPos.y;
      outerPositions[i+2] = outerPos.z;
    }

    let skinAttr = <THREE.BufferAttribute>(this._skinMesh.geometry as BufferGeometry).getAttribute('position')
    skinAttr.dynamic = true;
    let skinPositions = <any[]>skinAttr.array;
    let skinNormals = <any[]>(this._skinMesh.geometry as BufferGeometry).getAttribute('normal').array;

    for(let i = 0; i < skinPositions.length; i+=3){
      index = i/3;
      position = new Vector3(skinPositions[i], skinPositions[i+1], skinPositions[i+2]);
      normal = new Vector3(skinNormals[i], skinNormals[i+1], skinNormals[i+2]);
      let n = normal.clone();
      n.normalize();
      let skinPos = position.clone();
      let n_s = n.clone();
      n_s.multiplyScalar(this["expandSkin"]);
      skinPos.add(n_s);

      skinPositions[i] = skinPos.x;
      skinPositions[i+1] = skinPos.y;
      skinPositions[i+2] = skinPos.z;
    }

    innerAttr.needsUpdate = true;
    outerAttr.needsUpdate = true;
    skinAttr.needsUpdate = true;

  }


}
