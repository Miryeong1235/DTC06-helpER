//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   //if the pointer to "user" object is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        }
    });
}
loadSkeleton(); //invoke the function

var menuOpen = false;

function toggleMenu() {
    if (menuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    $('#hamburgerPlaceholder').load('./text/hamburger_menu.html');
    document.getElementById("hamburgerPlaceholder").style.width = "300px";
    document.getElementById("hamburgerPlaceholder").style.border = "1px solid grey";
    menuOpen = true;
}

function closeMenu() {
    document.getElementById("hamburgerPlaceholder").style.width = "0";
    document.getElementById("hamburgerPlaceholder").style.border = "none";
    menuOpen = false;
}
