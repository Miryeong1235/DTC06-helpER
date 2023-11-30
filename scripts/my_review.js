// declare userUid as global variable
var userUid = undefined;

//-------------------------------
// Get name and id from user Auth
//-------------------------------
function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        // if true, call displayCardsDynamically
        if (user) {
            var userUid = user.uid;
            displayCardsDynamically("review", userUid);
        } else {
            console.log('User not logged in')
        }
    })
}

// update userUid global variable when the script loaded
getUserId();


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection, userUid) {

    // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 
    let cardTemplate = document.getElementById("myReviewTemplate");

    //the collection called "review"
    db.collection(collection).get()
        .then(allReviews => {
            //iterate thru each review doc
            allReviews.forEach(doc => {
                let doc_id = doc.id
                // since the doc is is composed of hospital id + user id with "-" in between
                // here we want to search for the doc match with the userUid and add hospital card with this matched portion
                if (doc_id.startsWith(userUid)) {
                    // get the hospital id from the doc id after "-" character
                    let hospitalId = doc_id.split('-')[1];

                    // get the doc of selected hospital in hospitals collection
                    db.collection("hospitals").doc(hospitalId).get().then(hospital_doc => {
                        // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
                        let newcard = cardTemplate.content.cloneNode(true);
                        // Extract number of star in integer
                        let rating = parseInt(doc.data().rating.split(' stars')[0]);
                        //update title and review content
                        newcard.querySelector('#reviewHospitalName').innerHTML = hospital_doc.data().name;
                        newcard.querySelector('#reviewStar').innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);;
                        newcard.querySelector('#reviewContent').innerHTML = doc.data().comment;
                        document.getElementById(collection + "-go-here").appendChild(newcard);
                    })
                }

            })
        })
}

