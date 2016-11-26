"use strict";

// Global Variables
var gl = null; // WebGL context
var shaderProgram = null;
// The GLOBAL transformation parameters
var globalTz = -4.0;
// Phong coef.
var nPhong = 100;
// Models list and auxiliar varaibles to control draw flux
var models = [];
var indexDrow = 0;
var firstDraw = 0;
var controlsEnable = false;

// Handling the Vertex and the Color Buffers
function initBuffers(objVertexPos) 
{	
	if(models.length !== 0)
	{
			models[objVertexPos].vertexBuffer  = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, models[objVertexPos].vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(models[objVertexPos].vertex), gl.STATIC_DRAW);
			models[objVertexPos].vertexBuffer.itemSize = 3;
			models[objVertexPos].vertexBuffer.numItems = models[objVertexPos].vertex.length / 3;			
			// Associating to the vertex shader
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, models[objVertexPos].vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
			models[objVertexPos].colorBuffer  = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, models[objVertexPos].colorBuffer );
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(models[objVertexPos].colors ), gl.STATIC_DRAW);
			models[objVertexPos].colorBuffer.itemSize = 3;
			models[objVertexPos].colorBuffer .numItems = models[objVertexPos].colors.length / 3;	
			// Associating to the vertex shader
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, models[objVertexPos].colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}
}

//Draw all models in order
function drawModel() 
{
	var index = 0;
	for(var i = 0; i < models.length; i++)
	{	
		if(i >= indexDrow || firstDraw)
	    {
	    	models[i].transformationMatrix = translationMatrix( models[i].position);					 
			models[i].transformationMatrix = mult( models[i].transformationMatrix, rotationZZMatrix( models[i].rotation[2] ) );
			models[i].transformationMatrix = mult( models[i].transformationMatrix, rotationYYMatrix( models[i].rotation[1] ) );
			models[i].transformationMatrix = mult( models[i].transformationMatrix, rotationXXMatrix( models[i].rotation[0] ) );
			models[i].transformationMatrix = mult( models[i].transformationMatrix, scalingMatrix(models[i].scale) );	
			// Parent multiplication 
			if(i !== 0)
			{
				models[i].transformationMatrix = mult( models[i-1].transformationMatrix, models[i].transformationMatrix);
			}
	    }
	   
		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(models[i].transformationMatrix)));
		models[index].colors = computeIllumination( models[i].transformationMatrix, i);
		initBuffers(i);
		gl.drawArrays(gl.TRIANGLES, 0, models[i].vertexBuffer.numItems); 

	}
	firstDraw = 0;
}

//  Drawing the 3D scene
function drawScene() 
{
	var pMatrix;
	// Clearing the frame-buffer and the depth-buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	pMatrix = perspective( 60, 1, 0.2, 100 );
	pMatrix = mult( pMatrix, translationMatrix(new vec3( 0, 0, globalTz)) );	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	drawModel();
}

