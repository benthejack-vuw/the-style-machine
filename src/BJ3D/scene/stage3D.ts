import {TrackballControls} from 'three-trackballcontrols-es6'
import {Point} from "bj-utils/lib/geometry/point"
import {Vector2,
				Vector3,
	      Renderer,
				WebGLRenderer,
				Scene,
				Camera,
				PerspectiveCamera,
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
	private _camera:THREE.PerspectiveCamera;

	private _trackball:THREE.TrackballControls;

	private _resizing:boolean = false;

	constructor(parentID:string){
		this._parent = document.getElementById(parentID);
		this._size = new Vector2(this._parent.clientWidth, this._parent.clientHeight);

		this._renderer = new WebGLRenderer();
		this._renderer.setSize(this._size.x, this._size.y);

		this._scene = new Scene();
		this._scene.background = new Color(0x282c34);
		this._camera = new PerspectiveCamera(75, this._size.x/this._size.y, 0.1, 1000);
		this._camera.position.z = 4;
		this._camera.position.y = 3;
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

		this._trackball = new TrackballControls(this._camera, this._parent);
		this._parent.appendChild(this._canvas);

		window.addEventListener('resize', this.resize);
		this.start();
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
		this._renderer.render(this._scene, this._camera);

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
			this._camera.aspect = this._size.x/this._size.y;
			this._camera.updateMatrix();
			this._renderer.setSize(this._size.x, this._size.y);
			this._trackball.handleResize();
			window.requestAnimationFrame(this.throttle_resize);
		}
	}

}
