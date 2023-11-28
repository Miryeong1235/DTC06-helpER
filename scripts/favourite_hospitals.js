// initialize userUid as global variables
var userUid = undefined;

// update userUid in the global variable and get display name from the user Auth to use in html
function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            userUid = user.uid;
            userName = user.displayName;

            // display user's name in html
            $("#name-goes-here").text(userName);

            // reflect user's bookmark record
            getBookmarks();
        } else {
            console.log('User not logged in')
        }
    })
}

// reflect user's bookmark preference from records in firestore
function getBookmarks() {
    // Retrieve user document from userProfiles collection in firestore
    let currentUser = db.collection("userProfiles").doc(userUid);
    
    currentUser.get().then(userDoc => {
        // execute if the user document exists in the firestore
        if (userDoc.exists) {
            // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            if (bookmarks.length > 0) {
                // Get pointer the new card template
                let newcardTemplate = document.getElementById("favouriteHospitalTemplate");

                // Iterate through the ARRAY of bookmarked hospitals (document ID's)
                bookmarks.forEach(thisHospitalID => {
                    db.collection("hospitals").doc(thisHospitalID).get().then(doc => {
                        var title = doc.data().name; // get value of the "name" key
                        var details = doc.data().details;
                        var hospitalCode = doc.data().code;
                        var hospitalHour = doc.data().hours;

                        //clone the new card
                        let newcard = newcardTemplate.content.cloneNode(true);

                        //update title and some pertinant information
                        newcard.querySelector('.card-title').innerHTML = title;
                        newcard.querySelector('.card-hour').innerHTML = hospitalHour;
                        newcard.querySelector('.card-text').innerHTML = details;
                        newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`;
                        newcard.querySelector('a').href = "hospital_detail.html?docID=" + thisHospitalID;
                        newcard.querySelector('i').id = "heart-" + thisHospitalID;
                        newcard.querySelector('i').onclick = () => updateBookmark(thisHospitalID);

                        //Finally, attach this new card to the favorite hospital list
                        document.getElementById("favourite-go-here").appendChild(newcard);

                        // update the bookmark if the hospital is saved as favourite for the current user
                        if (bookmarks.includes(thisHospitalID)) {
                            // If already bookmarked, remove the bookmark
                            document.getElementById('heart-' + thisHospitalID).innerHTML = 'bookmark'
                        }
                    })
                })
            } else {
                // Display a message if there is no hospital newcard information appended
                if (document.getElementById("favourite-go-here").innerHTML.trim() == '') {
                    document.getElementById("favourite-go-here").innerHTML += '<p class="py-5 my-5 text-secondary">You have not saved any hospital yet!</p>';
                }
            }
        };
    })
}

// the setup function when this script is loaded
function setup() {
    // update the userUid gobal variable at the beginning
    getUserId();
}

$(document).ready(setup)