// Animation --- Updating transformation parameters
var lastTime = 0;
function animate() 
{	
	var timeNow = new Date().getTime();
	if( lastTime !== 0 ) 
	{
		var elapsed = timeNow - lastTime;
		var angle = 5* ((90 * elapsed) / 10000.0);
		
		indexDrow = models.length;
	    for(var i = 1; i < models.length; i++)
	    {	
	    	if(controlsEnable)
	    	{
	    		if(indexDrow >= i)
		    	{
		    		indexDrow = i;
		    	}

	    		switch(i)
	    		{
	    			case 1:
	    				models[i].rotation[1] = document.getElementById("baseSlider").value;
	    			break;
	    			case 2:
	    				models[i].rotation[0] = document.getElementById("block1Slider").value;
	    			break;
	    			case 3:
	    				models[i].rotation[0] = document.getElementById("block2Slider").value;
	    			break;
	    			case 4:
	    				models[i].rotation[2] = document.getElementById("block3Slider").value;
	    			break;
	    			case 5:
	    				models[i].rotation[0] = document.getElementById("block4Slider").value;
	    			break;
	    			case 6:
	    				models[i].rotation[1] = document.getElementById("block5Slider").value;
	    			break;
	    		}
	    	}
	    	else
	    	{
		    	if(equal(models[i].rotationEnable, vec3(0,0,0)))
		    	{	
		    		continue;
		    	}
		    	else
		    	{	
		    		if(indexDrow >= i)
		    		{
		    			indexDrow = i;
		    		}
			    	if(i === 2)
			    	{
			    		if((models[i].rotation[0] > 42.0 && models[i].rotationDirection[0] === 1) || 
			    			(models[i].rotation[0] < -42.0 && models[i].rotationDirection[0] === -1))
			    		{
			    			continue;
			    		}
			    		models[i].rotation[0] += models[i].rotationEnable[0] * models[i].rotationDirection[0] * models[i].rotationSpeed[0] * angle;
			    	}
			    	else if(i === 3 || i === 5)
			    	{
			    		if((models[i].rotation[0] > 90.0 && models[i].rotationDirection[0] === 1) || 
			    			(models[i].rotation[0] < -90.0 && models[i].rotationDirection[0] === -1))
			    		{
			    			continue;
			    		}
			    		models[i].rotation[0] += models[i].rotationEnable[0] * models[i].rotationDirection[0] * models[i].rotationSpeed[0] * angle;
			    	}
			    	else if(i == 4)
			    	{
			    		if((models[i].rotation[2] > 90.0 && models[i].rotationDirection[2] === 1) || 
			    			(models[i].rotation[2] < -90.0 && models[i].rotationDirection[2] === -1))
			    		{
			    			continue;
			    		}
			    		models[i].rotation[2] += models[i].rotationEnable[2] * models[i].rotationDirection[2] * models[i].rotationSpeed[2] * angle;
			    	}
			    	else
			    	{
			   			models[i].rotation[1] += models[i].rotationEnable[1] * models[i].rotationDirection[1] * models[i].rotationSpeed[1] * angle;
			    	}
		    	}
	    	}
	    } 
	}
	lastTime = timeNow;
}
// Timer
function tick() 
{
	requestAnimFrame(tick);
	handleKeys();
	drawScene();
	animate();
}

// Go to initial position
function resetPosition()
{
	for(var i = 0; i < models.length; i++)
		{
			models[i].origin = new vec3(0,0,0);
			models[i].rotation = new vec3(0,0,0);
			models[i].scale = new vec3(1,1,1);
			models[i].rotationSpeed =  new vec3(1,1,1);
			models[i].rotationEnable = new vec3(0,0,0);
			models[i].rotationDirection = new vec3(0,0,0);
			models[i].transformationMatrix = mat4();
		}
		firstDraw = 1;
}

//Update models 
function updateKeysAction(modelIdentifier, dir, axis, enable)
{	
	if(modelIdentifier <= models.length)
	{
		// model number for apllies transformation matrix 
		if(axis === 'x')
			axis = 0;
		else if(axis === 'y')
			axis = 1;
		else if(axis === 'z')
			axis = 2;
		if(dir === "left")
		{
			models[modelIdentifier].rotationDirection[axis] = -1;
		}
		else if(dir === "right")
		{
			models[modelIdentifier].rotationDirection[axis] = 1;
		}
			
		models[modelIdentifier].rotationEnable[axis] = enable;
	}
}

function enableSliceControls(enable)
{
	if(enable)
	{
		controlsEnable = true;
	}
	else
	{
		controlsEnable = false;
	}
	resetPosition();
}

// WebGL Initialization
function initWebGL( canvas ) {
	try 
	{
		gl = canvas.getContext("webgl");
		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );        
	} 
	catch (e) {}
	if (!gl) {
		alert("Could not initialise WebGL");
	}        
}

function runWebGL() 
{	
	var canvas = document.getElementById("canvas");
	initWebGL( canvas );
	shaderProgram = initShaders( gl );
	setEventListeners();
	//load obj model
	models = loadOBJ(readFile("data/obj/arm-robotic/Arm/arm.obj"));
	initBuffers(0);
	tick();
}