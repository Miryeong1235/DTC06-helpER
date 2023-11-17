var userUid = undefined;
var favouriteDocRef = undefined;

function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            var userUid = user.uid;
            displayCardsDynamically("review", userUid);
        } else {
            console.log('User not logged in')
        }
    })
}

getUserId();


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection, userUid) {
    

    let cardTemplate = document.getElementById("myReviewTemplate"); // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "review"
        .then(allReviews => {
            allReviews.forEach(doc => { //iterate thru each doc
                let doc_id = doc.id
                if (doc_id.startsWith(userUid)) {
                    let hospitalId = doc_id.split('-')[1];
                    db.collection("hospitals").doc(hospitalId).get().then(hospital_doc => {
                        console.log(doc.data(), '====');
                        let newcard = cardTemplate.content.cloneNode(true);
                        let rating = parseInt(doc.data().rating.split(' stars')[0]);
                        newcard.querySelector('#reviewHospitalName').innerHTML = hospital_doc.data().name;
                        newcard.querySelector('#reviewStar').innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);;
                        newcard.querySelector('#reviewContent').innerHTML = doc.data().comment;
                        document.getElementById(collection + "-go-here").appendChild(newcard);
                    })
                    // title = hospitalName;
                    // var rating = parseInt(doc.data().rating.split(' stars')[0]);
                    // var stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                    // var comments = doc.data().comment;
                    // let newcard = cardTemplate.content.cloneNode(true);
                    //update title and text and image
                    // newcard.querySelector('#reviewHospitalName').innerHTML = hospitalName;
                    // newcard.querySelector('#reviewStar').innerHTML = stars;
                    // newcard.querySelector('#reviewContent').innerHTML = comments;

                    // document.getElementById(collection + "-go-here").appendChild(newcard);
                }

            })
        })
}

