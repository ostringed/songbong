'use strict';

// Songs controller
angular.module('songs').controller('SongsController', ['$scope', '$stateParams', '$location' ,'Authentication', 'Songs', '$sce','$mdSidenav','$mdUtil',
	function($scope, $stateParams, $location, Authentication, Songs, $sce,$mdSidenav,$mdUtil) {
		$scope.authentication = Authentication;

        this.config = {
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"), type: "audio/mpeg"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.ogg"), type: "audio/ogg"}
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            }
        };

		// Create new Song
		$scope.create = function() {
			// Create new Song object
			var song = new Songs ({
				name: this.name,
                link: this.link,
				score:50
			});

			// Redirect after save
			song.$save(function(response) {
				if($scope.songs && $scope.songs.length>0){
					$scope.songs.push(song)
				}else{
					$scope.songs=[song]
				}
				$scope.close()

				// Clear form fields
//				$scope.name = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Remove existing Song
            $scope.remove = function(song) {
                if ( song ) {
                    song.$remove();

                    for (var i in $scope.songs) {
                        if ($scope.songs [i] === song) {
                            $scope.songs.splice(i, 1);
                        }
                    }
                } else {
                    $scope.song.$remove(function() {
                        $location.path('songs');
                    });
                }
            };

		// Update existing Song
		$scope.update = function() {
			var song = $scope.song;

			song.$update(function() {
				//$location.path('songs/' + song._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

            // Find a list of Songs
            $scope.find = function() {
                $scope.songs = Songs.query();
            };

            // Find existing Song
            $scope.findOne = function() {
                $scope.song = Songs.get({
                    songId: $stateParams.songId
                });
            };

            $scope.sanitizeURL = function(htmlCode){
                $scope.sanitizedURL = $sce.trustAsResourceUrl(htmlCode);
            }

            $scope.close = function () {
                $mdSidenav('right').close()
                    .then(function () {
                        console.debug("close RIGHT is done");
                    });
            };
            $scope.toggleRight = buildToggler('right');
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildToggler(navID) {
                var debounceFn =  $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            console.log("toggle " + navID + " is done");
                        });
                },300);
                return debounceFn;
            }
		$scope.ratingChanged=function(song){
			$scope.song=song
			$scope.update()
		}

        }
    ]);
