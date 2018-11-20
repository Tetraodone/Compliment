var app = angular.module("Compliment",[]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('mController', function($scope, $interval) {
    $scope.history = [];
    $scope.validInput = false;
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
      $("t3").css({'color':theme});
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

    $scope.pause = function(pause){
      if ($('#playpause').is(':checked')) {
        this.play = false;
      } else {
        this.play = true;
      }

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

    $scope.rgbSubmit = function(){
      if ($scope.validate($scope.rgbInput)){
        $("#playpause").prop( "checked", true );
        $scope.pause();
        var _rgb = $scope.rgbInput;
        _rgb = _rgb.replace("rgb(", "");
        _rgb = _rgb.replace(")", "");
        _rgb = _rgb.replace(/[^\d,]/g, '').split(',');
        var userColor = new $scope.rgb(_rgb[0], _rgb[1], _rgb[2]);
        var complementColor = userColor.complement();
        $scope.applyGradient(userColor, complementColor);
        //$scope.play = false;
      } else {
        alert('Invalid Input. rgb(000,000,000) or 000,000,00 are accepted.');
      }
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
  $scope.validate = function(value){
      var type = true;
      var valtest = value.replace("rgb(", "");
      valtest = valtest.replace(")", "");
      valtest = valtest.replace(/[^\d,]/g, '').split(',');

      if (isNaN(valtest)){
        console.log('A Number!');
        type = true;
      } else {
        type = false;
      }
      valtest = value;
      valtest = valtest.replace(/[^\d,]/g, '').split(',');

      if (isNaN(valtest)){
        console.log('A Number!');
        type = true;
      } else {
        type = false;
      }
      if (type){
        console.log('Valid!')
        return true;
      } else {
        console.log('notvalid');
        return false
      }
      return value;
    }
    $scope.removeCompliment = function(_comp){
      if (confirm('Are you sure you want to delete this compliment?')) {
        if($scope.compliments.length<=2){
          alert('Hey! I need at least two compliments!')
        } else {
          for (var i=$scope.compliments.length-1; i>=0; i--) {
              if ($scope.compliments[i] === _comp) {
                  $scope.compliments.splice(i, 1);
                  localStorage.setItem("compliments", JSON.stringify($scope.compliments));
                  break;
              }
          }
        }
      } else {
          // Do nothing!
      }
    }
    $scope.profanity = function(text){
      var swears = ['fuck','shit', 'balls', 'cunt', 'bitch', 'penis', 'dick', 'die'];

      swears.forEach(function(swear) {
        if (text.includes(swear)){
          console.log('Naughty!');
          $('#pageTitle').html('<br> INSULTS')
        }
      });
    }
    // at the bottom of your controller
    $scope.saveCompliments = function(){
      if (typeof(Storage) !== "undefined") {
         localStorage.setItem("compliments", JSON.stringify($scope.compliments));
      } else {
         // Sorry! No Web Storage support..
         console.log('Error: No local storage support')
      }
    }

    $scope.submitHistory = function(color){
      $scope.rgbInput = color;
      $scope.rgbSubmit();

    }

    var init = function () {
      if (typeof(Storage) !== "undefined") {
         if(JSON.parse(localStorage.getItem("compliments")) === null){
           console.log('No Compliments saved')
         } else {
           var userCompliments = JSON.parse(localStorage.getItem("compliments"));
           $scope.compliments = userCompliments;
         }
      } else {
         // Sorry! No Web Storage support..
      }
    };
    // and fire it after definition
    init();
});
