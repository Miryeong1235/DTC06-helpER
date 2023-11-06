// Hospital review data
function reviewHospitals() {
    // define a variable for the collection you want to create in Firestore to populate data
    var reviewsRef = db.collection("reviews");

    reviewsRef.add({
        name: "Vancouver General Hospital",
        rating: "4",
        comment: "Service was prompt and staff were friendly.",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("November 1, 2023"))
    });
    reviewsRef.add({
        name: "UBC Hospital",
        rating: "3",
        comment: "Wait was very long, but the doctor was kind.",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("October 22, 2023"))
    });
    reviewsRef.add({
        name: "St. Paul's Hospital",
        rating: "4",
        comment: "Decent service and clean facilities.",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("September 5, 2023"))
    });
}

function writeReview() {
    user = firebase.auth().currentUser;

    var user_profile = db.collection('review').doc(user.uid + "-" + );
    comment: $("#exampleFormControlTextarea1").val()    
}