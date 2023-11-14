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
        address: "920 West 10th Ave Vancouver, BC, V5Z 1M9",          //number value
        phoneNumber: "(604) 875-4111",
        details: "Ages 17 and older/ Adult Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hospitalsRef.add({
        code: "RH",
        name: "Richmond Hospital", //replace with your own city?
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
        name: "St. Paul's Hospital", //replace with your own city?
        city: "Vancouver",
        province: "BC",
        address: "1081 Burrard St Vancouver, BC, V6Z 1Y6",          //number value
        phoneNumber: "(604) 682-2344",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "MSJ",
        name: "Mount Saint Joseph Hospital", //replace with your own city?
        city: "Vancouver",
        province: "BC",
        address: "3080 Prince Edward St Vancouver, BC, V5T 3N4",          //number value
        phoneNumber: "(604) 874-1141",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "8am to 8pm",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "LGH",
        name: "Lions Gate Hospital", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        address: "231 East 15th St North Vancouver, BC, V7L 2L7",          //number value
        phoneNumber: "(604) 988-3131",
        details: "Patients of all ages seen/ Full Service Hospital",
        hours: "24-7",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hospitalsRef.add({
        code: "UBC",
        name: "UBC Hospital", //replace with your own city?
        city: "Vancouver",
        province: "BC",
        address: "2211 Wesbrook Mall Vancouver, BC, V6T 2B5",          //number value
        phoneNumber: "(604) 822-7121",
        details: "Patients of all ages seen",
        hours: "8am to 8pm",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// function fillHeart(elem, hospitalId) {
//     let element = elem.querySelector('#heart');
//     let favouriteDocRef = db.collection('userProfiles').doc(userUid).collection('favourite');
//     if (favouriteDocRef) {
//         favouriteDocRef.get().then(querySnapshot => {
//             return querySnapshot.docs.map(doc => doc.id);
//         }).then(hospitalIdList => {
//             if (hospitalIdList.includes(hospitalId)) {
//                 element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
//                 <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
//             </svg>`;
//             } else {
//                 element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
//                 class="bi bi-heart" viewBox="0 0 16 16">
//                 <path
//                     d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
//             </svg>`;
//             }
//         })
//     }
// }

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hospitalCardTemplate"); // Retrieve the HTML element with the ID "hospitalCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
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
                // newcard.querySelector('#heart').innerHTML = 'abc';
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-hour').innerHTML = hospitalHour;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`; //Example: MSJ.png
                newcard.querySelector('a').href = "hospital_detail.html?docID=" + docID;
                newcard.querySelector('i').id = "heart-"+docID
                newcard.querySelector('i').onclick = ()=> updateHeart(docID)
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
                // fillHeart(newcard, docID);
                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("hospitals");  //input param is the name of the collection