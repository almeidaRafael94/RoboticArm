// Model 
function Model()
{
	//Model Data
	this.vertex = [];
	this.normals = []; 
	this.faces = []; 
	this.colors = [];
	this.texture_coords = [];

	//Buffers
	this.colorBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Tranformations Control
	this.origin = new vec3(0,0,0);
	this.position = new vec3(0,0,0);
	this.rotation = new vec3(0,0,0);
	this.scale = new vec3(1,1,1);

	//Rotation controlers
	this.rotationSpeed =  new vec3(1,1,1);
	this.rotationEnable = new vec3(0,0,0);
	this.rotationDirection = new vec3(0,0,0);

	//Tranformation Matrix
	this.transformationMatrix = mat4();
}