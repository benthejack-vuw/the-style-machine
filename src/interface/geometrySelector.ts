import {UIObject} from "../BJ3D/UI/uiObject"
import {BufferGeometry,
        Mesh,
        MeshBasicMaterial} from "three";
import { saveAs } from 'file-saver';
import {fromGeometry, mimeType} from 'threejs-export-stl-es6'
import * as GeometryLoader from "../BJ3D/geometry/geometryLoader"

export class GeometrySelector extends UIObject{

  private _geometry;

  constructor(parent:HTMLElement){
    super("Geometry");
    this.buildUI(interfaceDefinition);
    this.displayUIOn(parent);
  }

  public get geometry():BufferGeometry{
    return this._geometry;
  }

  public set geometry(geometry){
    this._geometry = geometry;
  }

  public loadOBJ = ()=>{
    console.log("LOAD");
    GeometryLoader.selectOBJFile().then((mesh:Mesh) => {
        this._geometry = <BufferGeometry>mesh.geometry;
        this._updateCallback(this._geometry);
      }).catch(
      err => {console.error(err)}
    );
  }

  public saveSTL = () =>{
    console.log("SAVE");
    const buffer = fromGeometry(this._geometry);
    const blob = new Blob([buffer], { type: mimeType });

    saveAs(blob, 'cube.stl');
	}

  //override
  public updateFunction(callback){
    this._updateCallback = callback;
  }

}

let interfaceDefinition:any = {
  "load-geometry":{
    "attributes":{
      "type":"button",
      "value":"Select OBJ file"
    },
    "callbacks":{
      "click":"loadOBJ"
    }
  },

  "save-geometry":{
    "attributes":{
      "type":"button",
      "value":"Save"
    },
    "callbacks":{
      "click":"saveSTL"
    }
  }

}
