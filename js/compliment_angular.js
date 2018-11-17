var app = angular.module("Compliment",[]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('MainController', function($scope, $interval) {
    $scope.history = [];
    $scope.lastCompliment = '';
    $scope.inputPH='rgb()';
    $scope.play = true;
    $scope.compliments = ["I love you :)", "Have a good day <3", "You are doing great ; )", "Keep up the good work <3", "You are amazing", "You are the best!", "You look great omg.", "You are beautiful!"];
    $scope.compliment = "Hi there!"
    $scope.compColor1 = '#4ad2af';$scope.compColor2 = '#d27f4a';

    $scope.randomRGB = function(){
      //Generate random numbers until higher than Black Threshold
      do{
        var r = Math.floor((Math.random() * 255) + 1);
        var g = Math.floor((Math.random() * 255) + 1);
        var b = Math.floor((Math.random() * 255) + 1);
      }while(r < 50 || g <50 || b <50);

      return new $scope.rgb(r, g, b);
    }

    $scope.rgb = function(_r, _g, _b){
      this.r = function(){
        return _r;
      }
      this.g = function(){
        return _g;
      }
      this.b = function(){
        return _b;
      }
      this.fullrgb = function(){
        var s;
        s = 'rgb(' + _r + ',' + _g +',' + _b + ')';
        return s;
      }

      this.complement = function(){
        // Convert RGB to HSL
        // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
        r = _r; g =_g; b =_b;
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
        return new $scope.rgb(r,g,b);
      }
      this.balance = function(){
        return (_r + _g + _b);
      }

    }

    $scope.applyGradient = function(o,c){
      //push new colour to history
      $scope.history.push(o.fullrgb());
      $("#thisrgb").attr("placeholder", o.fullrgb());

      var theme;
      if(o.balance()<390){
        theme = 'white';
        $('#thisrgb').addClass('whitePlaceHolder');
      }else{
        theme = 'black';
        $('#thisrgb').removeClass('whitePlaceHolder');
      }

      $("b1").css({'color':theme});
      $("T1").css({'color':theme});
      $("t2").css({'color':theme});
      $('.loading').css({'background-color':theme});
      $('label').css({'border-color':'transparent transparent transparent ' + theme});

      //dispay result and save compColor1 and 2
      $("#result").html(c.fullrgb());
      $scope.compColor1 = o.fullrgb();
      $scope.compColor2 = c.fullrgb();

      //Apply background
      grad = "linear-gradient( 0deg, " + o.fullrgb() + ", " + c.fullrgb() + ")";
      $("body").css({'background': grad, 'background-size': '200% 200%', '-webkit-animation': 'AnimationName 4s ease infinite', 'animation': 'AnimationName 4s ease infinite', 'transition': 'opacity 5s ease-in-out'});

      //generate random compliment
      $scope.doCompliment();

      //Limit history to 20 colours to save memory
      if($scope.history.length > 20){
        $scope.history.shift()
      }
    }

    $scope.pause = function(){
      this.play = !this.play;
      //using opacity because animation needs to continue playing
      if(this.play){
        $('.loading').css({'opacity':'.3'})
      }else{
        $('.loading').css({'opacity':'0'})
      }
    }

    //Generate random Compliment Gradient every 4 seconds
    $interval(function () {
      //if play resume generating random colours and compliments
      if($scope.play){
        var randomColor = $scope.randomRGB();
        var randomComplementColor = randomColor.complement();
        $scope.applyGradient(randomColor, randomComplementColor);
      }
  }, 4000);

  $scope.hextToComplimentary = function(){
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
      $('input').css({'color':'white', 'border-color':'white !important'});
      $('label').css({'border-color':'white'});
    }
      $scope.setcolour(compcolor);
  }

  $scope.doCompliment = function (){
    do {
    this.compliment = this.compliments[Math.floor(Math.random() * this.compliments.length)];
    }
    while (this.compliment===this.lastCompliment);

    this.lastCompliment = this.compliment
    $('#randcompliment').animateCss('jello', function() {
      $('#randcompliment').removeClass('animated jello');
    });
  }

  $scope.setcolour = function (compcolor){
    //get main rgb
    var myrgb = $('#thisrgb').val();
    myrgb = "rgb(" + myrgb + ")";
    var grad = "linear-gradient( 0deg, " + myrgb + ", " + compcolor + ")";
    $("body").css("background", grad);
    $("body").css({'background': grad, 'background-size': '200% 200%', '-webkit-animation': 'AnimationName 4s ease infinite', 'animation': 'AnimationName 4s ease infinite'});
    $("#result").html(compcolor);
    compliment();
  }

});
