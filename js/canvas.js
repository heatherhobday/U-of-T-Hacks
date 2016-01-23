$(function() {
	var maxParticles = 1500;
	var baseVelocity = 0.9;
	
<<<<<<< HEAD
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
});
=======
	var canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      color = 'rgba(255, 255, 255, .5)';
    var w = $(window).width();
    var h = $(window).height();
    canvas.width = w;
	canvas.height = h;
	ctx.fillStyle = color;
	ctx.lineWidth = .1;
	ctx.strokeStyle = color;

	var dots = {
     	 num: 100,
     	 distance: 200,
     	 d_radius: 200,
     	 velocity: -.9,
     	 array: []
          }
	// Times it so the window starts producing dots at the end of the slide animation
	$(window).click(function() {
		for(i = 0; i < dots.num; i++){
		//	dots.array[i].vx /= vel_multiplier;
		//	dots.array[i].vy /= vel_multiplier;
		}
	});
	Leap.loop(function(frame) {
                 frame.hands.forEach(function(hand, index) {
                 var hands= {
           x: hand.palmPosition[0],
           y: hand.palmPosition[1]
 	}     
		console.log("X: " + hands.x + " Y: " + hands.y);

	function Dot(){
		this.x = Math.random() * w;
		this.y = Math.random() * h;

		this.vx = (dots.velocity + Math.random()) * vel_multiplier;
		this.vy = (dots.velocity + Math.random()) * vel_multiplier;

		this.radius = Math.random() * 2;
	}

	Dot.prototype = {
		create: function(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
		},

		animate: function() {
			for(i = 0; i < dots.num; i++){

				var dot = dots.array[i];

				if(dot.y < 0 || dot.y > h){
					dot.vx = dot.vx;
					dot.vy = - dot.vy;
				}
				else if(dot.x < 0 || dot.x > w){
					dot.vx = - dot.vx;
					dot.vy = dot.vy;
				}
				dot.x += dot.vx;
				dot.y += dot.vy;
			}
		},

		line: function() {
			for(i = 0; i < dots.num; i++){
				for(j = 0; j < dots.num; j++){
					i_dot = dots.array[i];
					j_dot = dots.array[j];

					if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
					if((i_dot.x - hands.x) < dots.d_radius && (i_dot.y - hands.y) < dots.d_radius && (i_dot.x - hands.x) > - dots.d_radius && (i_dot.y - hands.y) > - dots.d_radius){
							ctx.beginPath();
							ctx.moveTo(i_dot.x, i_dot.y);
                   ctx.bezierCurveTo(i_dot.x, (h / 2), (w / 2), i_dot.y, j_dot.x, j_dot.y);
							ctx.stroke();
							ctx.closePath();
						}
					}
				}
			}
		}
	};

	function createDots(position){
		ctx.clearRect(0, 0, w, h);
		for(i = 0; i < dots.num; i++){
			dots.array.push(new Dot());
			dot = dots.array[i];

			dot.create();
		}

		dot.line(position);
		dot.animate();
	}
 
	$('canvas').on('mousemove mouseleave handFound handLost', function(e){
		if(e.type == 'mousemove' || e.type == 'handFound'){
		//	mousePosition.x = e.pageX;
		//	mousePosition.y = e.pageY;
		}
		if(e.type == 'mouseleave' && e.type == 'handLost'){
		//	mousePosition.x = w / 2;
		//	mousePosition.y = h / 2;
		}
	});

  $('canvas').on('click', function(){
		dots.num += 10;
	});

	setInterval(createDots, 1000/30);

  $(window).on('resize', function() {
    canvas.width = w;
    canvas.height = h;;
    ctx.fillStyle = color;
    ctx.lineWidth = .1;
    ctx.strokeStyle = color;
	  });
    });
 });
Leap.loopController.setBackground(true);
});
>>>>>>> 8f398fe654fa85a1ce1be61685a3d89c1165d191
