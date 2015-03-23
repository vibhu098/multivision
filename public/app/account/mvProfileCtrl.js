angular.module('app').controller('mvProfileCtrl', function($scope, mvUser, mvNotifier, $location, mvAuth,mvIdentity) {
        $scope.fname=mvIdentity.currentUser.firstName;
    $scope.lname=mvIdentity.currentUser.lastName;
    $scope.email=mvIdentity.currentUser.username;

    $scope.update=function(){
      var newUserData={
          firstName:$scope.fname,
          lastName:$scope.lname,
          username:$scope.email
      };
        if($scope.password && $scope.password.length>0){
            newUserData.password=$scope.password;
        }

        mvAuth.updateCurrentUser(newUserData).then(
            function(){
                mvNotifier.notify("your account has been modified");
            },
            function (reason) {
                mvNotifier.error(reason);
            });
    };

})