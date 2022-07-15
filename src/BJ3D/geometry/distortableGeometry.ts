import {Vector2,
        Vector3,
        BufferGeometry,
        BufferAttribute
} from "three"

export class DistortableGeometry{

  private _geometry:BufferGeometry;
  private _initial_positions:any[];
  private _initial_uvs:any[];
  private _initial_normals:any[];

  public constructor(geometry:BufferGeometry){
    this._geometry = geometry;

    this.positionAttribute().dynamic = true;
    this.normalAttribute().dynamic   = true;
    this.uvAttribute().dynamic       = true;

    this.set_current_state_as_initial();
  }

  public set_current_state_as_initial(){
    this._initial_positions = this.positions().slice();
    this._initial_normals   = this.normals().slice();
    this._initial_uvs       = this.uvs().slice();
  }

  public get length(){
    return this.positions().length/3;
  }

  public clone(){
    let geom = this._geometry.clone();
    return new DistortableGeometry(geom);
  }

  public geometry(){
    return this._geometry;
  }

  public position_at(index:number):Vector3{
      return this.vec3_from_array(this.positions(), index);
  }

  public normal_at(index:number):Vector3{
      return this.vec3_from_array(this.normals(), index);
  }

  public uv_at(index:number):Vector2{
      return this.vec2_from_array(this.uvs(), index);
  }

  public initial_position_at(index:number):Vector3{
      return this.vec3_from_array(this._initial_positions, index);
  }

  public initial_normal_at(index:number):Vector3{
      return this.vec3_from_array(this._initial_normals, index);
  }

  public initial_uv_at(index:number):Vector2{
      return this.vec2_from_array(this._initial_uvs, index);
  }

  public update_positions(){
    this.positionAttribute().needsUpdate = true;
  }

  public update_position_at(position:Vector3, vertex_index:number){
    let index_in_array = this.vec3_array_index(vertex_index);
    this.positions()[index_in_array]   = position.x;
    this.positions()[index_in_array+1] = position.y;
    this.positions()[index_in_array+2] = position.z;
  }

  public base_vertex_transformation(vertex_transformation:(position:Vector3, normal:Vector3, uv:Vector2, index:number) => Vector3){
    for(let i = 0; i < this.length; ++i){
      let newPosition = vertex_transformation(this.initial_position_at(i), this.initial_normal_at(i), this.initial_uv_at(i), i);
      this.update_position_at(this.initial_position_at(i).add(newPosition), i);
    }
    this.update_positions();
  }

  public additive_vertex_transformation(vertex_transformation:(position:Vector3, normal:Vector3, uv:Vector2, index:number) => Vector3){
    for(let i = 0; i < this.length; ++i){
      let newPosition = vertex_transformation(this.position_at(i), this.normal_at(i), this.uv_at(i), i);
      this.update_position_at(this.position_at(i).add(newPosition), i);
    }
    this.update_positions();
  }

  public absolute_vertex_transformation(vertex_transformation:(position:Vector3, normal:Vector3, uv:Vector2, index:number) => Vector3){
    for(let i = 0; i < this.length; ++i){
      let newPosition = vertex_transformation(this.position_at(i), this.normal_at(i), this.uv_at(i), i);
      this.update_position_at(newPosition, i);
    }
    this.update_positions();
  }

  public clone_geometry(other:DistortableGeometry){
    this._geometry.copy(other.geometry());
  }

  public refresh_normals(){
    this._geometry.computeVertexNormals();
  }

  private initial_positions():any[]{
    return this._initial_positions;
  }

  private initial_normals():any[]{
    return this._initial_normals;
  }

  private initial_uvs():any[]{
    return this._initial_uvs;
  }

  private positions():any[]{
    return <any[]>this.positionAttribute().array;
  }

  private normals():any[]{
    return <any[]>this.normalAttribute().array;
  }

  private uvs():any[]{
    return <any[]>this.uvAttribute().array;
  }

  private positionAttribute():BufferAttribute{
    return <BufferAttribute>(this._geometry.getAttribute('position'));
  }

  private normalAttribute():BufferAttribute{
    return <BufferAttribute>(this._geometry.getAttribute('normal'));
  }

  private uvAttribute():BufferAttribute{
    return <BufferAttribute>(this._geometry.getAttribute('uv'));
  }

  private vec3_array_index(vertex_index:number):number{
    return vertex_index*3;
  }

  private vec2_array_index(vertex_index:number):number{
    return vertex_index*2;
  }

  private vec3_from_array(array:any[], index:number):Vector3{
    let index_in_array = this.vec3_array_index(index);

    return new Vector3(
      array[index_in_array],
      array[index_in_array+1],
      array[index_in_array+2]
    )
  }

  private vec2_from_array(array:any[], index:number):Vector2{
    let index_in_array = this.vec2_array_index(index);

    return new Vector2(
      array[index_in_array],
      array[index_in_array+1]
    )
  }

}
