(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
    .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
      var ddo = {
          templateUrl: 'foundItems.html',
          scope: {
              items: '<',
              onRemove: '&'
          },
          controller: FoundItemsDirectiveController,
          controllerAs: 'ctrl',
          bindToController: true
      };

      return ddo;
  }

  function FoundItemsDirectiveController() {
      var ctrl = this;

      ctrl.IsEmpty = function() {
        if (ctrl.items != undefined && ctrl.items.length === 0) {
          return true;
        }

        return false;
      };
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
      var ctrl = this;

      ctrl.SearchTerm = "";
     // ctrl.FoundItems = [];

      ctrl.applySearch = function() {
          var promise = MenuSearchService.getMatchedMenuItems(ctrl.SearchTerm);

          promise.then(function(result) {
              ctrl.FoundItems = result;
          });
      };

      ctrl.remove = function (index) {
          ctrl.FoundItems.splice(index, 1)[0];
      };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
      var service = this;

      service.getMatchedMenuItems = function (searchTerm) {
          return $http({
              method: "GET",
              url: ApiBasePath
          }).then(function (result) {
              var returnedItems = result.data.menu_items;
              var foundItems = [];

              for (var i = 0; i < returnedItems.length; i++) {
                  if (searchTerm != "" && returnedItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                      foundItems.push(returnedItems[i]);
                  }
              }

              return foundItems;
          });
      };
  }

})();
