'use strict';

module.exports = function(app){
  app.controller('BooksCtrl', function ($scope, $http) {
    $scope.books = [];
    $scope.waiting = true;
    $http.get("/api/books").success(function(books){
      $scope.books = books.sort(function() {return Math.random() - 0.5});
      $scope.waiting = false;
    });
  });

  app.controller('BookCtrl', function($scope, $http, $stateParams, $state){
    $scope.book = {};
    $http.get("/api/books/"+$stateParams.olid)
    .then(
      function(data){
        $scope.book = data.data;
      },
      function(error){
        $state.go("pageNotFound");
      }
    )
  });
}
