function setEventListeners()
{    
	document.getElementById('enable').onclick = function() {
	    if ( this.checked ) 
	    {
	        enableSliceControls(1);
	    } 
	    else 
	    {
	    	enableSliceControls(0);
	    }
	};
	
	function handleKeyDown(event) 
	{
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) 
    {	
        currentlyPressedKeys[event.keyCode] = false;
    }
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp; 
    document.getElementById("myCheck")      
}

var currentlyPressedKeys = {};
function handleKeys() 
{
	// Block1
	if (currentlyPressedKeys[65]) 
	{
		updateKeysAction(1, "left", 'y', 1);
	}
	else if(currentlyPressedKeys[68])
	{
		updateKeysAction(1, "right", 'y', 1);
	}
	else
	{
		updateKeysAction(1, "right", 'y', 0);
	}
	//Block2
	if (currentlyPressedKeys[87]) 
	{
		updateKeysAction(2, "left", 'x', 1);
	}
	else if(currentlyPressedKeys[83])
	{
		updateKeysAction(2, "right", 'x', 1);
	}
	else
	{
		updateKeysAction(2, "right", 'x', 0);
	}
	//Block3
	if (currentlyPressedKeys[38]) 
	{
		updateKeysAction(3, "left", 'x', 1);
	}
	else if(currentlyPressedKeys[40])
	{
		updateKeysAction(3, "right", 'x', 1);
	}
	else
	{
		updateKeysAction(3, "right", 'x', 0);
	}
	//Block4
	if (currentlyPressedKeys[39]) 
	{
		updateKeysAction(4, "left", 'z', 1);
	}
	else if(currentlyPressedKeys[37])
	{
		updateKeysAction(4, "right", 'z', 1);
	}
	else
	{
		updateKeysAction(4, "right", 'z', 0);
	}
	//Block5
	if (currentlyPressedKeys[88]) 
	{
		updateKeysAction(5, "left", 'x', 1);
	}
	else if(currentlyPressedKeys[90])
	{
		updateKeysAction(5, "right", 'x', 1);
	}
	else
	{
		updateKeysAction(5, "right", 'x', 0);
	}
	//Block6
	if (currentlyPressedKeys[69]) 
	{
		updateKeysAction(6, "left", 'y', 1);
	}
	else if(currentlyPressedKeys[81])
	{
		updateKeysAction(6, "right", 'y', 1);
	}
	else
	{
		updateKeysAction(6, "right", 'y', 0);
	}
	//Reset
	if(currentlyPressedKeys[82])
	{
		resetPosition();
	}
}