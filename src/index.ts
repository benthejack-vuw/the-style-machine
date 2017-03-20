import {LineSegments,
	 			CylinderBufferGeometry,
				Mesh,
				MeshPhongMaterial,
			  BufferGeometry,
				DoubleSide,
				FlatShading} from 'three'

import {loadOBJ} from "./BJ3D/geometry/geometryLoader"
import {GeometrySelector} from "./interface/geometrySelector"
import {Stage3D} from "./BJ3D/scene/stage3D"
import {buildGridObject} from "./BJ3D/geometry/gridBufferGeometry"
import {DistortionAggregator} from "./BJ3D/geometry/distortionAggregator"
import {Corrugator} from "./distortions/corrugator"
import {LatheBuilder} from "./geometryBuilders/latheBuilder"


window.addEventListener('load', function(){

	let stage = new Stage3D("stage");
	stage.addToScene(buildGridObject(30,30,0, 30,30));

	let UI = document.getElementById("controls");
	let geomSelector = new GeometrySelector(UI);

	let latheBuilder = new LatheBuilder(geomSelector.uiPanel);
	let geom = latheBuilder.build();
	geomSelector.geometry = geom;

	let material = new MeshPhongMaterial( {
					color: 0x156289,
					emissive: 0x072534,
					side: DoubleSide,
					shading: FlatShading
				} );
	let currentMesh:Mesh = new Mesh(geom, material);
	stage.addToScene(currentMesh);

	let distorter = new DistortionAggregator(<BufferGeometry>currentMesh.geometry);
	let corrugator = new Corrugator();
	corrugator.displayUIOn(UI);
	distorter.addDistortion(corrugator);

	function updateMesh(buffer:BufferGeometry){
			buffer.type = 'BufferGeometry';
			distorter.setGeometry(buffer);
			geomSelector.geometry = buffer;
			currentMesh.geometry = buffer;
			distorter.apply();
	}

	function updateLathe(){
		updateMesh(latheBuilder.build());
	}

	latheBuilder.updateFunction(updateLathe);
	geomSelector.updateFunction(updateMesh);

});
