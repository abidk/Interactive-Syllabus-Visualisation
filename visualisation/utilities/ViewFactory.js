dojo.provide("visualisation.utilities.ViewFactory");

dojo.require("visualisation.views.IntroductionView");
dojo.require("visualisation.views.ThemeView");
dojo.require("visualisation.views.YearView");
dojo.require("visualisation.views.SelectedView");
dojo.require("visualisation.views.SyllabusView");
dojo.require("dojox.collections.Dictionary");

dojo.declare("visualisation.utilities.ViewFactory", null, {
	constructor: function( ) {
		this.views = new dojox.collections.Dictionary();
	},

	getInstance: function( viewName ) {
		// May aswell set some default views
		if( viewName == "Syllabus" ) {
			this.views.add( viewName, new visualisation.views.SyllabusView( viewName ) );
		} else if( viewName == "Year" ) {
			this.views.add( viewName, new visualisation.views.YearView( viewName ) );
		} else if( viewName == "Selected" ) {
			this.views.add( viewName, new visualisation.views.SelectedView( viewName ) );
		} else if( viewName == "Themes" ) {
			this.views.add( viewName, new visualisation.views.ThemeView( viewName ) );
		} else if( viewName == "Introduction" ) {
			this.views.add( viewName, new visualisation.views.IntroductionView( viewName ) );
		}

		return this.views.item( viewName );
	}
});
	