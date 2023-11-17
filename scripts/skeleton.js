//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(url=undefined) {

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
        if (url) {
            address = url.split('/')[3];
            console.log(address)
            if (address == 'main.html') {
                console.log($('#footerPlaceholder').val());
                $('#footerPlaceholder #home-icon').attr('class', 'material-icons');
            }
            if (address == 'favourite_hospitals.html') {
                $('#home-icon').attr('class', 'material-icons');
            }
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
    document.getElementById("menu-icon").innerHTML = 'menu_open';
    menuOpen = true;
}

function closeMenu() {
    document.getElementById("hamburgerPlaceholder").style.width = "0";
    document.getElementById("hamburgerPlaceholder").style.border = "none";
    document.getElementById("menu-icon").innerHTML = 'menu';
    menuOpen = false;
}
