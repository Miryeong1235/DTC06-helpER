//--------------------------------------------------------------------------------------
// This function will call readReservation() to populate the user's waitlist information
//--------------------------------------------------------------------------------------
function populateReservationInfo() {
    console.log('populate user info from firestore database');
    readReservation(true);
}

//-------------------------------------------------------------------------------
// This function write the user's waitlist information to the firestore database
//-------------------------------------------------------------------------------
function writeReservation() {
    var user = firebase.auth().currentUser;
    let params = new URL(window.location.href); // get URL
    let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
    var userProfile = db.collection('userProfiles').doc(user.uid);
    var reservation = userProfile.collection('reservation').doc(hospitalId);

    // check if user profile exists and update accordingly
    userProfile.get().then(userDoc => {
        console.log(userDoc)
        if (userDoc.exist) { // if user profile exists, update it
            userProfile.update({
                first_name: $("#fname").val(),
                last_name: $("#lname").val(),
                date_of_birth: $("#dateOfBirth").val(),
                phone: $("#phone").val(),
                phn: $("#phn").val(),
                street_no: $("#street_no").val(),
                street_name: $("#street_name").val(),
                city: $("#city").val(),
                province: $("#province").val(),
                postal_code: $("#postal_code").val(),
            })
        } else { // if user profile does not exist, create a new one
            userProfile.set({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(),
                first_name: $("#fname").val(),
                last_name: $("#lname").val(),
                date_of_birth: $("#dateOfBirth").val(),
                phone: $("#phone").val(),
                phn: $("#phn").val(),
                street_no: $("#street_no").val(),
                street_name: $("#street_name").val(),
                city: $("#city").val(),
                province: $("#province").val(),
                postal_code: $("#postal_code").val(),
            })
        }
    })

    // write waitlist information to firestore database
    reservation.set({
        purposeOfVisit: $("#purposeOfVisit").val(),
        signature: $("#signature").val(),
        signDate: $("#signDate").val(),
        last_updated: firebase.firestore.FieldValue.serverTimestamp(),
        visited: false,
    }).then(() => { location.href = "waitlist_confirmation.html?docID=" + user.uid + "-" + hospitalId; }) // redirect to confirmation page
}

//--------------------------------------------------------------------------------------
// This function read user's waitlist information from the firestore database and display
//--------------------------------------------------------------------------------------
function readReservation(populate = false) { // populate = true if the function is called from join_waitlist.html, false everywhere else
    firebase.auth().onAuthStateChanged(user => {
        if (user) { // if user is logged in, continue to display user's waitlist information
            let params = new URL(window.location.href); // get URL
            let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
            console.log(hospitalId);
            var userProfile = db.collection('userProfiles').doc(user.uid);
            var reservation = userProfile.collection('reservation');

            // read user's waitlist information from firestore database
            userProfile.get().then(doc => doc.data())
                .then(data => {
                    if (data) {
                        if (populate) { // populate user's waitlist information to input fields
                            document.getElementById('fname').value = data.first_name;
                            document.getElementById('lname').value = data.last_name;
                            document.getElementById('dateOfBirth').value = data.date_of_birth;
                            document.getElementById('phn').value = data.phn;
                            document.getElementById('phone').value = data.phone;
                            document.getElementById("street_no").value = data.street_no;
                            document.getElementById("street_name").value = data.street_name;
                            document.getElementById("city").value = data.city;
                            document.getElementById("province").value = data.province;
                            document.getElementById("postal_code").value = data.postal_code;
                        } else { // display user's waitlist information in table
                            document.getElementById('fname').innerHTML = data.first_name;
                            document.getElementById('lname').innerHTML = data.last_name;
                            document.getElementById('dateOfBirth').innerHTML = data.date_of_birth;
                            document.getElementById('phn').innerHTML = data.phn;
                            document.getElementById('phone').innerHTML = data.phone;
                            document.getElementById("street_no").innerHTML = data.street_no;
                            document.getElementById("street_name").innerHTML = data.street_name;
                            document.getElementById("city").innerHTML = data.city;
                            document.getElementById("province").innerHTML = data.province;
                            document.getElementById("postal_code").innerHTML = data.postal_code;
                        }
                    }
                })

            // display purpose of visit if user has already joined the waitlist
            reservation.get().then(querySnapshot => querySnapshot.docs.map(doc => doc.id))
                .then(reservationList => {
                    // if hospital id is in the reservation list, display purpose of visit
                    if (reservationList.includes(hospitalId)) {
                        reservation.doc(hospitalId).get().then(doc => doc.data())
                            .then(data => {
                                document.getElementById('purposeOfVisit').innerHTML = data.purposeOfVisit;
                            })
                    }
                })
        } else { // if user is not logged in, redirect to login page
            console.log('user not logged in')
        }
    })
}

//--------------------------------------------------------------------------
// This function will cancel the user's waitlist from the firestore database
//--------------------------------------------------------------------------
function cancelWaitlist(btn) {
    if (confirm("Are you sure you want to cancel?")) {
        alert("You have canceled your waitlist.")
        let user = firebase.auth().currentUser; // get current user
        let userProfile = db.collection('userProfiles').doc(user.uid);
        // find the html element with id "currentReservationHospitalId" and get its text value
        let hospital_id = $(btn).closest('.card-body').find("#currentReservationHospitalId").text();
        let reservation = userProfile.collection('reservation').doc(hospital_id);
        // delete the reservation from firestore database
        reservation.delete().then(() => {
            console.log("Document successfully deleted!");
            location.reload(); // reload the page
        }).catch((error) => {
            console.error("Error removing document: ", error);  // log error
        });


    }
}
