import {BufferGeometry,
        Vector3,
        Vector2,
        Float32BufferAttribute,
        BufferAttribute} from "three"

import {BJMath} from "bj-utils"

export class SewnLatheBufferGeometry extends BufferGeometry{

  private parameters:any;

  constructor( points:any[], segments:number, phiStart:number, phiLength:number ){
    super();

    	this.type = 'LatheBufferGeometry';

    	this.parameters = {
    		points: points,
    		segments: segments,
    		phiStart: phiStart,
    		phiLength: phiLength
    	};

    	segments = Math.floor( segments ) || 12;
    	phiStart = phiStart || 0;
    	phiLength = phiLength || Math.PI * 2;

    	// clamp phiLength so it's in range of [ 0, 2PI ]

    	phiLength = BJMath.clamp( phiLength, 0, Math.PI * 2 );


    	// buffers

    	var indices = [];
    	var vertices = [];
    	var uvs = [];

    	// helper variables

    	var base;
    	var inverseSegments = 1.0 / segments;
    	var vertex = new Vector3();
    	var uv = new Vector2();
    	var i, j;

    	// generate vertices and uvs

    	for ( i = 0; i < segments; i ++ ) {

    		var phi = phiStart + i * inverseSegments * phiLength;

    		var sin = Math.sin( phi );
    		var cos = Math.cos( phi );

    		for ( j = 0; j <= ( points.length - 1 ); j ++ ) {

    			// vertex

    			vertex.x = points[ j ].x * sin;
    			vertex.y = points[ j ].y;
    			vertex.z = points[ j ].x * cos;

    			vertices.push( vertex.x, vertex.y, vertex.z );

    			// uv
    			uv.x = i / segments;
    			uv.y = j / ( points.length - 1 );

    			uvs.push( uv.x, uv.y );


    		}

    	}

    	// indices

    	for ( i = 0; i < segments; i ++ ) {

    		for ( j = 0; j < ( points.length - 1 ); j ++ ) {

    			base = j + i * points.length;

          var a, b, c, d;

          if(i < segments-1){
    			   a = base;
    			   b = base + points.length;
    			   c = base + points.length + 1;
    			   d = base + 1;
          }else{
             a = base;
             b = j;
             c = j + 1;
             d = base + 1;
          }

    			// faces

    			indices.push( a, b, d );
    			indices.push( b, c, d );

    		}

    	}

    	// build geometry

    	this.setIndex( indices );
    	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

    	// generate normals

    	this.computeVertexNormals();

  }

}
