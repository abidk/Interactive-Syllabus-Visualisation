dojo.provide("visualisation.utilities.GraphicFunctions");

dojo.declare("Shape", null, {
constructor: function(  box, shadow, title, group, colour ){
		this.box = box;
		this.shadow = shadow;
		this.title = title;
		this.group = group;
		
		if( colour == null ) {
			this.colour = getRandomColour();
		} else {
			this.colour = colour;
		}
	}
});


/*
Draw a line between two shapes.
*/
drawLine = function(shape1, shape2, colour){
	var surface = visual.getSurface();
	if( colour == null ) {
		colour = getRandomColour();
	}

	// work out the node 1 center
	var x_1 = shape1.getShape().x + shape1.getShape().width/2;
	var y_1 = shape1.getShape().y + shape1.getShape().height/2;

	// work out the node 2 center
	var x_2 = shape2.getShape().x + shape2.getShape().width/2;
	var y_2 = shape2.getShape().y + shape2.getShape().height/2;

	var line = surface.createLine({ x1: x_1, y1: y_1, x2: x_2, y2: y_2 });
	line.setStroke({color: colour, width: 3});
	line.moveToBack();
	return line;
};

createUpArrow = function( surface, position) { 
	var hour_shadow = surface.createShape({type: "path"});
	hour_shadow.moveTo(position.x+5, position.y);
	
	hour_shadow.lineTo(position.x+5, position.y);
	hour_shadow.lineTo(position.x, position.y+12);
	hour_shadow.lineTo(position.x+10, position.y+12);
	
	hour_shadow.setFill("black");		
};
	
drawLine1 = function(shape1, shape2, colour){
	var surface = visual.getSurface();
	if( colour == null ) {
		colour = getRandomColour();
	}
	
	// work out the node 1 center
	var x_1 = shape1.getShape().x + shape1.getShape().width/2;
	var y_1 = shape1.getShape().y + shape1.getShape().height/2;

	// work out the node 2 center
	var x_2 = shape2.getShape().x + shape2.getShape().width/2;
	var y_2 = shape2.getShape().y + shape2.getShape().height/2;
		
	var line = null;
	if( y_1 == y_2 ) {
		//draw line going down from A
		line = surface.createLine({ x1: x_2+15, y1: y_2, x2: x_2+15, y2: y_2+20 });
		line.setStroke({color: colour, width: 1});
		line.moveToBack();
		
		//draw line going up from B
		line = surface.createLine({ x1: x_1+15, y1: y_1, x2: x_1+15, y2: y_1+40 });
		line.setStroke({color: colour, width: 1});
		line.moveToBack();
			
		// then join line A with B line
		line = surface.createLine({ x1: x_1+15, y1: y_1+40, x2: x_2+15, y2: y_2+20 });
		line.setStroke({color: colour, width: 1});
		line.moveToBack();
	} else {
		line = surface.createLine({ x1: x_1, y1: y_1, x2: x_2, y2: y_2 });
		line.setStroke({color: colour, width: 3});
		line.moveToBack();
	}
	return line;
};

drawNicerLine = function(course1, course2, colour ){
	var shape1 = shapes.item( course1.code ).box;
	var shape2 = shapes.item( course2.code ).box;

	
	var surface = visual.getSurface();
	var group = surface.createGroup(); 

	
	// work out the node 1 center
	var x_1 = shape1.getShape().x + shape1.getShape().width/2;
	var y_1 = shape1.getShape().y + shape1.getShape().height/2;

	// work out the node 2 center
	var x_2 = shape2.getShape().x + shape2.getShape().width/2;
	var y_2 = shape2.getShape().y + shape2.getShape().height/2;
	
	if( x_1 == x_2 ) {			
		// draw line at top course
		var line = group.createLine({ x1: x_2+5, y1: y_2, x2: x_1+5, y2: y_2+25 });
		line.setStroke({color: colour, width: 3});
		
		// draw diognal line
		line = group.createLine({ x1: x_1-5, y1: y_1, x2: x_2-5, y2: y_2+35 });
		line.setStroke({color: colour, width: 3});
		
		//draw line going down
		line = group.createLine({ x1: x_1+5, y1: y_2+25, x2: x_2-5, y2: y_2+35 });
		line.setStroke({color: colour, width: 3});			
	} else if( y_1 == y_2 ) {
		// if the course is 1 then specfically display the lines at the top otherwise bottom
		//if( course1.level == "1") {
			//draw line going down from A
		//	var line = group.createLine({ x1: x_2+5, y1: y_2, x2: x_2+5, y2: y_2-10 });
		//	line.setStroke({color: colour, width: 1});
		
			//draw line going up from B
		//	line = group.createLine({ x1: x_1+5, y1: y_1, x2: x_1+5, y2: y_1-40 });
		//	line.setStroke({color: colour, width: 1});
			
			// then join line A with B line
		//	line = group.createLine({ x1: x_1+5, y1: y_1-40, x2: x_2+5, y2: y_2-10 });
		//	line.setStroke({color: colour, width: 1});
			
		//} else {
			//draw line going down from A
			var line = group.createLine({ x1: x_2+15, y1: y_2, x2: x_2+15, y2: y_2+20 });
			line.setStroke({color: colour, width: 1});
		
			//draw line going up from B
			line = group.createLine({ x1: x_1+15, y1: y_1, x2: x_1+15, y2: y_1+40 });
			line.setStroke({color: colour, width: 1});
			
			// then join line A with B line
			line = group.createLine({ x1: x_1+15, y1: y_1+40, x2: x_2+15, y2: y_2+20 });
			line.setStroke({color: colour, width: 1});
		//}
	} else {
		//draw line going down from A
		var line = group.createLine({ x1: x_2+5, y1: y_2, x2: x_2+5, y2: y_2+25 });
		line.setStroke({color: colour, width: 3});
		
		
		if( x_1 > x_2 ) {
			//draw line going up from B
			line = group.createLine({ x1: x_1-20, y1: y_1, x2: x_1-20, y2: y_1-25 });
			line.setStroke({color: colour, width: 3});
			
			// then join line A -B with line
			line = group.createLine({ x1: x_1-20, y1: y_1-25, x2: x_2+5, y2: y_2+25 });
			line.setStroke({color: colour, width: 3});
		} else {
			//draw line going up from B
			line = group.createLine({ x1: x_1+20, y1: y_1, x2: x_1+20, y2: y_1-25 });
			line.setStroke({color: colour, width: 3});
			
			// then join line A -B with line
			line = group.createLine({ x1: x_1+20, y1: y_1-25, x2: x_2+5, y2: y_2+25 });
			line.setStroke({color: colour, width: 3});
		}

	}
	
	group.moveToBack();
	return group;
};


