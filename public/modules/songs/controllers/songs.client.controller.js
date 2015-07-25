'use strict';

// Songs controller
angular.module('songs').controller('SongsController', ['$scope', '$stateParams', '$location' ,'Authentication', 'Songs', '$sce','$mdSidenav','$mdUtil', '$timeout', '$filter',
    function($scope, $stateParams, $location, Authentication, Songs, $sce, $mdSidenav, $mdUtil, $timeout, $filter) {
        $scope.authentication = Authentication;

        /*this.config = {
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"), type: "audio/mpeg"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.ogg"), type: "audio/ogg"}
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            }
        };*/


        var controller = this;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;

        controller.onPlayerReady = function(API) {
            controller.API = API;
        };

        controller.onCompleteVideo = function() {
            console.log('controller.videos.sources : ' + controller.videos.sources);
            controller.isCompleted = true;

            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

            controller.setVideo(controller.currentVideo);
        };

        controller.videos = [];

        /*controller.videos = [


            {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://www.schillmania.com/projects/soundmanager2/demo/_mp3/rain.mp3"), type: "audio/mpeg"}
                ]
            },
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://www.schillmania.com/projects/soundmanager2/demo/_mp3/walking.mp3"), type: "audio/mpeg"}
                ]
            }
        ];*/

        /*controller.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: controller.videos[0].sources,
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };*/

        controller.setVideo = function(index) {
            controller.API.stop();
            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 100);
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

            $scope.songs = Songs.query(function(data){

                console.log(data);

                data.forEach(function(song){

                    console.log('song: ' + song.url);
                    controller.videos.push(
                        {
                            sources: [
                                {src: $sce.trustAsResourceUrl(song.url), type: "audio/mpeg"}
                            ]
                        }
                    )

                    console.log('controller.videos : ' + controller.videos);

                });

                controller.config = {
                    preload: "none",
                    autoHide: false,
                    autoHideTime: 3000,
                    autoPlay: false,
                    sources: controller.videos[0].sources,
                    theme: {
                        url: "lib/videogular-themes-default/videogular.css"
                    },
                    plugins: {
                        poster: "http://www.videogular.com/assets/images/videogular.png"
                    }
                };
            });

//            $scope.songs = $filter('orderBy')($scope.songs, 'score');

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
