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
	var showToolTip = -2;
	
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
	 * Function that sets the showToolTip variable with an integer so   *
	 * a tooltip will or not be drawn on the next frame                 *
	 * #parameters:                                                     *
	 *   planet (int/String): planet index (0-7, 0 being Mercury, the   *
	 *                        closer to the Sun, -1 for the sun) or the *
	 *                        planet name (case indiferent)             *
	 * #return: nothing                                                 *
	 * #scope: public                                                  *
	 ********************************************************************/
	this.showToolTip = function(planetid){
		var id;
		if (isNaN(parseFloat(planetid))){
			var str = planetid.toUpperCase();
			switch(str){
				case "SUN":
					showToolTip = -1;
					break;
				case "MERCURY":
					showToolTip = 0;
					break;
				case "VENUS":
					showToolTip = 1;
					break;
				case "EARTH":
					showToolTip = 2;
					break;
				case "MARS":
					showToolTip = 3;
					break;
				case "JUPITER":
					showToolTip = 4;
					break;
				case "SATURN":
					showToolTip = 5;
					break;
				case "URANUS":
					showToolTip = 6;
					break;
				case "NEPTUNE":
					showToolTip = 7;
					break;
				default:
					showToolTip = -2;
					break;
			}
		}			
		else
			if (planetid % 1 == 0){
				if (planetid >= -1 && planetid <= 7)
					showToolTip = planetid;
				else
					showToolTip = -2;
			}
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
		
		sun = new Sun(screen, maxOrbitFull, maxOrbitInner, ctx, "Sun", 695500, sunImage, "1988x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2077"), 274);
		planet[0] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Mercury", 2439.7, 57909227, 0.20563593, 170503, planetImage[0], "330x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2071"), 3.7, 0);
		planet[1] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Venus", 6051.8, 108209475, 0.00677672, 126074, planetImage[1], "4867x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2071"), 8.7, 0);
		planet[2] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Earth", 6371.0, 149598262, 0.01671123, 107218, planetImage[2], "5972x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2071"), 9.8, 1);
		planet[3] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Mars", 3389.5, 227943824, 0.0933941, 86677, planetImage[3], "641x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2071"), 3.71, 2);
		planet[4] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Jupiter", 69911, 778340821, 0.04838624, 47002, planetImage[4], "1898x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x2074"), 24.79, 67);
		planet[5] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Saturn", 58232, 1426666422, 0.05386179, 34701, planetImage[5], "5683x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x00B3"), 10.4, 62);
		planet[6] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Uranus", 25362, 2870658186, 0.04725744, 24477, planetImage[6], "8681x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x00B3"), 8.87, 27);
		planet[7] = new Planet(screen, maxOrbitFull, maxOrbitInner, ctx, "Neptune", 24622, 4498396441, 0.00859048, 19566, planetImage[7], "1024x10" + String.fromCharCode("0x00B2") + String.fromCharCode("0x00B3"), 11.15, 14);

		moveTime();
	};
	
	/********************************************************************
	 * Function that draws a tooltip with usefull info about a planet   *
	 * or the Sun, in the same position as the planet.                  *
	 * #parameters:                                                     *
	 *   id (int) index of the planet (0-7) or -1 for the Sun           *
	 * #return: nothing                                                 *
	 * #scope: private                                                  *
	 ********************************************************************/
	var drawToolTip = function(id){
		var planetPosition;
		if (id >= 0 && id <= 7)
			planetPosition = planet[id].getPosition();
		else if (id == -1)
			planetPosition = sun.getPosition();
		var px = Math.round(planetPosition[0]);
		var py = Math.round(planetPosition[1]);
		var x = px - 90;
		var y = py;
		var w = 180;
		var h = 260;
		if (y + h >  canvas.height)
			y = canvas.height - h;
		if (x < 0)
			x = 0;
		if (x + w > canvas.width)
			x = canvas.width - w;
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.fillStyle = 'rgba(10, 10, 200, .4)';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#4444cc';
		ctx.stroke();
		ctx.closePath();
		if (id == -1){
			ctx.drawImage(sun.getImage(), x + 30, y + 25, 100, 100);
			ctx.font = "bold 16px Arial";
			ctx.fillStyle = 'rgb(200, 200, 255)';
			ctx.fillText(sun.getName(), x + 5, y + 20);
			ctx.font = "bold 12px Arial";
			ctx.fillStyle = 'rgb(180, 180, 235)';
			ctx.fillText("Radius: " + sun.getRadius() + " Km" , x + 5, y + 140);
			ctx.fillText("Mass: " + sun.getStrMass() + " Kg", x + 5, y + 160);
			ctx.fillText("Gravity: " + sun.getGravity() + " m/s" + String.fromCharCode("0x00B2"), x + 5, y + 180);
		}
		else{
			ctx.drawImage(planet[id].getImage(), x + 30, y + 25, 100, 100);
			ctx.font = "bold 16px Arial";
			ctx.fillStyle = 'rgb(200, 200, 255)';
			ctx.fillText(planet[id].getName(), x + 5, y + 20);
			ctx.font = "bold 12px Arial";
			ctx.fillStyle = 'rgb(180, 180, 235)';
			ctx.fillText("Radius: " + planet[id].getRadius() + " Km" , x + 5, y + 140);
			ctx.fillText("Mass: " + planet[id].getStrMass() + " Kg", x + 5, y + 160);
			ctx.fillText("Gravity: " + planet[id].getGravity() + " m/s" + String.fromCharCode("0x00B2"), x + 5, y + 180);
			ctx.fillText("Orbit speed: " + planet[id].getVelocity() + " Km/h", x + 5, y + 200);
			ctx.fillText("Orbit radius: " + planet[id].getOrbitRadius() + " Km", x + 5, y + 220);
			ctx.fillText("Moons: " + planet[id].getMoons(), x + 5, y + 240);
		}
	}
	
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
		setInterval(moveTime, 600);
		time = time + 0.001;
		clearCanvas();
		sun.drawSun(showFullSolarSystem, showRealScale);
		if (showFullSolarSystem)
			var max = 8;
		else
			var max = 4;
		for (var i = 0; i < max; i ++){
			if (showOrbits)
				planet[i].drawOrbit(showFullSolarSystem);
			planet[i].drawPlanet(time, showFullSolarSystem, showRealScale);
		}
		if (showToolTip >= -1 && showToolTip <= 7)
			drawToolTip(showToolTip);
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
 *   strMass (String): Mass of the planet, in scientific notation   *
 *   gravity (float): Gravity on the surface of the planet          *
 *   moons (int): Number of moons orbitting the planet              *
 * #return: nothing                                                 *
 ********************************************************************/
