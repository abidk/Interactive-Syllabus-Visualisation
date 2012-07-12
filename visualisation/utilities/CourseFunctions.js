dojo.provide("visualisation.utilities.CourseFunctions");

dojo.declare("Course", null, {
constructor: function( code, level, aim, title, website, credits, pool, prereq_text, coreq_text ){		
		if( aim == null ) {
			this.aim = "N/A";
		} else {
			this.aim = aim;
		}

		if( code == null ) {
			this.code = "N/A";
		} else {
			this.code = code;
		}
			
		if( title == null ) {
			//use the course code instead
			this.title = this.code;
		} else {
			this.title = title;
		}
		
		this.level = level;
		// hmmm, hard coded univsersity url
		var url = "http://www.cs.manchester.ac.uk/undergraduate/programmes/courseunits/syllabus.php?code=" + code;
		this.website = url;
		
		this.credits = credits;
		this.pool = pool;
		
		if( prereq_text == "none" || prereq_text == "no" || prereq_text == null ) {
			this.prereq_text = "None";
		} else {
			this.prereq_text = prereq_text;
		}
		this.prereq_array = this.splitRequistes( this.prereq_text );
				
		if( coreq_text == "none" || coreq_text == "no" || coreq_text == null ) {
			this.coreq_text = "None";
		} else {
			this.coreq_text = coreq_text;
		}		
		this.coreq_array = this.splitRequistes( this.coreq_text );
		
		this.semester = -1;
	},
	
	setSemester: function( semester ) {
		this.semester = semester;
	},
	/*
		Splits the input text according to the regex e.g. COMP10090
		return list of requisite codes. 
	*/
	splitRequistes: function( textToSplit ) {
		var array = new dojox.collections.ArrayList();
		if( textToSplit != null ) {
			var m = "";
			while ( m != null ) {
				//var re = new RegExp("[A-z]{4,}[0-9]{5,}");
				//var m = re.exec(course_pre_req);
				m = textToSplit.match(/[A-z]{4,}[0-9]{5,}/);
				if( m != null ) {  
					var result = "";
					for (i = 0; i < m.length; i++) {
						result = result + m[i];
					}
					array.add( result );
					var str = textToSplit;
					textToSplit = str.replace(/[A-z]{4,}[0-9]{5,}/,"");
				}
			}
		}
		return array;
	}
});

dojo.declare("Year", null, {
	constructor: function( year ){
		this.year = year;
		this.semester0 = new dojox.collections.ArrayList();
		this.semester1 = new dojox.collections.ArrayList();
		this.semester2 = new dojox.collections.ArrayList();
	},

	addToSemester: function( code, aim, title, website, credits, semester, pool, course_pre_req, prereq_array, course_co_req, coreq_array ){
		var c = new Course( code, this.year, aim, title, website, credits, pool, course_pre_req, prereq_array, course_co_req, coreq_array );
		
		// if it's pool zero add it to selected
		//if( pool == "0"  ) {
		//	var selected = visual.getSelected();
		//	selected.add( c );
		//}
		
		if( semester == "BOTH" ) {
			c.setSemester( 0 );
			this.semester0.add( c );
		} else if( semester == "SEM1" ) {
			c.setSemester( 1 );
			this.semester1.add( c );
		} else if( semester == "SEM2" ) {
			c.setSemester( 2 );
			this.semester2.add( c );
		} else {
			// if it did not add then just use the last character of the course to determine semester
			var semester = code.charAt(8);	
			if( semester == "0" ) {
				c.setSemester( 0 );
				this.semester0.add( c );
			} else if( semester == "1" ) {
				c.setSemester( 1 );
				this.semester1.add( c );
			} else if( semester == "2" ) {
				c.setSemester( 2 );
				this.semester2.add( c );
			} else {
				console.error( "Could not add: " + course);
			}
		}
	},
	
	sortCourses: function( sortMethod ) {
		this.semester0.sort( sortMethod );
		this.semester1.sort( sortMethod );
		this.semester2.sort( sortMethod );
	},
	
	findCourse: function( courseCode ) {
		var sem0 = this.semester0.toArray();
		for (s0_ptr in sem0){
			var course = sem0[s0_ptr];
			if( course.code == courseCode ) {
				return course;
			}
		}
		
		var sem1 = this.semester1.toArray();
		for (s1_ptr in sem1){
			var course = sem1[s1_ptr];
			if( course.code == courseCode ) {
				return course;
			}
		}
		
		var sem2 = this.semester2.toArray();
		for (s2_ptr in sem2){
			var course = sem2[s2_ptr];
			if( course.code == courseCode ) {
				return course;
			}
		}
		return null;
	},
	
	getSize: function( ) {
		var sem0 = this.semester0.toArray();
		var sem1 = this.semester1.toArray();
		var sem2 = this.semester2.toArray();
		return sem0.length + sem1.length + sem2.length;
	}
});

