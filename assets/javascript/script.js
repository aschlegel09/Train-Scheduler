// Create Firebase link // Initialize Firebase
var config = {
  apiKey: "AIzaSyCQ4bqP78sS7gwXSZSrWG1fD3HfBVRpOeQ",
  authDomain: "train-scheduler0913.firebaseapp.com",
  databaseURL: "https://train-scheduler0913.firebaseio.com",
  projectId: "train-scheduler0913",
  storageBucket: "train-scheduler0913.appspot.com",
  messagingSenderId: "238194712616"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Create initial train data in database
// Create button for adding new trains - then update the html + update the database on button click
$("#add-train").on("click", function() {
    event.preventDefault();
    // Initial Values
    var trainName = $("#trainName-input").val().trim();
    var destination = $("#destination-input").val().trim();
	// sets time train arrives by military time with moment.js
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").subtract(10, "years").format("HH:mm");
    var frequency = $("#frequency-input").val().trim();
    
// object to hold train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

// Uploads train data to the database
database.ref().push(newTrain);

console.log(newTrain.name + " " + newTrain.destination + " " + newTrain.firstTrainTime + " " + newTrain.frequency);

alert("Your train was added to the schedule.");

// CLEAR text boxes
$("#trainName-input").val("");
$("#destination-input").val("");
$("#first-train-time-input").val("");
$("#frequency-input").val("");

return false;
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val()); // destination object
    
    // new variables
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrainTime;
    
	var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxTime = moment.max(moment(), trainTime); // moment.max in favor of moment().max
  	var tMin;
    var tArrival;
	// Current Time
	var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
	
    // var diffTime = moment().diff(moment.unix(tFirstTrain), "minutes");
    // var timeRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
    // var minutes = tFrequency - timeRemainder;
    // var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
    
    // Test for correct times and info
    // console.log(nextTrainArrival);
    
    // var timeInSeconds = moment.unix(currentTime);
   
    // if first train is later than current time, set arrival to first train time
    if (maxTime === trainTime) {

        tArrival = trainTime.format("hh:mm A");
        // console.log("Max Time equals Train Time");
        tMin = trainTime.diff(moment(), "minutes");
		console.log("Train " + "'" + tName + "'" + " arrives in " + tMin + " minute(s).");
		console.log("The next train for " + "'" + tName + "'" + " is arriving at " + tArrival + ".");
    } 
    else {
        var tDifference = moment().diff(moment(trainTime, "HH:mm"), "minutes");
        // console.log(tDifference + " is working");
        
        var tRemainder = tDifference % tFrequency;
        
        tMin = tFrequency - tRemainder;
        console.log("Train " + "'" + tName + "'" + " arrives in " + tMin + " minute(s).");
        
        tArrival = moment().add(tMin, "m").format("hh:mm A");
        console.log("The next train for " + "'" + tName + "'" + " is arriving at " + tArrival + ".");
    }
	
	 // Append train info to table on page
    $("#table-data").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>"+ tFrequency + " mins" + "</td><td>" + tFirstTrain + "</td><td>" + tMin + "</td></tr>");

    });