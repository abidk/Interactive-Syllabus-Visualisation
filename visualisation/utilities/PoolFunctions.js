dojo.provide("visualisation.utilities.PoolFunctions");


/*
Stores the default colours for the pools
return pool colour
*/
getPoolColour = function( course ) {
	var pool = course.pool;
	if( !poolcolours.contains(pool) ) {
		var colour;
		// shadow needed to create a 2d look 
		var shadow;
		if( pool == "0" ) {
			colour = "#0099FF";
			shadow = "#0066CC";
		} else if( pool == "1" ) {
			colour = "#00FF66";
			shadow = "#33CC33";
		} else if( pool == "2" ) {
			colour = "#FF6600";
			shadow = "#FF3300";
		} else if( pool == "3" ) {
			colour = "#6666FF";
			shadow = "#663399";
		} else if( pool == "4" ) {
			colour = "#66FFFF";
			shadow = "#0099FF";
		} else if( pool == "5" ) {
			colour = "#666666";
			shadow = "#0099FF";
		} else if( pool == "6" ) {
			colour = "#FFFFCC";
			shadow = "#0099FF";
		} else if( pool == "7" ) {
			colour = "#FFCCCC";
			shadow = "#0099FF";
		} else if( pool == "8" ) {
			colour = "#FFCC99";
			shadow = "#0099FF";
		} else if( pool == "9" ) {
			colour = "#CCFF66";
			shadow = "#0099FF";
		} else {
			colour = getRandomColour();
		}
		poolcolours.add( pool, {colour: colour, shadow: shadow});
	}

	return poolcolours.item( pool );
};

getPoolNumberColour = function( pool ) {
	if( !poolcolours.contains(pool) ) {
		var colour;
		// shadow needed to create a 2d look 
		var shadow;
		if( pool == "0" ) {
			colour = "#0099FF";
			shadow = "#0066CC";
		} else if( pool == "1" ) {
			colour = "#00FF66";
			shadow = "#33CC33";
		} else if( pool == "2" ) {
			colour = "#FF6600";
			shadow = "#FF3300";
		} else if( pool == "3" ) {
			colour = "#6666FF";
			shadow = "#663399";
		} else if( pool == "4" ) {
			colour = "#66FFFF";
			shadow = "#0099FF";
		} else if( pool == "5" ) {
			colour = "#666666";
			shadow = "#0099FF";
		} else if( pool == "6" ) {
			colour = "#FFFFCC";
			shadow = "#0099FF";
		} else if( pool == "7" ) {
			colour = "#FFCCCC";
			shadow = "#0099FF";
		} else if( pool == "8" ) {
			colour = "#FFCC99";
			shadow = "#0099FF";
		} else if( pool == "9" ) {
			colour = "#CCFF66";
			shadow = "#0099FF";
		} else {
			colour = getRandomColour();
		}
		poolcolours.add( pool, {colour: colour, shadow: shadow});
	}

	return poolcolours.item( pool );
};