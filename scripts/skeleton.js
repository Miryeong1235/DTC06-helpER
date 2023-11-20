function toggleFooterIcon (url) {
    address = url.split('/')[3];
    if (address == 'main.html') {
        document.getElementById("home-icon").className = 'material-icons';
    } else {
        document.getElementById("home-icon").className = 'material-icons-outlined';
    }
    if (address == 'favourite_hospitals.html') {
        document.getElementById("bookmark-icon").className = 'material-icons';
    } else {
        document.getElementById("bookmark-icon").className = 'material-icons-outlined';
    }
}

//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(url = undefined) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   //if the pointer to "user" object is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            // console.log($('#footerPlaceholder').load('./text/footer.html'));
            $('#footerPlaceholder').load('./text/footer.html', () => {toggleFooterIcon(url)});
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            $('#footerPlaceholder').load('./text/footer.html', () => {toggleFooterIcon(url)});
        }
    });
}

function getCurrentURL() {
    return window.location.href
}

function setup() {
    loadSkeleton(getCurrentURL());
}
var menuOpen = false;

function toggleMenu() {
    if (menuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    $('#hamburgerPlaceholder').load('./text/hamburger_menu.html', () => {
        firebase.auth().onAuthStateChanged(user => {
            console.log(document.getElementById('logout-btn').style.display === 'block', '====')
            // Check if a user is signed in:
            if (user) {
                // Do something for the currently logged-in user here: 
                document.getElementById("display-name").innerHTML = user.displayName;
                document.getElementById("display-welcome").innerHTML = 'Welcome to helpER!';
            } else {
                document.getElementById('logout-btn').style.display = 'none';
            }
        })
    });
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

$(document).ready(setup);