var app = angular.module('musicApp', []);

app.controller('MusicController', function ($scope, $http) {
    $scope.songs = [];
    $scope.currentSong = {};
    $scope.isPlaying = false;

    var audioPlayer = document.getElementById('audioPlayer');
    var seekBar = document.getElementById('seekBar');
    var currentTime = document.getElementById('currentTime');
    var duration = document.getElementById('duration');
    var volumeBar = document.getElementById('volumeBar');

    function getFileNameFromUrl(url) {
        var fileName = url.substring(url.lastIndexOf('/') + 1);
        return fileName.replace('.mp3', '');
    }

    $http.get('db.json').then(function (response) {
        $scope.songs = response.data.songs;
        $scope.songs.forEach(function (song) {
            if (!song.title) {
                song.title = getFileNameFromUrl(song.url);
            }
        });
        if ($scope.songs.length > 0) {
            $scope.currentSong = $scope.songs[0];
        }
    });

    $scope.playSong = function (song) {
        $scope.currentSong = song;
        audioPlayer.src = song.url;
        audioPlayer.load();
        audioPlayer.play();
        $scope.isPlaying = true;
    };

    $scope.togglePlay = function () {
        if ($scope.isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        $scope.isPlaying = !$scope.isPlaying;
    };

    $scope.prevSong = function () {
        var index = $scope.songs.indexOf($scope.currentSong);
        if (index > 0) {
            $scope.playSong($scope.songs[index - 1]);
        }
    };

    $scope.nextSong = function () {
        var index = $scope.songs.indexOf($scope.currentSong);
        if (index < $scope.songs.length - 1) {
            $scope.playSong($scope.songs[index + 1]);
        }
    };

    audioPlayer.addEventListener('timeupdate', function () {
        if (!isNaN(audioPlayer.duration)) {
            seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            currentTime.textContent = formatTime(audioPlayer.currentTime);
            duration.textContent = formatTime(audioPlayer.duration);
        }
    });

    seekBar.addEventListener('input', function () {
        audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
    });

    volumeBar.addEventListener('input', function () {
        audioPlayer.volume = volumeBar.value / 100;
    });

    audioPlayer.addEventListener('ended', function () {
        $scope.$apply($scope.nextSong);
    });

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }
});
