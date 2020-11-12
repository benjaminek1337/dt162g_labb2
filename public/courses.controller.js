// AngularJS-kod som vi går igenom mer i detalj i sektion 4. 
// Fokusera på $scope i funktionen successCallBack i den här laborationen.

angular.module('myCoursesApp', []) // Läs 1 nedan
    .controller('CoursesController', function CourseController($scope, $http) { // Läs 2 nedan
        $http.get("/api/courses") // Läs 3 nedan
            .then(function successCallback(response) { // Läs 4 nedan
                // this callback will be called asynchronously
                // when the response is available
                
                // För att underlätta användningen av data i response lagrar vi det i en variabel
                const data = response.data;
                console.log(data);
                // Läs 5 nedan
                $scope.courses = data;
            },
                function errorCallback(response) { // Läs 6 nedan
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Error reading kurser.json! response=" + JSON.stringify(response));
                }
            );
    }
    );

/*
1.
    Från dokumentationen av AngularJS finner vi att:

    "You can think of a module as a container for the different parts of your app – controllers, services, filters,
    directives, etc."

    I det här läget av kursen kan vi se det som startpunkten för vår app med namnet myCoursesApp.

2.
    Från AngularJS läser vi att: "Controllers are the behavior behind the DOM elements".

    Här skapar vi en ny controller med namnet MyCoursesController. AngularJS kommer att skicka ett $scope-objekt
    när vår controller skapas. Från dokumentationen av AngularJS finner vi att:

    "The $scope in an AngularJS is a built-in object, which contains application data and methods. You can create
    properties to a $scope object inside a controller function and assign a value or function to it. The $scope is
    glue between a controller and view (HTML)."

    Utöver $scope väljer vi att inkludera $http i vår MyCoursesController. Från dokumentationen av AngularJS finner vi att:

    "The $http service is a core AngularJS service that facilitates communication with the remote HTTP servers via
    the browser's XMLHttpRequest object or via JSONP."

3.
    Via $http och dess metod get (utför en GET-begäran) kan vi läsa resurer via den url som anges som första argument.
    I det här fallet är resursen filen courses.json (som nu ligger i samma katalog som denna fil, men url kan lika gärna
    vara till en publik webbserver där json-filen ligger).

    Metoden get är en så kallad asynkron metod som returnerar sitt värde "någon gång i framtiden" som en Promise. När en
    Promise returneras av en metod har den antingen tillståndet "fulfilled" (med ett värde) eller "rejected" (med ett error).

    (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

4.
    På ett Promise kan vi anropa metoden "then" och som argument skickar vi två "callback functions" för de två tillstånd
    Promise kan ha. Den första callback anropas vid tillståndet "fulfilled/success" och den andra callback anropas vid
    tillståndet "rejected/failure ".

5.
    Som nämnts ovan i punkt 2 används $scope som klistret mellan appens logik och vyn (html-sidan). Till $scope kan du addera
    egna egenskaper (värden/variabler) och beteenden (funktioner). I detta exempel lägger vi värdet (value) från information
    (key) i courses.json till $scope.information. All kursdata från courses.json lägger vi i $scope.courses. Variablerna information
    och courses blir nu åtkomliga från t.ex. index.html.

6.
    Normalt ska vi hantera alla typer av errors i en app och meddela användaren på lämpligt sätt om dessa. Nu loggar vi bara
    till konsolen att det inte gick att läsa från filen.
*/