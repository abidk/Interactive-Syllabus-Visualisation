dojo.provide("visualisation.views.Selected4View");

dojo.require("dojox.collections.ArrayList");
dojo.require("visualisation.views.View");

var globalX = 50, globalY = 30;
var mand_lines = true;
var coursePositions = new dojox.collections.ArrayList();
var courseDistances = new dojox.collections.ArrayList();

dojo.declare("visualisation.views.Selected4View",visualisation.views.View,{
	
	displayInformation: function() {
		var str = "Show mandatory lines: ";
		if( mand_lines ) {
			str = str + "<input type=\"checkbox\" id=\"mand_lines\" onchange=\"visual.selectedViewObject.showMandLines()\;\" CHECKED />";
		} else {
			str = str + "<input type=\"checkbox\" id=\"mand_lines\" onchange=\"visual.selectedViewObject.showMandLines()\;\" />";
		}
		dojo.byId("information").innerHTML = str;
	},

	showMandLines: function() {
		if( dojo.byId("mand_lines").checked ) {
			mand_lines = true;
		} else {
			mand_lines = false;
		}
		
		this.drawGraphics();
	},
	
	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("8").innerHTML = this.viewType;
		dojo.byId("8").className="selected";
	},

	setGfxCanvas: function() {
		// get dynamic height
		var height = screen.height * 0.4;
		dojo.byId("gfx").style.height = height + "px";
	},

	drawGraphics: function() {
		//moveUselessCourses( orderList );
		//var list = visual.getSelected().toArray();
			
		this.minimiseDistance();
		//this.minimiseCrossing();
		this.method2();
	},

	minimiseDistance: function( ) {
		console.info("=========MIN DISTANCE==========");
		
		var orderList = orderSelectedCourses( true );
		var list = orderList.toArray();
		createPositions( list );
		createDistances( );
		
		var i = 1;
		var newCount = countMaxDisctance();
		var prevCount = 0;
		do {
			// add safeguard just incase
			if( i > 20 ) {
				break;
			}

			console.info("=====PASS " + (i++) + "=====");
			
			// create distances from the position list
			createDistances( );
			
			//store copy of new positions
			var copyPositions = modifyDistances( 2 );			
			prevCount = newCount;
			newCount = countMaxDisctance();

			console.info( "prev:" + prevCount + " new:" + newCount );
			// check to see if the distances has minimised
			if( prevCount > newCount ) {
				alert( "Previous distance:" + prevCount + "   New Distance:" + newCount );
				coursePositions.clear();
				// copy the smallest positions into position list
				coursePositions.addRange( copyPositions );
				updatePositions();
			}
		} while( prevCount > newCount )
	},
	
	minimiseCrossing: function( ) {
		console.info("=========MIN CROSSING==========");
		
		var orderList = orderSelectedCourses( true );
		var list = orderList.toArray();
		createPositions( list );
		createDistances( );
		
		var distance_itr = courseDistances.toArray();
		for( x in distance_itr ){
			
			var distance1 = distance_itr[x];
			var course1Position = distance1.course1;
			var course2Position = distance1.course2;

			for( y in distance_itr ){
				var distance2 = distance_itr[y];
				
				if( distance1 == distance2 ) {
					continue;
				}
				var course3Position = distance2.course1;
				var course4Position = distance2.course2;

				if( course1Position.course.level == course3Position.course.level ) {

					var value1 = course1Position.getCoursePosition( course3Position );
					var value2 = course2Position.getCoursePosition( course4Position );
					
					if( value1 == value2 ) {
						console.info("===>");
						distance1.print();
						distance2.print();
					}
				}
			}
		}

	},

	method2: function() {
		var surface = visual.getSurface();
		surface.clear();
		shapes.clear();
		
		var list = coursePositions.toArray();
	
		var surface_height = 0;
		var surface_width = 0;
		
		var courses_itr = visual.getCourses().getKeyList();
		courses_itr.sort( );

		var global_y = 30;
		
		for (x in courses_itr){
			var global_x = 10;
			var level = "" + courses_itr[x];

			for (x in list){
				var position = list[x];
				var course = position.course;
								
				if( course.level == level ) {
					//position.print();
					var shape = shapes.item( course.code );
					if( shape == null ) {				
						this._createBox( course, {x: global_x, y: global_y} );
						global_x = global_x + 100;
					}
				}
			}

			global_y = global_y + 150;

			//calculate surface x and y
			if( global_y > surface_height ) {
				surface_height = global_y;
			}
			
			if( global_x > surface_width ) {
				surface_width = global_x;
			}
			
		}
		visualisation.views.SelectedView.superclass.addPoolInformation( surface_width );
		
		// requisite lines
		this._createRequisitesLines();
		surface.setDimensions(surface_width+150, surface_height);

	},

	_createBox: function( course, position ) {
		var surface = visual.getSurface();
		var group = surface.createGroup(); 

		var width = 90;
		var height = 28;
		
		// draw box
		var box = group.createRect({x:position.x, y:position.y, r:10, width:width, height:height});
		box.setFill( getPoolColour( course ).colour );
		box.setStroke({color: "black", width: 1.2});

		var shadow;

		// write course title
		var title = group.createText({x:(position.x + width/2), y: (position.y + 10 + (height - 10)/2), text: course.code, align: "middle"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		// needed for tooltip
		group.getEventSource().setAttribute("title", course.title);
		group.getEventSource().setAttribute("desc", course.title);

		var shape = new Shape( box, title, shadow, group, null);
		// add the shape to dictionary
		shapes.add( course.code, shape );
	},
	
	_createRequisitesLines: function() {
		var surface = visual.getSurface();
		var line = surface.createGroup();
		line.moveToBack();

		var courses_itr = shapes.getKeyList();
		for( x in courses_itr ) {
			var course = findCourse( courses_itr[x] );
			
			if( course.pool != "0" || mand_lines == true ) {
				var shape = shapes.item( course.code );
				var pre_req = course.prereq_array.toArray();
				this._highlightReq(pre_req, course, shape, line );
				var co_req = course.coreq_array.toArray();
				this._highlightReq(co_req, course, shape, line );
			}
		}
	},
	
	_highlightReq: function( array, course, shape, line  ) {
		for ( ptr in array ){
			var shape2 = shapes.item( array[ptr] );
			if( shape2 != null ) {
				var course2 = findCourse( array[ptr] );
				line.add( drawNicerLine( course, course2, shape2.colour ) );
			} 
		}
	}
});

dojo.declare("Position", null, {
	constructor: function( course, x, y ){
		this.course = course;
		this.x = x;
		this.y = y;
	},
	
	getCourse: function( ) {
		return this.course;
	},
	
	moveLeft: function() {
		if( this.x > 0 ) {
			this.x--;
		}		
	},
	
	moveRight: function() {
		this.x++;
	},
	
	setX: function( x ) {
		this.x = x;
	},
	
	getCoursePosition: function( compareCourse ) {
		if( this.x < compareCourse.x ) {
			// left
			return -1;
		} if( this.x > compareCourse.x ) {
			//right
			return 1;
		} else {
			//equal
			return 0;
		}
	},
	
	print: function() {
		console.info( this.course.code + " "+ this.x + " "+ this.y);
	}
});

dojo.declare("Distance", null, {
	constructor: function( course1, course2, distance ){
		this.course1 = course1;
		this.course2 = course2;
		this.distance = distance;
	},
	
	getCourse1: function( ) {
		return this.course1;
	},
	
	getCourse2: function( ) {
		return this.course2;
	},
		
	getDistance: function( ) {
		return this.distance;
	},
	
	setDistance: function( distance ) {
		this.distance = distance;
	},
	print: function( ){
		console.info( this.course1.course.code + " "+ this.course2.course.code + " "+ this.distance);
	}
});

createCourseList = function( ) {
	var newOrderedList = new dojox.collections.ArrayList();

	var coursePositions_itr = coursePositions.toArray();	
	for( x in coursePositions_itr ) {
		var position = coursePositions_itr[x];
		var course = position.course;
		newOrderedList.add( course );
	}
	return newOrderedList;
},


/*
updates the positions of the courses
needed to calculate the crossovers.
*/
updatePositions = function( ) {	
	var coursePositions_itr = coursePositions.toArray();
	var newPositions = new dojox.collections.ArrayList();
	
	var local_y = 1;
	var courses_itr = visual.getCourses().getKeyList();
	for (x in courses_itr){
		var local_x = 1;
		var level = "" + courses_itr[x];
		for( x in coursePositions_itr ) {
			var position = coursePositions_itr[x];
			var course = position.course;
			
			if( course.level == level ) {
				var position = new Position( course, local_x, local_y );
				newPositions.add( position );
				local_x++;
			}
		}
		local_y++;			
	}
	
	// update the list
	coursePositions.clear();
	coursePositions.addRange( newPositions );
};

createPositions = function( list ) {
	coursePositions.clear();
	
	var local_y = 1;
	var courses_itr = visual.getCourses().getKeyList();
	for( x in courses_itr ){
		var local_x = 1;
		var level = "" + courses_itr[x];
		for( x in list ){
			var course = list[x];
	
			if( course.level == level ) {
				var position = new Position( course, local_x, local_y );
				coursePositions.add( position );
				local_x++;
			}
		}
		local_y++;			
	}
};

createDistances = function( ) {
	courseDistances.clear();
	var coursePositions_itr = coursePositions.toArray();	
	for( x in coursePositions_itr ) {
		var coursePosition = coursePositions_itr[x];
		var course = coursePosition.course;
		if( course.pool != "0" || mand_lines == true  ) {
			var pre_req = course.prereq_array.toArray();
			findDistance( course, pre_req );
			var co_req = course.coreq_array.toArray();
			findDistance( course, co_req );
		}
	}
};
	
findCoursePosition = function( courseCode ) {
	var position_itr = coursePositions.toArray();
	for( x in position_itr ){
		var position = position_itr[x];
		if( position.getCourse().code == courseCode ) {
			return position;
		}
	}
	return null;
};

printCoursePosition = function( ) {
	var position_itr = coursePositions.toArray();
	for( x in position_itr ){
		var position = position_itr[x];
		position.print();
	}
};

printCourseDistances = function( ) {
	var distance_itr = courseDistances.toArray();
	for( x in distance_itr ){
		var distance = distance_itr[x];
		distance.print();
	}
};


modifyDistances = function( threshold ) {
	var copyPositions = new dojox.collections.ArrayList();
	copyPositions.addRange( coursePositions );
	
	var distance_itr = courseDistances.toArray();
	for( x in distance_itr ){
		var distance = distance_itr[x];
		
		if( distance.getDistance() > threshold ) {
			//distance.print();
			var course1 = distance.getCourse1();
			var course2 = distance.getCourse2();

			var i = 0;
			var prev = 0;
			var value = course1.getCoursePosition( course2 );
			do {
				// add in a safe guard of 20
				if( i > 20 ) {
					break;
				}
				prev = distance.getDistance();
				
				if( value == 1 ) {//left		
					course1.moveLeft();
					var newDis = calculateDistance( course1, course2 );
					if( newDis <= prev ) {
						distance.setDistance( newDis );
						var course1Inx = copyPositions.indexOf(course1);
						copyPositions.remove(course1);
						copyPositions.insert(course1Inx-1, course1);
					} else {
						course1.moveRight();
					}
				} else if( value == -1 ) {
					course1.moveRight();
					var newDis = calculateDistance( course1, course2 );
					if( newDis <= prev ) {
						distance.setDistance( newDis );
						var course1Inx = copyPositions.indexOf(course1);
						copyPositions.remove(course1);				
						copyPositions.insert(course1Inx+1, course1);
					} else {
						course1.moveLeft();
					}
				}
				
				i++;
			} while( distance.getDistance() < prev )
			
			//distance.print();
		}
		
	}
	
	return copyPositions;
};

countMaxDisctance = function() {
	var count = 0;
	var distance_itr = courseDistances.toArray();
	for( x in distance_itr ){
		var distance = distance_itr[x];
		count = count + distance.getDistance();
		//distance.print();
	}
	//console.info("Total = "+ count);
	return count;
};
	


	
findDistance = function( course, array ) {
	// get course1 position
	var course1 = findCoursePosition( course.code );
	if( course1 != null ) {
		for ( ptr in array ){
			var course2 = findCoursePosition( array[ptr] );
		
			if( course2 != null ) {
				var distance = calculateDistance({x: course1.x, y: course1.y},{x: course2.x, y: course2.y});
				// add distance to position array
				var distanceObj = new Distance( course1, course2, distance );
				courseDistances.add( distanceObj );
				
			}
		}
	}
};
	
calculateDistance = function( position1, position2 ) {
	var x = Math.pow(position2.x - position1.x, 2);
	var y = Math.pow(position2.y - position1.y, 2)
	return Math.sqrt(x+y);
};

sortRequisite = function( a, b ) {
	var preqA = a.prereq_array.toArray();
	var creqA = a.coreq_array.toArray();
	var preqB = b.prereq_array.toArray();	
	var creqB = b.coreq_array.toArray();

	return (preqB.length+creqB.length) - (preqA.length+creqA.length);
};

calculateMaximumColumn = function( ) {
	var max = 0;
	
	var courses_itr = visual.getCourses().getKeyList();
	for (x in courses_itr){
		var level = courses_itr[x];
		var numberOfItems = numberOfSelectedCourses( level );
		
		if( numberOfItems > max ) {
			max = numberOfItems;
		}
	}
	return max;
};