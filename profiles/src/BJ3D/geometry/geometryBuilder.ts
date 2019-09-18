import {BufferGeometry} from "three";
import {UIObject} from "../UI/uiObject"


export class GeometryBuilder extends UIObject{

  constructor(title:string, parameters:any){
    super(title);
    this.buildUI(parameters);
  }
  
}
