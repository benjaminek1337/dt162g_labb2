
angular.module('myCoursesApp', [])
    .controller('MyCoursesController', function MyCourseController($scope, $http) { // Läs 2 nedan
        $scope.getAllCourses = () => {
            $http.get("/api/my/courses")
                .then(function successCallback(response) {
                    const data = response.data;
                    console.log(data);
                    $scope.myCourses = data;
                },
                function errorCallback(response) { 
                    console.log("Error reading kurser.json! response= " + JSON.stringify(response));
                }
            );
        };
        $scope.addCourse = () => {
            if ($scope.done != true){
                $scope.done = false;
            }
            const data = {
                courseCode: $scope.courseCode,
                done: $scope.done
            };
            $http.post("/api/my/courses/add", data)
                .then(function successCallback(response) {
                    if(response.status == 200)
                        $scope.getAllCourses();
                },
                function errorCallback(response){
                    if(response.status == 403) 
                        return alert("403, forbidden request. Ajabajja... \nAnge kurskod som finns hos MIUN, och till kurs som jag inte redan läst")
                    else if(response.status == 404){
                        return alert("404, hittade ingen kurs att lägga till")
                    }
                }
            );
        };
        $scope.removeCourse = (courseCode) => {
            $http.delete("/api/my/courses/" + courseCode)
                .then(function successCallBack(response) {
                    if(response.status == 200)
                        $scope.getAllCourses();
                },
                function errorCallback(response) {
                    console.log("Error deleting course. Response=" + JSON.stringify(response));
                }
            );
        };
        $scope.updateCourse = (courseCode, completed) => {
            const data = {done: !completed};
            $http.put("/api/my/courses/" + courseCode, data)
                .then(function successCallBack(response) {
                    if(response.status == 200)
                        $scope.getAllCourses();
                },
                function errorCallback(response) {
                    console.log("Error updating course. Response=" + JSON.stringify(response));
                }
            );
        };
        $scope.isCompleted = (completed) => {
            if(completed)
                return true;
            else
                return false;
        };
    }
    );