"use strict";
var getId = function (obj,type) {
  var retObj = null;
  switch (type){
    case "movie":
          retObj = obj.traktSlug;
          break;
    case "show":
          retObj = obj.traktSlug;
          break;
    case "track":
          retObj = {artist:obj.artist,track:obj.track};
          break;
    case "book":
          retObj = obj.olid;
          break;
    case "place":
          retObj = obj.venueid;
          break;
  }
  return retObj;
};
//E->Elementos, A->Atributo (def), C->Class, M->Comments, AEC-> Varias
module.exports = function(app){
  app.directive("parallaxImg",function(){
    return {
      restrict: "E",
      scope: {
        image: "@pImg"
      },
      transclude: true,
      templateUrl: "/templates/directives/parallax-img.html",
      link: function(scope, element, attrs){
        $('.parallax').parallax();
      }
    };
  });
  app.directive("poster",function($compile, Auth, $state){
    return {
      restrict: "E",
      templateUrl: "/templates/directives/poster.html",
      link: function(scope, element, attrs, controller){
        var obj = JSON.parse(scope.state);
        scope.go = function () {
          $state.go(scope.type,obj);
        };
        scope.like = function () {
          var id = getId(obj,scope.type);
          switch (scope.type){
            case "movie":
            case "show":
            case "book":
            case "place":
              alert(Auth.getCurrentUser().username + " likes " + id);
              break;
            case "track":
              alert(Auth.getCurrentUser().username + " likes " + id.artist + " of " + id.track);
              break;
          }
          alert("Done");
          window.debugType = scope.type;
          window.debugState = scope.state;
          //$state.go("movie",{traktSlug:"deadpool-2016"});
        };
        scope.logged = Auth.isLoggedIn();
        $(element).find(".card-content").css("background-color","#1A2327");
        $(element).find(".card-content").css("color","white");
        $(element).find(".card-content").css("border-radius","0");

      },
      scope: {
        image: "@image",
        width: "@width",
        height: "@height",
        title: "@title",
        description: "@description",
        type: "@type",
        state: "@state"
      }
    };
  });
  app.directive("esearchbox",function($state){
    return {
      restrict: "E",
      templateUrl: "/templates/directives/esearchbox.html",
      link: function(scope, element, attrs){
        $(element).find("form").css("display","flex");
        $(element).find("input[type=\"text\"]").addClass("esearchbox-input");
        $(element).find("input[type=\"submit\"]").addClass("esearchbox-btn");
        scope.search = function(term){
          $state.go("search-result",{term:term});
        };
      }
    }
  });
};
