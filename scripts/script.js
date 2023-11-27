//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

//------------------------------------------------
// Call this function when the "sign in" button is clicked
//-------------------------------------------------
function signIn() {
    console.log("clicked sign in icon");
    location.href = "login.html";
}

function profile() {
    console.log("user clicked profile icon or personal info");
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            db.collection('userProfiles').get()
                .then(querySnapshot => querySnapshot.docs.map(doc => doc.id))
                .then(uidList => {
                    console.log('user profile has record:', uidList.includes(user.uid));
                    if (uidList.includes(user.uid)) {
                        location.href = "personal_info.html";
                    } else {
                        location.href = "prompt_to_register.html";
                    }
                })

        } else {
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

function toFavouriteHospital() {
    console.log("go to favourite hospitals page");
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            location.href = "favourite_hospitals.html";
        } else {
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

function prevResvReview(btn) {
    let hospital_id = $(btn).closest('.card-body').find("#previousReservationHospitalId").text();
    toPostReview(`?docID=${hospital_id}`)
}


function toPostReview(url) {
    hospitalid = url.split("?docID=")[1];
    console.log("go to post review page");
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            console.log('user logged in, need to create a notification page.')
            location.href = "post_review.html" + "?docID=" + hospitalid;
        } else {
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

function joinWaitList(url) {
    console.log("go to join waitlist page");
    hospitalId = url.split("?docID=")[1];
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            let reservationRef = db.collection('userProfiles').doc(user.uid).collection('reservation');
            reservationRef.get()
                .then(querySnapshot => querySnapshot.docs.map(doc => doc.id))
                .then(reservationList => {
                    if (reservationList.includes(hospitalId)) {
                        reservationRef.doc(hospitalId).get().then(hospital_doc => {
                            if (hospital_doc.data().visited == true) {
                                location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
                            } else {
                                location.href = "waitlist_confirmed.html?docID=" + user.uid + "-" + hospitalId;
                            }
                        })
                    } else {
                        location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
                    }
                });
        } else {
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            }
        }
    })
}

function updateJoinWaitList(url) {
    console.log("go to join waitlist page");
    hospitalId = url.split("?docID=")[1];
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            location.href = "join_waitlist.html?docID=" + user.uid + "-" + hospitalId;
        }
    })
}

function toMap(url = '?docID=') {
    hospitalId = url.split('?docID=')[1];
    sessionStorage.setItem('directions', 'true')
    sessionStorage.setItem('hospitalID', hospitalId)
    location.href = "map.html"
}

function toRegister() {
    console.log("go to prompt to register page");
    location.href = "prompt_to_register.html";
}

function toRegistration() {
    console.log("go to registration page");
    location.href = "registration.html";
}

function toConfirmRegister() {
    console.log("go to confirm registration page");
    location.href = "confirm_registration.html";
}

function toWaitlistConfirmed(url) {
    param = url.split('?docID=')[1];
    console.log("go to waitlist confirmed page");
    location.href = "waitlist_confirmed.html?docID=" + param;
}

function toMyReview() {
    console.log("go to my reviews page");
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            location.href = "review.html";
        } else {
            console.log('user not logged in');
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            } 
        }
    })
}

function toMyReservation() {
    console.log("go to my reviews page");
    firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if (user) {
            location.href = "reservation.html";
        } else {
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

function toContactUs() {
    console.log("go to contact page");
    location.href = "contact.html";
}

function toHelp() {
    console.log("go to help page");
    location.href = "help.html";
}