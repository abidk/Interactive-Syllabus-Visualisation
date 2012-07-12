dojo.provide("visualisation.utilities.KeyboardSupport");

var item = -1;
var previousCourse = null;
var focusedLine = null;

selectCourse = function( course ) {
	if( course != null ) {
		var shape = shapes.item( course.code );
	}

	if( previousCourse != null ) {
		var shape2 = shapes.item( previousCourse.code );
		shape2.group.setTransform( dojox.gfx.matrix.scaleAt(1.0, { x:shape2.box.getShape().x, y: shape2.box.getShape().y} ) );
	}

	if( course != null ) {
		shape.group.setTransform( dojox.gfx.matrix.scaleAt(1.2, { x:shape.box.getShape().x+50, y: shape.box.getShape().y+30} ) );
		visual.selectedViewObject.displayCourseInformation( course );
	}
};

OutlineHighlight = function( course ) {
	var surface = visual.getSurface();

	if( previousCourse != null ) {
		var coursesAvailable1 = findFutureCourses( previousCourse ).toArray();
		var pre_req1 = previousCourse.prereq_array.toArray();
		var co_req1 = previousCourse.coreq_array.toArray();

		if( focusedLine != null ) {
			surface.remove(focusedLine);
		}

		unhighlightBox( coursesAvailable1, previousCourse );
		unhighlightBox( pre_req1, previousCourse );
		unhighlightBox( co_req1, previousCourse );
	}

	if( course != null ) {
		var shape = shapes.item( course.code );
		var coursesAvailable = findFutureCourses( course ).toArray();
		var pre_req = course.prereq_array.toArray();
		var co_req = course.coreq_array.toArray();

		focusedLine = surface.createGroup();	
		focusedLine.moveToBack();
	
		var highlight = dojo.byId("highlightType").value;
		highlightBox( highlight, pre_req, course, focusedLine, "red");
		highlightBox( highlight, co_req, course, focusedLine, "blue");
		highlightBox( highlight, coursesAvailable, course, focusedLine, "green");
	}
};

OutlineEnter = function( course ) {
	if( course != null ) {
		var selected = addRemoveSelectedCourse( course );
		selectBox( course );
	}
};


selectTheme = function( themeTitle ) {
	
	if( themeTitle != null ) {
	
		var theme = findTheme( themeTitle );
		var shape = shapes.item( theme.title );
		shape.box.setFill("black");

			alert(theme.course1);
			var course = findCourse( theme.course1 );
			if( course != null ) {
				removeCourseFromSelected( course );
			}
			alert(theme.course2);
			course = findCourse( theme.course2 );
			if( course != null ) {
				addRemoveSelectedCourse( course );
			}
			
			course = findCourse( theme.course3 );
			if( course != null ) {
				addRemoveSelectedCourse( course );
			}
			
			course = findCourse( theme.course4 );
			if( course != null ) {
				addRemoveSelectedCourse( course );
			}
	}
};


highlightTheme = function( themeTitle ) {
	if( themeTitle != null ) {
	
		var theme = findTheme( themeTitle );
		var shape = shapes.item( theme.title );
		shape.box.setFill("white");
			
	}
};

onKeyUpDown = function( courses_itr ) {
	var selectedViewName = visual.getViewName();
	if( selectedViewName == "Syllabus" ) {
		var course = findCourse( courses_itr );
		selectCourse( course );
		OutlineHighlight( course );
	} else if( selectedViewName == "Year" ) {
		var course = findCourse( courses_itr );
		selectCourse( course );
	} else if( selectedViewName == "Themes" ) {
		highlightTheme( courses_itr );
	}
	previousCourse = course;
};

onEnter = function( courses_itr ) {
	var selectedViewName = visual.getViewName();
	if( selectedViewName == "Syllabus" ) {
		var course = findCourse( previousCourse.code );
		OutlineEnter( course );
	} else if( selectedViewName == "Year" ) {
		var course = findCourse( previousCourse.code );
		OutlineEnter( course );
	} else if( selectedViewName == "Themes" ) {
		selectTheme( courses_itr );
	}
};

onKeyPress = function(e){
	var courses_itr = shapes.getKeyList();

	switch(e.keyCode){

	case 190://>
		if( item < courses_itr.length ) {
			item++;
			onKeyUpDown( courses_itr[item] );
		}
		dojo.stopEvent(e);
	break;

	case 188://<
		if( item > -1) {
			item--;
			onKeyUpDown( courses_itr[item] );
		}
		dojo.stopEvent(e);
	break;

	case 16://shift
		onEnter( courses_itr[item] );
		dojo.stopEvent(e);
	break;

	case 222://#
		var course = findCourse( courses_itr[item] );
		if( course != null ) {
			// ondblclick - goes to website
			window.open(course.website, "_blank");
		}
	break;

	}
};