/*
return random colour
*/
getRandomColour = function() {
	var red   = Math.floor(Math.random() * (20 - 200) + 200);
	var green = Math.floor(Math.random() * (20 - 200) + 200);
	var blue  = Math.floor(Math.random() * (20 - 200) + 200);
	return [red, green, blue, 1];
};

selectBox = function( course ) {
	var shape = shapes.item( course.code );

	if( isCourseSelected( course ) ) {
		shape.box.setStroke({color: "black", width: 4});
	} else {
		shape.box.setStroke({color: "black", width: 1});
	}
};

var row = -20;


highlightBox = function( highlightSelected, array, course, line, colour ) {
	if( highlightSelected == "algorithm1" ) {
		highlightAlgoritm1( array, course, line, colour );
	} else if( highlightSelected == "algorithm2" ) {
		highlightAlgoritm2( array, course, line, colour );
	}
};

highlightAlgoritm1 = function( array, course, line, colour ) {
	var shape = shapes.item( course.code );
	
	for ( ptr in array ){
		var shape2 = shapes.item( array[ptr] );
	
		
		if( shape2 != null ) {
			var shape_x = shape.box.getShape().x;
			var shape_y = shape.box.getShape().y;
			
			var shape2_x = shape2.box.getShape().x;
			var shape2_y = shape2.box.getShape().y;
			
			shape2.box.setFill( colour );

			var zero_x = -(shape2_x - shape_x);
			var zero_y = -(shape2_y - shape_y);
			
			var offset = 0;
			if( course.semester == "0" || course.semester == "1" ) {
				offset = 210;
			} else {	
				offset = 110;
			}
		
			shape2.group.setTransform( dojox.gfx.matrix.translate( {x: zero_x+offset, y: zero_y+row} ) );						
			shape2.group.moveToFront();
			
			if( line != null ) {
				// work out the node 1 center
				var x_1 = shape.box.getShape().x + shape.box.getShape().width/2;
				var y_1 = shape.box.getShape().y + shape.box.getShape().height/2;

				// work out the node 2 center
				var x_2 = shape2.box.getShape().x + (zero_x+offset) + shape2.box.getShape().width/2;
				var y_2 = shape2.box.getShape().y + (zero_y+row) + shape2.box.getShape().height/2;
			
				var group = visual.getSurface();
				var line1 = group.createLine({ x1: x_1, y1: y_1, x2: x_2, y2: y_2 });
				line1.setStroke({color: colour, width: 3});
				line.add( line1 );
			}

			row = row + 45;
		}
	}
};


highlightAlgoritm2 = function( array, course, line, colour ) {
	var shape = shapes.item( course.code );

	for ( ptr in array ){
		var shape2 = shapes.item( array[ptr] );
	
		
		if( shape2 != null ) {
			var shape_x = shape.box.getShape().x;
			var shape_y = shape.box.getShape().y;
			
			var shape2_x = shape2.box.getShape().x;
			var shape2_y = shape2.box.getShape().y;
			
			shape2.box.setFill( colour );

			
			if( line != null ) {
				line.add( drawLine( shape.box, shape2.box, colour ) );
			}				
		}
	}
};

unhighlightBox = function( array, course ) {
	row = -20;

	var shape = shapes.item( course.code );
	for ( ptr in array ){
		var shape2 = shapes.item( array[ptr] );
		
		// check to see if a shape exists
		if( shape2 != null ) {
			var course2 = findCourse( array[ptr] );

			var shape_x = shape.box.getShape().x;
			var shape_y = shape.box.getShape().y;
			
			var shape2_x = shape2.box.getShape().x;
			var shape2_y = shape2.box.getShape().y;
		
			//reset the matrix back to normal			
			shape2.group.setTransform();
			
			shape2.box.setFill( getPoolColour(course2).colour );
		}
	}
};




highlightCourses = function( course, array, colour, width ) {
	// on mouse over highlight the selected course co-requistes		
	for (ptr in array ){
		var shape = shapes.item( array[ptr] );
		if( shape != null ) {
			shape.box.setStroke({color: colour, width: width});
		}
	}	
};