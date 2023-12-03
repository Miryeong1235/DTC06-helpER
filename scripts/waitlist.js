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
                street_no: $("#street_no").val(),
                street_name: $("#street_name").val(),
                city: $("#city").val(),
                province: $("#province").val(),
                postal_code: $("#postal_code").val(),
            })
        } else {
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

    reservation.set({
        purposeOfVisit: $("#purposeOfVisit").val(),
        signature: $("#signature").val(),
        signDate: $("#signDate").val(),
        last_updated: firebase.firestore.FieldValue.serverTimestamp(),
        visited: false,
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
                        } else {
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

function cancelWaitlist(btn) {
    if (confirm("Are you sure you want to cancel?")) {
        alert("You have canceled your waitlist.")
        let user = firebase.auth().currentUser;
        let userProfile = db.collection('userProfiles').doc(user.uid);
        let hospital_id = $(btn).closest('.card-body').find("#currentReservationHospitalId").text();
        let reservation = userProfile.collection('reservation').doc(hospital_id);
        reservation.delete().then(() => {
            console.log("Document successfully deleted!");
            location.reload();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });


    }
}
