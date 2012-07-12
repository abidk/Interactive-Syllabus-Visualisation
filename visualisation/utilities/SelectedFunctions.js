dojo.provide("visualisation.utilities.SelectedFunctions");

dojo.require("dojox.collections.ArrayList");

/*
Check to see if the course is selected.
returns true or false
*/
isCourseSelected = function( course ) {
	var selected = visual.getSelected();
	if( selected.contains(course) ) {
		return true;
	} else {
		return false;
	}
};

moveUselessCourses = function ( list ) {
	var selected_array = list.toArray();
	for (x in selected_array){
		var course = selected_array[x];
		
		var returnedCourse = isItSelectedByAnotherCourse( course );
		if( returnedCourse == null ) {
			list.remove( course );
			list.insert( selected_array.length-1, course );
		}
	}
};

/*
adds or removes the course.
returns true or false
*/
addRemoveSelectedCourse = function( courseObject ) {
	var selected = visual.getSelected();
	
	if( !isCourseSelected( courseObject ) ) {
		selected.add( courseObject );
		visual.selectedViewObject.displayCredits();
		return true;
	} else {
		selected.remove( courseObject );
		visual.selectedViewObject.displayCredits();
		return false;
	}
};

addCourseToSelected = function( courseObject ) {
	if( courseObject != null ) {
		var selected = visual.getSelected();
		if( !isCourseSelected( courseObject ) ) {
			selected.add( courseObject );
		}
	}
	visual.selectedViewObject.displayCredits();
};

process = function() {
	var textToSplit = "A56u123t534h123o90r1: 1M2340oh2a3m2a3d3 123A123b14i23d 123K123h13a12l3i123l";
	return removeNumbers( textToSplit );
};

removeCourseFromSelected = function( courseObject ) {
	if( courseObject != null ) {
		var selected = visual.getSelected();
		selected.remove( courseObject );
	}
	visual.selectedViewObject.displayCredits();
};

/*
Not used
Checks to see if the course is selected by another course.
return select course.
*/
isItSelectedByAnotherCourse = function( selectedCourse ) {
	var selected = visual.getSelected();
	var selected_array = selected.toArray();
	for (x in selected_array){
		var course = selected_array[x];
		var pre_req = course.prereq_array.toArray();
		for ( req_ptr in pre_req ){
			if( pre_req[req_ptr] == selectedCourse.code ) {
				return course;
			}
		}

		var co_req = course.coreq_array.toArray();  	
		for ( co_ptr in co_req ){
			if( co_req[co_ptr] == selectedCourse.code ) {
				return course;
			}
		}
	}
	return null;
};

findSelectedCourse = function( courseCode ) { 
	var selected = visual.getSelected();
	var selected_array = selected.toArray();
	for (x in selected_array){
		var course = selected_array[x];	
		if( course.code == courseCode ) {
			return course;
		}
	}
	return null;
};
/*
Finds the number of courses selcted within a year 
*/
numberOfSelectedCourses = function( level ) {
	var count = 0;
	var selected = visual.getSelected();
	var selected_array = selected.toArray();
	for (x in selected_array){
		var course = selected_array[x];	
		if( course.level == level ) {
			count = count + 1;
		}
	}
	return count;
};

/*
useful  array- list of courses which have a pathway
*/
var useful = new dojox.collections.ArrayList();
orderSelectedCourses = function( order2 ) {
	useful.clear();
	var selected = visual.getSelected();
	var selectedCourses = selected.toArray();
	// sort the array by course code
	selectedCourses.sort( codeSort );
	
	// order course list
	for (x in selectedCourses){
		if ( !order2 ) {
			orderCourse1( selectedCourses[x] );
		} else {
			orderCourse2( selectedCourses[x] );
		}
	}
	
	var orderedList = new dojox.collections.ArrayList();
	
	var ar1 = useful.toArray();	
	for (x1 in ar1){
		if( !orderedList.contains( ar1[x1] ) ) {
			orderedList.add( ar1[x1] );
		}
	}
	var ar2 = selected.toArray();
	for (x2 in ar2){
		if( !orderedList.contains( ar2[x2] ) ) {
			orderedList.add( ar2[x2] );
		}
	}
	return orderedList;	
};

