var models = [];

//Read text file
function readFile(fname)
{
	var file = new XMLHttpRequest();
	file.overrideMimeType("text/plain");
	
	var data = null;
	//Request file to server
	file.open("GET", fname, false);
	//Get file
	file.onreadystatechange = function ()
	{
		if(file.status === 200 || file.status === 0)
		{
			data = file.responseText;
		}
	}
	//Send null to ensure that file was received
	file.send(null);
	return data;
}

//load obj file
function loadOBJ(data)
{
	// The file lines
	var lines = data.split('\n');
	
	//Clear Data
	var vertex = []; //Vertex Points
	var normals = []; //Vertex Normals
	var texture_coords = []; //Vertex Texture Coords
	var faces = []; //Face

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
		var tokens = lines[i].split(/\s\s*/);
		//Group
		if(tokens[0] == "g")
		{
			if (i !== 0)
			{	
				//Covert collected data
				transformOBJData(vertex, normals, texture_coords, faces);
			}
			vertex = [];
			normals = [];
			texture_coords = [];
			faces = [];
		}
		//Vertices
		else if(tokens[0] == "v")
		{
			vertex.push(parseFloat(tokens[1]));
			vertex.push(parseFloat(tokens[2]));
			vertex.push(parseFloat(tokens[3]));
		}
		//Normals
		else if(tokens[0] == "vn")
		{
			normals.push(parseFloat(tokens[1]));
			normals.push(parseFloat(tokens[2]));
			normals.push(parseFloat(tokens[3]));
		}
		//Texture coords
		else if(tokens[0] == "vt")
		{
			texture_coords.push(parseFloat(tokens[1]));
			texture_coords.push(parseFloat(tokens[2]));
		}
		//Faces <vertex>/<texture>/<normal>
		else if(tokens[0] == "f")
		{
			var val = tokens[1].split("/");
			faces.push(parseInt(val[0])); //Vertex
			faces.push(parseInt(val[1])); //Texture
			//faces.push(parseInt(val[2]));; //Normal

			val = tokens[2].split("/");
			faces.push(parseInt(val[0])); //Vertex
			faces.push(parseInt(val[1])); //Texture
			//faces.push(parseInt(val[2]));; //Normal

			val = tokens[3].split("/");
			faces.push(parseInt(val[0])); //Vertex
			faces.push(parseInt(val[1])); //Texture
			//faces.push(parseInt(val[2]));; //Normal
			
			//4 vertex face
			//f 16/92 14/101 1/69 10/2
			if(tokens.length == 5)
			{
				val = tokens[1].split("/");
				faces.push(val[0]); //Vertex
				faces.push(val[1]); //Texture
				//faces.push(val[2]); //Normal
				val = tokens[3].split("/");
				faces.push(val[0]); //Vertex
				faces.push(val[1]); //Texture
				//faces.push(val[2]); //Normal
				val = tokens[4].split("/");
				faces.push(val[0]); //Vertex
				faces.push(val[1]); //Texture
				//faces.push(val[2]); //Normal
			}
		}
	}
	//initBuffers(0);
	return models;
}

//Tranform OBJ file to single hash level as used in classes
function transformOBJData(v, n, t , f)
{
	//Create temporary arrays to store all model data
	var vertex = [];
	var texture = [];
	var normals = [];
	var faces = [];
	var colors = [];
	
	//Transform Data
	for(var i = 0; i < f.length; i += 2)
	{
		faces.push(i/3);
		vertex.push(v[(f[i]-1)*3]);
		vertex.push(v[(f[i]-1)*3+1]);
		vertex.push(v[(f[i]-1)*3+2]);
		texture.push(t[(f[i+1]-1)*2]);
		texture.push(t[(f[i+1]-1)*2+1]);
	}
	// Checking to see if the normals are defined on the file
	if( normals.length == 0 )
	{
		computeVertexNormals( vertex, normals );
	}
	for(var i = 0; i < vertex.length; i++)
	{
		colors.push(1.0);
	}
	//Copy array pointer into main data and update bufffers
	var model = new Model();
	model.vertex = vertex;
	model.normals = normals;
	model.texture_coords = texture;
	model.colors = colors.slice();
	models.faces = faces;
	models.push(model);
	updateModelsPosition(models.length-1);
}


//update translation atrix 
function updateModelsPosition(modelIndex)
{
	switch(modelIndex)
	{
		case 0:
			models[0].position = [0, -1.0, 0];
		break;
		case 1:
			models[1].position = [0, 0.05, 0];
		break;
		case 2:
			models[2].position = [0, 0.35, 0];
		break;
		case 3:
			models[3].position = [0, 0.85, 0];
		break;
		case 4:
			models[4].position = [0, 0.40, 0];
		break;
		case 5:
			models[5].position = [0, 0.4, 0];
		break;
		case 6:
			models[6].position = [0, 0.25, 0];
		break;
	}
}