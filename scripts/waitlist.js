function populateReservationInfo() {
    console.log('populate user info from firestore database');
    readReservation(true);
}

function writeReservation() {
    var user = firebase.auth().currentUser;
    let params = new URL(window.location.href); // get URL
    let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
    var reservation = db.collection('userProfiles').doc(user.uid).collection('reservation').doc(hospitalId);

    reservation.set({
        purposeOfVisit: $("#purposeOfVisit").val(),
        signature: $("#signature").val(),
        signDate: $("#signDate").val(),
        last_updated: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => { location.href = "waitlist_confirmation.html?docID=" + user.uid + "-" + hospitalId; })
}

function readReservation(populate=false) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let params = new URL(window.location.href); // get URL
            let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
            console.log(hospitalId);
            var userProfile = db.collection('userProfiles').doc(user.uid);
            var reservation = userProfile.collection('reservation');

            userProfile.get().then(doc => doc.data())
                .then(data => {
                    console.log(data);
                    if (populate) {
                        document.getElementById('exampleInputFname').value = data.first_name;
                        document.getElementById('exampleInputLname').value = data.last_name;
                        document.getElementById('exampleInputdof').value = data.date_of_birth;
                        document.getElementById('exampleInputPhone').value = data.phn;
                        document.getElementById('exampleInputPHN').value = data.phone;
                    } else {
                        document.getElementById('fname').innerHTML = data.first_name;
                        document.getElementById('lname').innerHTML = data.last_name;
                        document.getElementById('dateOfBirth').innerHTML = data.date_of_birth;
                        document.getElementById('phone').innerHTML = data.phn;
                        document.getElementById('phn').innerHTML = data.phone;
                    }
                })
            reservation.get().then(querySnapshot => querySnapshot.docs.map(doc => doc.id))
                .then(reservationList => {
                    if (reservationList.includes(hospitalId)) {
                        reservation.doc(hospitalId).get().then(doc => doc.data())
                            .then(data => {
                                document.getElementById('purposeOfVisit').innerHTML = data.purposeOfVisit;
                            })
                    }
                })
        } else {
            console.log('user not logged in')
        }
    })
}

function cancelWaitlist() {
    var txt;
    if (confirm("Are you sure you want to cancel?")) {
        alert("You have canceled your waitlist.")
        location.href = "";
    }
  }