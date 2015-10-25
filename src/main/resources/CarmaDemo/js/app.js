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
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.controller('MyCtrl', $scope => {
  if (!WebSocket) window.WebSocket = window.MozWebSocket;
  if (!WebSocket) {
    return alert('Your browser does not support WebSockets.');
  }

  const socket = new WebSocket('ws://127.0.0.1:8080/websocket');
  socket.onmessage = event => $scope.message += '\n' + event.data;
  socket.onclose = () => $scope.message = 'WebSocket closed';
  socket.onopen = () => $scope.message = 'WebSocket opened';

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

  $scope.send = message => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      alert('The socket is not open.');
      open(); //TODO: Where is this defined?
    }
  };
});
console.log('app.js x: created myCtrl');
