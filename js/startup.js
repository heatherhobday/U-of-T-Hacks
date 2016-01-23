$(function() {
  var background = $('#background');
  var canvas = $('#canvas');
  var animation_speed = 900;
  
  background.css('margin-bottom', 0);
  
  $(window).click(function (){
    if(background.css('margin-bottom') == "0px"){
		background.animate({'margin-bottom': -background.height()}, animation_speed);
		$('#body').css('background', '#D75C6A');
    }
  });
});
