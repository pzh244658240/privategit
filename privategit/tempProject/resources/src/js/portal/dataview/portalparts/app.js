// Declare app level module which depends on views, and components
var projectName={name:"test"};
var visitPower=true;
var projectId =null;
var app = angular.module('APP', [
  'oc.lazyLoad',
  'ui.router'
]).controller('AppCtrl',['$scope', '$rootScope','$state','ToolService', '$stateParams',
                         function ($scope, $rootScope,$state, ToolService,$stateParams)  {
		$scope.message="sdfsf";
 }]); 