/*
Orders the courses into a pre-ordered traversal.
*/
orderCourse1 = function( course ) {
	var preReqArray = course.prereq_array.toArray();
	var coReqArray = course.coreq_array.toArray();
	var selected = visual.getSelected();	
	// get selected future courses only
	var coursesAvailable = findFutureCoursesFromArray( course, selected.toArray() ).toArray();
	if( coursesAvailable.length != 0 || preReqArray.length != 0 || coReqArray.length != 0 ) {
		// the courses appear neater if we do not add the mandatory requisites at this stage
		if( course.pool != "0" ) {
			for( b in coReqArray  ) {
				var testCourse = findCourse( coReqArray[b] );
				if( testCourse != null ) {
					if( isCourseSelected( testCourse ) ) {
						useful.add( testCourse );	
					}
				}
			}

			for( a in preReqArray  ) {
				var testCourse = findCourse( preReqArray[a] );
				if( testCourse != null ) {
					if( isCourseSelected( testCourse ) ) {
						useful.add( testCourse );	
					}
				}
			}
		}

		useful.add( course );

		// get future cources
		for( ptr in coursesAvailable ) {
			var testCourse = findCourse( coursesAvailable[ptr] );
			if( testCourse != null ) {
					orderCourse1( testCourse );
			}
		}
	}
};


orderCourse2 = function( course ) {
	var preReqArray = course.prereq_array.toArray();
	var coReqArray = course.coreq_array.toArray();
	var selected = visual.getSelected();	
	// get selected future courses only
	var coursesAvailable = findFutureCoursesFromArray( course, selected.toArray() ).toArray();
	if( coursesAvailable.length != 0 || preReqArray.length != 0 || coReqArray.length != 0 ) {
		// get future cources
		for( ptr in coursesAvailable ) {
			var testCourse = findCourse( coursesAvailable[ptr] );
			if( testCourse != null ) {
					orderCourse2( testCourse );
			}
		}
		
		// the courses appear neater if we do not add the mandatory requisites at this stage
		if( course.pool != "0" ) {
			for( a in preReqArray  ) {
				var testCourse = findCourse( preReqArray[a] );
				if( testCourse != null ) {
					if( isCourseSelected( testCourse ) ) {
						useful.add( testCourse );	
					}
				}
			}
			for( b in coReqArray  ) {
				var testCourse = findCourse( coReqArray[b] );
				if( testCourse != null ) {
					if( isCourseSelected( testCourse ) ) {
						useful.add( testCourse );	
					}
				}
			}
		}
		useful.add( course );
	}
};

/*

//OLD method for minimising distance
// MINIMUM DISTANCE FUNCTIONS
var coursePositions = new dojox.collections.ArrayList();
var courseDistances = new dojox.collections.ArrayList();

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

	setY: function( x ) {
		this.y = y;
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

minimiseDistance = function( mand_lines ) {
	coursePositions.clear();
	courseDistances.clear();

	var orderList = orderSelectedCourses( false );
	var list = orderList.toArray();
	createPositions( list );
	
	createDistances( mand_lines );
	alert( "Original Distance:" + countMaxDisctance() );	
	
	//store copy of new positions
	modifyDistances( );
		
	alert( "Average Mimimum Distance: " + countMaxDisctance() );
	return createCourseList( );
};
	
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

createDistances = function( mand_lines ) {
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

printCoursePosition = function( list ) {
	var position_itr = list.toArray();
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


modifyDistances = function( ) {
	var distance_itr = courseDistances.toArray();
	for( x in distance_itr ){
		var distance = distance_itr[x];

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
			
			if( value == 1 ) {//course is on right	
				course1.moveLeft();
				var newDis = calculateDistance( course1, course2 );
				if( newDis <= prev ) {
					distance.setDistance( newDis );
					var course1Inx = coursePositions.indexOf(course1);
					coursePositions.remove(course1);
					coursePositions.insert(course1Inx-1, course1);
				} else {
					course1.moveRight();
				}
			} else if( value == -1 ) {
				course1.moveRight();
				var newDis = calculateDistance( course1, course2 );
				if( newDis <= prev ) {
					distance.setDistance( newDis );
					var course1Inx = coursePositions.indexOf(course1);
					coursePositions.remove(course1);				
					coursePositions.insert(course1Inx+1, course1);
				} else {
					course1.moveLeft();
				}
			}
			
			i++;
		} while( distance.getDistance() < prev )
	
	}
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
*/
