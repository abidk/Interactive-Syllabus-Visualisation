dojo.provide("visualisation.utilities.minimiseDistance");

dojo.require("dojox.collections.Dictionary");
dojo.require("dojox.collections.ArrayList");

dojo.declare("visualisation.utilities.minimiseDistance",null,{
	constructor: function( array, mand_lines ) {
		this.positions = new dojox.collections.Dictionary();
		this.distances = new dojox.collections.ArrayList();

		this.prevCount = 0;
		this.newCount = 0;
		
		this.mand_lines = mand_lines;
		this.addCourses( array );

	},
	
	addCourses: function( array ) {
		this.positions.clear();
		
		var local_y = 1;
		var courses_itr = visual.getCourses().getKeyList();
		for( x in courses_itr ){
			var local_x = 1;
			// make it a string
			var level = "" + courses_itr[x];
					
			if( !this.positions.contains( level ) ) {
				var year = new dojox.collections.ArrayList();
				this.positions.add( level, year );
			}
				
			for( x in array ){
				var course = array[x];

				if( course.level == level ) {
					var year = this.positions.item( level );
					year.add( course );
					local_x++;
				}
			}
			local_y++;			
		}
		
		this.minimiseDistances();
		
		//alert( "Old Distance: " + this.prevCount + " New Distance:"  + this.newCount );
	},
	
	minimiseDistances: function( ) {
		var positions_array = this.positions.getKeyList();
		for( x in positions_array ) {
			var level = positions_array[x];
			//console.info( level );
			var year = this.positions.item( level );			
			var year_array = year.toArray();
			for( y in year_array ) {
				var course = year_array[y];
				if( course.pool != "0" || this.mand_lines == true  ) {
	
					var pre_req = course.prereq_array.toArray();
					if( pre_req.length > 0 ) {
						this.createDistance( course, pre_req );
					}
					
					var co_req = course.coreq_array.toArray();
					if( co_req.length > 0 ) {
						this.createDistance( course, co_req );
					}
				}
			
			}
		}
	},
	
	createDistance: function( course1, array ) {
		if( course1 != null ) {
			for ( ptr in array ){
				var course2 = findSelectedCourse( array[ptr] );
				if( course2 != null ) {
					this.shortenDistance( course1, course2 );
				}
			}
		}
	},
	
	shortenDistance: function( course1, course2 ) {
		//console.info( course1.code );
		//console.info( course2.code );
		
		//alert(course1.code + " " + course2.code );

		this.prevCount = this.prevCount + this.getCourseDistance( course1, course2 );
		
		var i = 0;
		do {
			// add in a safe guard of 20
			if( i > 20 ) {
				break;
			}
			
			var prevDistance = this.getCourseDistance( course1, course2 );
			
			var value = this.compareCoursePositions( course1, course2 );
			//console.info( value );
			if( value == 1 ) {
				this.moveCourseRight( course2 );
				var newDistance = this.getCourseDistance( course1, course2 );
				if( newDistance >= prevDistance ) {
					this.moveCourseLeft( course2 );
					break;
				}
			} else if ( value == -1 ) {
				this.moveCourseLeft( course2 );
				var newDistance = this.getCourseDistance( course1, course2 );
				if( newDistance >= prevDistance ) {
					this.moveCourseRight( course2 );
					break;
				}
			}
			i++;
		} while ( value != 0 )

		this.newCount = this.newCount + this.getCourseDistance( course1, course2 );
	},
	
	moveCourseLeft: function( course ) {
		var year = this.positions.item( course.level );
		var index = year.indexOf( course );
		
		if( index > 0 ) {
			year.remove( course );
			year.insert( index-1, course );
		}
	},
	
	moveCourseRight: function( course ) {
		var year = this.positions.item( course.level );
		var index = year.indexOf( course );
		year.remove( course );
		year.insert( index+1, course );
	},
	
	getCourseIndex: function( course ) {
		var year = this.positions.item( course.level );
		var index = year.indexOf( course );
		return index;
	},
	
	compareCoursePositions: function( course1, course2 ) {
		var year1 = this.positions.item( course1.level );
		var x1 = year1.indexOf( course1 );
		var y1 = course1.level;
		
		var year2 = this.positions.item( course2.level );
		var x2 = year2.indexOf( course2 );
		var y2 = course2.level;
		
		if( x1 < x2 ) {
			// left
			return -1;
		} else if( x1 > x2 ) {
			//right
			return 1;
		} else {
			//equal
			return 0;
		}
	},
	
	getCourseDistance: function( course1, course2 ) {
		var year1 = this.positions.item( course1.level );
		var x1 = year1.indexOf( course1 );
		var y1 = course1.level;
		
		var year2 = this.positions.item( course2.level );
		var x2 = year2.indexOf( course2 );
		var y2 = course2.level;

		var x = Math.pow( x2 - x1, 2);
		var y = Math.pow( y2 - y1, 2);
		return Math.sqrt( x + y );
	},
	
	getCourseList: function() {
		var newOrderedList = new dojox.collections.ArrayList();

		var positions_array = this.positions.getKeyList();
		for( x in positions_array ) {
			var level = positions_array[x];
			var year = this.positions.item( level );			
			var year_array = year.toArray();
			for( y in year_array ) {
				var course = year_array[y];
				newOrderedList.add( course );
			}
		}

		return newOrderedList;
	},
	
	
	print: function( ) {
		var positions_array = this.positions.getKeyList();
		for( x in positions_array ) {
			var level = positions_array[x];
			var year = this.positions.item( level );			
			var year_array = year.toArray();
			for( y in year_array ) {
				console.info( year_array[y].code );
			}
		}
	}
});

test2dArray = function() {
	var orderList = orderSelectedCourses( false );
	
	var test = new visualisation.utilities.minimiseDistance( orderList.toArray(), true );
	


	console.info("Done====="); 
	test.print();
	

	var course1 = findCourse( "COMP10092" );
	var course2 = findCourse( "COMP30900" );
	
	//console.info( test.getCourseDistance( course1, course2 ) );
	//console.info( "compare 1: " + test.compareCoursePositions( course1, course2 ) );
	
	//test.shortenDistance( course2, course1 );

	//console.info( "compare 2: " + test.compareCoursePositions( course1, course2 ) );
	
	//console.info( test.getCourseDistance( course1, course2 ) );
	//test.print();
};