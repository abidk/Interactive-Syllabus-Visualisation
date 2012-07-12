dojo.provide("visualisation.views.SyllabusView");

dojo.require("visualisation.views.View");
dojo.require("dojox.collections.Dictionary");

var sortSelected = "pool";
var highlightSelected1 = "algorithm2";
dojo.declare("visualisation.views.SyllabusView",visualisation.views.View,{
	
	displayInformation: function() {
		// add sort combo here
		var str = "Sort courses by: ";
		str = str + "<select title=\"List containing different ways to sort the course list.\" id=\"sort\" onchange=\"visual.selectedViewObject.sortCourses()\;\">";
		if( sortSelected == "pool" ) {
			str = str + "<option value=\"pool\" selected=\"true\">Pool</option>";
			str = str + "<option value=\"code\">Code</option>";
			str = str + "<option value=\"requisites\">Requisite</option>";
		} else if( sortSelected == "code" ) {
			str = str + "<option value=\"pool\">Pool</option>";
			str = str + "<option value=\"code\" selected=\"true\">Code</option>";
			str = str + "<option value=\"requisites\">Requisite</option>";
		} else {
			str = str + "<option value=\"pool\">Pool</option>";
			str = str + "<option value=\"code\">Code</option>";
			str = str + "<option value=\"requisites\" selected=\"true\">Requisite</option>";
		}
		str = str + "</select>";

		str = str + " Highlight Type: ";
		str = str + "<select title=\"\" id=\"highlightType\" onchange=\"visual.selectedViewObject.highlightCourses()\;\">";
		if( highlightSelected1 == "algorithm1" ) {
			str = str + "<option value=\"algorithm1\" selected=\"true\">Stacked</option>";
			str = str + "<option value=\"algorithm2\">Not stacked</option>";
		} else {
			str = str + "<option value=\"algorithm1\">Stacked</option>";
			str = str + "<option value=\"algorithm2\" selected=\"true\">Not stacked</option>";
		}
		str = str + "</select>";
		
		dojo.byId("information").innerHTML = str;
	},

	displayDetail: function() {
		dojo.byId("coursedetail").innerHTML = "<strong>Course description and selections will appear here.</strong>";
	},

	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("2").innerHTML = this.viewType;
		dojo.byId("2").className="selected";
	},

	setGfxCanvas: function() {
		// get dynamic height
		var height = screen.height * 0.4;
		dojo.byId("gfx").style.height = height + "px";
	},
	
	sortCourses: function() {
		sortSelected = dojo.byId("sort").value;
		sortCourseList( sortSelected );
		this.drawGraphics();
	},
	
	highlightCourses: function() {
		highlightSelected1 = dojo.byId("highlightType").value;
	},
	
	drawGraphics: function() {
		var surface = visual.getSurface();
		surface.clear();
		shapes.clear();
		
		var surface_height = 0;
		var surface_width = 0;

		var courses_itr = visual.getCourses().getKeyList();
		courses_itr.sort();

		var global_x = 20;

		for (x in courses_itr){
			var global_y1 = 30;
			var global_y2 = 30;

			var text = surface.createText({x: global_x+100, y: 20, text: "Year " + courses_itr[x], align: "middle"});
			text.setFont({family: "Verdana", size: 12, weight: "bold"});
			text.setFill("#000000");
			
			var year = visual.getCourses().item( courses_itr[x] );
			var semester0 = year.semester0.toArray();
			var semester1 = year.semester1.toArray();
			var semester2 = year.semester2.toArray();

			// create 2 semester courses
			for (s0_ptr in semester0){
				var course = semester0[s0_ptr];
				this._createBox( course, {x: global_x, y: global_y1}, true ); 
				global_y1 = global_y1 + 45;
			}

			// make y1 and y2 the same
			global_y2 = global_y1;
				
			for (s1_ptr in semester1){
				var course = semester1[s1_ptr];
				this._createBox( course, {x: global_x, y: global_y1}, false ); 
				global_y1 = global_y1 + 45;
			}
			
			global_x = global_x + 100;

			for (s2_ptr in semester2){
				var course = semester2[s2_ptr];
				this._createBox( course, {x: global_x, y: global_y2}, false ); 
				global_y2 = global_y2 + 45;
			}

			global_x = global_x + 180;

			//calculate surface x and y
			if( global_y1 > surface_height ) {
				surface_height = global_y1;
			}
			if( global_y2 > surface_height ) {
				surface_height = global_y2;
			}
			
			surface_width = global_x;
		}
			
		visualisation.views.SyllabusView.superclass.addPoolInformation( surface_width-50 );
		surface.setDimensions(surface_width+150,surface_height);
	},
	
	_createBox: function( course, position, twosemesters ) {
		var surface = visual.getSurface();
		var group = surface.createGroup(); 
		var width = 90;
		var height = 40;

		if( twosemesters ) {
			width = (width * 2) + 10;
		} 

		var textBox = group.createGroup();
		// draw box
		var box = textBox.createRect({x:position.x, y:position.y, r:5, width:width, height:height});
		box.setFill( getPoolColour( course ).colour );

		if( isCourseSelected(course)  ) {	  
			box.setStroke({color: "black", width: 4});
		} else {
			box.setStroke({color: "black", width: 1});
		}
	
		// does not work in firefox
		//box.setFill({
		//	type:"linear",
		//	x1:0, y1:0, x2:0, y2:28,
		//	colors:[{offset:0.0, color:getPoolColour( course ).colour },
		//			{offset:1.0, color:getPoolColour( course ).shadow}]
		//});
			
		// draw shadow
		var shadow = textBox.createRect({x:position.x+3, y:position.y+3, r:5, width:width, height:height});
		shadow.setFill([0, 0, 0, 0.4]);
		shadow.moveToBack();
	
		// write course title
		var title = textBox.createText({x:(position.x + width/2), y: (position.y + 7 + (height-20)/2), text: course.code, align: "middle"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");
		

		var link = group.createGroup();
		var linkBox = link.createRect({x:(position.x + width/2)-11, y: (position.y + 4 +  (height)/2), r:2, width:20, height:10});
		linkBox.setFill( [0, 0, 0, 0.1] );
		//linkBox.setStroke({color: "black", width: 1});
		
		// write course title
		var linkText = link.createText({x:(position.x + width/2), y: (position.y + 13 + (height)/2), text: "link", align: "middle"});
		linkText.setFont({family: "Verdana", size: 10, weight: "normal"});
		linkText.setFill("#000000");

		// needed for tooltip
		link.getEventSource().setAttribute("title", "website");
		link.getEventSource().setAttribute("desc", "website");
		group.getEventSource().setAttribute("title", course.title);
		group.getEventSource().setAttribute("desc", course.title);
		
		var coursesAvailable = null;
		var pre_req = course.prereq_array.toArray();
		var co_req = course.coreq_array.toArray();  	

		var focusedLine = null;
		var clickedLine = null;
		
			
		group.connect( "onmouseover", function(){
			group.setTransform( dojox.gfx.matrix.scaleAt(1.2, { x:position.x+50, y: position.y+30} ) );	

			focusedLine = surface.createGroup();	
			focusedLine.moveToBack();		

			if( coursesAvailable == null ) {
				coursesAvailable = findFutureCourses( course ).toArray();
			}
			

			highlightBox( highlightSelected1, pre_req, course, focusedLine, "red");
			highlightBox( highlightSelected1, co_req, course, focusedLine, "blue");	
			highlightBox( highlightSelected1, coursesAvailable, course, focusedLine, "green");
			
			//call the superclass method
			visualisation.views.SyllabusView.superclass.displayCourseInformation( course );
		});
			
		group.connect( "onmouseout", function(){		
			group.setTransform( dojox.gfx.matrix.scaleAt(1.0, { x:position.x, y:position.y } ) );
					
			//dojo.fx.chain([
			//	dojox.fx.slideBy({ node: group.getNode(), top:50, left:50, duration:400 }),
			//	dojox.fx.slideBy({ node: group, top:25, left:-25, duration:400 })
			//]).play();

			
			unhighlightBox( pre_req, course );
			unhighlightBox( co_req, course );
			unhighlightBox( coursesAvailable, course );

			if( focusedLine != null ) {
				surface.remove(focusedLine);
			}
			visualisation.views.SyllabusView.superclass.displaySubmenu();
		});
		

		
		// ondblclick - goes to website
		link.connect( "onclick", function() {
			window.open(course.website, "_blank");
		});
		
		link.connect( "onmouseover", function(){
			linkText.setFill("blue");
		});
		
		link.connect( "onmouseout", function(){
			linkText.setFill("#000000");
		});
		
		textBox.connect("onclick", function( ) {
			var selected = addRemoveSelectedCourse( course ); 
			selectBox( course );	
		});
		
		var shape = new Shape( box, title, shadow, group, null);
		// add the shape to dictionary
		shapes.add( course.code, shape );
	}
});