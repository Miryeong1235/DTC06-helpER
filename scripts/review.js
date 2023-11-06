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

function writeReview(url) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            hospitalid = url.split("?")[1];
            console.log(user.uid + "-" + hospitalid);
            var review = db.collection('review').doc(user.uid + "-" + hospitalid);
            var star = document.getElementsByName("rate");
            for (i=0; i < star.length; i++) {
                if (star[i].checked) {
                    star_id = star[i].getAttribute('id');
                    star_val = $(`#${star_id}Label`).text();
                    break;
            }}
            review.set({
                rating: star_val,
                comment: $("#exampleFormControlTextarea1").val()
            })
        }
        else {
            console.log('logout')
        }
    })
}


