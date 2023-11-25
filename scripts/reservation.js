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

    let cardTemplate = document.getElementById('myReservationCardTemplate');
    db.collection(collection).doc(userUid).collection('reservation').get()
        .then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
                querySnapshot.forEach(doc => {
                    let thisReservationID = doc.id; //get reservation id
                    console.log(thisReservationID)
    
                    // get hospital's name based on the reservation ID
                    db.collection('hospitals').doc(thisReservationID).get()
                        .then(hospital_doc => {
                            if (hospital_doc.exists) {
                                let newCard = cardTemplate.content.cloneNode(true);
                                newCard.querySelector('#currentReservationHospitalName').innerHTML = hospital_doc.data().name;
                                newCard.querySelector('#currentReservationHospitalId').innerHTML = thisReservationID;
                                
                                let randomNumberOfPeople = Math.floor(Math.random() * 30) + 1
                                newCard.querySelector('#numberOfPeople').innerHTML = randomNumberOfPeople;
    
                                document.getElementById("current-reservation-go-here").appendChild(newCard);
    
                            }
                        })
    
    
                });
            } else {
                document.getElementById("current-reservation-go-here").innerHTML += '<p class="text-center">You have no record of joined waitlist at the moment!</p>';
            }
            
        });
}

