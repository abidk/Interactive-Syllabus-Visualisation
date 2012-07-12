dojo.provide("visualisation.views.YearView");

dojo.require("visualisation.views.View");

dojo.declare("visualisation.views.YearView",visualisation.views.View,{
	displayInformation: function() {
		dojo.byId("information").innerHTML = "";
	},

	displayDetail: function() {
		dojo.byId("coursedetail").innerHTML = "<strong>Course description and selections will appear here.</strong>";
	},
	
	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("3").innerHTML = this.viewType;
		dojo.byId("3").className="selected";
	},

	setTabDisabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("3").innerHTML = this.viewType;
		dojo.byId("3").className="selected";
	},
	
	setGfxCanvas: function() {
		// get dynamic height
		var height = screen.height * 0.45;
		dojo.byId("gfx").style.height = height + "px";
	},
	
	drawGraphics: function() {
		var surface = visual.getSurface();
	
		var group = surface.createGroup();
		var surface_height = 0;
		var surface_width = 0;
		
		var credits = visual.getCredits();
		var credits_itr = credits.getKeyList();
		credits_itr.sort();
		
		var y1=20;
		for (x in credits_itr){
			var x1=30;	
			var year = credits_itr[x];
			var title = group.createText({x:x1, y:y1, text: "Year: " + year, align: "right"});
			title.setFont({family: "Verdana", size: 12, weight: "bold"});
			title.setFill("#000000");
			
		
		
			var credit = credits.item( credits_itr[x] );
			var credit_itr = credit.getKeyList();
			credit_itr.sort();
			
			for (x in credit_itr){
				var y2 = y1;	
				var poolLevel = credit_itr[x];
				
				y2 = y2 + 15;
									
				// add the text
				if( poolLevel == "0") {
					title = group.createText({x:x1, y:y2, text: "Mandatory", align: "right"});
					title.setFont({family: "Verdana", size: 11, weight: "normal"});
					title.setFill("#000000");
				} else {
					var limit = "Min: " + credit.item( credit_itr[x]).min + ", Max: " + credit.item( credit_itr[x]).max;
					title = group.createText({x:x1, y:y2, text: "Pool " + poolLevel + " [" + limit + "]", align: "right"});
					title.setFont({family: "Verdana", size: 11, weight: "normal"});
					title.setFill("#000000");
				}

				y2 = y2 + 10;
				
				var year1 = visual.getCourses().item( year );
				var semester0 = year1.semester0.toArray();
				for (s0_ptr in semester0){
					var course = semester0[s0_ptr];
					if( course.pool == poolLevel ) {
						this._createBox( course, {x: x1, y: y2} ); 
						y2 = y2 + 28;
					}
				}

				var semester1 = year1.semester1.toArray();
				for (s1_ptr in semester1){
					var course = semester1[s1_ptr];
					if( course.pool == poolLevel ) {
						this._createBox( course, {x: x1, y: y2} ); 
						y2 = y2 + 28;
					}
				}

				var semester2 = year1.semester2.toArray();
				for (s2_ptr in semester2){
					var course = semester2[s2_ptr];
					if( course.pool == poolLevel ) {
						this._createBox( course, {x: x1, y: y2} ); 
						y2 = y2 + 28;
					}
				}
				
				x1 = x1 + 250;
				
				if( y2 > surface_height ) {
					surface_height = y2;
				}
			}
			y1 = surface_height + 70;
		}
		surface_width = x1;
		surface.setDimensions(surface_width,surface_height+20);
	},
	
	_createBox: function ( course, position ){
		var surface = visual.getSurface();
		var group = surface.createGroup(); 

		var width = 180;
		var height = 28;
		
		// draw box
		var box = group.createRect({x:position.x, y:position.y, width:width, height:height});
		box.setFill( getPoolColour(course).colour );

		if( isCourseSelected( course ) ) {	  
			box.setStroke({color: "black", width: 4});
			group.moveToFront();
		} else {
			box.setStroke({color: "black", width: 1.2});
			group.moveToBack();
		}

		var shadow;

		var titleText = course.title;
		if( titleText == null ) {
			titleText == course.code;
		}
		if( titleText.length > 27 ) {
			titleText = titleText.substring(0, 24) + "...";
		}
		
		// write course title
		var title = group.createText({x:(position.x + width/2), y: (position.y + 10 + (height - 10)/2), text: titleText, align: "middle"});
		title.setFont({family: "Verdana", size: 10, weight: "bold"});
		title.setFill("#000000");

		// needed for tooltip
		group.getEventSource().setAttribute("title", course.title);
		group.getEventSource().setAttribute("desc", course.title);
		

		group.connect( "onclick", function() {
			var selected = addRemoveSelectedCourse( course ); 
			selectBox( course );
		});
		
		group.connect( "onmouseover", function(){
			group.setTransform( dojox.gfx.matrix.scaleAt(1.3, { x:position.x+50, y: position.y+30} ) );
			//call the superclass method
			visualisation.views.YearView.superclass.displayCourseInformation( course );
			
		});
		

		group.connect( "onmouseout", function(){
			group.setTransform( dojox.gfx.matrix.scaleAt(1.0, { x:position.x, y:position.y } ) );

			if( isCourseSelected( course ) ) {	  
				group.moveToFront();
			} else {
				group.moveToBack();
			}
			visualisation.views.YearView.superclass.displaySubmenu();
		});


		var shape = new Shape( box, title, shadow, group, null);
		// add the shape to dictionary
		shapes.add( course.code, shape );
	}
});	

