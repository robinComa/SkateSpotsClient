function isConnected($rootScope, $location){
	if(!$rootScope.user){
		$location.path('/');
	}
	return true;
}

function LoginCtrl($rootScope, $scope, $location, $routeParams, $http, User){
	var auth = new Auth();
	auth.init();
	auth.onAuthCallback = function(social_user){
		console.log(social_user)
		$http.defaults.headers.common["Authorization"] = window.btoa(social_user.id);
		User.login({}, function(data){
			$rootScope.user = data;
			$location.path('/user/show/'+$rootScope.user.id);
		}, function(){
			$rootScope.social_user = social_user;
			$location.path('/user/create');
		});
	}
}

function LogoutCtrl($rootScope, $scope, $location, $http){
	if(isConnected($rootScope, $location)){
		$http.defaults.headers.common["Authorization"] = '';
		delete $rootScope['user'];
		$location.path('/');
	}
}

function UserCreateCtrl($rootScope, $scope, $location, User){
	if($rootScope.social_user){
		$scope.name = $rootScope.social_user.name;
		$scope.onCreateUser = function(){
			$rootScope.util.getUserPosition(function(currentCoordinates){
				if(currentCoordinates){
					User.create({
						clientId : $scope.social_user.id,
						social : $rootScope.social_user.social,
						name : $scope.name,
						email : $rootScope.social_user.email,
						avatar : $rootScope.social_user.avatar,
						coordinates : currentCoordinates
					}, function(data){
						$rootScope.user = data;
						$location.path('/user/show/'+$rootScope.user.id);
					}, function(){
						$rootScope.alert = {
							show : true,
							type : 'alert-error',
							message : $rootScope.i18n.get('user.create.error')
						};
					});
				}else{
					$rootScope.alert = {
						show : true,
						type : 'alert-error',
						message : $rootScope.i18n.get('gps.active.error')
					};
				}
			});
		};
	}else{
		$location.path('/');
	}
}

function UserUpdateCtrl($rootScope, $scope, $location, $routeParams, User){
	if(isConnected($rootScope, $location)){
		$scope.size = $rootScope.user.board?$rootScope.user.board.size.replace('.', ','):'';
		$scope.name = $rootScope.user.board?$rootScope.user.board.name:'';
		$scope.onUpdateBoardInfo = function(){
			User.updateBoardInfo({
				size : this.size,
				name : this.name
			}, function(){
				$rootScope.user.board.name = $scope.name;
				$rootScope.user.board.size = $scope.size.toString().replace(',', '.');
				$location.path('/user/show/'+$rootScope.user.id);
			}, function(){
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('user.update.board.size.error')
				};
			});
		};
	}
}

function UserListCtrl($rootScope, $scope, $location, User){
	if(isConnected($rootScope, $location)){
		$rootScope.util.getUserPosition(function(currentCoordinates){
			currentCoordinates = currentCoordinates?currentCoordinates:$rootScope.user.coordinates;
			var map = new Map(currentCoordinates, 13);
			map.onLayerChange(function(layerBounds){
				User.getByCoordinatesFrame({coordinate:layerBounds}, function(users){
					map.removeAllMarkers();
					updateUsers(users);
				});
			});
			
			var updateUsers = function(users){
				$scope.users = $rootScope.util.needArray(users.user);
				for(var i in $scope.users){
					map.addMarker($scope.users[i].coordinates, {
						title : $scope.users[i].name,
						link : '#/user/show/'+$scope.users[i].id
					});
				}
			};
			
			User.getByCoordinatesFrame({coordinate:map.getLayerBounds()}, function(users){
				updateUsers(users);
			});
		});		
	}
}

