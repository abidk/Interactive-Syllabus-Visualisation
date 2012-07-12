dojo.provide("visualisation.Visual");

dojo.require("dojox.fx"); 

dojo.require("dojox.gfx");
dojo.require("dojox.collections.Dictionary");
dojo.require("dojox.collections.ArrayList");

dojo.require("visualisation.views.View");

dojo.require("visualisation.utilities.ViewFactory");
dojo.require("visualisation.utilities.GraphicFunctions");
dojo.require("visualisation.utilities.CourseFunctions");
dojo.require("visualisation.utilities.KeyboardSupport");
dojo.require("visualisation.utilities.Tree");
dojo.require("visualisation.utilities.ThemeFunctions");
dojo.require("visualisation.utilities.SelectedFunctions");

dojo.declare("visualisation.Visual", null, {
	constructor: function() {
		this.surface = dojox.gfx.createSurface(dojo.byId("gfx"), 400, 400);
	
		this.vFactory = new visualisation.utilities.ViewFactory();
		// give it a default view
		this.selectedViewName = "Introduction";
		this.selectedProgramme = null;
		// give it a default object
		this.selectedViewObject = new visualisation.views.View();
		this.courses = new dojox.collections.Dictionary();
		this.themes = new dojox.collections.ArrayList();
		this.selected = new dojox.collections.ArrayList();
		this.credits = new dojox.collections.Dictionary();
				
		// add keyboard support
		dojo.connect(document, "onkeydown", onKeyPress);
	},
	
	selectView: function( view ) {
		this.selectedViewName = view;
		this.loadView();
	},

	setViewName: function( view ) {
		this.selectedViewName = view;
	},

	getViewName: function( ) {
		return this.selectedViewName;
	},
	
	getCourses: function( ) {
		return this.courses;
	},
	
	getThemes: function( ) {
		return this.themes;
	},
	
	getSelected: function( ) {
		return this.selected;
	},
	
	getCredits: function( ) {
		return this.credits;
	},
	
	getSurface: function( ) {
		return this.surface;
	},
	//getShapes: function( ) {
	//	return this.shapes;
	//},
	
	//getPoolColours: function( ) {
	//	return this.poolcolours;
	//},
	
	selectAll: function() {
		this.showLoading();
		var courses_itr = visual.getCourses().getKeyList();
		for (x in courses_itr){
			var year = visual.getCourses().item( courses_itr[x] );
			var semester0 = year.semester0.toArray();
			for (s0_ptr in semester0){
				var course = semester0[s0_ptr];
				addCourseToSelected(course);
			}
			var semester1 = year.semester1.toArray();
			for (s1_ptr in semester1){
				var course = semester1[s1_ptr];
				addCourseToSelected(course);
			}
			
			var semester2 = year.semester2.toArray();
			for (s2_ptr in semester2){
				var course = semester2[s2_ptr];
				addCourseToSelected(course);
			}
		}
		this.loadView();
		this.hideLoading();
	},
	selectMandatory: function() {
		this.showLoading();
		//this.selected.clear();
		var courses_itr = visual.getCourses().getKeyList();
		for (x in courses_itr){
			var year = visual.getCourses().item( courses_itr[x] );
			var semester0 = year.semester0.toArray();
			for (s0_ptr in semester0){
				var course = semester0[s0_ptr];
				if( course.pool == "0" ) {
					addCourseToSelected(course);
				}
			}
			var semester1 = year.semester1.toArray();
			for (s1_ptr in semester1){
				var course = semester1[s1_ptr];
				if( course.pool == "0" ) {
					addCourseToSelected(course);
				}
			}
			
			var semester2 = year.semester2.toArray();
			for (s2_ptr in semester2){
				var course = semester2[s2_ptr];
				if( course.pool == "0" ) {
					addCourseToSelected(course);
				}
			}
		}
		this.loadView();
		this.hideLoading();
	},
	
	selectNone: function() {
		this.showLoading();
		this.selected.clear();
		this.loadView();
		this.hideLoading();
	},
	
	loadView: function() {
		this.showLoading();

		if( this.selectedProgramme != "none" ) {
			this.surface.clear();
			shapes.clear();

			this.selectedViewObject = this.vFactory.getInstance( this.selectedViewName );
			this.selectedViewObject.clearWarnings();
			this.selectedViewObject.setTabEnabled();
			this.selectedViewObject.displayInformation();
			this.selectedViewObject.displayDetail();
			this.selectedViewObject.displaySubmenu();
			this.selectedViewObject.setGfxCanvas();
			this.selectedViewObject.drawGraphics();
		}
		this.hideLoading();
	},
	
	reload: function() {
		this.selectedProgramme = dojo.byId("degree").value;
		if( this.selectedProgramme != "none" ) {
			this.showLoading();
			this.grabThemeData();
			this.grabCourseData( this.selectedProgramme );
		} else {
			// view is none
			this.selectedViewObject = this.vFactory.getInstance( "Introduction" );
			this.selectedViewObject.clearWarnings();
			this.selectedViewObject.setTabDisabled();
			// display any view information
			this.selectedViewObject.displayInformation();
			
			// submenu
			this.selectedViewObject.displaySubmenu();
			this.selectedViewObject.displayDetail();
			
			this.selectedViewObject.setGfxCanvas();
			this.selectedViewObject.drawGraphics();
		}
	},
	
	grabCourseData: function( programme ) {
		dojo.xhrGet( {
			url: "scripts/coursedata.json",
			content: { programme: programme},
			handleAs: "json",
			timeout: 10000,
			load: function(responseObject, ioArgs) {	
				// clear
				visual.getCourses().clear();
				poolcolours.clear();
				visual.getSelected().clear();
				visual.getCredits().clear();
				
				// create the course list
				visual.createCourseList( responseObject );
				
				sortCourseList( "pool" );
				
				visual.loadView();

				visual.hideLoading();	

				return responseObject;
			},
			error: function( responseObject ) {
				console.error("Could not get the data, please try again later.");
				alert("Could not get the data, please try again later.");
			}
		});
	},
	
	createCourseList: function( courseList ) {
		for (x in courseList){
			var course = courseList[x]; 
			var course_code = course.CODE;
			var course_aim = course.AIMS;
			var course_title = course.TITLE;
			var course_website = course.WEBSITE;
			var course_credits = course.CREDITS;
			var course_semester = course.SEMESTER;
			var course_level = course.PROGRAMME_LEVEL;
			var course_co_req = course.COREQ1;
			var course_pre_req = course.PREREQ1;
			var course_pool = course.OPTION_POOL_NAME;
			var pool_maxcredits = course.MAX_CREDITS;
			var pool_mincredits = course.MIN_CREDITS;
			
			
			//TODO get rid if the pool array and place it in year
			if( !this.credits.contains(course_level) ) {
				var pool = new dojox.collections.Dictionary();
				this.credits.add(course_level, pool);
			}
			var pool = this.credits.item(course_level);
			if( !pool.contains(course_pool) ) {
				pool.add(course_pool, {max: pool_maxcredits, min:pool_mincredits});
			}		
			
		
			// var course_level = course_code.charAt(4);
			
			// do a check to see if it's a integer
			//if( parseInt(course_level) != course_level-0) {
			//  continue;
			//}
			//var semester = course_code.charAt(7);
			
			if( !this.courses.contains(course_level) ) {
				var year = new Year( course_level );
				year.addToSemester( course_code, course_aim, course_title, course_website, course_credits, course_semester, course_pool, course_pre_req, course_co_req);
				this.courses.add( course_level, year );
			} else {
				var newyear = this.courses.item(course_level);
				newyear.addToSemester( course_code, course_aim, course_title, course_website, course_credits, course_semester, course_pool, course_pre_req, course_co_req);
			}
		}
	},
	
	grabThemeData: function( ) {
		dojo.xhrGet( {
			url: "scripts/themedata.json",
			handleAs: "json",
			timeout: 10000,
			load: function(responseObject, ioArgs) {
				visual.createThemeList( responseObject )
				return responseObject;
			},
			error: function( responseObject ) {
				console.error("Could not get the theme data, please try again later.");
				alert("Could not get the theme data, please try again later.");
			}
		});
	},
	
	createThemeList: function( list ) {
		for (x in list){
			var theme = list[x]; 
			var title = theme.TITLE;
			var description = theme.DESCRIPTION;
			var course1 = theme.COURSE1;
			var course2 = theme.COURSE2;
			var course3 = theme.COURSE3;
			var course4 = theme.COURSE4;
			var theme = new Theme( title, description, course1, course2, course3, course4 );
			this.themes.add( theme );
		}
	},
	
	showLoading: function() {
		dojo.byId("loading").innerHTML="Loading";
		dojo.byId("loading").className="showloading";
	},
	
	hideLoading: function() {
		dojo.byId("loading").innerHTML="";
		dojo.byId("loading").className="hideloading";
	}
});

//-----------------------------------GET\POST METHODS---------------------------------------------//


//TODO
		//var d = new dojo.Deferred();
//d.addCallback(function() {
		//setTimeout( function(){
		//				alert("deferred");
		//			}, 10000);
		
//});
//d.callback();