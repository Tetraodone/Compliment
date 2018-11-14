var randomcolours = setInterval(function() {
  // method to be executed;
  var greydiff = 400;
    do{
      lop = false;
      var rR = Math.floor((Math.random() * 255) + 1);
      var rG = Math.floor((Math.random() * 255) + 1);
      var rB = Math.floor((Math.random() * 255) + 1);
      //greydiff = (rR-rG);
    }while(rR < 50 || rG <50 || rB <50);

var rRGB1 = "rgb(" + rR + ","+ rG + "," + rB + ")";
//set history
timercount = timercount + 1;
//var history = $(".miniheader").html();
//var newhist = "<span onclick='copyrgb(" + timercount + ")' id='history" + timercount + "' class='headercontainer'><b2>"+ rRGB1 + "</b2></span> " + history;
//$(".miniheader").html(newhist);

  $("#thisrgb").attr("placeholder", rRGB1);
  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r = rR; g = rG; b = rB;
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min) {
    h = s = 0;  //achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

    if(max == r && g >= b) {
      h = 1.0472 * (g - b) / d ;
    } else if(max == r && g < b) {
      h = 1.0472 * (g - b) / d + 6.2832;
    } else if(max == g) {
      h = 1.0472 * (b - r) / d + 2.0944;
    } else if(max == b) {
      h = 1.0472 * (r - g) / d + 4.1888;
    }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h+= 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if(s === 0){
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  var rgbstring = r + "," + g + "," + b;
  var balance = r + g + b;
  if(balance<390){
    $("b1").css({'color':'white'});
    $("T1").css({'color':'white'});
  }else{
    $("b1").css({'color':'black'});
    $("T1").css({'color':'black'});
  }
  var compcolor = "rgb(" + rgbstring + ")";

  $("#result").html(compcolor);
grad = "linear-gradient( 0deg, " + rRGB1 + ", " + compcolor + ")";

$("body").css({'background': grad, 'background-size': '200% 200%', '-webkit-animation': 'AnimationName 4s ease infinite', 'animation': 'AnimationName 4s ease infinite', 'transition': 'opacity 5s ease-in-out'});
}, 4000);


/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value
 * @return [String] : complimentary color as hex value
 */

function hexToComplimentary(){
  var rgb = $('#thisrgb').val();


  //test input
  if(rgb==null){
    alert("Please enter a valid RGB Value!");
    console.log("error: Invalid Input.");
    return;
  }
  $("#submit_button").attr('disabled', 'enabled');
  // Get array of RGB values
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0], g = rgb[1], b = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min) {
    h = s = 0;  //achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

    if(max == r && g >= b) {
      h = 1.0472 * (g - b) / d ;
    } else if(max == r && g < b) {
      h = 1.0472 * (g - b) / d + 6.2832;
    } else if(max == g) {
      h = 1.0472 * (b - r) / d + 2.0944;
    } else if(max == b) {
      h = 1.0472 * (r - g) / d + 4.1888;
    }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h+= 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if(s === 0){
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  var rgbstring = r + "," + g + "," + b;

  var compcolor = "rgb(" + rgbstring + ")";
    //bgstyle = "\"" + bgstyle + "\""
  var balance = r + g + b;
  if(balance<390){
    $("b1").css({'color':'white'});
    $("t1").css({'color':'white'});
    $("b2").css({'color':'white'});
    $("t2").css({'color':'white'});
  }
    setcolour(compcolor)
}
