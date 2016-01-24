$(function() {
	var maxParticles = 1500;
	var animSpeed = 5000;
	var velConstant = 16;

	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Container for all the particles, fields, and emitters and player input
	var particles = []
	var emitters = []
	var fields = []
	var leftHand = new PlayerHand(0, 0);
	var rightHand = new PlayerHand(0, 0);
	
	//Radial point
	var colors = ['#162955', '#4F628E', '#7887AB', '#887CAF', '#226666', '#B45A81']
	var radial = $("#background");
	var xCoord = '1px';
	var yCoord = '0px';
	radial.css('margin-left', 0);
	
	// Initialize the starting animations
	addNewParticles(150);
	
	// Slows the initial particles
	for(i = 0; i < particles.length; i++){
		particles[i].vel.x /= velConstant;
		particles[i].vel.y /= velConstant;
	}
	
	// Starts the loop sequence
	loop();
	
	// Enables the background animation
	$(window).click(function (){
		if($('#foreground').css('margin-bottom') == "0px"){
			xCoord = '0px';
			$('#body').css('transition', 'background 20s');
			$('#body').css('background', colors[0]);
			setTimeout(changeColor, '20000');
		}
	});
	
	// Changes the color of the background
	function changeColor() {
		var color = colors[Math.floor(Math.random() * colors.length)];
		while(color != $("#body").css("background")){
			color = colors[Math.floor(Math.random() * colors.length)];
		}
		
		$('#body').css('background', color);
		setTimeout(changeColor, '20000');
	}
	
	// Checker that it is constantly run to test if the coords need to be updated
	function checkCoords() {
		if(radial.css('margin-left') - xCoord <= '2px' || radial.css('margin-left') - xCoord >= '-2px'){
			radial.css('margin-left', xCoord);
		}
		
		if(radial.css('margin-left') == xCoord){
			xCoord = Math.round($(window).width() * -0.25 + $(window).width() / 2 * Math.random()) + 'px';
			yCoord = Math.round($(window).height() * -0.25 + $(window).height() / 2 * Math.random()) + 'px';
			animGradient();
		}
	}
	
	// Animates the gradient ball
	function animGradient() {
		radial.animate({'margin-bottom': yCoord}, {duration: animSpeed});
		radial.animate({'margin-left': xCoord}, {duration: animSpeed, queue: false});
	}
	
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
		checkCoords();
		
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
			var vx = 1 + Math.random();
			var vy = 1 + Math.random();
			
			return (new Particle(x, y, vx, vy, 0, 0));
		}
		
	// A generic field object with a position and a mass. Used to attract (or repell) particles
	function Field (x, y, vx, vy, power, radius) {
		this.itself = new Particle(x, y, vx, vy, 0, 0);
		this.power = power;
		this.radius = radius;
	}
		
		// Black Hole that sucks in particles
		function BlackHole (x, y, power, radius) {
			this.field = new Field(x, y , 0, 0, power, radius);
			this.particleCount = 0;
		}
		
	// Player's hand used to interact with particles
	function PlayerHand (x, y) {
		this.pos = new Vector(x, y);
		this.size = 25;
		this.power = -10;
	}
		
	// Determines if two circles collide or not
	function circleHitDetection(pointOne, pointTwo, radiusOne, radiusTwo){
		return ((pointOne.x - pointTwo.x) * (pointOne.x - pointTwo.x) + 
			(pointOne.y - pointTwo.y) * (pointOne.y - pointTwo.y) <= (radiusOne + radiusTwo) * radiusOne + radiusTwo);
	}
	
	// Loops the leap motion device
	Leap.loop(function(frame) {
        frame.hands.forEach(function(hand, index) {
            var hands= {
			  x: canvas.width*0.5 +hand.palmPosition[0]*canvas.width/400,
                          y: canvas.height*1.25 - hand.palmPosition[1]*canvas.height/300
		}     
		console.log("X: " + hands.x + " Y: " + hands.y);
		});
	});
	
	Leap.loopController.setBackground(true);
});
