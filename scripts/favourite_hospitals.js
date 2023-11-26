
var hospitalIdList = undefined;

var userUid = undefined;

function getUserId() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            userUid = user.uid;
            userName = user.displayName;
            $("#name-goes-here").text(userName);

            getBookmarks();
        } else {
            console.log('User not logged in')
        }
    })
}

function setup() {
    getUserId();
}


function getBookmarks() {
    let currentUser = db.collection("userProfiles").doc(userUid);
    currentUser.get().then(userDoc => {
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

                        //Finally, attach this new card to the gallery
                        document.getElementById("favourite-go-here").appendChild(newcard);

                        // update the bookmark if the hospital is saved as favourite for the current user
                        if (bookmarks.includes(thisHospitalID)) {
                            // If already bookmarked, remove the bookmark
                            document.getElementById('heart-' + thisHospitalID).innerHTML = 'bookmark'
                        }
                    })
                })
            } else {
                if (document.getElementById("favourite-go-here").innerHTML.trim() == '') {
                    document.getElementById("favourite-go-here").innerHTML += '<p class="py-5 my-5">You have not saved any hospital yet!</p>';
                }
            }


        };
    })
}

$(document).ready(setup)
