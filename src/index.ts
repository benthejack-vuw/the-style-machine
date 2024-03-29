import {LineSegments,
	 			CylinderBufferGeometry,
				Mesh,
				MeshBasicMaterial,
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
import {Twist} from "./distortions/twist"
import {LatheBuilder} from "./geometryBuilders/latheBuilder"


window.addEventListener('load', function(){

	let stage = new Stage3D("stage");
	stage.addToScene(buildGridObject(30,30,0, 30,30));

	let UI = document.getElementById("controls");
	let geomSelector = new GeometrySelector(UI);

	let latheBuilder = new LatheBuilder(geomSelector.uiPanel);
	let geom = latheBuilder.build();

	let distorter = new DistortionAggregator(geom);
	distorter.scene = stage.scene;
	distorter.displayUIOn(UI);

	let corrugator = new Corrugator();
	corrugator.displayUIOn(UI);
	distorter.addDistortion(corrugator);

	let twist = new Twist();
	twist.displayUIOn(UI);
	distorter.addAbsoluteDistortion(twist);

	function updateMesh(buffer:BufferGeometry){
			buffer.computeBoundingBox();

			stage.removeFromScene(distorter.innerMesh);
			stage.removeFromScene(distorter.bodyMesh);
			stage.removeFromScene(distorter.outerMesh);
			stage.removeFromScene(distorter.skinMesh);

			buffer.type = 'BufferGeometry';
			distorter.geometry = buffer;

			stage.addToScene(distorter.innerMesh);
			stage.addToScene(distorter.bodyMesh);
			stage.addToScene(distorter.outerMesh);
			stage.addToScene(distorter.skinMesh);


	}

	function updateAndApply(buffer:BufferGeometry){
		updateMesh(buffer);
		distorter.apply();
	}

	function updateLathe(){
		updateMesh(latheBuilder.build());

		distorter.apply();
		distorter.smoothPointCount(latheBuilder.numPoints);
	}

	latheBuilder.updateFunctions(updateLathe, distorter.apply);
	geomSelector.updateFunction(updateAndApply);

	latheBuilder.runCallbacks();
});
