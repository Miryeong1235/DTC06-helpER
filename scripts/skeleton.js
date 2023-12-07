// -------------------------
// This script is used to load the skeleton of the web page (navbar, footer, etc.)
// -------------------------
function toggleFooterIcon(url) {
    // Get the current URL
    address = url.split('/')[3];
    // If the current page is main.html, change the home icon to filled, else change it to outlined
    if (address == 'main.html') {
        document.getElementById("home-icon").className = 'material-icons';
    } else {
        document.getElementById("home-icon").className = 'material-icons-outlined';
    }
    // If the current page is favourite_hospitals.html, change the bookmark icon to filled, else change it to outlined
    if (address == 'favourite_hospitals.html') {
        document.getElementById("bookmark-icon").className = 'material-icons';
    } else {
        document.getElementById("bookmark-icon").className = 'material-icons-outlined';
    }
    // If the current page is map.html, change the map icon to filled, else change it to outlined
    if (address == 'map.html') {
        document.getElementById("map-icon").className = 'material-icons';
    } else {
        document.getElementById("map-icon").className = 'material-icons-outlined';
    }
}

//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(url = undefined) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {  // if user is logged in
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            // Call toggleFooterIcon() after footer is loaded
            $('#footerPlaceholder').load('./text/footer.html', () => { toggleFooterIcon(url) });
        } else { // if user is not logged in
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            // Call toggleFooterIcon() after footer is loaded
            $('#footerPlaceholder').load('./text/footer.html', () => { toggleFooterIcon(url) });
        }
    });
}

//---------------------------------------------------
// This function returns the current URL of the page
//---------------------------------------------------
function getCurrentURL() {
    return window.location.href
}

//---------------------------------------------------
// This function is called when the page is loaded
//---------------------------------------------------
function setup() {
    loadSkeleton(getCurrentURL());
}

notificationOpen = false;

// Function to toggle notification
function toggleNotification() {
    if (notificationOpen) { // If notification is open, call closeNotification()
        closeNotification(); 
    } else { // If notification is closed, call openNotification() and closeMenu()
        openNotification();
        closeMenu();
    }
}

//---------------------------------------------------
// This function is called when the notification icon is clicked and the notification slide-in window is closed
//---------------------------------------------------
function openNotification() {
    $('#notificationPlaceholder').load('./text/notification.html', () => { // Load the notification slide-in window
        firebase.auth().onAuthStateChanged(user => {
            if (user) { // If user is logged in, open the notification slide-in window
                console.log('user logged in, open notification page.')
            } else { // If user is not logged in, prompt user to log in
                console.log('user not logged in');
                if (confirm("You are not logged in, log in now!")) {
                    location.href = "login.html";
                }
            }
        })
    })

    // Change the notification's height and fill the icon
    document.getElementById("notificationPlaceholder").style.height = "200px";
    document.getElementById("notification-icon").className = 'material-icons';
    notificationOpen = true;
}

//---------------------------------------------------
// This function is called when the notification icon is clicked and the notification slide-in window is opened
//---------------------------------------------------
function closeNotification() {
    // Change the notification's height to 0 and outline the icon
    document.getElementById("notificationPlaceholder").style.height = "0";
    document.getElementById("notification-icon").className = 'material-icons-outlined';
    notificationOpen = false;
}

var menuOpen = false;

// -----------------------------
// This function is called when the menu icon is clicked
// -----------------------------
function toggleMenu() {
    if (menuOpen) { // If menu is open, call closeMenu()
        closeMenu();
    } else { // If menu is closed, call openMenu() and closeNotification()
        openMenu();
        closeNotification();
    }
}

// -----------------------------
// This function is called when the menu icon is clicked and the menu slide-in window is closed
// -----------------------------
function openMenu() {
    $('#hamburgerPlaceholder').load('./text/hamburger_menu.html', () => { // Load the menu slide-in window
        firebase.auth().onAuthStateChanged(user => {
            if (user) { // If user is logged in
                // Display the user's name and the logout button
                document.getElementById("display-name").innerHTML = user.displayName;
                document.getElementById("display-welcome").innerHTML = 'Welcome to helpER!';
            } else { // If user is not logged in, hide the logout button
                document.getElementById('logout-btn').style.display = 'none';
            }
        })
    });
    // Change the menu's width and fill the icon
    document.getElementById("hamburgerPlaceholder").style.width = "300px";
    document.getElementById("hamburgerPlaceholder").style.border = "1px solid grey";
    document.getElementById("menu-icon").innerHTML = 'menu_open';
    menuOpen = true;

}


// -----------------------------
// This function is called when the menu icon is clicked and the menu slide-in window is opened
// -----------------------------
function closeMenu() {
    // Change the menu's width to 0 and outline the icon
    document.getElementById("hamburgerPlaceholder").style.width = "0";
    document.getElementById("hamburgerPlaceholder").style.border = "none";
    document.getElementById("menu-icon").innerHTML = 'menu';
    menuOpen = false;
}

$(document).ready(setup);