/********************************************************************
 * The SolarSystem object itializes the canvas, assignin it to the  *
 * HTML element, and set the required mouse events.                 *
 * #parameters: none                                                *
 * #return: (SolarSystem) itself                                    *
 ********************************************************************/
function SolarSystem(){
	
	/********************************************************************
	 * Parameters for costumization.                                    *
	 ********************************************************************/ 
	var canvasWidth;
	var showFullSolarSystem = false;
	var showRealScale = false;
	var showOrbits = true;
	var showTime = true;
	
	/********************************************************************
	 * Variable containing this object, to be refered from nested       *
	 * functions.                                                       *
	 ********************************************************************/ 
	var thisSolarSystem;
	
	/********************************************************************
	 * Variable to determine if the canvas has been initialized.        *
	 ********************************************************************/ 
	var canvasInitialized = false;
	
	/********************************************************************
	 * Array containing the planets.                                    *
	 ********************************************************************/ 
	var planet = new Array(8);
	var planetImage = new Array(8)
	var sun;
	var sunImage;
	
	/********************************************************************
	 * Variables containing the canvas and its context.                 *
	 ********************************************************************/ 
	var canvas;
	var ctx;
	
	/********************************************************************
	 * Variable to control time.                                        *
	 ********************************************************************/ 
	var time = 0;
	
	/********************************************************************
	 * Function that initializes the canvas, assignin it to the HTML    *
	 * element,                                                         *
	 * #parameters:                                                     *
	 *   canv (canvas): canvas to use. If omited, the one named         *
	 *                  named "SSCanvas" will be used.                  *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.init = function(canv){
		var w = window;
		var d = document;
		var e = d.documentElement;
		var g = d.getElementsByTagName('body')[0];
		var x = w.innerWidth || e.clientWidth || g.clientWidth;
		var y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		if (x < y){
			document.getElementById("SSCanvas").height = 0.9 * x;
			document.getElementById("SSCanvas").width = 0.9 * x;
		}
		else{
			document.getElementById("SSCanvas").height = 0.9 * y;
			document.getElementById("SSCanvas").width = 0.9 * y;
		}
		if (!canvasInitialized){
			if (canv!= null)
				canvas = canv;
			else
				canvas = document.getElementById("SSCanvas");
			ctx = canvas.getContext("2d");
		}
		initPlanets([canvas.width, canvas.height]);
	};
	
	/********************************************************************
	 * Getter or setter to determine if the full Solar System is to be  *
	 * drawn.                                                           *
	 * #parameters:                                                     *
	 *   val (boolean): true if the full Solar System is to be drawn,   *
	 *                  false to draw only the Inner Solar System.      *
	 *                  Empty to leave the value unchanged.             *
	 * #return: (Boolean) if the full Solar System is to be drawn.      *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.showFullSolarSystem = function(val){
		if (arguments.length == 1)
			showFullSolarSystem = val;
		return showFullSolarSystem;
	};
	
	/********************************************************************
	 * Getter or setter to determine if the planet orbits are to be     *
	 * drawn.                                                           *
	 * #parameters:                                                     *
	 *   val (boolean): true if the orbits are to be drawn, false       *
	 *                  otherwise. Empty to leave the value unchanged.  *
	 * #return: (Boolean) if the orbits are to be drawn.                *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.showOrbits = function(val){
		if (arguments.length == 1)
			showOrbits = val;
		return showOrbits;
	};
	
	/********************************************************************
	 * Getter or setter to determine if the planets are to be scaled up *
	 * so they can be beter observed.                                   *
	 * #parameters:                                                     *
	 *   val (boolean): true to scale up the planets 2000 times and the *
	 *                  sun 20 times, false to show the real            *
	 *                  proportions, empty to leave the value unchanged *
	 * #return: (Boolean) if the planets are to be scaled up            *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.showRealScale = function(val){
		if (arguments.length == 1)
			showRealScale = val;
		return showRealScale;
	};
	
	/********************************************************************
	 * Getter or setter to determine if the time is to be written.      *
	 * #parameters:                                                     *
	 *   val (boolean): true to write the time, false otherwise, empty  *
	 *                  to leave the value unchanged                    *
	 * #return: (Boolean) if the time is to be written                  *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.showTime = function(val){
		if (arguments.length == 1)
			showTime = val;
		return showTime;
	};
	
	/********************************************************************
	 * Function that initializes the arrays with the planets and their  *
	 * images. Also does the same for the Sun.                          *
	 * #parameters:                                                     *
	 *   screen ([int, int]): the canvas dimensions.                    *
	 * #return: nothing                                                 *
	 * #scope: private                                                  *
	 ********************************************************************/	
	var initPlanets = function(screen){
		maxOrbitFull = 4498396441; //For all the solar system
		maxOrbitInner = 227943824; //For the inner solar system
			
		sunImage = new Image();
		sunImage.src = "/img/sun.png";
		planetImage[0] = new Image();
		planetImage[0].src = "/img/mercury.png";
		planetImage[1] = new Image();
		planetImage[1].src = "/img/venus.png";
		planetImage[2] = new Image();
		planetImage[2].src = "/img/earth.png";
		planetImage[3] = new Image();
		planetImage[3].src = "/img/mars.png";
		planetImage[4] = new Image();
		planetImage[4].src = "/img/jupiter.png";
		planetImage[5] = new Image();
		planetImage[5].src = "/img/saturn.png";
		planetImage[6] = new Image();
		planetImage[6].src = "/img/uranus.png";
		planetImage[7] = new Image();
		planetImage[7].src = "/img/neptune.png";
		
		sun = new Sun(screen, maxOrbitFull, maxOrbitInner, ctx, "Sun", 695500, sunImage);
		planet[0] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Mercury", 2439.7, 57909227, 0.20563593, 170503, planetImage[0], null);
		planet[1] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Venus", 6051.8, 108209475, 0.00677672, 126074, planetImage[1], null);
		planet[2] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Earth", 6371.0, 149598262, 0.01671123, 107218, planetImage[2], null);
		planet[3] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Mars", 3389.5, 227943824, 0.0933941, 86677, planetImage[3], null);
		planet[4] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Jupiter", 69911, 778340821, 0.04838624, 47002, planetImage[4], null);
		planet[5] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Saturn", 58232, 1426666422, 0.05386179, 34701, planetImage[5], null);
		planet[6] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Uranus", 25362, 2870658186, 0.04725744, 24477, planetImage[6], null);
		planet[7] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Neptune", 24622, 4498396441, 0.00859048, 19566, planetImage[7], null);

		moveTime();
	};
	
	/********************************************************************
	 * Function that clears the canvas and gets it ready to draw on it. *
	 * #parameters: none                                                *
	 * #return: nothing                                                 *
	 * #scope: private                                                  *
	 ********************************************************************/
	var clearCanvas = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
	
	/********************************************************************
	 * Function that advances time so the next frame can be drawn.      *
	 * #parameters: none                                                *
	 * #return: nothing                                                 *
	 * #scope: private                                                  *
	 ********************************************************************/
	var moveTime = function() {
		time = time + 0.001;
		clearCanvas();
		if (showFullSolarSystem)
			var max = 8;
		else
			var max = 4;
		for (var i = 0; i < max; i ++){
			if (showOrbits)
				planet[i].drawOrbit(showFullSolarSystem);
			planet[i].drawPlanet(time, showFullSolarSystem, showRealScale);
			sun.drawSun(showFullSolarSystem, showRealScale);
		}
		setInterval(moveTime, 400);
	};
	
	thisSolarSystem = this;
	return this;
};

