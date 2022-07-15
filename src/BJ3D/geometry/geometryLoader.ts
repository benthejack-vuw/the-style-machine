import {Mesh} from 'three'
import * as Domutils from "bj-utils/lib/util/domUtils"
import {OBJLoader} from "three-obj-loader-es6"


export function selectOBJFile(){
  return new Promise((resolve, reject)=>{
    Domutils.selectFile().then((file:File) => {
      return Domutils.readFile(file);
    }).then(data => {
      let mesh = parseGeometry(data);
      resolve(mesh);
    }).catch(err => {
      reject(err);
    });
  });
}

export function loadOBJ(url):Promise<Mesh>{
  return new Promise<Mesh>((resolve, reject)=>{
    Domutils.fetchFile(url).then(data => {
      resolve(parseGeometry(data));
    }).catch(err => {
      reject(err);
    });
  });
}

function parseGeometry(text):Mesh{
	let loader = new OBJLoader();
	let object = loader.parse(text);
  var last_child;

	object.traverse( ( child ) => {
		if(child instanceof Mesh){
      last_child = child;
		}
	});

  return last_child;
}
