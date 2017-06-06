import {TrackballControls} from 'three-trackballcontrols-es6'
import {Point} from "bj-utils/lib/geometry/point"
import {Vector2,
				Vector3,
	      Renderer,
				WebGLRenderer,
				Scene,
				Camera,
				PerspectiveCamera,
				OrthographicCamera,
			  Object3D,
			  EventDispatcher,
				BoxGeometry,
				MeshBasicMaterial,
				Mesh,
			  Color,
			PointLight} from 'three'

export class Stage3D{

	private _size:Vector2;
	private _loop:boolean;

	private _parent:HTMLElement;
	private _canvas:HTMLCanvasElement;
	private _renderer:Renderer;
	private _scene:THREE.Scene;
	private _perspCamera:THREE.PerspectiveCamera;
	private _lockedCamera:THREE.PerspectiveCamera;
	private _currentCamera:THREE.Camera;

	private _trackball:THREE.TrackballControls;

	private _resizing:boolean = false;
	private _cameraToggle:HTMLInputElement;

	constructor(parentID:string){
		this._parent = document.getElementById(parentID);
		this._size = new Vector2(this._parent.clientWidth, this._parent.clientHeight);

		this._renderer = new WebGLRenderer();
		this._renderer.setSize(this._size.x, this._size.y);

		this._scene = new Scene();
		this._scene.background = new Color(0x282c34);
		this._perspCamera = new PerspectiveCamera(75, this._size.x/this._size.y, 0.1, 1000);
		this._perspCamera.position.z = 3.5;
		this._perspCamera.position.y = 3;

		let proportion = this._size.x/this._size.y;
		this._lockedCamera = new PerspectiveCamera(75, this._size.x/this._size.y, 0.1, 1000);
		this._lockedCamera.position.z =3.5;
		this._lockedCamera.position.y = 1.5;

		this._currentCamera = this._perspCamera;

		this._canvas = this._renderer.domElement;



		var lights = [];
		lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
		lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
		lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

		lights[ 0 ].position.set( 0, 200, 0 );
		lights[ 1 ].position.set( 100, 200, 100 );
		lights[ 2 ].position.set( - 100, - 200, - 100 );

		this._scene.add( lights[ 0 ] );
		this._scene.add( lights[ 1 ] );
		this._scene.add( lights[ 2 ] );

		this._trackball = new TrackballControls(this._perspCamera, this._parent);
		this._parent.appendChild(this._canvas);

		this._cameraToggle = document.createElement("input");
		this._cameraToggle.setAttribute("id", "cameraToggle");
		this._cameraToggle.setAttribute("type", "button");
		this._cameraToggle.setAttribute("value", "view locked camera");
		this._cameraToggle.setAttribute("style", "width:150px; position:fixed; right:20px; top:20px;");
		this._cameraToggle.addEventListener("click", this.toggleCamera);
		document.body.appendChild(this._cameraToggle);

		window.addEventListener('resize', this.resize);
		this.start();
	}

	public toggleCamera = ()=>{
			this._currentCamera = this._currentCamera == this._lockedCamera ? this._perspCamera : this._lockedCamera;
			this._cameraToggle.setAttribute("value", this._currentCamera == this._lockedCamera ? "unlock camera" : "view locked camera");
			this._trackball.reset();
	}

	public start(){
		this.loop = true;
	}

	public get loop():boolean{
		return this._loop;
	}

	public set loop(do_loop){
		this._loop = do_loop;
		if(this._loop)
			window.requestAnimationFrame(this.render);
	}

	public get scene():Scene{
		return this._scene;
	}

	public get canvas():HTMLCanvasElement{
		return this._canvas;
	}

	public get renderer():Renderer{
		return this._renderer;
	}

	public addToScene(object:Object3D){
		this._scene.add(object);
	}

	public removeFromScene(object:Object3D){
		this._scene.remove(object);
	}

	public render = ()=>{
		this._trackball.update();
		this._renderer.render(this._scene, this._currentCamera);

		if(this._loop)
			window.requestAnimationFrame(this.render);
	}

	public throttle_resize = () => {
		this._resizing = false;
	}

	public resize = () => {
		if(!this._resizing){
			this._resizing = true;
			this._size = new Vector2(this._parent.clientWidth, this._parent.clientHeight);
			this._renderer.setSize(this._size.x, this._size.y);
			this._trackball.handleResize();
			window.requestAnimationFrame(this.throttle_resize);
		}
	}

}
