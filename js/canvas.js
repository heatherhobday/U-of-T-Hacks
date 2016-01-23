$(function() {
	var vel_multiplier = 0.2;
	
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