function UserShowCtrl($rootScope, $scope, $location, $routeParams, User, Spot){
	if(isConnected($rootScope, $location)){
		$scope.isOwner = ($routeParams.id == $rootScope.user.id);
		
		var initMap = function (user){
			var map = new Map(user.coordinates);
			map.addCircle(user.coordinates);
			$scope.user.checkin = $rootScope.util.needArray(user.checksin);
			for(var i in $scope.user.checkin){
				map.addMarker($scope.user.checkin[i].spot.coordinates, 'SPOT');
			}
		}
		
		if($scope.isOwner){
			$scope.currentUser = $rootScope.user;
			initMap($scope.currentUser);
		}else{
			$scope.currentUser = User.get({id : $routeParams.id}, function(){
				initMap($scope.currentUser);
			});
		}
		
		$scope.onCheckIn = function(){
			$rootScope.util.getUserPosition(function(currentCoordinates){
				Spot.getByCoordinates(currentCoordinates, function(spots){
					spots = $rootScope.util.needArray(spots.spot);
					if(spots.length == 0){
						$rootScope.alert = {
							show : true,
							type : 'alert-warning',
							message : $rootScope.i18n.get('user.checkin.empty')
						};
						return;
					}
					$scope.checkInChoose = true;
					$scope.user.checkin = spots;
				});
			}, function(message){
				$rootScope.alert = {
						show : true,
						type : 'alert-error',
						message : message
					};
			});
		};
		
		$scope.onCheckInSpotChoose = function(spotId){
			User.addCheckIn({id : spotId}, function(checkin){
				$scope.checkInChoose = false;
				$rootScope.user.checksin.push(checkin);
			}, function(){
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('user.add.checkin.error')
				};
			});
		}
	}
}

function SpotListCtrl($rootScope, $scope, $location, Spot){
	if(isConnected($rootScope, $location)){
		$rootScope.util.getUserPosition(function(currentCoordinates){
			currentCoordinates = currentCoordinates?currentCoordinates:$rootScope.user.coordinates;
			var map = new Map(currentCoordinates, 13);
			map.onLayerChange(function(layerBounds){
				Spot.getByCoordinatesFrame({coordinate:layerBounds}, function(spots){
					map.removeAllMarkers();
					updateSpots(spots);
				});
			});
			
			var updateSpots = function(spots){
				$scope.spots = $rootScope.util.needArray(spots.spot);
				for(var i in $scope.spots){
					map.addMarker($scope.spots[i].coordinates, {
						title : $scope.spots[i].name,
						link : '#/spot/show/'+$scope.spots[i].id
					});
				}
			};
			
			Spot.getByCoordinatesFrame({coordinate:map.getLayerBounds()}, function(spots){
				updateSpots(spots);
			});
		});		
	}
}

function SpotShowCtrl($rootScope, $scope, $location, $routeParams, Spot){
	if(isConnected($rootScope, $location)){
		Spot.get({id:$routeParams.id}, function(spot){
			spot.pictures = $rootScope.util.needArray(spot.pictures);
			spot.comments = $rootScope.util.needArray(spot.comments);
			spot.alreadyLike = spot.alreadyLike == 'true';
			$scope.spot = spot;
			var map = new Map($scope.spot.coordinates);
			map.addMarker($scope.spot.coordinates);
			if(spot.pictures.length > 0){
				$scope.hasPicture = true;
				$('.carousel').carousel();
			}
		});
		
		$scope.onLike = function(){
			if($scope.spot.alreadyLike){
				Spot.like({id:$routeParams.id});
				$scope.spot.nbLikes --;
				$scope.spot.alreadyLike = false;
			}else{
				Spot.like({id:$routeParams.id});
				$scope.spot.nbLikes ++;
				$scope.spot.alreadyLike = true;
			}
		};
				
		$scope.onComment = function(){
			var comment = {
				id : $routeParams.id,
				user : {
					id : $rootScope.user.id,
					avatar : $rootScope.user.avatar
				},
				comment : this.comment,
				date : (new Date()).getTime()
			};
			var parent = this;
			Spot.createComment(comment, function(com){
				$scope.spot.comments.push(com);
				parent.comment = '';
			}, function(){
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('comment.create.error')
				};
			});
		};
		
		$scope.onSpotDescriptionChange = function(){
			Spot.updateDescription({id: $scope.spot.id,description:this.spot.description}, function(){
				$scope.descriptionUpdate = false;
			}, function(){
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('spot.update.description.error')
				};
			});
		};
		
		$scope.onDeleteComment = function(comment){
			Spot.deleteComment({id:comment.id}, function(){
				$scope.spot.comments.splice($scope.spot.comments.indexOf(comment), 1);
			}, function(){
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('comment.delete.error')
				};
			});
		};
	}
}

