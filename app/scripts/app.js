'use strict';
var app = angular.module('ngenda', [ ]);

app.controller('SeshController',['$scope','$location', function($scope,$location){

  $scope.filter = function(term){
    var filtered = [];
    term = term.toLowerCase();

    angular.forEach(window.ucdata.sessionsView.results, function(sesh){
      var found = false;
      if(new Date(sesh.st) > new Date(2014,6,19) ) {
        found = (sesh.t.toLowerCase().indexOf(term) !== -1);
        if(!found){
          found = (sesh.c.toLowerCase().indexOf(term) !== -1);
        }
        if(!found){
          found = (sesh.d.toLowerCase().indexOf(term) !== -1);
        }
        if(found){
          filtered.push(sesh);
        }
      }
    });
    $scope.sessions = filtered;
    $location.url('/' + term);
  };


  if($location.url() !='/'){
    $scope.term = $location.url().substring(1);
    $scope.filter($scope.term);
  }else{
    $scope.sessions = window.ucdata.sessionsView.results;
  }
  
}]);