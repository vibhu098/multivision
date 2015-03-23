angular.module('app').factory('mvAuth', function($http, mvIdentity, $q, mvUser) {
    return {
        authenticateUser: function(username, password) {
            var dfd = $q.defer();
            $http.post('/login', {username:username, password:password}).then(function(response) {
                console.log("from mvAuth"+response);
                if(response.data.success) {
                    var user = new mvUser();
                    angular.extend(user, response.data.user);
                    mvIdentity.currentUser = user;
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        createUser: function(newUserData) {
            var newUser = new mvUser(newUserData);
            var dfd = $q.defer();

            newUser.$save().then(function() {
                mvIdentity.currentUser = newUser;
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;
        },
        updateCurrentUser: function(newUserData) {
            var clone = angular.copy(mvIdentity.currentUser);
            var dfd = $q.defer();
            angular.extend(clone,newUserData);
            clone.$update().then(function() {
                mvIdentity.currentUser = clone;
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;
        },
        logoutUser: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout:true}).then(function() {
                mvIdentity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function(role) {
            if(!role){
                if(mvIdentity.isAuthenticated()) {
                    return true;
                } else {
                    return $q.reject('not authorized');
                }
            }
            if(mvIdentity.isAuthorized(role)) {
                return true;
            } else {
                return $q.reject('not authorized');
            }

        }
    }
});