/********************************************************************
 * The Planet object stores information about each planet, both to  *
 * draw the canvas and to display information on the tooltip.       *
 * #parameters:                                                     *
 *   canvasSize ([int, int]): the canvas dimensions (width, height) *
 *   maxOrbitFull (int): biggest orbit from the full Solar System   *
 *   maxOrbitInner (int): biggest orbits from the Inner Solar Sys   *
 *   ctx (Context): the Canvas context                              *
 *   name (String): the planet name                                 *
 *   radius (int): the planet radius, in Km                         *
 *   orbitRadius (int): semimajor axis of orbit, in Km              *
 *   excentricity (float): excentricity of the orbit ellipse        *
 *   velocity (int): orbit velocity of the planet, in km/h          *
 *   image (Image): image of the planet                             *
 * #return: nothing                                                 *
 ********************************************************************/
function Planet(canvasSize, maxOrbitFull, maxOrbitInner, ctx, name, radius, orbitRadius, excentricity, velocity, image){
	
	/********************************************************************
	 * Function that calculates the planet position along its orbit     *
	 * across time, calculates its size (scaled up if required) and     *
	 * draws it.                                                        *
	 * #parameters:                                                     *
	 *   t (int): current frame                                         *
	 *   showFullSolarSystem (Boolean): See variable in parent object   *
	 *   showFullRealScale (Boolean): See variable in parent object     *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.drawPlanet = function(t, showFullSolarSystem, showRealScale) {
		if (showFullSolarSystem)
			var maxOrbit = maxOrbitFull;
		else
			var maxOrbit = maxOrbitInner;
		var a = orbitRadius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		var x0 = canvasSize[0] / 2 + a * excentricity;
		var y0 = canvasSize[1] / 2;
		var time = t * velocity / 100000;
		x0 += a * excentricity;
		var r = a * (1 - excentricity *excentricity )/(1 + excentricity * Math.cos(time));
		var x = x0 + r * Math.cos(time);
		var y = y0 + r * Math.sin(time);
		var rad = radius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		if (!showRealScale)
			rad = 2000 * rad;
		if (rad < 2)
			rad = 2;
		ctx.drawImage(image, x - rad, y - rad, rad * 2, rad * 2);
	};
	
	/********************************************************************
	 * Function that draws the orbit of the planet.                     *
	 * #parameters: none                                                *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.drawOrbit = function(showFullSolarSystem) {
		if (showFullSolarSystem)
			var maxOrbit = maxOrbitFull;
		else
			var maxOrbit = maxOrbitInner;
		var a = orbitRadius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		var x0 = canvasSize[0] / 2 + a * excentricity;
		var y0 = canvasSize[1] / 2;
		
		x0 += a * excentricity;
		var r = a * (1 - excentricity * excentricity)/(1 + excentricity);
		var x = x0 + r
		var y = y0;
		ctx.beginPath();
		ctx.moveTo(x, y);
		var i = 0.01 * Math.PI;
		var twoPi = 2 * Math.PI;
		while (i < twoPi) {
			r = a * (1 - excentricity *excentricity )/(1 + excentricity * Math.cos(i));
			x = x0 + r * Math.cos(i);
			y = y0 + r * Math.sin(i);
			ctx.lineTo(x, y);
			i += 0.15;
		}
	    ctx.lineWidth = 1;
		ctx.strokeStyle = "gray";
		ctx.closePath();
		ctx.stroke();
	};
};

/********************************************************************
 * The Sun object stores information about each planet, both to     *
 * draw the canvas and to display information on the tooltip.       *
 * #parameters:                                                     *
 *   canvasSize ([int, int]): the canvas dimensions (width, height) *
 *   maxOrbitFull (int): biggest orbit from the full Solar System   *
 *   maxOrbitInner (int): biggest orbits from the Inner Solar Sys   *
 *   ctx (Context): the Canvas context                              *
 *   name (String): the planet name                                 *
 *   radius (int): the planet radius, in Km                         *
 *   image (Image): image of the planet                             *
 * #return: nothing                                                 *
 ********************************************************************/
function Sun(canvasSize, maxOrbitFull, maxOrbitInner, ctx, name, radius, image){
	
	/********************************************************************
	 * Function that calculates the sun size (scaled up if required)    *
	 * and draws it.                                                    *
	 * #parameters:                                                     *
	 *   showFullSolarSystem (Boolean): See variable in parent object   *
	 *   showFullRealScale (Boolean): See variable in parent object     *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.drawSun = function(showFullSolarSystem, showRealScale) {
		if (showFullSolarSystem)
			maxOrbit = maxOrbitFull;
		else
			maxOrbit = maxOrbitInner;
		x = canvasSize[0] / 2 ;
		y = canvasSize[1] / 2;
		rad = radius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		if (!showRealScale)
			rad = 20 * rad;
		if (rad < 3)
			rad = 3;
		ctx.drawImage(image, x - rad, y - rad, rad * 2, rad * 2);
	};
};