function SpotCreateCtrl($rootScope, $scope, $location, Spot){
	if(isConnected($rootScope, $location)){
		var currentCoordinates = null;
		$rootScope.util.getUserPosition(function(currentCoord){
			currentCoordinates = currentCoord;
			var map = new Map(currentCoordinates, 15);
			map.addMarker(currentCoordinates);
		});
		$scope.onCreate = function(){
			if(currentCoordinates){
				Spot.create({
					name : this.name,
					description : this.description,
					coordinates : currentCoordinates
				}, function(spot){
					$location.path('/spot/show/'+spot.id);
				}, function(){
					$rootScope.alert = {
						show : true,
						type : 'alert-error',
						message : $rootScope.i18n.get('spot.conflit.error')
					};
				});
			}else{
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('gps.active.error')
				};
			}
		};
	}
}

function PictureCreateCtrl($rootScope, $scope, $location, $routeParams, Picture){
	if(isConnected($rootScope, $location)){
		
		$scope.callback = {
			controller : $routeParams.controller,
			id : $routeParams.id,
		}
		
		$scope.init = true;
		
		$scope.postImage = function(){
			$scope.disabled = true;
			Picture.put({
				resource : $routeParams.controller,
				method : $routeParams.method,
				id : $routeParams.id,
				src : (document.getElementById('input-picture-64')).value
			}, function(){
				$location.path($routeParams.controller+'/show/'+$routeParams.id);
			}, function(){
				$scope.disabled = false;
				$rootScope.alert = {
					show : true,
					type : 'alert-error',
					message : $rootScope.i18n.get('picture.create.error')
				};
			});
		}
		
		var cleanPicture = function cleanPicture(){
			$('#picture-preview').removeClass('img-polaroid').removeClass('span10').removeClass('offset1').attr('src', '');
			$('#input-picture-64').val('');
			$scope.hasPicture = false;
		}
				
		var onSuccessPicture = function (imageURI) {
			if($rootScope.isMobile){
				imageURI = 'data:image/jpeg;base64,' + imageURI;
			}
			$('#picture-preview').addClass('img-polaroid span10 offset1').attr('src', imageURI);
			$('#input-picture-64').val(imageURI);
			$scope.$apply(function($scope) {
				$scope.hasPicture = true;
			});
		}
		var onFailPicture = function (message) {
			$rootScope.alert = {
				show : true,
				type : 'alert-warnig',
				message : message
			};
		}
		
		$scope.setPicture = function(oFile) {
			$scope.wait = true;
			$scope.$apply(function($scope) {
				cleanPicture();
				var rFilter = /^(image\/jpeg|image\/png)$/i;
				if (! rFilter.test(oFile.type) || oFile.size > 1048576 * 6) {
				    $scope.error = true;
				    $scope.success = false;
				    return;
			    }
			    $scope.error = false;
			    $scope.success = true;
			    var oReader = new FileReader();
			    oReader.onload = function(e){
			    	onSuccessPicture(e.target.result);
			    };
			    oReader.readAsDataURL(oFile);
			});
		};
				
		$scope.camera = function(){
			cleanPicture();
			navigator.camera.getPicture(onSuccessPicture, onFailPicture, {
				quality: 20, 
				sourceType: Camera.PictureSourceType.CAMERA,
			    destinationType: Camera.DestinationType.DATA_URL
			}); 
		};
		$scope.gallery = function(){
			cleanPicture();
			navigator.camera.getPicture(onSuccessPicture, onFailPicture, {
				quality: 20,
				sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
			    destinationType: Camera.DestinationType.DATA_URL
			}); 	
		};
	}
}