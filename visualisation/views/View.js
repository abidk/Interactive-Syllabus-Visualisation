dojo.provide("visualisation.views.View");

var selectedSubmenu = "";

dojo.declare("visualisation.views.View",null,{
	constructor: function( viewType ) {
		this.viewType = viewType;
		this.warnings = ""
	},
	
	displayInformation: function() {
		dojo.byId("information").innerHTML = "";
	},
	
	clearSubmenu: function() {
		dojo.byId("submenu").innerHTML = "";
	},
	
	displaySubmenu: function() {
		var course = "<input type=\"button\" id=\"selected\" value=\"Show Credits\" onclick=\"visual.selectedViewObject.displayCredits()\;return false\;\"></input>";
		var warning = "<input type=\"button\" id=\"warning\" value=\"Show Warnings\" onclick=\"visual.selectedViewObject.displayWarnings()\;return false\;\"></input>";
	
		//var course = "<font color=\"#660000\"><strong>Selected Courses</strong></font> (<a href=\"#\" onclick=\"visual.selectedViewObject.displayCredits()\;return false\;\">Show</a>)";
		//var warning = "<font color=\"#660000\"><strong>Warnings</strong></font>(<a href=\"#\" onclick=\"visual.selectedViewObject.displayWarnings()\;return false\;\">Show</a>)";
		dojo.byId("submenu").innerHTML = " <div style=\" border-bottom: medium solid #00CC66\; padding-bottom:5px\; margin-bottom:10px\; \"> " + course + " " + warning + "</div>";
		
		
		if( selectedSubmenu == "warnings" ) {
			this.displayWarnings();
		} else if ( selectedSubmenu == "credits" ) {
			this.displayCredits();
		}
var a = dojo.byId("coursedetail");
a.focus();

	},
	
	displayDetail: function() {
		dojo.byId("coursedetail").innerHTML = "";
	},
	
	displayCourseInformation: function( course ) {
		var info = "<strong>Course Title: </strong>" + course.title + "<br/>";
		info = info + "<strong>Credits: </strong>" + course.credits + "<br/>";
		info = info + "<strong>Pre-requisites: </strong>" + course.prereq_text + "<br/>";
		info = info + "<strong>Co-requisites: </strong>" + course.coreq_text + "<br/>";
		info = info + "<strong>Aims: </strong>" + course.aim + "<br/>";

		dojo.byId("coursedetail").innerHTML = info;


	},
	
	displayCredits: function() {
		//dojo.byId("warning").disabled=false;
		//dojo.byId("selected").disabled=true;
		
		selectedSubmenu = "credits";
		
		var str = "<table border=\"0\">";
		var selected = visual.getSelected();
		var selected_array = selected.toArray();
		
		var credits = visual.getCredits();
		var credits_itr = credits.getKeyList();
		credits_itr.sort();

		for (x in credits_itr){
			var year = credits_itr[x];
			str = str + "<th><strong>Year: " + year + "</strong></th>";
			str = str + "<th></th>";
		}

		str = str + "<tr>";	
		for (x in credits_itr){
			var year = credits_itr[x];
			var pool = credits.item( credits_itr[x] );
			var pool_itr = pool.getKeyList();
			pool_itr.sort();
			
			str = str + "<td style=\"padding:10px\; \" bgcolor=\"#00CC66\">";
			for (x in pool_itr){
				var credit = 0;
				var p = pool_itr[x];

				for (y in selected_array){
					var course = selected_array[y];
					if( course.level == year && course.pool == p ) {
						credit = credit + parseInt(course.credits);
					}
				}

				var text = "";
				if( p != 0 ) {				
					var min = pool.item( pool_itr[x] ).min;
					var max = pool.item( pool_itr[x] ).max;
				
					text = "Pool " + p + ": (Min:" + min + ", Max:" + max + ")";
					
					str = str + text + "<br/>"
				} else {
					str = str + "Mandatory: <br/>";
				}
			}
			str = str + "</td>";
			
			str = str + "<td style=\"padding:10px\;\" bgcolor=\"#00CC66\">";
			for (x in pool_itr){
				var credit = 0;
				var p = pool_itr[x];

				for (y in selected_array){
					var course = selected_array[y];
					if( course.level == year && course.pool == p ) {
						credit = credit + parseInt(course.credits);
					}
				}

				var min = pool.item( pool_itr[x] ).min;
				var max = pool.item( pool_itr[x] ).max;
					
				//highlight it red if it does not meet minimum and maximum limit
				if( credit > max || credit < min ) {
					str = str + "<span class=\"error\">" + credit + "</span><br/>";
				} else {
					str = str + "<strong>" + credit + "</strong><br/>";
				}

			}
			str = str + "</td>";
			
		}
		str = str + "</tr>";
		str = str + "<tr>";
		for (x in credits_itr){
			var year = credits_itr[x];
			var pool = credits.item( credits_itr[x] );
			var pool_itr = pool.getKeyList();
			pool_itr.sort();
			
			str = str + "<td style=\"padding:10px;\" bgcolor=\"#00CC66\">";
			str = str + "All Year:<br />";
			str = str + "Semester 1:<br />";
			str = str + "Semester 2:<br />";
			str = str + "<strong>Total Selected:</strong>";
			str = str + "</td>";
			
			str = str + "<td style=\"padding:10px;\" bgcolor=\"#00CC66\">";
			var semester0 = 0;
			var semester1 = 0;
			var semester2 = 0;
			for (y in pool_itr){
				var p = pool_itr[y];
				
				for (z in selected_array){
					var course = selected_array[z];
					if( course.level == year && course.pool == p ) {
						
						if( course.semester == 1 ) {
							semester1 = semester1 + parseInt(course.credits);
						} else if (course.semester == 2) {
							semester2 = semester2 + parseInt(course.credits);
						} else {
							semester0 = semester0 + parseInt(course.credits);
						}
						
						
					}
				}
			}
			str = str + semester0 + "<br />";
			str = str + semester1 + "<br />";
			str = str + semester2 + "<br />";
			
			var total = semester0+semester1+semester2;
			

			if( total != 120 ) {
				str = str + "<span class=\"error\">" + total + "</span><br/>";
			} else {
				str = str + "<strong>" + total + "</strong>";
			}
				
			str = str + "</td>";
		}
		str = str + "</tr>";
		str = str + "</table>";

		dojo.byId("coursedetail").innerHTML = str;
var a = dojo.byId("coursedetail");
a.focus();
	},
	
	clearWarnings: function( ) {
		this.warnings = "";
		dojo.byId("coursedetail").innerHTML = "";
	},
	
	displayWarnings: function( ) {
		//dojo.byId("warning").disabled=true;
		//dojo.byId("selected").disabled=false;
		
		selectedSubmenu = "warnings";
		this.clearWarnings();
		var selected = visual.getSelected();
		var selected_array = selected.toArray();
		for (x in selected_array){
			var course = selected_array[x];
			var array = course.prereq_array.toArray();
			for ( ptr in array ){		
				var preCourse = findCourse( array[ptr] );
				if( !isCourseSelected( preCourse ) ) { 
					this.warnings = this.warnings + course.code + " requires you pick " + array[ptr] + "<br/>";
				}
			}
		}

		
		if( this.warnings != "" ) {			
			dojo.byId("coursedetail").innerHTML = "Use these warnings as a guide. The courses may not exist for your programme or may be optional. <br/><br/>" + this.warnings;
		}
var a = dojo.byId("coursedetail");
a.focus();
	},
	
	addPoolInformation: function( startWidth ) {
		var surface = visual.getSurface();
		//loop around selected array checking
		var pool_list = poolcolours.getKeyList();
		pool_list.sort();

		var group = surface.createGroup();

		var x1 = startWidth + 10;

		var y1 = 50;
		for (ptr in pool_list){
			var pool = pool_list[ptr];
			var box = group.createRect({x:x1, y:y1, width:10, height:10});
			box.setFill( poolcolours.item( pool ).colour );
			box.setStroke({color: "black", width: 1});
			
			if( pool == "0") {
				pool = "Mandatory";
			} else {
				pool = "Pool " + pool;
			}
			var title = group.createText({x:x1+12, y:y1+8, text: pool, align: "right"});
			title.setFont({family: "Verdana", size: 10, weight: "bold"});
			title.setFill("#000000");

			y1 = y1 + 15;
		}

		y1 = y1 + 20;
	},
	
	setTabEnabled: function() {
		dojo.byId("1").innerHTML = "<a title=\"Introduction View\" href=\"#\" onclick=\"visual.selectView('Introduction')\;return false\;\">Introduction</a>";
		dojo.byId("2").innerHTML = "<a title=\"Syllabus Outline View\" href=\"#\" onclick=\"visual.selectView('Syllabus')\;return false\;\">Syllabus</a>";
		dojo.byId("3").innerHTML = "<a title=\"Year View\" href=\"#\" onclick=\"visual.selectView('Year')\;return false\;\">Year</a>";
		dojo.byId("4").innerHTML = "<a title=\"Themes View\" href=\"#\" onclick=\"visual.selectView('Themes')\;return false\;\">Themes</a>";
		dojo.byId("5").innerHTML = "<a title=\"Selected Courses View\" href=\"#\" onclick=\"visual.selectView('Selected')\;return false\;\">Selected</a>";
		dojo.byId("allbutton").disabled=false;
		dojo.byId("nonebutton").disabled=false;
		dojo.byId("mandatorybutton").disabled=false;
	},
	
	setTabDisabled: function() {
		dojo.byId("1").innerHTML = "Introduction";
		dojo.byId("1").className="disabled";
		dojo.byId("2").innerHTML = "Syllabus";
		dojo.byId("2").className="disabled";
		dojo.byId("3").innerHTML = "Year";
		dojo.byId("3").className="disabled";
		dojo.byId("4").innerHTML = "Themes";
		dojo.byId("4").className="disabled";
		dojo.byId("5").innerHTML = "Selected";
		dojo.byId("5").className="disabled";
		
		dojo.byId("allbutton").disabled=true;
		dojo.byId("nonebutton").disabled=true;
		dojo.byId("mandatorybutton").disabled=true;
	},
	
	setGfxCanvas: function() {
		dojo.byId("gfx").style.height = "0px";
	},
	
	drawGraphics: function() {
	}
});
