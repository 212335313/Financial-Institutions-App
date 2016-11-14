
var app = angular.module('financialInstitutionsApp',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'homeController'
	}).otherwise('/');
}]);

app.controller('homeController', ['$scope', 'searchDataFactory', '$filter', function($scope, searchDataFactory, $filter) {

	$scope.searchData = [];

	searchDataFactory.getInstitutionsData(function(response) {
		$scope.searchData = response.data.products;
		console.log(response.data.products);
	}, function(error) {
		console.log(error);
	});

	$scope.displaySearchResult = function() {
		
		$('#searchResultsUL').hide();
		$('#searchResultsUL li').hide();
		
		//Wait for angular filter to return results
		setTimeout(function() {
			var searchListCount = $('#searchResultsUL').find('li').length;
			if(searchListCount > 0 && $scope.searchText !== '') {
				var searchWordsArr = $scope.searchText.split(' ');		
				$('#searchResultsUL').show();

				//Display only 10 records, if more than 10 records found
				if(searchListCount >= 10) {
					
					for(var i = 0; i < 10; i++) {						
						$('#searchResultsUL li:eq(' + i +')').show();
					}

				} else {
					$('#searchResultsUL').show();
					$('#searchResultsUL li').show();				
				}
				//Hightlight the text matched with $scope.searchText
				$('#searchResultsUL li').unhighlight();
				$('#searchResultsUL li').highlight(searchWordsArr);
			}	
		}, 100);
	}
}]);

app.factory('searchDataFactory', ['$http', function($http) {
	var factory = {};

	factory.getInstitutionsData = function(callback,errorCallback) {
		$http.get('../products.json')
			.then(callback, errorCallback);
	};

	return factory;
}]);