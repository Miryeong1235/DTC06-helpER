// declare userUid as global variable
var userUid = undefined;

//-------------------------------
// Get name and id from user Auth
//-------------------------------
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            userUid = user.uid;
            console.log('User singned in with the id:', user.uid); //print the uid in the browser console
            var currentUser = db.collection("userProfiles").doc(userUid);
            currentUser.get()
                .then(doc => {
                    userName = doc.data().first_name;
                    $("#name-goes-here").text(userName);
                })
        } else {
            // No user is signed in.
            console.log('User has not signed in')
        }
    });
}

// update userUid global variable when the script loaded
getNameFromAuth();


//---------------------------------
// Write hospital information data
//---------------------------------
function writeHospitals() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hospitalsRef = db.collection("hospitals");

    //add hospitals
    hospitalsRef.add({
        code: "VGH",
        name: "Vancouver General Hospital",
        city: "Vancouver",
        province: "BC",
        address: "920 West 10th Ave Vancouver, BC, V5Z 1M9",
        phoneNumber: "(604) 875-4111",
        details: "Ages 17 and older/ Adult Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hospitalsRef.add({
        code: "RH",
        name: "Richmond Hospital",
        city: "Richmond",
        province: "BC",
        address: "7000 Westminster Highway Richmond, BC, V6X 1A2, BC, V5Z 1M9",          //number value
        phoneNumber: "(604) 278-9711",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "SPH",
        name: "St. Paul's Hospital",
        city: "Vancouver",
        province: "BC",
        address: "1081 Burrard St Vancouver, BC, V6Z 1Y6",
        phoneNumber: "(604) 682-2344",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "MSJ",
        name: "Mount Saint Joseph Hospital",
        city: "Vancouver",
        province: "BC",
        address: "3080 Prince Edward St Vancouver, BC, V5T 3N4",
        phoneNumber: "(604) 874-1141",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "8am to 8pm",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "LGH",
        name: "Lions Gate Hospital",
        city: "North Vancouver",
        province: "BC",
        address: "231 East 15th St North Vancouver, BC, V7L 2L7",
        phoneNumber: "(604) 988-3131",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "UBC",
        name: "UBC Hospital",
        city: "Vancouver",
        province: "BC",
        address: "2211 Wesbrook Mall Vancouver, BC, V6T 2B5",
        phoneNumber: "(604) 822-7121",
        details: "Patients of all ages seen",
        hours: "8am to 8pm",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
}


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 
    let cardTemplate = document.getElementById("hospitalCardTemplate");
    
    // get mapHospitalId if it exist in the sessionStorage, otherwise make it an empty string
    var mapHospitalId = ''
    if (sessionStorage.getItem('hospitalID') != null) {
        mapHospitalId = sessionStorage.getItem('hospitalID')
    }

    // get the collection called "hospitals"
    db.collection(collection).orderBy('name').limit(6).get()
        .then(allHospitals => {
            // Iterate through the ARRAY of all hospitals
            allHospitals.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var hospitalCode = doc.data().code;    //get unique ID to each hospital to be used for fetching right image
                var hospitalHour = doc.data().hours; //gets the length field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-hour').innerHTML = hospitalHour;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`; //Example: MSJ.png
                newcard.querySelector('a').href = "hospital_detail.html?docID=" + docID;
                newcard.querySelector('i').id = "heart-" + docID; //assigning unique id to each element
                newcard.querySelector('i').onclick = () => updateBookmark(docID);

                // get the user document in userProfile
                let currentUser = db.collection("userProfiles").doc(userUid);

                // attach to the list if the mapHospitalId is empty string (when displaying in general) 
                // or when the mapHospitalId equals to hosptial ID in this iteration (when displaying through the hospital direction page)
                if (mapHospitalId == "" || mapHospitalId == docID) {
                    document.getElementById(collection + "-go-here").appendChild(newcard);

                    currentUser.get().then(userDoc => {
                        if (userDoc.exists) {
                            // update the bookmark if the hospital is saved as favourite for the current user
                            var bookmarks = userDoc.data().bookmarks;
                            if (bookmarks.includes(docID)) {
                                // If already bookmarked, remove the bookmark
                                document.getElementById('heart-' + docID).innerHTML = 'bookmark'
                            }
                        }
                    });
                }
            })
        })
}

//---------------------------------
// Redirect user to the search page 
//---------------------------------
function toSearch() {
    document.getElementById('search').addEventListener('submit', function (event) {
        // prevent the default action
        event.preventDefault();

        // extract user value and pass to the url
        var userInput = document.getElementById('searchBar').value;
        window.location.href = 'search.html?query=' + encodeURIComponent(userInput);

    });
}

//-------------------------------------------------------------
// reflect user's bookmark preference from records in firestore
//-------------------------------------------------------------
function updateBookmark(hospitalID) {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // access current user's document on firestore
            let currentUser = db.collection("userProfiles").doc(userUid);
            currentUser.get().then(userDoc => {
                // extract bookmark record if user document exists
                if (userDoc.exists) {
                    let bookmarks = userDoc.data().bookmarks;
                    let iconID = 'heart-' + hospitalID;

                    if (bookmarks) {
                        //check if this hospitalId exist in bookmark
                        var isBookmarked = bookmarks.includes(hospitalID);
                        // update the bookmark attribute on firestore and front end display based on current bookmark status
                        if (isBookmarked) {
                            currentUser.update({
                                bookmarks: firebase.firestore.FieldValue.arrayRemove(hospitalID)
                            }).then(() => {
                                document.getElementById(iconID).innerText = 'bookmark_add';
                            })
                        } else {
                            currentUser.update({
                                bookmarks: firebase.firestore.FieldValue.arrayUnion(hospitalID)
                            }).then(() => {
                                document.getElementById(iconID).innerText = 'bookmark';
                            })
                        }
                    } else {
                        console.log("Something went wrong! Bookmark attribute does not exist.")
                    }
                } else {
                    // if the doc doesn't exist, will create a empty user doc to show bookmark attribute is EMPTY
                    // bookmark attribute has to exist for the Union and Remove actions used in updateBookmark
                    currentUser.set({
                        bookmarks: firebase.firestore.FieldValue.arrayUnion(),
                        first_name: '',
                        last_name: '',
                        email: '',
                        date_of_birth: '',
                        phone: '',
                        phn: '',
                        street_no: '',
                        street_name: '',
                        city: '',
                        province: '',
                        postal_code: '',
                    })
                }

            })
        } else {
            // promt user to log in when user is not logged in
            if (confirm("You are not logged in, log in now!")) {
                location.href = "login.html";
            }
        }
    })
}