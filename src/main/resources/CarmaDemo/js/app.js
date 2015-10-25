'use strict';
/* global angular */

console.log('app.js x: creating myApp module');
const app = angular.module('myApp', [
  'myApp.directives', 'myApp.filters', 'myApp.services',
  'ngRoute', 'ngSanitize', 'ngTouch'
]);
console.log('app.js x: created myApp module');


app.config(['$routeProvider', $routeProvider => {
 $routeProvider.when('/admin', {
    templateUrl: 'partials/admin.html',
    controller: 'MyCtrl',
    view: 'center'
  });
  $routeProvider.when('/pump', {
    templateUrl: 'partials/pump-sim.html',
    controller: 'MyCtrl',
    view: 'center'
  });
  $routeProvider.when('/tank', {
    templateUrl: 'partials/tank-sim.html',
    controller: 'MyCtrl',
    view: 'center'
  });
  $routeProvider.when('/monitor', {
    templateUrl: 'partials/monitor.html',
    controller: 'MyCtrl',
    view: 'center'
  });
  $routeProvider.otherwise({redirectTo: '/admin'});
}]);


app.controller('MyCtrl', (function($scope) {
	
	  if (!WebSocket) window.WebSocket = window.MozWebSocket;
	  if (!WebSocket) {
		    return alert('Your browser does not support WebSockets.');
	  }

	  var socket = null;

	  function startupWebSocket() {
	  	   socket = new WebSocket("ws://"+location.host+"/websocket");
	      
	       socket.binaryType = 'arraybuffer';
	       socket.onmessage = function(event) {
				    	
		            var view = new Uint8Array(event.data);

   	                var dataView = new Uint32Array(event.data);	 
   	                
   	                
   	                //Do something with the data               	        
   	                	         

	       }
	       
	      socket.onopen = function(event) {
				   console.log('Web Socket opened!');
		  }
		  
		  socket.onclose = function(event) {
				    console.log('Web Socket closed');
				    checkWebSocketStatus();
				    
		  }

	  }
	  
	  function checkWebSocketStatus(){
   			 if(!socket || socket.readyState == 3) startupWebSocket();
  	  }
  	  
	  startupWebSocket();
	  setInterval(checkWebSocketStatus, 3000);
	  

		$scope.send = function(message) {
		   if (socket.readyState === WebSocket.OPEN) {
		      	socket.send(message);
		    } else {
		    	console.log('The socket is not open.');
		    }
		}		
		
		$scope.subscribe = function(subId) {
	 	   if (socket.readyState === WebSocket.OPEN) {
				var subMsg = new ArrayBuffer(2);			
				var byteView = new Uint8Array(subMsg);
				byteView[0] = subId;
				byteView[1] = 1;//subscribe			
			   	socket.send(subMsg);	
		    } else {
		    	console.log('The socket is not open.');
		    }
		}
		
		$scope.unsubscribe = function(subId) {
		   if (socket.readyState === WebSocket.OPEN) {
				var subMsg = new ArrayBuffer(2);			
				var byteView = new Uint8Array(subMsg);
				byteView[0] = subId;
				byteView[1] = 0;//unsubscribe	
			   	socket.send(subMsg);
		    } else {
		    	console.log('The socket is not open.');
		    }
		}  
		
		
		function updatePumpStatus() {
    $scope.pumpStatus =
      'The pump simulation is ' +
      ($scope.pumpSimulationRunning ? 'running' : 'stopped') + '.';
  }

  function updateTankStatus() {
    $scope.tankStatus =
      'The tank simulation is ' +
      ($scope.tankSimulationRunning ? 'running' : 'stopped') + '.';
  }

  $scope.brokerAddress = '127.0.0.1:1883';
  $scope.station = 'stl/bigroad';
  $scope.simRate = 2;
  $scope.fuelTypes = '1,2,3';
  $scope.fuelTypeDesignator = 'Premium Unleaded';
  $scope.pricePerGallon = 1.23;
  $scope.pumpSimulationRunning = false;
  $scope.tankSimulationRunning = false;

  $scope.togglePumpSimulation = () => {
    $scope.pumpSimulationRunning = !$scope.pumpSimulationRunning;
    updatePumpStatus();
  };

  $scope.toggleTankSimulation = () => {
    $scope.tankSimulationRunning = !$scope.tankSimulationRunning;
    updateTankStatus();
  };

  updatePumpStatus();
  updateTankStatus();
		
		
		
		
		
		
		    
 }));
