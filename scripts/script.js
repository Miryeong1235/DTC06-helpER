//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
        console.log('Error logging out user')
    });
}

//------------------------------------------------
// Call this function when the "sign in" button is clicked
//-------------------------------------------------
function signIn() {
    console.log("clicked sign in icon");
    location.href = "login.html";
}

//------------------------------------------------
// Call this function when the "profile" button is clicked
//-------------------------------------------------
function profile() {
    console.log("user clicked profile icon or personal info");

    // check if user is logged in
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) { // if user is logged in, check if user has a profile
            db.collection('userProfiles').get()
                .then(querySnapshot => querySnapshot.docs.map(doc => doc.id)) // get all user ids
                .then(uidList => { // check if user has a profile
                    console.log('user profile has record:', uidList.includes(user.uid));
                    if (uidList.includes(user.uid)) { // if user has a profile, go to personal info page
                        location.href = "personal_info.html";
                    } else { // if user does not have a profile, go to prompt to register page
                        location.href = "prompt_to_register.html";
                    }
                })

        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}


//------------------------------------------------
// Call this function to go to designated page
//-------------------------------------------------
function toMain() {
    console.log("go back to main page");
    location.href = "main.html";
}

//------------------------------------------------
// Call this function to go to favourite hospital page
//-------------------------------------------------
function toFavouriteHospital() {
    firebase.auth().onAuthStateChanged(user => { // check if user is logged in
        console.log(user);
        if (user) { // if user is logged in, go to favourite hospital page
            location.href = "favourite_hospitals.html";
        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

//------------------------------------------------
// Call this function to pass hospital id to postReview function
//-------------------------------------------------
function prevResvReview(btn) {
    let hospital_id = $(btn).closest('.card-body').find("#previousReservationHospitalId").text();
    // call toPostReview function
    toPostReview(`?docID=${hospital_id}`)
}

//------------------------------------------------
// Call this function to go to post review page in the completed wait list section
//-------------------------------------------------
function toPostReview(url) {
    // get hospital id from url
    hospitalid = url.split("?docID=")[1];
    // check if user is logged in
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) { // if user is logged in, go to post review page
            console.log('user logged in, need to create a notification page.')
            location.href = "post_review.html" + "?docID=" + hospitalid;
        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

//------------------------------------------------
// Call this function to go to hospital detail page
//-------------------------------------------------
function joinWaitList(url) {
    // get hospital id from url
    hospitalId = url.split("?docID=")[1];
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) { // if user is logged in, check if user has a reservation
            let reservationRef = db.collection('userProfiles').doc(user.uid).collection('reservation');
            reservationRef.get()
                .then(querySnapshot => querySnapshot.docs.map(doc => doc.id)) // get all reservation ids
                .then(reservationList => {
                    if (reservationList.includes(hospitalId)) { // if user has a reservation, check if user has visited
                        reservationRef.doc(hospitalId).get().then(hospital_doc => { // get reservation doc
                            if (hospital_doc.data().visited == true) { // if user has visited, go to waitlist confirmed page
                                location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
                            } else { // if user has not visited, go to waitlist confirmed page
                                location.href = "waitlist_confirmed.html?docID=" + user.uid + "-" + hospitalId;
                            }
                        })
                    } else { // if user does not have a reservation, go to join waitlist page
                        location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
                    }
                });
        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            }
        }
    })
}

//------------------------------------------------
// Call this function to go to join wait list page
//-------------------------------------------------
function updateJoinWaitList(url) {
    hospitalId = url.split("?docID=")[1]; // get hospital id from url
    firebase.auth().onAuthStateChanged(user => { // check if user is logged in
        console.log(user);
        if (user) { // if user is logged in, go to join waitlist page
            location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
        }
    })
}

//------------------------------------------------
//  Call this function to go to map page
//-------------------------------------------------
function toMap(url = '?docID=') {
    hospitalId = url.split('?docID=')[1];
    sessionStorage.setItem('hospitalID', hospitalId)
    location.href = "map.html"
}

//------------------------------------------------
// Call this function to go to prompt to register page
//-------------------------------------------------
function toRegister() {
    location.href = "prompt_to_register.html";
}

//------------------------------------------------
// Call this function to go to registration page
//-------------------------------------------------
function toRegistration() {
    location.href = "registration.html";
}

// ------------------------------------------------
// Call this function to go to confirm registration page
// ------------------------------------------------
function toConfirmRegister() {
    location.href = "confirm_registration.html";
}

//------------------------------------------------
// Call this function to go to waitlist confirmed page
//-------------------------------------------------
function toWaitlistConfirmed(url) {
    param = url.split('?docID=')[1];
    location.href = "waitlist_confirmed.html?docID=" + param;
}

//------------------------------------------------
// Call this function to go to review page
//-------------------------------------------------
function toMyReview() {
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) { // if user is logged in, go to review page
            location.href = "review.html";
        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

//------------------------------------------------
// Call this function to go to my reservation page if user is logged in
//-------------------------------------------------
function toMyReservation() {
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) { // if user is logged in, go to my reservation page
            location.href = "reservation.html";
        } else { // if user is not logged in, go to login page
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

//------------------------------------------------
// Call this function to get user display name
//-------------------------------------------------
function getDisplayName() {
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            console.log(user.displayName);
            $("#user_name").text(user.displayName);
        }
    })
}

//------------------------------------------------
// Call this function to go to contact page
//-------------------------------------------------
function toContactUs() {
    location.href = "contact.html";
}

//------------------------------------------------
// Call this function to go to help page
//-------------------------------------------------
function toHelp() {
    location.href = "help.html";
}