function Planet(canvasSize, maxOrbitFull, maxOrbitInner, ctx, name, radius, orbitRadius, excentricity, velocity, image, strMass, gravity, moons){
	
	/********************************************************************
	 * Variables that store the current position of the planet, in px   *
	 ********************************************************************/ 
	var posX = 0;
	var posY = 0;
		
	/********************************************************************
	 * Getters to read different atributes about the planet.     .      *
	 * #parameters: none                                                *
	 * #return: the required parameter                                  *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.getImage = function(){
		return image;
	};
	
	this.getName = function(){
		return name;
	};
	
	this.getStrMass = function(){
		return strMass;
	};
	
	this.getRadius = function(){
		return radius;
	};
	
	this.getGravity = function(){
		return gravity;
	};
	
	this.getVelocity = function(){
		return velocity;
	};
	
	this.getOrbitRadius = function(){
		return orbitRadius;
	};
	
	this.getMoons = function(){
		return moons;
	};
	
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
		var time = t * velocity / 800000;
		x0 += a * excentricity;
		var r = a * (1 - excentricity * excentricity )/(1 + excentricity * Math.cos(time));
		var x = x0 + r * Math.cos(time);
		var y = y0 + r * Math.sin(time);
		var rad = radius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		if (!showRealScale)
			rad = 2000 * rad;
		if (rad < 2)
			rad = 2;
		ctx.drawImage(image, x - rad, y - rad, rad * 2, rad * 2);
		posX = x;
		posY = y;
	};
	
	/********************************************************************
	 * Function that returns the planet position, in pixels, relative   *
	 * to the top left of the canvas, on a given time.                  *
	 * #parameters: (none)                                              *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.getPosition = function(){
		return [posX, posY];
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
 * The Sun object stores information about the Sun, both to draw    *
 * the canvas and to display information on the tooltip.            *
 * #parameters:                                                     *
 *   canvasSize ([int, int]): the canvas dimensions (width, height) *
 *   maxOrbitFull (int): biggest orbit from the full Solar System   *
 *   maxOrbitInner (int): biggest orbits from the Inner Solar Sys   *
 *   ctx (Context): the Canvas context                              *
 *   name (String): the planet name                                 *
 *   radius (int): the planet radius, in Km                         *
 *   image (Image): image of the planet                             *
 *   strMass (String): Mass of the Sun, in scientific notation      *
 *   gravity (float): Gravity on the surface of the Sun             *
 * #return: nothing                                                 *
 ********************************************************************/
function Sun(canvasSize, maxOrbitFull, maxOrbitInner, ctx, name, radius, image, strMass, gravity){
	
	/********************************************************************
	 * Getters to read different atributes about the Sun.               *
	 * #parameters: none                                                *
	 * #return: the required parameter                                  *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.getImage = function(){
		return image;
	};
	
	this.getName = function(){
		return name;
	};
	
	this.getStrMass = function(){
		return strMass;
	};
	
	this.getRadius = function(){
		return radius;
	};
	
	this.getGravity = function(){
		return gravity;
	};
	
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
	
	/********************************************************************
	 * Function that returns the Sun position, in pixels, relative to   *
	 * the top left of the canvas.                                      *
	 * #parameters: (none)                                              *
	 *   t (int): time                                                  *
	 *   showFullSolarSystem (Boolean): See variable in parent object   *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/
	this.getPosition = function(){
		x = canvasSize[0] / 2 ;
		y = canvasSize[1] / 2;
		return [x, y];
	};
};



