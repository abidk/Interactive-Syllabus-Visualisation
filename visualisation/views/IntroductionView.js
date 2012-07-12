dojo.provide("visualisation.views.IntroductionView");

dojo.require("visualisation.views.View");

dojo.declare("visualisation.views.IntroductionView",visualisation.views.View,{
	displayInformation: function() {
		var str = "<div>";
		str = str + "There are 5 views available:<br />";
		str = str + "<strong>1. Introduction Tab</strong> leads you back to this screen.<br />";
		str = str + "<strong>2. Themes Tab</strong> displays the themes available.<br />";
		str = str + "<strong>3. Syllabus Tab</strong> displays the courses by year and semester.<br />";
		str = str + "<strong>4. Year Tab</strong> groups courses according to the year and pool.<br />";
		str = str + "<strong>5. Selected Tab</strong> displays your course selections.";
		str = str + "</div>";

		str = str + "<br/><br/>";
		
		str = str + "<div class=\"introtitle\">";
		str = str + "General Information";
		str = str + "</div>";
		str = str + "<div class=\"introtext\">";
		str = str + "Select your programme in the combo box at the top. ";
		str = str + "Once you have selected your programme you can select your courses in the theme, syllabus and year view.<br /><br />";
		str = str + "There are three buttons (all, none and mandatory) that allow you to quickly select specific courses.<br /><br />";
		str = str + "In theme, syllabus and year view: <br />";
		str = str + "1. When you focus on a course box the course details will appear at the bottom of the screen. (See figure 1)<br/>";
		str = str + "2. When you make your course selection a table will appear showing you the number of credits selected.<br />";
		str = str + "3. Clicking the buttons will show you warnings or credits selected.<br /><br />";
		str = str + "Figure 1:<br /><img alt=\"Image showing course details example.\" src=\"images/introduction_detail.gif\">";
		str = str + "</div>";
		
		str = str + "<br/><br/>";
		
		str = str + "<div class=\"introtitle\">";
		str = str + "Themes View Information";
		str = str + "</div>";
		str = str + "<div class=\"introtext\">";
		str = str + "Click the 'Select' to select the theme or 'Deselect' to deselect the theme.<br />";
		str = str + "<img alt=\"Image showing theme selection\" src=\"images/theme_selection.gif\"><br /><br />";
		str = str + "Any selected courses will have a red border.<br />";
		str = str + "<img alt=\"Image showing theme selected\" src=\"images/theme_selected.gif\">";
		str = str + "</div>";
		
		str = str + "<br/><br/>";
		
		str = str + "<div class=\"introtitle\">";
		str = str + "Syllabus View Information";
		str = str + "</div>";
		str = str + "<div class=\"introtext\">";
		str = str + "Clicking the course with the left mouse button will select the course, and clicking it once more will deselect the course.<br />";
		str = str + "<img alt=\"Image showing when you click the box a black border appears to indicate it's selected.\" src=\"images/syllabus_click.gif\"><br /><br />";
		str = str + "You can access the course website by clicking the \"link\" button.<br />";
		str = str + "<img alt=\"Image showing you can click the link button.\" src=\"images/syllabus_link.gif\"><br /><br />";
		str = str + "When in focus, pre-requisites courses will highlight in red, ";
		str = str + "co-requisite in blue and future courses in green. Also course details will appear at the bottom of the screen.<br />";
		str = str + "<img alt=\"Image showing you the colours of the requisites.\" src=\"images/syllabus_stack.gif\"><br /><br />";
			
		str = str + "There are 2 different course highlighting techniques:<br />";
		str = str + "<strong>1. Not stacked</strong> - The courses remain where they are. Requisites and future courses are highlighted.<br />";
		str = str + "<strong>2. Stacked</strong> - The requisite and future courses stack up next to the focused course.<br /><br />";
		str = str + "You can also sort the courses by pool, course code and requisites. The courses will be grouped according to year and semester.<br /><br />";		
		
		str = str + "<u>Keyboard Support</u><br />";
		str = str + "- You can navigate around the courses by pressing the '<' key to go up and '>' key to go down.<br />";
		str = str + "- To make a course selection you can press the 'shift' key.<br />";
		str = str + "- Pressing the '#' key loads up the course website.<br/>";
		str = str + "</div>";
		
		str = str + "<br/><br/>";
		
		str = str + "<div class=\"introtitle\">";
		str = str + "Year View Information";
		str = str + "</div>";
		str = str + "<div style=\"background: #00CC66\; padding: 10px\;\">";
		str = str + "You can select the courses by clicking on the course, a black border will appear to indicate it's selected.<br /><br />";
		str = str + "<u>Keyboard Support</u><br />";
		str = str + "- You can navigate around the courses by pressing the '<' key to go up and '>' key to go down.<br />";
		str = str + "- To make a course selection you can press the 'shift' key.<br />";
		str = str + "- Pressing the '#' key loads up the course website.<br/>";
		str = str + "</div>";
		
		str = str + "<br/><br/>";
	
		
		str = str + "<div class=\"introtitle\">";
		str = str + "Selected View Information";	
		str = str + "</div>";
		str = str + "<div class=\"introtext\">";				
		str = str + "This view will show selected course and it will link any requisites depending on the view selected. <br /><br />";	
		
		str = str + "There are 5 different views. Each view shows a different graphical representation of the selected courses. <br />";
		str = str + "<strong>1. Hierarchy Graph</strong> - This will present the selected courses by year hierarchy.<br />";
		str = str + "<strong>2. Text</strong> - Displays the selected courses in black, future available courses in green, pre-requisites in red and co-requisites in blue.<br />";
		str = str + "<strong>3. Bar Chart</strong> - Displays the selected courses as a bar chart.<br />";
		str = str + "<strong>4. Circle</strong> - Displays all the selected courses in a circle.<br />";
		str = str + "<strong>5. Hierarchy Circle</strong> - Displays the courses by year hierarchy.<br /><br />";
		
		str = str + "There are 4 different ordering algorithms:<br />";
		str = str + "<strong>1. Not Ordered</strong> - Any selected courses will not be ordered.<br />";
		str = str + "<strong>2. Ordered 1</strong> - Selected course requisites are added first, then current course and then recurse future courses.<br />";
		str = str + "<strong>3. Ordered 2</strong> - Recurse around future courses, then add the requisites and then the current course.<br />";
		str = str + "<strong>4. Minimum Distance</strong> - Minimises the distance of the requisite lines.<br /><br />";

		str = str + "There are 2 different styles of lines:<br />";
		str = str + "<strong>1. Line 1</strong><br />";
		str = str + "<strong>2. Line 2</strong><br />";

		str = str + "</div>";
				
		
		// add safari specific text, as the browser has compatibility problems.
		if ( dojo.isSafari ) {
			str = str + "<p><strong>Safari User - </strong> You may need to upgrade your Safari browser to the latest version in order for the application to work. If the application still does not work you can use a compatible browser such as <a href=\"http://www.firefox.com\">Firefox</a></p>";
		}

		dojo.byId("information").innerHTML = str;
	},

	displaySubmenu: function() {
		dojo.byId("submenu").innerHTML = process();
	},
	
	setTabEnabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("1").innerHTML = this.viewType;
		dojo.byId("1").className="selected";
	},

	setTabDisabled: function() {
		// call super class
		this.inherited(arguments);
		dojo.byId("1").innerHTML = this.viewType;
		dojo.byId("1").className="selected";
	}
});


/*
Detecting bowser
console.debug(navigator.userAgent);

dojo.isOpera
dojo.isKhtml
dojo.isSafari
dojo.isMoz
dojo.isMozilla
dojo.isFF
dojo.isIE
*/