// declare userUid as global variable
var userUid = undefined;

//-------------------------------
// Get name and id from user Auth
//-------------------------------
function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            console.log('Log in with', userUid);
            display(user.uid)
        } else {
            console.log('User not logged in')
        }
    })
}

//-------------------------------
// Get the queue length
//-------------------------------
function getQueue(userId, hospitalId) { 
    // Get the userProfiles collection
    let userProfiles = db.collection('userProfiles');
    let queue = [];
    let i = 0;

    // Get the user's reservation timestamp
    return userProfiles.doc(userId).collection('reservation').doc(hospitalId)
        .get()
        .then(doc => doc.data().last_updated.seconds)
        .then(user_resv_timestamp => {
            // Get all other users
            return userProfiles.get().then(otherUsers => {
                let otherResvs = []; // Store otherResvs in an array

                // Iterate through each otherUser
                otherUsers.forEach(otherUser => {
                    i++;
                    // Get each otherUser's reservation
                    let otherResv = userProfiles.doc(otherUser.id).collection('reservation').doc(hospitalId).get()
                        .then(otherReservation => {
                            if (otherReservation.exists && otherReservation.data().visited == false && otherReservation.data().last_updated.seconds < user_resv_timestamp) {
                                queue.push(otherUser.id);
                            }
                        });
                        otherResvs.push(otherResv); // Add each otherWaitList to the array
                });
                // Wait for all otherResvs to resolve before returning the queue length
                return Promise.all(otherResvs).then(() => {
                    return queue.length;
                });
            });
        });
}

//-------------------------------
// Display the reservation
//-------------------------------
function display(userUid) {
    let current_count = 0;
    let previous_count = 0;
    let reservation_count = 0;
    let cardTemplate = document.getElementById('myReservationCardTemplate');
    let cardCompletedTemplate = document.getElementById('previousReservationsTemplate');

    // Get the user's reservation
    db.collection('userProfiles').doc(userUid).collection('reservation').orderBy('last_updated', 'desc').get()
        .then(querySnapshot => {
            reservation_count = querySnapshot.docs.length;

            // Iterate through each reservation
            if (reservation_count > 0) {
                querySnapshot.forEach(reservation_doc => {
                    let thisReservationID = reservation_doc.id; //get reservation id
                    // get hospital's name based on the reservation ID
                    db.collection('hospitals').doc(thisReservationID)
                        .get().then(async hospital_doc => {

                            // If the hospital exists and the user has not visited, display the reservation
                            if (hospital_doc.exists) {
                                if (!reservation_doc.data().visited) {
                                    if (current_count == 0) {
                                        document.getElementById("current-reservation-go-here").innerHTML = ''
                                    }
                                    current_count ++;

                                    // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data.
                                    let newCard = cardTemplate.content.cloneNode(true);
                                    newCard.querySelector('#currentReservationHospitalName').innerHTML = hospital_doc.data().name;
                                    newCard.querySelector('#currentReservationHospitalId').innerHTML = thisReservationID;
                                   
                                    // Get the queue length
                                    await getQueue(userUid, thisReservationID).then(randomNumberOfPeople => {
                                        if (randomNumberOfPeople == 0) {
                                            newCard.querySelector('#numberOfPeople').innerHTML = 'You are next!'
                                        } else {
                                            newCard.querySelector('#numberOfPeople').innerHTML = randomNumberOfPeople;
                                        }
                                    })
                                    
                                    document.getElementById("current-reservation-go-here").appendChild(newCard);
                                } else { // If the user has visited, display the reservation in the previous reservation section
                                    if (previous_count == 0) { // Clear the previous reservation section
                                        document.getElementById("previous-reservation-go-here").innerHTML = ''
                                    }

                                    // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data.
                                    previous_count ++;
                                    let newCard = cardCompletedTemplate.content.cloneNode(true);
                                    newCard.querySelector('#previousReservationHospitalName').innerHTML = hospital_doc.data().name;
                                    newCard.querySelector('#previousReservationHospitalId').innerHTML = thisReservationID;
                                    document.getElementById("previous-reservation-go-here").appendChild(newCard);
                                }
                            }
                        })
                })

            }
        })
}

//-------------------------------
// call getUserId when the script loaded
//-------------------------------
function setup() {
    getUserId();
}

$(document).ready(setup)