dojo.provide("visualisation.utilities.Tree");

dojo.declare("Node", null, {
	constructor: function( course ){
		this.course = course;
		this.futureCourses = new dojox.collections.ArrayList();

		this.findOtherCourses( course )
	},
	
	findOtherCourses: function( course ) {
		var selectedCourses = visual.getSelected().toArray();
		var coursesAvailable = findFutureCoursesFromArray( course, selectedCourses ).toArray();
		// get future cources
		for( ptr in coursesAvailable ) {
			var testCourse = findCourse( coursesAvailable[ptr] );
			if( testCourse != null ) {
				var node = new Node( testCourse )
				this.futureCourses.add( node ); 
			}
		}		
	},
	
	getCourse: function( ) {
		return this.course;
	},	
	getSize: function( ) {
		var pre_req = this.course.prereq_array.toArray().length;
		var co_req = this.course.coreq_array.toArray().length; 
		
		var futureSize = 0;
		var array = this.futureCourses.toArray();
		for( ptr in array ) {
			var node = array[ptr];
			futureSize = futureSize + node.getSize();
		}
		
		return pre_req + co_req + futureSize;
	},
	
	getCourse: function() {
		return this.course;
	},
	
	getFutureCourses: function() {
		return this.futureCourses;
	},
	
	print: function( number ) {	
		number = number + 1;
		
		var array = this.futureCourses.toArray();
		for( ptr in array ) {
			var node = array[ptr];
			var str = "";
			var x = 0;
			while( x < number ) {
				str = str + "-";
				x = x + 1;
			}
			console.info( str + ">" + node.course.code );
			node.print( number );
		}
		
	}
});

dojo.declare("Tree", null, {
	constructor: function( array ){
		this.courses = new dojox.collections.ArrayList();
		
		for( ptr in array ) {
			var course = array[ptr];
			var node = new Node( course );
			this.courses.add( node );
		}
	},
	
	sortTree: function( sortMethod ) {
		if( sortMethod == null ) {
			this.courses.sort( sizeSort )
		} else {
			this.courses.sort( sortMethod );
		}
	},
	
	getList: function() {
		return this.courses;
	},
	
	getSize: function ( ) {
		return this.courses.toArray().length;
	},
	print: function() {
		var array = this.courses.toArray();
		for( ptr in array ) {
			var node = array[ptr];
			console.info( "=>" + node.course.code + " size:" + node.getSize() );
			node.print( 0 );
		}
	}, 
	
	clear: function() {
		this.courses.clear();
	}
	
});

test = function( ) {
	var selectedCourses = visual.getSelected().toArray();
	var tree = new Tree( selectedCourses );
	tree.print();
};

sizeSort = function( a, b ) {
	return b.getSize() - a.getSize();
};
