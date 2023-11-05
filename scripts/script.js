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
    console.log("clicked profile icon");
    location.href = "profile_menu.html";
}


//------------------------------------------------
// Call this function to go to designated page
//-------------------------------------------------
function toMain() {
    console.log("go back to main page");
    location.href = "main.html";
}

function joinWaitList() {
    console.log("go to join waitlist page");
    location.href = "join_waitlist.html";
}
