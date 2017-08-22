import {BufferGeometry,
				LineSegments,
				Uint16BufferAttribute,
			  Float32BufferAttribute,
			  LineBasicMaterial} from "three"

export class GridBufferGeometry extends BufferGeometry{

	protected parameters:any;

	constructor(width:number, depth:number, y_position:number, widthSegments?:number, heightSegments?:number){
		super();
		this.type='GridBufferGeometry'

		this.parameters = {
			width: width,
			depth:depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		}

		let width_half = width / 2;
		let depth_half = depth / 2;

		let gridX = Math.floor( widthSegments ) || 1;
		let gridY = Math.floor( heightSegments ) || 1;
		let segment_width = width / gridX;
		let segment_height = depth / gridY;

		let gridX1 = gridX + 1;
		let gridY1 = gridY + 1;

		let ix, iz;
		// buffers

		let indices = [];
		let vertices = [];
		let normals = [];
		let uvs = [];

		// generate vertices and normals and uvs

		for (iz = -depth_half; iz <= depth_half; iz += segment_height) {
			vertices.push( -width_half, y_position, iz);
			normals.push( 0, 1, 0);
			uvs.push(0, 1-(iz/depth));
			vertices.push( width_half, y_position, iz);
			normals.push( 0, 1, 0 );
			uvs.push(1.0, 1-(iz/depth));
		}

		for ( ix = -width_half; ix <= width_half; ix += segment_width) {
			vertices.push( ix, y_position, -depth_half );
			normals.push( 0, 1, 0 );
			uvs.push(ix/width, 0);
			vertices.push( ix, y_position, depth_half);
			normals.push( 0, 1, 0 );
			uvs.push(ix/width, 1.0);
		}

		for (var i = 0; i < vertices.length/3; i+=2) {
			indices.push(i, i+1);
		}

		this.setIndex(new Uint16BufferAttribute(indices, 1));
		this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.addAttribute('normal', new Float32BufferAttribute(normals, 3));
		this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
	}

}

export function buildGridObject(segments_x:number, segments_z:number, y_position:number, width, depth):LineSegments{
	let geom = new GridBufferGeometry(segments_x,segments_z, y_position, width,depth);
  let mat = gridBasicMaterial();
	return new LineSegments(geom, mat);
}

export function gridBasicMaterial():LineBasicMaterial{
	return new LineBasicMaterial({color:0x444444});;
}
