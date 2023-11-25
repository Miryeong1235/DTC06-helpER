function populateReservationInfo() {
    console.log('populate user info from firestore database');
    readReservation(true);
}

function writeReservation() {
    var user = firebase.auth().currentUser;
    let params = new URL(window.location.href); // get URL
    let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
    var userProfile = db.collection('userProfiles').doc(user.uid);
    var reservation = userProfile.collection('reservation').doc(hospitalId);

    userProfile.get().then(userDoc => {
        console.log(userDoc)
        if (userDoc.exist) { // join waitlist form doesn't work
            userProfile.update({
                first_name: $("#fname").val(),
                last_name: $("#lname").val(),
                date_of_birth: $("#dateOfBirth").val(),
                phone: $("#phone").val(),
                phn: $("#phn").val(),
            })
        } else {
            userProfile.set({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(),
                first_name: $("#fname").val(),
                last_name: $("#lname").val(),
                date_of_birth: $("#dateOfBirth").val(),
                phone: $("#phone").val(),
                phn: $("#phn").val(),
                street_no: '',
                street_name: '',
                city: '',
                province: '',
                postal_code: '',
            })
        }
    })

    reservation.set({
        purposeOfVisit: $("#purposeOfVisit").val(),
        signature: $("#signature").val(),
        signDate: $("#signDate").val(),
        last_updated: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => { location.href = "waitlist_confirmation.html?docID=" + user.uid + "-" + hospitalId; })
}

function readReservation(populate = false) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let params = new URL(window.location.href); // get URL
            let hospitalId = params.searchParams.get("docID").split('-')[1]; // get value for key "docID"
            console.log(hospitalId);
            var userProfile = db.collection('userProfiles').doc(user.uid);
            var reservation = userProfile.collection('reservation');

            userProfile.get().then(doc => doc.data())
                .then(data => {
                    if (data) {
                        if (populate) {
                            console.log('populateeeee')
                            document.getElementById('fname').value = data.first_name;
                            document.getElementById('lname').value = data.last_name;
                            document.getElementById('dateOfBirth').value = data.date_of_birth;
                            document.getElementById('phn').value = data.phn;
                            document.getElementById('phone').value = data.phone;
                        } else {
                            document.getElementById('fname').innerHTML = data.first_name;
                            document.getElementById('lname').innerHTML = data.last_name;
                            document.getElementById('dateOfBirth').innerHTML = data.date_of_birth;
                            document.getElementById('phn').innerHTML = data.phn;
                            document.getElementById('phone').innerHTML = data.phone;
                        }
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
