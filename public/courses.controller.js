angular.module('myCoursesApp', [])
    .controller('CoursesController', function CourseController($scope, $http) {
        $http.get("/api/courses")
            .then(function successCallback(response) {
                const data = response.data;
                $scope.courses = data;
            },
                function errorCallback(response) { 
                    console.log("Error reading kurser.json! response=" + JSON.stringify(response));
                }
            );
    }
    );