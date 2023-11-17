var userUid = undefined;

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            userUid = user.uid;
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            //document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            $("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function


// Hospital information data
function writeHospitals() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hospitalsRef = db.collection("hospitals");

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
    let cardTemplate = document.getElementById("hospitalCardTemplate"); // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 

    var currentUser = db.collection("userProfiles").doc(userUid);

    db.collection(collection).get()   //the collection called "hospitals"
        .then(allHospitals => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHospitals.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var hospitalCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
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

                let currentUser = db.collection("userProfiles").doc(userUid);


                currentUser.get().then(userDoc => {
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        // If already bookmarked, remove the bookmark
                        document.getElementById('heart-' + docID).innerHTML = 'favorite'
                    }
                });

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("hospitals");  //input param is the name of the collection

document.getElementById('search').addEventListener('submit', function (event) {
    event.preventDefault();

    var userInput = document.getElementById('searchBar').value;
    console.log(userInput);

    window.location.href = 'search.html?query=' + encodeURIComponent(userInput);

});

function updateBookmark(hospitalID) {
    let currentUser = db.collection("userProfiles").doc(userUid);
    currentUser.get().then(userDoc => {
        let bookmarks = userDoc.data().bookmarks;
        let iconID = 'heart-' + hospitalID;

        if (bookmarks) {
            var isBookmarked = bookmarks.includes(hospitalID); //check if this hikeDocID exist in bookmark
            console.log(isBookmarked);
            if (isBookmarked) {
                currentUser.update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(hospitalID)
                }).then(() => {
                    console.log("bookmark has been removed for " + hospitalID);
                    document.getElementById(iconID).innerText = 'favorite_outline';
                })
            } else {
                currentUser.update({
                    bookmarks: firebase.firestore.FieldValue.arrayUnion(hospitalID)
                }).then(() => {
                    console.log("bookmark has been saved for " + hospitalID);
                    document.getElementById(iconID).innerText = 'favorite';
                })
            }
        } 
        // else {
        //     var isBookmarked = false;
        //     currentUser.set({
        //         bookmarks: firebase.firestore.FieldValue.arrayUnion(hospitalID),
        //     }).then(() => {
        //         document.getElementById(iconID).innerText = 'favorite';
        //         console.log("bookmark initialize");
        //     })
        // }
    })
}