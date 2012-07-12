dojo.provide("visualisation.views.ThemeView");

dojo.require("visualisation.views.View");

dojo.declare("visualisation.views.ThemeView",visualisation.views.View,{
	displayInformation: function() {
		var str = "Click <a href=\"http://www.cs.manchester.ac.uk/undergraduate/programmes/courseunits/themes-extended.php\" target=\"_blank\">here</a> to see the updated list.";
		dojo.byId("information").innerHTML = str;
	},

	displayDetail: function() {
		dojo.byId("coursedetail").innerHTML = "<strong>Course description and selections will appear here.</strong>";
	},
	
	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("4").innerHTML = this.viewType;
		dojo.byId("4").className="selected";
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

		var surface_height = 0;
		var surface_width = 0;

		var themes_itr = visual.getThemes().toArray();
		
		var x1 = 30;
		var y1 = 30;
		for (x in themes_itr){
			var theme = themes_itr[x];
			this._createBox( theme, {x: x1, y: y1} ); 
			y1 = y1	+ 140;
		}
	
		surface.setDimensions(900,y1);
	},

	_createRightArrow: function( surface, position) { 
		var hour_shadow = surface.createShape({type: "path"});
		hour_shadow.moveTo(position.x, position.y);
		
		hour_shadow.lineTo(position.x, position.y);
		hour_shadow.lineTo(position.x, position.y+10);
		hour_shadow.lineTo(position.x+10, position.y+5);
		
		hour_shadow.setFill("black");
		this._drawLine(surface, {x:position.x, y:position.y+5});
	},
	

	
	_drawLine: function( surface, position ){
		var line = surface.createLine({ x1: position.x, y1: position.y, x2: position.x-50, y2: position.y });
		line.setStroke({color: "black", width: 2});
		return line;
	},
	
	_createBox: function( theme, position ) {
		var surface = visual.getSurface();
		var group = surface.createGroup(); 

		var positionNew = { x:position.x, y:position.y};
				
		var shadow;
		
		var title = group.createText({x:positionNew.x, y:positionNew.y, text: theme.title, align: "left"});
		title.setFont({family: "Verdana", size: 18, weight: "normal"});
		title.setFill("#000000");
		
		positionNew.y = positionNew.y + 10;
		
		var course1 = theme.course1;
		var course2 = theme.course2;			
		var course3 = theme.course3;
		var course4 = theme.course4;

		var link2 = group.createGroup();
		var linkBox = link2.createRect({x:position.x, y: position.y+10, width:60, height:15});
		linkBox.setFill( [0, 0, 0, 0.1] );
		linkBox.setStroke({color: "black", width: 1});
		
		var select = link2.createText({x:positionNew.x+10, y:positionNew.y+11, text: "Select", align: "left"});
		select.setFont({family: "Verdana", size: 11, weight: "bold"});
		select.setFill("black");
		
		link2.connect( "onclick", function(){		
			var course = findCourse( course1 );
			if( course != null ) {
				addCourseToSelected( course );
				//"#0066CC"
				course1Box.setStroke({color: "red", width: 4});
			}
			
			course = findCourse( course2 );
			if( course != null ) {
				addCourseToSelected( course );
				course2Box.setStroke({color: "red", width: 4});
			}
			
			course = findCourse( course3 );
			if( course != null ) {
				addCourseToSelected( course );
				course3Box.setStroke({color: "red", width: 4});
			}

			course = findCourse( course4 );
			if( course != null ) {
				addCourseToSelected( course );
				course4Box.setStroke({color: "red", width: 4});
			}
			
			
			select.setFill("blue");
			unselect.setFill("black");
		});
		
		var link1 = group.createGroup();
		var linkBox = link1.createRect({x:position.x+70, y: position.y+10, width:60, height:15});
		linkBox.setFill( [0, 0, 0, 0.1] );
		linkBox.setStroke({color: "black", width: 1});

		var unselect = link1.createText({x:positionNew.x+71, y:positionNew.y+11, text: "Deselect", align: "start"});
		unselect.setFont({family: "Verdana", size: 11, weight: "bold"});
		unselect.setFill("black");
		
		link1.connect( "onclick", function(){	
			var course = findCourse( course1 );
			if( course != null ) {
				removeCourseFromSelected( course );
				course1Box.setStroke({color: "#003366", width: 4});
			}
			
			course = findCourse( course2 );
			if( course != null ) {
				removeCourseFromSelected( course );
				course2Box.setStroke({color: "#003366", width: 4});
			}
			
			course = findCourse( course3 );
			if( course != null ) {
				removeCourseFromSelected( course );
				course3Box.setStroke({color: "#003366", width: 4});
			}
			
			course = findCourse( course4 );
			if( course != null ) {
				removeCourseFromSelected( course );
				course4Box.setStroke({color: "#003366", width: 4});
			}
		
			select.setFill("black");
			unselect.setFill("blue");
		});
		
		positionNew.y = positionNew.y + 35;

		var group1 = surface.createGroup();
		var course1Box = this._drawCourse( course1, positionNew, group1, false );
		group1.connect( "onmouseover", function(){
			var course = findCourse( course1 );
			if( course != null ) {
				visualisation.views.ThemeView.superclass.displayCourseInformation( course );
			}
		});
		
		var group2 = surface.createGroup();
		var course2Box = this._drawCourse( course2, positionNew, group2, true );
		group2.connect( "onmouseover", function(){
			var course = findCourse( course2 );
			if( course != null ) {
				visualisation.views.ThemeView.superclass.displayCourseInformation( course );
			}
		});
		
		var group3 = surface.createGroup();
		var course3Box = this._drawCourse( course3, positionNew, group3, true );
		group3.connect( "onmouseover", function(){
			var course = findCourse( course3 );
			if( course != null ) {
				visualisation.views.ThemeView.superclass.displayCourseInformation( course );
			}
		});
		
		var group4 = surface.createGroup();
		var course4Box = this._drawCourse( course4, positionNew, group4, true );
		group4.connect( "onmouseover", function(){
			var course = findCourse( course4 );
			if( course != null ) {
				visualisation.views.ThemeView.superclass.displayCourseInformation( course );
			}
		});

		// draw box
		var box = group.createRect({x:position.x, y:position.y+25, width:positionNew.x, height:70});
		box.setFill([0, 0, 0, 0.1]);
		box.setStroke({color: "#003366", width: 2});
		box.moveToBack();


				
		var shape = new Shape( box, title, shadow, group, null);

		// add the shape to dictionary
		shapes.add( theme.title, shape );
	},
	
	_drawCourse: function( course4, position, group, drawLine ) {
		var width = 90;
		var height = 30;

		var title;
		var box = null;
		
		if( course4 != "" ) {
			position.x = position.x + 40;
			var course = findCourse( course4 );

			if( drawLine ) {
				//this._createUpArrow(group, {x:position.x-10, y:position.y});
				this._createRightArrow(group, {x:position.x-10, y:position.y+10});
			}

			if( course != null ) {
				box = group.createRect({x:position.x, y:position.y, width:width, height:height});
				box.setFill( "#003366" );
				
				if( isCourseSelected(course)  ) {	 
					//"#0066CC"
					box.setStroke({color: "red", width: 4});
				} else {
					box.setStroke({color: "#003366", width: 4});
				}
		
				title = group.createText({x:(position.x + width/2), y: (position.y + 10 + (height - 10)/2), text: course.code, align: "middle"});
				title.setFont({family: "Verdana", size: 10, weight: "bold"});
				title.setFill("white");				
			} else {
				box = group.createRect({x:position.x, y:position.y, width:width, height:height});
				box.setFill( "#CCCCCC" );
				
	
				title = group.createText({x:(position.x + width/2), y: (position.y + 10 + (height - 10)/2), text: course4, align: "middle"});
				title.setFont({family: "Verdana", size: 10, weight: "bold"});
				title.setFill("white");	
			}
			

			position.x = position.x + 110;

		}
		return box;

	}
});