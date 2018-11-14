var app = angular.module("header", []);

app.controller("myCtrl", function($scope) {
  $scope.history = [''];

  addHeader(hist){
    this.history.push(hist);
  }
});
