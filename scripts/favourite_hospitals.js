
var favouriteDocRef = undefined;
var hospitalIdList = undefined;

var userUid = undefined;

function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            var userUid = user.uid;
            favouriteDocRef = db.collection('userProfiles').doc(userUid).collection('favourite');
            displayFavouritesDynamically(userUid, 'favourite');

        } else {
            console.log('User not logged in')
        }
    })
}

// toggle favourites
function toggleFavourite(elem) {
    let url = $(elem).siblings('a').attr('href');
    let hospitalId = url.split('?docID=')[1];
    if (favouriteDocRef) {
        favouriteDocRef.get().then(querySnapshot => {
            return querySnapshot.docs.map(doc => doc.id);
        }).then(hospitalIdList => {
            console.log(hospitalIdList);
            if (hospitalIdList.includes(hospitalId)) {
                removeFromFavourites(hospitalId);
                console.log('invoke remove function to remove hospital from favourite list');
            } else {
                addToFavourites(hospitalId);
                console.log('invoke add function to add hospital to favourite list');
            }
        })
    }
}

// Add to favourite
function addToFavourites(hospitalId) {
    favouriteDocRef.doc(hospitalId).set({
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    }).then(() => {
        console.log("Document successfully written!");
        updateHeartColor(true);
    })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

// Delete from Favourites
function removeFromFavourites(hospitalId) {
    favouriteDocRef.doc(hospitalId).delete()
        .then(() => {
            console.log("Document successfully deleted!");
            updateHeartColor(false);
        })
        .catch((error) => {
            console.error("Error deleting document: ", error);
        });
}

// Change the color 
function updateHeartColor(fill) {
    let heartElement = document.getElementById('heart');
    if (fill) {
        heartElement.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
            </svg>`;
    } else {
        heartElement.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-heart" viewBox="0 0 16 16">
                <path
                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
            </svg>`;
    }

}

getUserId();


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayFavouritesDynamically(userUid, collection) {
    favouriteDocRef = db.collection('userProfiles').doc(userUid).collection('favourite');
    hospitalInfo = db.collection('hospitals');

    let cardTemplate = document.getElementById("favouriteHospitalTemplate"); // Retrieve the HTML element with the ID "favouriteHospitalTemplate" and store it in the cardTemplate variable. 

    console.log(hospitalInfo, '123');

    favouriteDocRef.get().then(querySnapshot => {
        return querySnapshot.docs.map(doc => doc.id); 
    }).then(favHospitalList => {
        console.log(favHospitalList); //favourite hospital list
 
        favHospitalList.forEach(hospitalId => { //iterate thru each doc
            console.log(hospitalId); //each hospital id
            console.log(hospitalInfo);
            hospitalInfo.doc(hospitalId).get()
                .then(doc => doc.data())
                .then(data => {
                    let newcard = cardTemplate.content.cloneNode(true);
                    newcard.querySelector('.card-title').innerHTML = data.name;
                    newcard.querySelector('.card-hour').innerHTML = data.hours;
                    newcard.querySelector('.card-text').innerHTML = data.details;
                    newcard.querySelector('.card-image').src = `./images/${data.code}.png`; //Example: MSJ.png
                    newcard.querySelector('a').href = "hospital_detail.html?docID=" + hospitalId;
                    document.getElementById(collection + "-go-here").appendChild(newcard);
                }).then(() => {
                    console.log(document.getElementById(collection + "-go-here"));
                    })
                
                //update title and text and image

                
            })

        })
    }

