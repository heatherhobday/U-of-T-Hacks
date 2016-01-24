$(function() {
	var maxParticles = 1500;
	var baseVelocity = 1;
	var velConstant = 16;
	var bool=1;
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Container for all the particles, fields, and emitters and player input
	var particles = []
	//var cursorticles=[50]
	var emitters = []
	var fields = []
	//var leftHand = new PlayerHand(0, 0);
	var rightHand = new PlayerHand(0, 0);
	fields.push(new Field(0,0,0,0,0,0));
//	fields.push(new Field(500, 250, 1, 1, 2, 15));

	// Initialize the starting animations
	addNewParticles(1200);

	// Slows the initial particles
	for(i = 0; i < particles.length; i++){
		particles[i].vel.x /= velConstant;
		particles[i].vel.y /= velConstant;
	}

	// Starts the loop sequence
	loop();

	// The loop of the canvas which keeps it updating and animating
	function loop(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		update();
		draw();
		queue();
	}

	// Keeps the loop cycle going
	function queue(){
		window.requestAnimationFrame(loop);
	}

	// Update variables in a single loop instance
	function update(){
		for(i = 0; i < particles.length; i++){
			// Move the particle
			var particle = particles[i];
			move(particle);
		}
	}

	// Draws entities to the canvas screen
	function draw(){
		// Set the color of our particles
		ctx.fillStyle = 'rgb(217,255,48)';

		// Draw a square at each particle
		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			ctx.fillRect(particle.pos.x-particle.size/2, particle.pos.y-particle.size/2, particle.size, particle.size);
		}

		// Draw a square at each field
		for (var j = 0; j < fields.length; j++) {
			var field = fields[j];
			ctx.fillRect(field.itself.pos.x-field.radius/2, field.itself.pos.y-field.radius/2, field.radius, field.radius);
		}
	}

	// On the window click it speeds up the particles after the animation is completed
	$(window).click(function (){
		if($('#background').css('margin-bottom') == "0px"){
			// do something
		}
    });

	// Basic Vector Object with values x, y
	function Vector(x, y) {
		this.x = x;
		this.y = y;
	}
		// Adds the velocity from one vector to another vector, used in collision
		function addVector(baseVect, addVect) {
			baseVect.x += addVect.x;
			baseVect.y += addVect.y;
		}

	// Basic Particle Object with radius and vector variables
	function Particle(x, y, vx, vy, ax, ay){
		this.pos = new Vector(x, y);
		this.vel = new Vector(vx, vy);
		this.acc = new Vector(ax, ay);
		this.size = 2 + 4 * Math.random();
	}

		// Moves the particle based on velocity and acceleration
		function move(p) {
				/*	for(m=0;m<particles.length;m++){
					if(circleHitDetection(p.pos,particles[m].pos,p.size,particles[m].size)) {
						p.pos.x*= (-1);
						p.pos.y*= (-1);
						particles[m].pos.x*= (-1);
						particles[m].pos.y*= (-1);
					}
				}*/
					// Applies gravity fields to appropriate particles
					for(k = 0; k < fields.length; k++){
							var f = fields[k];

							// find the distance between the particle and the field
				    	var vectorX = f.itself.pos.x - p.pos.x;
				    	var vectorY = f.itself.pos.y - p.pos.y;
				    	var force = f.power / Math.abs(Math.pow(vectorX*vectorX+vectorY*vectorY,1.5));
							p.acc.x += (vectorX * force);
							p.acc.y += (vectorY * force);
							if(Math.pow(vectorX,2)+Math.pow(vectorY,2) < Math.pow(f.radius,2)){
								var temp= p;
								p=particles[particles.length-1];
								particles[particles.length-1]=temp;
								particles.pop();
								particles.push(createRandomParticle());
							}
							//Adding vectors over time
							addVector(p.vel, p.acc);
							addVector(p.pos, p.vel);
							p.acc.x *=0.65;
							p.acc.y *=0.65;
							if(Math.abs(p.vel.x+p.vel.y)>1.0){
								p.vel.x*=0.75;
								p.vel.y*=0.75;
							}
						

			// Bounces the particle back into the canvas
			if(p.pos.x - p.size< 0 || p.pos.x + p.size> $(window).width()){
				addVector(p.vel, new Vector(p.vel.x * -2, 0));
			} else if(p.pos.y - p.size< 0 || p.pos.y + p.size> $(window).height()){
				addVector(p.vel, new Vector(0, p.vel.y * -2));
			}

			// Constantly decelerates the particle's x movement
			if(p.acc.x > 0){
				p.acc.x -= p.acc.x * 0.1;
			} else if(p.acc.x < 0.15 && p.acc.x > -0.15){
				p.acc.x = 0;
			}

			// Constantly decelerates the particle's y movement
			if(p.acc.y > 0){
				p.acc.y -= p.acc.y * 0.1;
			} else if(p.acc.y < 0.15 && p.acc.y > -0.15){
				p.acc.y = 0;
			}
		}
	}
	// An Emitter object which acts itself as a particle but also contains a spread to emit particles
	function Emitter(x, y, vx, vy, ax, ay, spread){
		this.itself = new Particle(x, y, vx, vy, ax, ay);
		this.spread = spread || Math.PI / 6;
		this.drawColor = '#555';
	}

		// Emits a particle with a randomized velocity and angle
		function emitParticle(emtr) {
			var multiplier = 1;
			if(Math.random() >= 0.5){
				multiplier = -1;
			}

			// Calculates necessary information for a new particle
			var angle = Math.atan2(emtr.itself.vel.y, emtr.itself.vel.x) + emtr.spread * Math.random() * multiplier;
			var magnitude = Math.sqrt(emtr.itself.vel.x * emtr.itself.vel.x + emtr.itself.vel.y * emtr.itself.vel.y);
  		//	var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5)rticles[particles.length-1]particles[particles.length-1;]
			// Return the newly created particle
			return new Particle(emtr.itself.pos.x, emtr.itself.pos.y, magnitude * Math.cos(angle), magnitude * Math.sin(angle))
		} 

		// Function for adding new particles to the screen
		function addNewParticles(amount) {
			// Create particles from anywhere
			for(i = 0; i < amount; i++){
				if(particles.length < maxParticles){
					particles.push(createRandomParticle());
				} else {
					i = amount;
				}
			}
		}

		// Creates a random particle on the screen
		function createRandomParticle() {
			var multx=1;
			var multy=1
			if(Math.random()<0.5) multx=-1;
			if(Math.random()<0.5) multy=-1;
			var x = $(window).width() * Math.random();
			var y = $(window).width() * Math.random();
			var vx = baseVelocity + Math.random();
			var vy = baseVelocity + Math.random();

			return (new Particle(x, y, multx*vx, multy*vy, 0, 0));
		}

	// A generic field object with a position and a mass. Used to attract (or repell) particles
	function Field (x, y, vx, vy, power, radius) {
		this.itself = new Particle(x-radius/2, y-radius/2, vx, vy, 0, 0);
		this.power = power;
		this.radius = radius;
	}

		// Black Hole that sucks in particles
		function BlackHole (x, y, power, radius) {
			this.field = new Field(x-radius/2, y-radius/2 , 0, 0, power, radius);
			this.particleCount = 0;
		}

	// Player's hand used to interact with particles
	function PlayerHand (x, y) {
		this.pos = centre(x,y,12.5);
		this.size = 25;
		this.power = -10;
	}

	// Determines if two circles collide or not
	function circleHitDetection(pointOne, pointTwo, radiusOne, radiusTwo){
		//pointOne=centre(pointOne.x,pointOne.y, radiusOne);
		//pointTwo=centre(pointTwo.x,pointTwo.y, radiusTwo);
		return (pointOne.x - pointTwo.x) * (pointOne.x - pointTwo.x) + (pointOne.y - pointTwo.y) * (pointOne.y - pointTwo.y) < (radiusOne + radiusTwo) * (radiusOne + radiusTwo);
	}

	/* function createCursor(xpos,ypos) {
                          var x = xpos;
                          var y = ypos;
                          var vx = baseVelocity + Math.random();
                          var vy = baseVelocity + Math.random();

                          return (new Particle(x, y, 0, 0, 0, 0));
                  }
	function addNewCursorticles(amount,x,y) {
                          // Create particles from anywhere
                          for(i = 0; i < amount; i++){
                                  if(cursorticles.length < maxParticles){
                                          cursorticles[i]=createCursor(x,y);
                                  } else {
                                          i = amount;
                                  }
				console.log("yo:" + i);
                          }
                  }*/
	function centre(x,y,radius){
		return Vector(x-radius/2,y-radius/2);
	}

	// Loops the leap motion device
	Leap.loop(function(frame) {
	frame.hands.forEach(function(hand, index){
	   var cursorSize= 10+10*hand.grabStrength.toPrecision(2);
           var handR= {
			  x: canvas.width*0.5 + hand.palmPosition[0]*canvas.width/400,
       			  y: canvas.height*1.25 - hand.palmPosition[1]*canvas.height/300
		};
		//addNewCursorticles(50,handR.x,handR.y)
		//console.log("X: " + handR.x + " Y: " + handR.y + "   " + cursorticles.length);
		//rightHand= new PlayerHand(handR.x,handR.y);
		//ctx.fillRect(handR.x-cursorSize/2, handR.y-cursorSize/2,cursorSize, cursorSize);
		fields[0]=new Field(handR.x,handR.y, 1,3,-30-90*hand.grabStrength.toPrecision(2),10+30*hand.grabStrength.toPrecision(2));
		//fields[1]=new Field(handR.x,handR.y, 1,3,-30-90*hand.grabStrength.toPrecision(2),10+30*hand.grabStrength.toPrecision(2));
		
		});
	});
	Leap.loopController.setBackground(true);
});

