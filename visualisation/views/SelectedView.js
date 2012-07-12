dojo.provide("visualisation.views.SelectedView");

dojo.require("visualisation.views.View");
dojo.require("visualisation.utilities.minimiseDistance");

var showMandLines = true;
var cricleDiameter = 50;
var view = "view1";
var sorted = "sorted5";
var lineType = "line2";

dojo.declare("visualisation.views.SelectedView",visualisation.views.View,{
	
	displayInformation: function() {
		var str = "View: <select title=\"\" id=\"viewType\" onchange=\"visual.selectedViewObject.selectView()\;\">"
		if( view == "view1" ) {
			str = str + "<option value=\"view1\" selected=\"true\">Hierarchy Graph</option>";
			str = str + "<option value=\"view2\">Text</option>";
			str = str + "<option value=\"view3\">Bar Chart</option>";
			str = str + "<option value=\"view4\">Circle</option>";
			str = str + "<option value=\"view5\">Hierarchy Circle</option>";
		} else if( view == "view2" ) {
			str = str + "<option value=\"view1\">Hierarchy Graph</option>";
			str = str + "<option value=\"view2\" selected=\"true\">Text</option>";
			str = str + "<option value=\"view3\">Bar Chart</option>";
			str = str + "<option value=\"view4\">Circle</option>";
			str = str + "<option value=\"view5\">Hierarchy Circle</option>";
		} else if( view == "view3" ) {
			str = str + "<option value=\"view1\">Hierarchy Graph</option>";
			str = str + "<option value=\"view2\">Text</option>";
			str = str + "<option value=\"view3\" selected=\"true\">Bar Chart</option>";
			str = str + "<option value=\"view4\">Circle</option>";
			str = str + "<option value=\"view5\">Hierarchy Circle</option>";
		} else if( view == "view4" ) {
			str = str + "<option value=\"view1\">Hierarchy Graph</option>";
			str = str + "<option value=\"view2\">Text</option>";
			str = str + "<option value=\"view3\">Bar Chart</option>";
			str = str + "<option value=\"view4\" selected=\"true\">Circle</option>";
			str = str + "<option value=\"view5\">Hierarchy Circle</option>";
		} else {
			str = str + "<option value=\"view1\">Hierarchy Graph</option>";
			str = str + "<option value=\"view2\">Text</option>";
			str = str + "<option value=\"view3\">Bar Chart</option>";
			str = str + "<option value=\"view4\">Circle</option>";
			str = str + "<option value=\"view5\" selected=\"true\">Hierarchy Circle</option>";
		}
		str = str + "</select>";
		
		
		str = str + " Order by: <select title=\"\" id=\"sorted\" onchange=\"visual.selectedViewObject.selectSorted()\;\">";
		if( sorted == "sorted1" ) {
			str = str + "<option value=\"sorted1\" selected=\"true\">Ordered (RCF)</option>";
			str = str + "<option value=\"sorted3\">Ordered (FRC)</option>";
			str = str + "<option value=\"sorted2\">Not Ordered</option>";
			str = str + "<option value=\"sorted4\">Mimimum Distance 1 Pass</option>";
			str = str + "<option value=\"sorted5\">Mimimum Distance 2 Pass</option>";
		} else if ( sorted == "sorted2" ) {
			str = str + "<option value=\"sorted1\">Ordered (RCF)</option>";
			str = str + "<option value=\"sorted3\">Ordered (FRC)</option>";
			str = str + "<option value=\"sorted2\" selected=\"true\">Not Ordered</option>";
			str = str + "<option value=\"sorted4\">Mimimum Distance 1 Pass</option>";
			str = str + "<option value=\"sorted5\">Mimimum Distance 2 Pass</option>";
		} else if ( sorted == "sorted3" ) {
			str = str + "<option value=\"sorted1\">Ordered (RCF)</option>";
			str = str + "<option value=\"sorted3\" selected=\"true\">Ordered (FRC)</option>";
			str = str + "<option value=\"sorted2\">Not Ordered</option>";
			str = str + "<option value=\"sorted4\">Mimimum Distance 1 Pass</option>";
			str = str + "<option value=\"sorted5\">Mimimum Distance 2 Pass</option>";
		} else if ( sorted == "sorted4" ) {
			str = str + "<option value=\"sorted1\">Ordered (RCF)</option>";
			str = str + "<option value=\"sorted3\">Ordered (FRC)</option>";
			str = str + "<option value=\"sorted2\">Not Ordered</option>";
			str = str + "<option value=\"sorted4\" selected=\"true\">Mimimum Distance 1 Pass</option>";
			str = str + "<option value=\"sorted5\">Mimimum Distance 2 Pass</option>";
		} else {
			str = str + "<option value=\"sorted1\">Ordered (RCF)</option>";
			str = str + "<option value=\"sorted3\">Ordered (FRC)</option>";
			str = str + "<option value=\"sorted2\">Not Ordered</option>";
			str = str + "<option value=\"sorted4\">Mimimum Distance 1 Pass</option>";
			str = str + "<option value=\"sorted5\" selected=\"true\">Mimimum Distance 2 Pass</option>";
		}
		str = str + "</select>";
	
		str = str + " Line Type: <select title=\"\" id=\"line\" onchange=\"visual.selectedViewObject.selectLine()\;\">";
		if( lineType == "line1" ) {
			str = str + "<option value=\"line1\" selected=\"true\">Line 1</option>";
			str = str + "<option value=\"line2\">Line 2</option>";
		} else {
			str = str + "<option value=\"line1\">Line 1</option>";
			str = str + "<option value=\"line2\" selected=\"true\">Line 2</option>";
		}
		str = str + "</select>";
		
		str = str + " Show mandatory lines: ";
		if( showMandLines ) {
			str = str + "<input type=\"checkbox\" id=\"showMandLines\" onchange=\"visual.selectedViewObject.showMandLines()\;\" CHECKED />";
		} else {
			str = str + "<input type=\"checkbox\" id=\"showMandLines\" onchange=\"visual.selectedViewObject.showMandLines()\;\" />";
		}
		
		dojo.byId("information").innerHTML = str;
	},

	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("5").innerHTML = this.viewType;
		dojo.byId("5").className="selected";
	},
	
	selectSorted: function( ) {
		sorted = dojo.byId("sorted").value;
		this.drawGraphics();
	},

	showMandLines: function() {
		if( dojo.byId("showMandLines").checked ) {
			showMandLines = true;
		} else {
			showMandLines = false;
		}
		
		this.drawGraphics();
	},
	
	selectView: function( ) {
		view = dojo.byId("viewType").value;
		this.drawGraphics();
	},
	
	selectLine: function( ) {
		lineType = dojo.byId("line").value;
		this.drawGraphics();
	},

	setGfxCanvas: function() {
		// get dynamic height
		var height = screen.height * 0.4;
		dojo.byId("gfx").style.height = height + "px";
	},

	drawGraphics: function() {
		var surface = visual.getSurface();
		surface.clear();
		shapes.clear();
		angleRecords.clear();
		
		var list = null;
		if( sorted == "sorted1") {
			list = orderSelectedCourses( false ).toArray();
		} else if ( sorted == "sorted3") {
			list = orderSelectedCourses( true ).toArray();
		} else if ( sorted == "sorted4") {
			var orderList = orderSelectedCourses( true );

			//pass 1
			var test = new visualisation.utilities.minimiseDistance( orderList.toArray(), showMandLines );
			list = test.getCourseList().toArray();
		} else if ( sorted == "sorted5") {
			var orderList = orderSelectedCourses( true );

			//pass 1
			var test = new visualisation.utilities.minimiseDistance( orderList.toArray(), showMandLines );
			list = test.getCourseList().toArray();

			//pass 2
			test = new visualisation.utilities.minimiseDistance( list, showMandLines );
			list = test.getCourseList().toArray();
		} else {
			list = visual.getSelected().toArray();	
		}


		//for( p in list ) {
		//  console.info( list[p].code );
		//}
		
		if( view == "view1" ) {
			dojo.byId("line").disabled = false;
			this.method1( list );
		} else if( view == "view2" ) {
			dojo.byId("line").disabled = false;
			this.method2( list );
		} else if( view == "view3" ) {
			dojo.byId("line").disabled = false;
			this.method3( );
		} else if( view == "view4" ) {
			dojo.byId("line").disabled = true;
			var currentLine = lineType;
			lineType = "line1";
			this.method4( list );
			lineType = currentLine;
		} else if( view == "view5" ) {
			dojo.byId("line").disabled = true;
			var currentLine = lineType;
			lineType = "line1";
			this.method5( list );
			lineType = currentLine;
		}
	},

	method1: function( list ) {
		var surface = visual.getSurface();
		
		var surface_height = 0;
		var surface_width = 0;
		
		var courses_itr = visual.getCourses().getKeyList();
		courses_itr.sort( );

		var global_y = 30;
		
		for (x in courses_itr){
			var global_x = 10;
			var level = "" + courses_itr[x];

			for (x in list){
				var course = list[x];
				
				if( course.level == level ) {
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

		//var coursesAvailable = findFutureCourses( course ).toArray();
		//var pre_req = course.prereq_array.toArray();
		//var co_req = course.coreq_array.toArray();  	

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
			if( course.pool != "0" || showMandLines == true ) {
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
				//shape.box.setStroke({color: shape2.colour, width: 4});

				if( lineType == "line1") {
					line.add( drawLine1( shape.box, shape2.box, shape2.colour ) );
				} else {
					line.add( drawNicerLine( course, course2, shape2.colour ) );
				}
			} 
		}
	},
	
	method2: function( list ) {
		var surface = visual.getSurface();
		
		globalX = 50;
		globalY = 30;
		
		var tree = new Tree( list );
		tree.sortTree();
		//tree.print();
		
		var courseNodes = tree.getList().toArray();
		this.printNodes( surface, 0, courseNodes, null );
		
		
		var y1 = 30;
		var x1 = 300;
		
		var group = surface.createGroup();

		var box = group.createRect({x:x1, y:y1, width:10, height:10});
		box.setFill( "black" );
		box.setStroke({color: "black", width: 1});
		var title = group.createText({x:x1+12, y:y1+8, text: "Selected", align: "right"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		y1 = y1 + 15;
		
		box = group.createRect({x:x1, y:y1, width:10, height:10});
		box.setFill( "green" );
		box.setStroke({color: "black", width: 1});
		title = group.createText({x:x1+12, y:y1+8, text: "Future course", align: "right"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		y1 = y1 + 15;
		
		box = group.createRect({x:x1, y:y1, width:10, height:10});
		box.setFill( "red" );
		box.setStroke({color: "black", width: 1});
		title = group.createText({x:x1+12, y:y1+8, text: "Pre-requisite", align: "right"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		y1 = y1 + 15;
		
		box = group.createRect({x:x1, y:y1, width:10, height:10});
		box.setFill( "blue" );
		box.setStroke({color: "black", width: 1});
		title = group.createText({x:x1+12, y:y1+8, text: "Co-requisite", align: "right"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		y1 = y1 + 15;

	
		//TODO get dynamic width
		surface.setDimensions(900, globalY);
	},
	
	printNodes: function( surface, number, courseNodes, colour ) {
		number = number + 1;
		var i = 0;
		for( ptr in courseNodes ) {
			i = i + 1;
			var node = courseNodes[ptr];
			var course = node.course;

			var title = surface.createText({x: globalX + (number*20), y: globalY, text: i + "-" + course.code, align: "middle"});
			title.setFont({family: "Verdana", size: 12, weight: "bold"});
			
			if( colour == null ) {
				title.setFill("#000000");
			} else {
				title.setFill( colour );
			}
			globalY = globalY + 15;

			var extraSpacing = 6;
			if( i > 9) {
				extraSpacing = 11;
			} else if( i > 99) {
				extraSpacing = 14;
			} else if( i > 999) {
				extraSpacing = 18;
			}
			
			var pre_req = course.prereq_array.toArray();
			for (ptr in pre_req){
				var course1 = findCourse( pre_req[ptr] );
			
				if( course1 != null ) {
					var title = surface.createText({x:globalX + (number*20) + extraSpacing, y: globalY, text: "-"+course1.code, align: "middle"});
					title.setFont({family: "Verdana", size: 12, weight: "bold"});
					title.setFill("red");
					globalY = globalY + 15;
				}
			}
	
			var co_req = course.coreq_array.toArray();  
			for (ptr in co_req){
				var course1 = findCourse( co_req[ptr] );
			
				if( course1 != null ) {
					
					var title = surface.createText({x:globalX + (number*20) + extraSpacing, y: globalY, text: "-"+course1.code, align: "middle"});
					title.setFont({family: "Verdana", size: 12, weight: "bold"});
					title.setFill("blue");
					globalY = globalY + 15;
				}
			}

			var futureNodes = node.futureCourses.toArray();
			this.printNodes( surface, number, futureNodes, "green" );
		}
	},
	
	method3: function() {
		var surface = visual.getSurface();			

		var surface_height = 0;
		var surface_width = 400;

		var selected_array = visual.getSelected().toArray();	
		var credits = visual.getCredits();
		var credits_itr = credits.getKeyList();
		credits_itr.sort();

		var x1 = 40;
		var y1 = 30;
		for (x in credits_itr){
			var year = credits_itr[x];
			
			// draw the grid
			var text = surface.createText({x: x1, y: y1, text: "Year " + year, align: "middle"});
			text.setFont({family: "Verdana", size: 16, weight: "bold"});
			text.setFill("#000000");
			
			var pool = credits.item( credits_itr[x] );
			var pool_itr = pool.getKeyList();
			pool_itr.sort();
			
			for (x in pool_itr){
				var credit = 0;
				var p = pool_itr[x];
					
				
				y1 = y1 + 30;
				if ( p != "0") {
					var text = surface.createText({x: x1, y: y1+10, text: "Pool " + p, align: "middle"});
					text.setFont({family: "Verdana", size: 12, weight: "bold"});
					text.setFill("#000000");
				} else {
					var text = surface.createText({x: x1, y: y1+10, text: "Mandatory", align: "middle"});
					text.setFont({family: "Verdana", size: 12, weight: "bold"});
					text.setFill("#000000");	
				}
				
				
				for( y in selected_array ) {
					var course = selected_array[y];
					if( course.level == year && course.pool == p ) {
						credit = credit + parseInt(course.credits);
					}
				}
				
				var amountSelected = credit;
				var min = parseInt( pool.item( pool_itr[x] ).min );
				var max = parseInt( pool.item( pool_itr[x] ).max );					
		
		
				// draw selected value
				var maxWidth = 300 * ( credit / max );	
				
				// set the width to the selected bar size
				if( surface_width < maxWidth ) {
					surface_width = maxWidth;
				}
					
				//Fix for i.e. bug 
				if( maxWidth == 0 ) {
					maxWidth = 1;
				}

				var box = surface.createRect({x:x1+50, y:y1-10, width:maxWidth, height:30});
				box.setFill( getPoolNumberColour( p ).colour );
				
				
				// draw maximum grid
				var maxBox = surface.createRect({x:x1+50, y:y1-10, width:300, height:30});
				maxBox.setStroke({color: "black", width: 2});
				maxBox.moveToback;
					
				// draw minimum selected value
				// just draw line
				var minWidth = 300 * ( min / max );	
				
				var line = surface.createLine({ x1: x1+50+minWidth, y1: y1-10, x2: x1+50+minWidth, y2: y1+20});
				line.setStroke({color: getPoolNumberColour( p ).shadow, width: 2});
				
					
				//if the minimum is zero dont bother writing text.
				if( min != 0 ) {
					// draw min Text
					var text = surface.createText({x: x1+50+minWidth, y: y1+6, text: "min", align: "middle"});
					text.setFont({family: "Verdana", size: 12, weight: "bold"});
					text.setFill("#000000");
				}
							
			}
			
			y1 = y1 + 90;
		}
		
		surface.setDimensions(surface_width, y1);
	},
	
	method4: function( list ) {
		var surface = visual.getSurface();
			
		var numberOfItems = list.length;
		var circleSize = numberOfItems * (cricleDiameter/2);
		var radius = circleSize/2;
		var angle = 0;
		var angle_diff = 360/numberOfItems;
		// shift it 50 pixels right
		var centre_x = radius;
		
		// shift it 50 pixels down
		var centre_y = radius;
		var degToRad = 0.0174532925;
	
		
		for (x in list){
			var course = list[x];		
			angle = angle + angle_diff;
			var x = centre_x + Math.sin( degToRad * angle ) * radius;
			var y = centre_y + Math.cos( degToRad * angle ) * radius; 
			
			createCircle( course, x, y, "red" );
		}
		// add 300 so we fit the circle in
		surface.setDimensions(circleSize+300, circleSize+300);
		
		this._createRequisitesLines();
	},
	
	method5: function( list ) {
		var surface = visual.getSurface();
		
		var maxNumberOfItems = list.length;
		var circleSize = maxNumberOfItems * (cricleDiameter/2);
		
		if( circleSize < 400 ) {
			circleSize = 500;
		}
		var maxRadius = circleSize/2;

		var centre_x = maxRadius;		
		var centre_y = maxRadius;
		
		var degToRad = 0.0174532925;
			
		var courses_itr = visual.getCourses().getKeyList();
		
		for (x in list) {
			var course = list[x];		

			var angle = keepTrackOfAngles( course );
	
			var radius = 0;
			if( course.level == 1 ) {
				radius = maxRadius;
			} else {
				radius = maxRadius / ( 2 * ( course.level - 1) );
			}
			
			var x = centre_x + Math.sin( degToRad * angle ) * radius;
			var y = centre_y + Math.cos( degToRad * angle ) * radius; 
			
			createCircle( course, x, y, "red" );
		}
			
		// add 300 so we fit the circle in
		surface.setDimensions(circleSize+300, circleSize+300);
		
		this._createRequisitesLines();
	}
});


// CIRCLE FUNCTIONS

createCircle = function( course, x, y, colour ) {
	var surface = visual.getSurface();
	var group = surface.createGroup(); 
	
	var circle = group.createRect({x:x, y:y, r:cricleDiameter/2, width:cricleDiameter, height:cricleDiameter});
	circle.setFill( getPoolColour( course ).colour );
	circle.setStroke({color: "black", width: 1});
	
	var shadow;
	
	var title = group.createText({x:x+(cricleDiameter/2), y: y+(cricleDiameter/2), text: course.code, align: "middle"});
	title.setFont({family: "Verdana", size: 7, weight: "bold"});
	title.setFill("#000000");
	
	var shape = new Shape( circle, title, shadow, group, null);
	// add the shape to dictionary
	shapes.add( course.code, shape );
};


var angleRecords = new dojox.collections.Dictionary();
keepTrackOfAngles = function( course ) {
	if( !angleRecords.contains(course.level) ) {
		var numberOfItems = numberOfSelectedCourses(course.level);
		var angle_diff = 360/numberOfItems;		
		
		var info = { add: angle_diff, current:0}
		angleRecords.add( course.level, info );
	} else {
		var info = angleRecords.item(course.level);
		info.current = info.current + info.add;
	}
	var info = angleRecords.item(course.level);
	return info.current;
};


