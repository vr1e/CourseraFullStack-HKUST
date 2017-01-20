angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.reservation = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };

    // Create the login modal
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeReserve = function() {
      $scope.reserveform.hide();
    };

    // Open the login modal
    $scope.reserve = function() {
      $scope.reserveform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doReserve = function() {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    };

  })

  .controller('MenuController', ['$scope', 'dishes', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = dishes;


    $scope.select = function(setTab) {
      $scope.tab = setTab;

      if (setTab === 2) {
        $scope.filtText = "appetizer";
      } else if (setTab === 3) {
        $scope.filtText = "mains";
      } else if (setTab === 4) {
        $scope.filtText = "dessert";
      } else {
        $scope.filtText = "";
      }
    };

    $scope.isSelected = function(checkTab) {
      return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function(index) {
      console.log("index is " + index);

      favoriteFactory.addToFavorites(index);
      $ionicListDelegate.closeOptionButtons();

      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.schedule({
          id: 1,
          title: "Added Favorite",
          text: $scope.dishes[index].name
        }).then(function() {
            console.log('Added Favorite' + $scope.dishes[index].name);
          },
          function() {
            console.log('Failed to add Favorite ');
          });

          $cordovaToast
            .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
            .then(function (success) {
                // success
            }, function (error) {
                // error
            });

      });
    }
  }])

  .controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {
      mychannel: "",
      firstName: "",
      lastName: "",
      agree: false,
      email: ""
    };

    var channels = [{
      value: "tel",
      label: "Tel."
    }, {
      value: "Email",
      label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', '$ionicPopover', '$ionicModal', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function($scope, $stateParams, dish, menuFactory, favoriteFactory, $ionicPopover, $ionicModal, favoriteFactory, baseURL, $ionicListDelegate) {

    $scope.baseURL = baseURL;
    $scope.dish = {};

    $scope.dish = dish;

    // add Favorites popover
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.addFavorite = function(index) {
      console.log("index is " + index);

      favoriteFactory.addToFavorites(index);
      $scope.popover.hide();
    };

    // add Comments modal
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.popover.hide();
    };


    $scope.mycomment = {
      rating: 5,
      comment: "",
      author: "",
      date: ""
    };
    $scope.submitComment = function() {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.update({
        id: $scope.dish.id
      }, $scope.dish);
      //$scope.$setPristine();
      $scope.closeModal();
    }

  }])

  .controller('IndexController', ['$scope', 'leader', 'dish', 'promotion', 'menuFactory', 'corporateFactory', 'promotionFactory', 'baseURL', function($scope, leader, dish, promotion, menuFactory, corporateFactory, promotionFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

  }])

  .controller('AboutController', ['$scope', 'leaders', 'corporateFactory', 'baseURL', function($scope, leaders, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = leaders;
    console.log($scope.leaders);

  }])

  .controller('FavoritesController', ['$scope', '$localStorage', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function($scope, $localStorage, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    // $scope.favorites = $localStorage.getObject('favorites','{}');
    $scope.favorites = favorites;

    $scope.dishes = dishes;

    $scope.toggleDelete = function() {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function(index) {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          console.log('Ok to delete');
          favoriteFactory.deleteFromFavorites(index);
        } else {
          console.log('Canceled delete');
        }
      });
      $scope.shouldShowDelete = false;
    }
  }])

  .filter('favoriteFilter', function() {
    return function(dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }
  });
