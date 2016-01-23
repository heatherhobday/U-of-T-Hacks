$(function() {
	var maxParticles = 1500;
	var baseVelocity = 0.9;

	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Container for all the particles, sorted by life expectency 
	var particles = []
	
	// First run of the canvas loop
	addNewParticles(50);
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
		ctx.fillStyle = 'rgb(180,150,220)';
		
		
		// Draw a square at each particle
		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			ctx.fillRect(particle.pos.x, particle.pos.y, particle.size, particle.size);
		}
	}
	
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
		this.size = 5;
	}
	
		// Moves the particle based on velocity and acceleration
		function move(p) {
			addVector(p.vel, p.acc);
			addVector(p.pos, p.vel);
			
			// Bounces the particle back into the canvas
			if(p.pos.x < 0 || p.pos.x > $(window).width()){
				addVector(p.vel, new Vector(p.vel.x * -2, 0));
			} else if(p.pos.y < 0 || p.pos.y > $(window).height()){
				addVector(p.vel, new Vector(0, p.vel.y * -2));
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
			var x = $(window).width() * Math.random();
			var y = $(window).width() * Math.random();
			var vx = baseVelocity + Math.random();
			var vy = baseVelocity + Math.random();
			
			return (new Particle(x, y, vx, vy, 0, 0));
		}
		
	Leap.loop(function(frame) {
        frame.hands.forEach(function(hand, index) {
            var hands= {
				x: hand.palmPosition[0],
				y: hand.palmPosition[1]
		}     
		console.log("X: " + hands.x + " Y: " + hands.y);
		});
	});	
Leap.loopController.setBackground(true);
});
