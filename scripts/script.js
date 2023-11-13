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
            if (db.collection('userProfile').doc(user.uid)) {
                location.href = "personal_info.html";
            } else {
                location.href = "prompt_to_registration.html";
            }
        } else {
            console.log('user not logged in');
        }
})}


//------------------------------------------------
// Call this function to go to designated page
//-------------------------------------------------
function toMain() {
    console.log("go back to main page");
    location.href = "main.html";
}

function toPostReview(url) {
    hospitalid = url.split("?")[1]
    console.log("go to post review page");
    location.href = "post_review.html" + "?" + hospitalid;
}

function joinWaitList() {
    console.log("go to join waitlist page");
    location.href = "join_waitlist.html";
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
