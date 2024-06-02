// Tạo một module AngularJS tên là 'musicApp'
var app = angular.module('musicApp', []);

// Tạo controller 'MusicController' cho module 'musicApp'
app.controller('MusicController', function ($scope, $http) {
    $scope.songs = [];  // Mảng lưu danh sách bài hát
    $scope.currentSong = {};  // Đối tượng lưu bài hát hiện tại
    $scope.isPlaying = false;  // Trạng thái phát nhạc

    var audioPlayer = document.getElementById('audioPlayer');  // Phần tử audio
    var seekBar = document.getElementById('seekBar');  // Thanh kéo để tua nhạc
    var currentTime = document.getElementById('currentTime');  // Thời gian hiện tại của bài hát
    var duration = document.getElementById('duration');  // Thời lượng bài hát
    var volumeBar = document.getElementById('volumeBar');  // Thanh kéo điều chỉnh âm lượng

    // Hàm lấy tên file từ URL
    function getFileNameFromUrl(url) {
        var fileName = url.substring(url.lastIndexOf('/') + 1);
        return fileName.replace('.mp3', '');
    }

    // Gửi yêu cầu HTTP để lấy dữ liệu từ 'db.json'
    $http.get('db.json').then(function (response) {
        $scope.songs = response.data.songs;  // Lưu danh sách bài hát từ dữ liệu nhận được
        $scope.songs.forEach(function (song) {
            if (!song.title) {
                song.title = getFileNameFromUrl(song.url);  // Nếu bài hát chưa có tiêu đề, lấy tên file làm tiêu đề
            }
        });
        if ($scope.songs.length > 0) {
            $scope.currentSong = $scope.songs[0];  // Đặt bài hát đầu tiên là bài hát hiện tại
        }
    });

    // Hàm phát bài hát
    $scope.playSong = function (song) {
        $scope.currentSong = song;  // Đặt bài hát hiện tại
        audioPlayer.src = song.url;  // Đặt nguồn của audio player
        audioPlayer.load();  // Tải bài hát
        audioPlayer.play();  // Phát bài hát
        $scope.isPlaying = true;  // Đặt trạng thái là đang phát nhạc
    };

    // Hàm chuyển đổi giữa phát và tạm dừng bài hát
    $scope.togglePlay = function () {
        if ($scope.isPlaying) {
            audioPlayer.pause();  // Tạm dừng bài hát
        } else {
            audioPlayer.play();  // Phát bài hát
        }
        $scope.isPlaying = !$scope.isPlaying;  // Thay đổi trạng thái phát nhạc
    };

    // Hàm phát bài hát trước đó
    $scope.prevSong = function () {
        var index = $scope.songs.indexOf($scope.currentSong);
        if (index > 0) {
            $scope.playSong($scope.songs[index - 1]);  // Phát bài hát trước đó trong danh sách
        }
    };

    // Hàm phát bài hát tiếp theo
    $scope.nextSong = function () {
        var index = $scope.songs.indexOf($scope.currentSong);
        if (index < $scope.songs.length - 1) {
            $scope.playSong($scope.songs[index + 1]);  // Phát bài hát tiếp theo trong danh sách
        }
    };

    // Cập nhật thanh kéo và thời gian khi bài hát đang phát
    audioPlayer.addEventListener('timeupdate', function () {
        if (!isNaN(audioPlayer.duration)) {
            seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            currentTime.textContent = formatTime(audioPlayer.currentTime);
            duration.textContent = formatTime(audioPlayer.duration);
        }
    });

    // Thay đổi thời gian bài hát khi người dùng điều chỉnh thanh kéo
    seekBar.addEventListener('input', function () {
        audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
    });

    // Thay đổi âm lượng khi người dùng điều chỉnh thanh kéo âm lượng
    volumeBar.addEventListener('input', function () {
        audioPlayer.volume = volumeBar.value / 100;
    });

    // Tự động phát bài hát tiếp theo khi bài hát hiện tại kết thúc
    audioPlayer.addEventListener('ended', function () {
        $scope.$apply($scope.nextSong);
    });

    // Hàm định dạng thời gian thành phút và giây
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }
});