removeNumbers = function( textToSplit ) {
	var m = "";
	while ( m != null ) {
		m = textToSplit.match(/[0-9]+/);
		if( m != null ) {  
			var str = textToSplit;
			textToSplit = str.replace(/[0-9]+/,"");
		}
	}
	return textToSplit;
};
/*
Finds the course from the course list.
Input course code
return course or null
*/
findCourse = function( courseCode ) {
	var courses_itr = visual.getCourses().getKeyList();  
	for (x in courses_itr){
		var year = visual.getCourses().item( courses_itr[x] );
		
		var course = year.findCourse( courseCode );
		if( course != null ) {
			return course;
		}
	}
	return null;
};


findFutureCourses = function( selectedCourse ) {
	var coursesAvailable = new dojox.collections.ArrayList();

	var courses_itr = visual.getCourses().getKeyList();  
	for (x in courses_itr){
		var year = visual.getCourses().item( courses_itr[x] );

		var semester0 = year.semester0.toArray();
		coursesAvailable.addRange( findFutureCoursesFromArray( selectedCourse, semester0 ) );
		
		var semester1 = year.semester1.toArray();
		coursesAvailable.addRange( findFutureCoursesFromArray( selectedCourse, semester1 ) );
		
		var semester2 = year.semester2.toArray();
		coursesAvailable.addRange( findFutureCoursesFromArray( selectedCourse, semester2 ) );
	}

	return coursesAvailable;
};

// takes in the course and returns a list of pre-requistes which are in the fromArray.
findFutureCoursesFromArray = function( selectedCourse, fromArray ) {
	var coursesAvailable = new dojox.collections.ArrayList();
	for (ptr in fromArray){
		var course = fromArray[ptr];
		var reqArray = course.prereq_array.toArray();
		for (req_ptr in reqArray){
			var reqCourse = reqArray[req_ptr];
			if( reqCourse == selectedCourse.code ) {
				coursesAvailable.add( course.code );
			}
		}
		
		var coArray = course.coreq_array.toArray();
		for (co_ptr in coArray){
			var coCourse = coArray[co_ptr];
			if( coCourse == selectedCourse.code ) {
				coursesAvailable.add( course.code );
			}
		}
	}
	return coursesAvailable;
};

findFutureCourseObjects = function( selectedCourse, fromArray ) {
	var coursesAvailable = new dojox.collections.ArrayList();
	for (ptr in fromArray){
		var course = fromArray[ptr];
		var reqArray = course.prereq_array.toArray();
		for (req_ptr in reqArray){
			var reqCourse = reqArray[req_ptr];
			if( reqCourse == selectedCourse.code ) {
				coursesAvailable.add( course );
			}
		}
	}
	return coursesAvailable;
};

sortCourseList = function( sortSelected ) {
	var courses_itr = visual.getCourses().getKeyList();  
	for (x in courses_itr){
		var year = visual.getCourses().item( courses_itr[x] );
		if( sortSelected == "code" ) {
			year.sortCourses( codeSort );
		} else if( sortSelected == "pool" ) {
			year.sortCourses( poolSort );
		} else if( sortSelected == "requisites" ) {
			year.sortCourses( requisiteSort );
		}  else {
			year.sortCourses( codePoolSort );
		}
	}
};

/*
Sort according to the course pool
*/
poolSort = function( a, b ) {
	return a.pool - b.pool;
};

/*
Sort according to the course code
*/
codeSort = function( a, b ) {
	if( a.code < b.code) {
		return -1;
	} else if( a.code > b.code) {
		return 1;
	} else { 
		return 0;
	}
};

/*
Sort according to the course level
*/
levelSort = function( a, b ) {
	return a.level - b.level;
};

/*
Sort according to the course code and pool
*/
codePoolSort = function( a, b ) {
	if( a.pool == b.pool ) {
		return codeSort( a, b );
	} else {
		return poolSort( a, b );
	}
};

/*
Sort course by requiste importance
*/
requisiteSort = function( a, b ) {
	var preqA = a.prereq_array.toArray();
	var creqA = a.coreq_array.toArray();
	var preqB = b.prereq_array.toArray();	
	var creqB = b.coreq_array.toArray();

	return (preqB.length+creqB.length) - (preqA.length+creqA.length);
};
