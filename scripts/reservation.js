// $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
// })

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

getUserId();


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
                        .get().then(hospital_doc => {
                            if (hospital_doc.exists) {
                                if (!reservation_doc.data().visited) {
                                    if (current_count == 0) {
                                        document.getElementById("current-reservation-go-here").innerHTML = ''
                                    }
                                    current_count ++;
                                    let newCard = cardTemplate.content.cloneNode(true);
                                    newCard.querySelector('#currentReservationHospitalName').innerHTML = hospital_doc.data().name;
                                    newCard.querySelector('#currentReservationHospitalId').innerHTML = thisReservationID;

                                    let randomNumberOfPeople = Math.floor(Math.random() * 30) + 1
                                    newCard.querySelector('#numberOfPeople').innerHTML = randomNumberOfPeople;

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
