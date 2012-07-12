dojo.require("visualisation.Visual");

dojo.require("dojox.collections.Dictionary");
dojo.require("visualisation.utilities.PoolFunctions");

var visual = null;

//TODO put these somewhere suitable
var shapes = new dojox.collections.Dictionary();
var poolcolours = new dojox.collections.Dictionary();

init = function(){
	visual = new visualisation.Visual();
	visual.reload();
};

dojo.addOnLoad(init);