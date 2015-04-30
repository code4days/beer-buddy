angular.module('beer-buddy-app')

.controller('HomeController', [ '$scope', '$rootScope', 'BeerService', 'UserService', 'SearchService',
	function($scope, $rootScope, BeerService, UserService, SearchService) {
	
		$rootScope.user = $rootScope.user || beerBuddy.getUser() || {};
	
		$rootScope.menu = $rootScope.menu || {};
		//clear out page title so that default takes over
		delete $rootScope.menu.currentPage;
		
		$scope.page = -1;
		$scope.totalPages = 1;
		$scope.lastPage = false;
		$scope.searchText = "Lakeport Ice";
		
		$scope.hasMore = function() {
			return ! $scope.lastPage; 
		};
		
		$scope.beers = $scope.beers || [];
		$scope.nextPage = function() {
			BeerService.getPage($scope.page + 1, function(page) {
				$scope.beers = angular.copy(page.content, $scope.beers);
				$scope.page = page.number;
				$scope.totalPages = page.totalPages;
				$scope.lastPage = page.last;
			});
		};
		
		
	
		//load the first page...
		$scope.nextPage();
		$scope.showBeer = true;
		$scope.showUsersBeer = false;
		$scope.showSearch = false;
		
		var tabs = [
            { title: 'All', action: 'show-all-beers' }
         ];
		if( $scope.user && $scope.user.isLoggedIn ) {
			tabs.push({ title: 'Favorites', action: 'show-favorites' });
		}
		tabs.push({ title: 'Drinking Buddies', action: 'show-all-people' });
		tabs.push({ title: 'Search', action: 'show-search'});

		var types = [];
		BeerService.getTypes(function(ts){
			angular.forEach(ts, function(type) {
				$scope.tabs.push({title: type});
				types.push(type);
			});
		});
		
		
//		$scope.searchText = "test";
//		$scope.displaySearchResults = function() {
//			
//			$scope.searchPage(searchText);
//			var names = [];
//			SearchService.getNames(function(ns){
//				angular.forEach(ns, function(name) {
//					$scope.tabs.push({title: 'Search Results'});
//					names.push(name);
//				});
//			});
//			$scope.showBeer = true;
//			$scope.showUsersBeer = false;
//		}
		
		$scope.searchResults = function() {
			 $scope.showSearch = true;
			 //$scope.searchText = "Lakeport Ice";
			 var searchName = $scope.searchText;
			 console.log(searchName);
			 $scope.searchPage(searchName);
			 $scope.showBeer = true;
			 $scope.showUsersBeer = false;
			 $scope.showPeople = false;
		}
		
          $scope.tabs = tabs;
          $scope.selectedIndex = 0;
          $scope.selectType = selectType;
          $scope.deselectType = deselectType;
          
          $scope.addTab = function (title, view) {
            view = view || title + " Content View";
            tabs.push({ title: title, content: view, disabled: false});
          };
          
          
          $scope.removeTab = function (tab) {
            for (var j = 0; j < tabs.length; j++) {
              if (tab.title == tabs[j].title) {
                $scope.tabs.splice(j, 1);
                break;
              }
            }
          };
          
          
		 function selectType(tab) {
			 $scope.page = -1;
			 $scope.beers = [];
			 $scope.people = [];
			 if( types.indexOf(tab.title) > -1 ) {
				 $scope.nextPageOfType(tab.title);
				 $scope.loadMore = function() {
					 $scope.nextPageOfType(tab.title);
				}; 
				$scope.showBeer = true;
				$scope.showUsersBeer = false;
				$scope.showPeople = false;
				$scope.showSearch = false;
			 } else {
				 if( tab.action && tab.action === 'show-all-people' ) {
					 $scope.nextPageOfPeople();
					 $scope.loadMore = function() {
						 $scope.nextPageOfPeople();
					 };
					 $scope.showBeer = false;
					 $scope.showUsersBeer = false;
					 $scope.showPeople = true;
					 $scope.showSearch = false;
				 } else if( tab.action && tab.action === 'show-favorites' ) {
					 $scope.nextPageOfUsersBeers();
					 $scope.loadMore = function() {
						 $scope.nextPageOfUsersBeers();
					 };
					 $scope.showBeer = false;
					 $scope.showUsersBeer = true;
					 $scope.showPeople = false;
					 $scope.showSearch = false;
				 } else if( tab.action && tab.action === 'show-search') {
					 //search button calls this tab
					 $scope.showSearch = true;
					 //$scope.searchText = "Lakeport Ice";
					 var searchName = $scope.searchText;
					 console.log(searchName);
					 $scope.searchPage(searchName);
					 $scope.showBeer = true;
					 $scope.showUsersBeer = false;
					 $scope.showPeople = false;
				 } 
				 else {
					 $scope.nextPage();
					 $scope.loadMore = function() {
						 $scope.nextPage();
					 };
					 $scope.showBeer = true;
					 $scope.showUsersBeer = false;
					 $scope.showPeople = false;
					 $scope.showSearch = false;
				 }
			 }
		}
		 
		function deselectType(tab) {
			$scope.greeting = 'Hello ' + tab.title + '!';
		}
		$scope.nextPageOfType = function(type) {
			BeerService.getType(type, $scope.page + 1, function(page) {
				$scope.beers = angular.copy(page.content, $scope.beers);
				$scope.page = page.number;
				$scope.totalPages = page.totalPages;
				$scope.lastPage = page.last;
			});
		};
		
		$scope.loadMore = function() {
			$scope.nextPage();
		};
		
		//$scope.beerSearch = $scope.beerSearch || [];
		$scope.searchPage = function(name) {
			SearchService.getName(name, $scope.page + 1, function(page) {
				//$scope.searchPage = angular.copy(page.content, $scope.searchPage);
				$scope.beers = angular.copy(page.content, $scope.beers);
				$scope.page = page.number;
				$scope.totalPages = page.totalPages;
				$scope.lastPage = page.last;
			});
		};
		
		
		$scope.people = $scope.people || [];
		$scope.nextPageOfPeople = function() {
			UserService.getPage($scope.page + 1, function(page) {
				$scope.people = angular.copy(page.content, $scope.people);
				$scope.page = page.number;
				$scope.totalPages = page.totalPages;
				$scope.lastPage = page.last;
			});
		};
		
		$scope.nextPageOfUsersBeers = function() {
			UserService.getUsersBeers($scope.page + 1, function(page) {
				$scope.beers = angular.copy(page.content, $scope.beers);
				$scope.page = page.number;
				$scope.totalPages = page.totalPages;
				$scope.lastPage = page.last;
			});
		};

		$scope.addToRank = function(beer) {
			UserService.addBeerToRanking(beer, function(response) {
				console.log(response);
				if(response.message === "Beer added!") {
					beer.ranked = true;
				}
			});
		};

	}])
