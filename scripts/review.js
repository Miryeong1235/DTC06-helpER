// Hospital review data for one time use
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


// ------------------------------
// Write a review to Firestore
// ------------------------------
function writeReview(url) {
    // define a variable for the collection you want to create in Firestore to populate data
    firebase.auth().onAuthStateChanged(user => {
        if (user) { // if user is logged in, write review to Firestore
            hospitalid = url.split("?docID=")[1];
            console.log(user.uid + "-" + hospitalid);
            var review = db.collection('review').doc(user.uid + "-" + hospitalid);
            var star = document.getElementsByName("rate");
            for (i = 0; i < star.length; i++) { // iterate through each star
                if (star[i].checked) {
                    star_id = star[i].getAttribute('id');
                    star_val = $(`#${star_id}Label`).text();
                    break;
                }
            }
            review.set({ // write review to Firestore
                rating: star_val,
                comment: $("#exampleFormControlTextarea1").val()
            })
                .then(function () { // redirect to main page after review is written
                    console.log("review updated");
                    alert('Thank you for taking the time to review! Your comments are valuable to us.')
                    window.location.assign("main.html");
                }).catch(function (error) {
                    console.log("Error adding review: " + error);
                })
        }
        else { // if user is not logged in, redirect to login page
            console.log('logout')
        }
    })
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection, hospitalId, starFilter = '1 stars') {
    db.collection("hospitals").doc(hospitalId).get().then(doc => { // Retrieve hospital document from hospitals collection in firestore
        hospitalName = doc.data().name;
    })

    let cardTemplate = document.getElementById("reviewTemplate"); // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 
    document.getElementById(collection + "-go-here").innerHTML = '';
    db.collection(collection).where('rating', '>=', starFilter).get()   //the collection called "hospitals"
        .then(allReviews => {
            console.log(allReviews)
            allReviews.forEach(doc => { //iterate thru each doc
                console.log(doc, 'doc')
                let doc_id = doc.id
                // since the doc is is composed of hospital id + user id with "-" in between, here we want to search for the doc match with the hospitalId and add hospital card with this matched portion
                if (doc_id.includes('-' + hospitalId)) { 
                    var title = hospitalName;
                    var rating = parseInt(doc.data().rating.split(' stars')[0]);
                    var stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                    var comments = doc.data().comment;
                    let newcard = cardTemplate.content.cloneNode(true);

                    //update title and text and image
                    newcard.querySelector('#reviewHospitalName').innerHTML = title;
                    newcard.querySelector('#reviewStar').innerHTML = stars;
                    newcard.querySelector('#reviewContent').innerHTML = comments;

                    document.getElementById(collection + "-go-here").appendChild(newcard);
                }

            })

            // if no match, display "No Match"
            if (document.getElementById(collection + "-go-here").innerHTML == '') {
                document.getElementById(collection + "-go-here").innerHTML = 'No Match <br> <br>'
            }
        })
    
}

//-------------------------------
// Filter by rating
//-------------------------------
function filterByRating(selectObject) {
    var value = selectObject.value
    console.log(value, 'the button selected');
    // display cards based on the selected value
    displayCardsDynamically("review", hospitalId, `${value} stars`)
}

