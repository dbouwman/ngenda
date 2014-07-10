'use strict';
var app = angular.module('ngenda', [ ]);

app.controller('SeshController',['$scope','$location', function($scope,$location){

  $scope.sessions = window.ucdata.sessionsView.results;

  $scope.filter = function(term){
    var filtered = [];
    angular.forEach(window.ucdata.sessionsView.results, function(sesh){
      var found = false;
      found = sesh.t.toLowerCase().contains(term);
      if(!found){
        found = sesh.c.toLowerCase().contains(term);
      }
      if(!found){
        found = sesh.d.toLowerCase().contains(term);
      }
      if(found){
        filtered.push(sesh);
      }
    });
    $scope.sessions = filtered;
    $location.url('/' + term);
  };
}]);