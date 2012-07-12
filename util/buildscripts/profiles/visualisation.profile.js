dependencies ={
    layers:  [
        {
        name: "Project.js",
        dependencies: [
            "dojox.gfx",
			"dojox.gfx.move",
            "dojox.collections.Dictionary",
			"dojox.collections.ArrayList",
            "visualisation.Visual",
			"visualisation.Project",
			"visualisation.views.View",
			"visualisation.views.IntroductionView",
			"visualisation.views.SelectedView",
			"visualisation.views.SyllabusView",
			"visualisation.views.ThemesView",
			"visualisation.views.YearView",
			"visualisation.utilities.GraphicFunctions",
			"visualisation.utilities.KeyboardSupport",
			"visualisation.utilities.ViewFactory",
			"visualisation.utilities.CourseFunctions",
			"visualisation.utilities.Tree",
			"visualisation.utilities.ThemeFunctions",
			"visualisation.utilities.SelectedFunctions",
			"visualisation.utilities.minimiseDistance",
			"visualisation.utilities.PoolFunctions"
	
        ]
        }
    ],
    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "visualisation", "../visualisation" ]
    ]
};