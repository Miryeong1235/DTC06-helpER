
var userUid = undefined;

function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            var userUid = user.uid;
            console.log('Log in with', userUid);
            displayCardsDynamically("userProfiles", userUid);
        } else {
            console.log('User not logged in')
        }
    })
}

function getQueue(userId, hospitalId) {
    let userProfiles = db.collection('userProfiles');
    let queue = [];
    let i = 0;
    let endi = 0;

    return userProfiles.doc(userId).collection('reservation').doc(hospitalId)
        .get()
        .then(doc => doc.data().last_updated.seconds)
        .then(user_resv_timestamp => {
            return userProfiles.get().then(otherUsers => {
                endi = otherUsers.docs.length;
                let promises = []; // Store promises in an array
                otherUsers.forEach(otherUser => {
                    i++;
                    let promise = userProfiles.doc(otherUser.id).collection('reservation').doc(hospitalId).get()
                        .then(otherReservation => {
                            if (otherReservation.exists && otherReservation.data().visited == false && otherReservation.data().last_updated.seconds < user_resv_timestamp) {
                                queue.push(otherUser.id);
                            }
                        });
                    promises.push(promise); // Add each promise to the array
                });
                // Wait for all promises to resolve before returning the queue length
                return Promise.all(promises).then(() => {
                    return queue.length;
                });
            });
        });
}

function displayCardsDynamically(collection, userUid) { //collection is userProfiles
    let current_count = 0;
    let previous_count = 0;
    let reservation_count = 0;
    let cardTemplate = document.getElementById('myReservationCardTemplate');
    let cardCompletedTemplate = document.getElementById('previousReservationsTemplate');
    db.collection(collection).doc(userUid).collection('reservation').get()
        .then(querySnapshot => {
            reservation_count = querySnapshot.docs.length;
            if (reservation_count > 0) {
                querySnapshot.forEach(reservation_doc => {
                    let thisReservationID = reservation_doc.id; //get reservation id
                    // get hospital's name based on the reservation ID
                    db.collection('hospitals').doc(thisReservationID)
                        .get().then(async hospital_doc => {
                            if (hospital_doc.exists) {
                                if (!reservation_doc.data().visited) {
                                    if (current_count == 0) {
                                        document.getElementById("current-reservation-go-here").innerHTML = ''
                                    }
                                    current_count ++;
                                    let newCard = cardTemplate.content.cloneNode(true);
                                    newCard.querySelector('#currentReservationHospitalName').innerHTML = hospital_doc.data().name;
                                    newCard.querySelector('#currentReservationHospitalId').innerHTML = thisReservationID;

                                    await getQueue(userUid, thisReservationID).then(randomNumberOfPeople => {
                                        if (randomNumberOfPeople == 0) {
                                            newCard.querySelector('#numberOfPeople').innerHTML = 'You are next!'
                                        } else {
                                            newCard.querySelector('#numberOfPeople').innerHTML = randomNumberOfPeople;
                                        }
                                    })
                                    
                                    document.getElementById("current-reservation-go-here").appendChild(newCard);
                                } else {
                                    if (previous_count == 0) {
                                        document.getElementById("previous-reservation-go-here").innerHTML = ''
                                    }
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


function setup() {
    getUserId();
}

$(document).ready(setup)