;


angular.module('beer-buddy-app')

.service('BeerService', [ '$resource', function($resource) {
	
	var baseUrl = "/beers/";
	
	var BeerApi = $resource(baseUrl + '/:id');
	
	var Types = $resource(baseUrl + '/types/:type');
	
	return {
		getPage : function(page, callback) {
			return BeerApi.get({page: page}, callback);
		}
		, get : function(id) {
			return BeerApi.get({id : id});
		}
		, getTypes : function(callback) {
			return Types.query(callback);
		}
		, getType : function(type, page, callback) {
			return Types.get({type: type, page: page}, callback);
		}
		
	};
	
}])

.service('SearchService', [ '$resource', function($resource) {
	
	var baseUrl = "/beers/";
	
	//var BeerApi = $resource(baseUrl + '/:id');
	
	var Names = $resource(baseUrl + '/names/:name');
	
	return {
		getPage : function(page, callback) {
			return BeerApi.get({page: page}, callback);
		}	
//		, get : function(id) {
//			return BeerApi.get({id : id});
//		}
		, getNames : function(callback) {
			return Names.query(callback);
		}
		, getName : function(name, page, callback) {
			return Names.get({name: name, page: page}, callback);
		}
		
	};
	
}])

.service('UserService', [ '$resource', function($resource) {
	
	var baseUrl = "/users";
	
	var UserApi = $resource(baseUrl);
	
	var UsersBeers = $resource(baseUrl + '/beers');
	
	return {
		getPage : function(page, callback) {
			return UserApi.get({page: page}, callback);
		}
		, getUsersBeers : function(page, callback) {
			return UsersBeers.get({page: page}, callback);
		}
		, addBeerToRanking : function(beer, callback) {
			return new UsersBeers(beer).$save(function(response) {
				callback(response);
			});
		}
	};
	
}])
;