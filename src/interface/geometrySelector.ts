import {UIObject} from "../BJ3D/UI/uiObject"
import {BufferGeometry,
        Mesh,
        MeshBasicMaterial,
        Object3D,
        Scene} from "three";

import * as GeometryLoader from "../BJ3D/geometry/geometryLoader"

export class GeometrySelector extends UIObject{

  private _mesh:Mesh;

  constructor(parent:HTMLElement){
    super("Geometry");
    this.buildUI(interfaceDefinition);
    this.displayUIOn(parent);
  }


  public loadOBJ = ()=>{
    console.log("LOAD");
    GeometryLoader.selectOBJFile().then((mesh:Mesh) => {
        let geometry = <BufferGeometry>mesh.geometry;
        this._updateCallback(geometry);
      }).catch(
      err => {console.error(err)}
    );
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
  }
}
