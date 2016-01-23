$(function() {
	var background = $('#background');
	var animation_speed = 1500;
	
	// Set the background up for animation
	background.css('margin-top', -background.height() + $(window).height());
	
	// Slides the image upwards when the window is clicked and it has not slid yet
	$(window).click(function() {
		if(background.css('color') == 'rgb(255, 255, 255)'){
			background.animate({'margin-top': 0}, animation_speed);
			background.css('color', 'rgb(0, 0, 0)');
		}
	});
});