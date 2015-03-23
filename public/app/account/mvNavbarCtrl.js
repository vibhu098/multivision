angular.module('app').controller('mvNavbarCtrl',function($scope,$http){
    $scope.signin=function(username,password){
        $http.post('/login',{userName:username,password:password}).then(function(response){
            if(response.data.success){
                console.log('logged in')
            }else{
                console.log('logging fail');
            }
        })
    };
});