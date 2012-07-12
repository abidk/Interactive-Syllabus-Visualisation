dojo.provide("visualisation.utilities.ThemeFunctions");

dojo.declare("Theme", null, {
constructor: function( title, description, course1, course2, course3, course4 ){
			this.title = title;
			this.description = description;
			this.course1 = course1;
			this.course2 = course2;
			this.course3 = course3;
			this.course4 = course4;
	}
});

findTheme = function( themeTitle ) {
	var themes_itr = visual.getThemes().toArray(); 
	
	for (x in themes_itr){
		var theme = themes_itr[x];
	
		if( themeTitle == theme.title ) {
			return theme;
		}
	}
	return null;
};