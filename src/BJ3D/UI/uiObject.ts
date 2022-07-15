import {GUIInteractionHandler} from "interaction-centre"

/*

  {
    "amplitude":{
      "label":"amplitude",
      "callbacks":{

      },
      attributes{
       "type":"range",
       "class":"uiSlider"
       "min":0,
       "max":4,
       "step":0.1,
       "value":1
     }
    }

  }

*/


export class UIObject{

  protected _id:string;
  protected _interactions:GUIInteractionHandler;
  protected _parameters:any;
  protected _parent:HTMLElement;
  protected _uiPanel:HTMLElement;
  protected _updateCallback;


  constructor(protected _title:string){}

  protected buildUI(parameters:any){
    this._parameters = parameters;
    this._uiPanel = document.createElement("div");
    this._id = this._title.replace(" ", "-")+"-UIPanel";
    this._uiPanel.setAttribute("id", this._id);
    document.body.appendChild(this._uiPanel);
    let heading = document.createElement("h2");
    heading.innerText = this._title;
    this._uiPanel.appendChild(heading);

    let name, uiLayout, label:HTMLElement;
    let element:HTMLElement;
    let keys = Object.keys(this._parameters);


    for(let i = 0; i < keys.length; ++i){

      name = keys[i];

      Object.defineProperty(this._parameters, this._title+name,
      Object.getOwnPropertyDescriptor(this._parameters, name));
      delete this._parameters[name];
      
      name = this._title+name;

      uiLayout = this._parameters[name];

      //create and link class variables to UI objects
      if(this._parameters[name].variable){
        let variable:string = this._parameters[name].variable;
        this[variable] = this._parameters[name].attributes.value;
        this["set_"+variable] = (value)=>{
          this[variable] = value;
          this._updateCallback();
        };
        let listener = this._parameters[name].listener;
        let callbacks = {}
        callbacks[listener] = "set_"+variable;
        this._parameters[name].callbacks = callbacks;
      }


      //create label if the widget has one specified
      if(uiLayout["label"]){
        label = document.createElement("label");
        label.setAttribute("for", name);
        label.innerText = uiLayout["label"];
        this._uiPanel.appendChild(label);
      }

      //create the actual input element
      element = document.createElement("input");
      element.setAttribute("id", name)
      this._uiPanel.appendChild(element);
    }

    document.body.removeChild(this._uiPanel);

  }

  public get uiPanel():HTMLElement{
    return this._uiPanel;
  }

  public displayUIOn(parent:HTMLElement){
    this._parent = parent;
    this._parent.appendChild(this._uiPanel);
    this._interactions = new GUIInteractionHandler(this, this._parameters);
    this._interactions.start();
  }

  public updateFunction(callback){
    this._updateCallback = callback;
    this._updateCallback();
  }

  public hideUI(){
    if(this._parent){
      this._interactions.stop();
      this._parent.removeChild(this._uiPanel);
    }
  }

}
