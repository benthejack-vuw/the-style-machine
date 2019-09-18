import {Vector2,
        Vector3,
        BufferGeometry,
        Geometry,
        Mesh,
        MeshBasicMaterial,
        MeshPhongMaterial,
        DoubleSide,
        FlatShading,
        Scene,
        VertexNormalsHelper} from "three"

import {BJMath} from "bj-utils"

import {DistortableGeometry} from "./distortableGeometry"
import {BufferDistortion} from "./bufferDistortion"
import {UIObject} from "../UI/uiObject"

import {saveAs} from 'file-saver';
import {saveScene} from "../scene/saveScene"

import {Pinch} from "../../distortions/pinch"
import {Expand} from "../../distortions/expand"

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
        "value":0.1,
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
        "value":-0.1,
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
        "value":-0.05,
        "step":0.001
    }
  },
  "pinch_top":{
    "variable":"pinch_top",
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
  "pinch_bottom":{
    "variable":"pinch_bottom",
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
  "pinch0":{
    "variable":"pinch0",
    "label":"pinch shells point 1",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch1":{
    "variable":"pinch1",
    "label":"pinch shells point 2",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch2":{
    "variable":"pinch2",
    "label":"pinch shells point 3",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch3":{
    "variable":"pinch3",
    "label":"pinch shells point 4",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch4":{
    "variable":"pinch4",
    "label":"pinch shells point 5",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch5":{
    "variable":"pinch5",
    "label":"pinch shells point 6",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch6":{
    "variable":"pinch6",
    "label":"pinch shells point 7",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch7":{
    "variable":"pinch7",
    "label":"pinch shells point 8",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch8":{
    "variable":"pinch8",
    "label":"pinch shells point 9",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch9":{
    "variable":"pinch9",
    "label":"pinch shells point 10",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch10":{
    "variable":"pinch10",
    "label":"pinch shells point 11",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch11":{
    "variable":"pinch11",
    "label":"pinch shells point 12",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch12":{
    "variable":"pinch12",
    "label":"pinch shells point 13",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch13":{
    "variable":"pinch13",
    "label":"pinch shells point 14",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch14":{
    "variable":"pinch14",
    "label":"pinch shells point 15",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch15":{
    "variable":"pinch15",
    "label":"pinch shells point 16",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch16":{
    "variable":"pinch16",
    "label":"pinch shells point 17",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch17":{
    "variable":"pinch17",
    "label":"pinch shells point 18",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch18":{
    "variable":"pinch18",
    "label":"pinch shells point 19",
    "listener":"input",
    "attributes":{
        "type":"range",
        "min":0,
        "max":1,
        "value":0,
        "step":0.001
    }
  },
  "pinch19":{
    "variable":"pinch19",
    "label":"pinch shells point 20",
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

  protected _bodyShell:DistortableGeometry;
  protected _skinShell:DistortableGeometry;
  protected _innerShell:DistortableGeometry;
  protected _outerShell:DistortableGeometry;

  protected _distortions:BufferDistortion[];
  protected _surfaceDistortions:BufferDistortion[];
  protected _absoluteDistortions:BufferDistortion[];

  private _pinch:Pinch;

  private _bodyMesh:Mesh;
  private _innerMesh:Mesh;
  private _outerMesh:Mesh;
  private _skinMesh:Mesh;

  private _scene:Scene;
  private _bodyMaterial:MeshPhongMaterial;
  private _shellMaterial:MeshBasicMaterial;

  private _minOffset:number;
  private _maxOffset:number;
  private _pointCount:number;

  private _displaySolidShells:boolean;

  constructor(geometry:BufferGeometry){
    super("distortions");
    this.buildUI(distortionParams);

    this._pinch = new Pinch();

    this.geometry = geometry;

    this._distortions = [];
    this._surfaceDistortions = [];
    this._absoluteDistortions = [];

    this._bodyMaterial = new MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: DoubleSide,
          } );
    this._bodyMaterial.flatShading = false;

    this._shellMaterial = new MeshBasicMaterial( {
          color: 0xFFFFFF,
          side: DoubleSide,
          wireframe: true
    } );

    this._displaySolidShells = false;

    this.geometry = geometry;
    this.updateFunction(this.apply);

  }

  public set geometry(geometry:BufferGeometry){

    let skinVisible:boolean = false;;
    let outerVisible:boolean = false;
    let innerVisible:boolean = false;

    if(this._skinMesh){
      skinVisible  = this._skinMesh.visible;
      outerVisible = this._outerMesh.visible;
      innerVisible = this._innerMesh.visible;
    }

    this._bodyShell = new DistortableGeometry(geometry.clone());
    this._skinShell = new DistortableGeometry(geometry.clone());
    this._innerShell = new DistortableGeometry(geometry.clone());
    this._outerShell = new DistortableGeometry(geometry.clone());

    this._bodyMesh = new Mesh(this._bodyShell.geometry(), this._bodyMaterial);
    this._skinMesh = new Mesh(this._skinShell.geometry(), this._bodyMaterial);
    this._innerMesh = new Mesh(this._innerShell.geometry(), this._shellMaterial);
    this._outerMesh = new Mesh(this._outerShell.geometry(), this._shellMaterial);

    this._skinMesh.visible = skinVisible;
    this._innerMesh.visible = innerVisible;
    this._outerMesh.visible = outerVisible;

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

  public get innerShell():DistortableGeometry{
    return this._innerShell;
  }

  public get outerShell():DistortableGeometry{
    return this._outerShell;
  }

  public smoothPointCount(pts){

    this._pointCount = pts;

    function findLableFor(el) {
       var idVal = el.id;
       var labels = document.getElementsByTagName('label');
       for( var i = 0; i < labels.length; i++ ) {
          if (labels[i].htmlFor == el)
               return labels[i];
       }
    }

    for(var i = 0; i < 20; ++i){
      var elem = document.getElementById("distortionspinch"+i).style.display = 'none';
      findLableFor("distortionspinch"+i).style.display = 'none';
    }

    for(var i = 0; i < pts; ++i){
      var elem = document.getElementById("distortionspinch"+i).style.display = 'block';
      findLableFor("distortionspinch"+i).style.display = 'block';
    }
  }

  public addDistortion(distortion:BufferDistortion){
    this._distortions.push(distortion);
    distortion.updateFunction(this.apply);
    distortion.pinch = this._pinch;
  }

  public addAbsoluteDistortion(distortion:BufferDistortion){
    this._absoluteDistortions.push(distortion);
    distortion.updateFunction(this.apply);
    distortion.pinch = this._pinch;
  }

  public addSurfaceDistortion(distortion:BufferDistortion){
    this._surfaceDistortions.push(distortion);
    distortion.updateFunction(this.apply);
    distortion.pinch = this._pinch;
  }

  public update_pinch = () => {
    this._pinch.top = this["pinch_top"];
    this._pinch.bottom = this["pinch_bottom"];
    this.update_pinch_points();
  }

  private update_pinch_points(){
    let pinch_points = []
    for(let p = 0; p < this._pointCount; ++p){
        pinch_points.push(parseFloat(this["pinch"+p]));
    }
    this._pinch.pinch_points(pinch_points);
  }

  public apply = () => {

    this.update_pinch();

    this.apply_distortions(this._bodyShell, this._distortions);
    this.apply_absolute_distortions(this._bodyShell, this._absoluteDistortions);

    this._bodyShell.geometry().computeVertexNormals();

    this._skinShell.clone_geometry(this._bodyShell);
    this._skinShell.set_current_state_as_initial();

    this.expand_shells();
  }

  public apply_distortions = (geometry:DistortableGeometry, distortions:any[]) => {
    if(this._distortions.length > 0)
      geometry.base_vertex_transformation(distortions[0].vertexDistortionFunction);

    for(var i = 1; i < distortions.length; ++i)
      geometry.additive_vertex_transformation(distortions[i].vertexDistortionFunction);
  }

  public apply_absolute_distortions = (geometry:DistortableGeometry, distortions:any[]) => {
    for(var i = 0; i < distortions.length; ++i)
      geometry.absolute_vertex_transformation(distortions[i].vertexDistortionFunction);
  }

  public expand_shells = () => {
    this.expand_shell_by(this._innerShell, parseFloat(this["expandInner"]));
    this.expand_shell_by(this._outerShell, parseFloat(this["expandOuter"]));
    this.expand_shell_by(this._skinShell , parseFloat(this["expandSkin"]));
  }

  public expand_shell_by(geometry:DistortableGeometry, amount:number){
    geometry.base_vertex_transformation(Expand.expand_function(amount, this._pinch));
  }

}
