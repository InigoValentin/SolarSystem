/********************************************************************
 * The SolarSystem object itializes the canvas, assignin it to the  *
 * HTML element, and set the required mouse events.                 *
 * #parameters: none                                                *
 * #return: nothing                                                 *
 ********************************************************************/
function SolarSystem(){
	
	/********************************************************************
	 * Parameters for costumization.                                    *
	 ********************************************************************/ 
	var canvasWidth;
	
	/********************************************************************
	 * Variable containing this object, to be refered from nested       *
	 * functions.                                                       *
	 ********************************************************************/ 
	var thisSolarSystem;
	
	/********************************************************************
	 * Parameter used to store the widest orbit.                        *
	 ********************************************************************/
	var mawWidth;
	
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
	
	/********************************************************************
	 * Variables containing the canvas and its context.                 *
	 ********************************************************************/ 
	var canvas;
	var ctx;
	
	/********************************************************************
	 * Variables containing the number of elements.                     *
	 ********************************************************************/ 
	var totalVert;
	var totalMaterial = 0;
	var totalFace
	
	/********************************************************************
	 * Arrays containing the vertices, faces and materials.             *
	 ********************************************************************/ 
	var material;
	var vert;
	var face;
	
	/********************************************************************
	 * Booleans to determine wich elements are to draw.                 *
	 ********************************************************************/ 
	var dVerts = true;
	var dEdges = true;
	var dFaces = true;
	var dBackg = true;
	
	/********************************************************************
	 * Booleans to indicate if mtl file should be used.                 *
	 ********************************************************************/
	var hasMtl = true;
	var useMtl = true;
	
	/********************************************************************
	 * Global variables that will contain the position of the mouse in  *
	 * the previous frame to calculate rotation.                        *
	 ********************************************************************/ 
	var pX = null;
	var pY = null;
	
	/********************************************************************
	 * Function that initializes the canvas, assignin it to the HTML    *
	 * element, and set the required mouse events.                      *
	 * #parameters:                                                     *
	 *   canv (canvas): canvas to use. If omited, the one named         *
	 *                  named "ObJSCanvas" will be used.                *
	 * #return: nothing                                                 *
	 * #scope: public                                                   *
	 ********************************************************************/	
	this.initCanvas = function(canv){
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
		this.initPlanets([canvas.width, canvas.height]);
	};
	
	this.initPlanets = function(screen){
		//maxOrbit = 4498396441; //For all the solar system
		maxOrbit = 227943824; //For the inner solar system
		planetImage[0] = new Image();
		planetImage[0].src = "/img/mercury.png";
		planetImage[1] = new Image();
		planetImage[1].src = "/img/venus.png";
		planetImage[2] = new Image();
		planetImage[2].src = "/img/earth.png";
		planetImage[3] = new Image();
		planetImage[3].src = "/img/mars.png";
		
		sun = new Sun(screen, maxOrbit, ctx, "Sun", 695500, null, null)
		planet[0] = new Planet(screen, maxOrbit, ctx, "Mercury", 2439.7, 57909227, 0.20563593, 170503, planetImage[0], null);
		planet[1] = new Planet(screen, maxOrbit, ctx, "Venus", 6051.8, 108209475, 0.00677672, 126074, planetImage[1], null);
		planet[2] = new Planet(screen, maxOrbit, ctx, "Earth", 6371.0, 149598262, 0.01671123, 107218, planetImage[2], null);
		planet[3] = new Planet(screen, maxOrbit, ctx, "Mars", 3389.5, 227943824, 0.0933941, 86677, planetImage[3], null);
		planet[4] = new Planet(screen, maxOrbit, ctx, "Jupiter", 69911, 778340821, 0.04838624, 47002, null, null);
		planet[5] = new Planet(screen, maxOrbit, ctx, "Saturn", 58232, 1426666422, 0.05386179, 34701, null, null);
		planet[6] = new Planet(screen, maxOrbit, ctx, "Uranus", 25362, 2870658186, 0.04725744, 24477, null, null);
		planet[7] = new Planet(screen, maxOrbit, ctx, "Neptune", 24622, 4498396441, 0.00859048, 19566, null, null);

		moveTime();
	};
	
	/********************************************************************
	 * Function that clears the arrays and the canvas. Use to unload a  *
	 * model.                                                           *
	 * #parameters: none                                                *
	 * #return: nothing                                                 *
	 * #scope: public                                                  *
	 ********************************************************************/
	this.clear = function(){
		initArrays();
		clearCanvas();
	};
	
	
	/********************************************************************
	 * Function that clears the canvas and gets it ready to draw on it. *
	 * #parameters: none                                                *
	 * #return: nothing                                                 *
	 * #scope: private                                                  *
	 ********************************************************************/
	var clearCanvas = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//ctx.fillStyle = "#ffffff";
		//ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
	};
	
	var time = 0;
	moveTime = function() {
		time = time + 0.001;
		clearCanvas();
		for (var i = 0; i < 4; i ++){
			planet[i].drawOrbit();
			planet[i].drawPlanet(time);
			sun.drawSun();
		}
		setInterval(moveTime, 200);
	}
	
	thisSolarSystem = this;
	return this;
}


function Planet(canvasSize, maxOrbit, ctx, name, radius, orbitRadius, excentricity, velocity, image){
	
	this.drawPlanet = function(t) {
		time = t * velocity / 100000;
		r = a * (1 - excentricity *excentricity )/(1 + excentricity * Math.cos(time));
		x = x0 + r * Math.cos(time);
		y = y0 + r * Math.sin(time);
		rad = 2000 * radius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		if (rad < 2)
			rad = 2;
		//ctx.beginPath();
		//ctx.moveTo(x, y);
		//ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
		
		//image.onload = function() {
			ctx.drawImage(image, x - rad, y - rad, rad * 2, rad * 2);
		//};
		//ctx.fillStyle = 'green';
		//ctx.closePath();
		//ctx.fill();
	};
	
	this.drawOrbit = function() {
		a = orbitRadius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		x0 = canvasSize[0] / 2 + a * excentricity;
		y0 = canvasSize[1] / 2;
		
		x0 += a * excentricity;
		var r = a * (1 - excentricity * excentricity)/(1 + excentricity), x = x0 + r, y = y0;
		ctx.beginPath();
		ctx.moveTo(x, y);
		var i = 0.01 * Math.PI;
		var twoPi = 2 * Math.PI;
		while (i < twoPi) {
			r = a * (1 - excentricity *excentricity )/(1 + excentricity * Math.cos(i));
			x = x0 + r * Math.cos(i);
			y = y0 + r * Math.sin(i);
			ctx.lineTo(x, y);
			i += 0.01;
		}
	    ctx.lineWidth = 1;
		ctx.strokeStyle = "gray";
		ctx.closePath();
		ctx.stroke();
		
	};
}

function Sun(canvasSize, maxOrbit, ctx, name, radius){
	
	this.drawSun = function() {
		x = canvasSize[0] / 2 ;
		y = canvasSize[1] / 2;
		rad = 10 * radius * (canvasSize[0] / 2) * 0.8 / maxOrbit;
		if (rad < 1)
			rad = 1;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'orange';
		ctx.closePath();
		ctx.fill();
	};
}



