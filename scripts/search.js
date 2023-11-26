function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param).toLowerCase();
}

// Function to display cards dynamically based on query
async function displayCardsDynamically(query) {
    var user = firebase.auth().currentUser;
    let cardTemplate = document.getElementById("hospitalCardTemplate");
    console.log('Query is "' + query + '"')
    try {
        // Correct syntax for Firebase SDK 8.10.0
        db.collection('hospitals').get().then((docs) => {
            docs.forEach(doc => {
                if (doc.data().name.toLowerCase().includes(query)) {
                    var title = doc.data().name;
                    var details = doc.data().details;
                    var hospitalCode = doc.data().code;
                    var hospitalHour = doc.data().hours;
                    var docID = doc.id;
                    let newcard = cardTemplate.content.cloneNode(true);

                    // Assuming fillHeart is a defined function
                    // fillHeart(newcard, docID);
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-hour').innerHTML = hospitalHour;
                    newcard.querySelector('.card-text').innerHTML = details;
                    newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`;
                    newcard.querySelector('a').href = `hospital_detail.html?docID=${docID}`;
                    newcard.querySelector('i').id = "heart-" + docID;
                    newcard.querySelector('i').onclick = () => updateBookmark(docID);

                    document.getElementById("hospitals-go-here").appendChild(newcard);

                    firebase.auth().onAuthStateChanged(user => {
                        if (user) {
                            let currentUser = db.collection("userProfiles").doc(user.uid);
                            currentUser.get().then(userDoc => {
                                if (userDoc.exists) {
                                    var bookmarks = userDoc.data().bookmarks;
                                    if (bookmarks.includes(docID)) {
                                        // If already bookmarked, remove the bookmark
                                        document.getElementById('heart-' + docID).innerHTML = 'bookmark'
                                    }
                                }
                            });
                        } else {
                            console.log('user not logged in')
                        }
                    })
                }

            });
        })

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

const userQuery = getQueryParam('query');
displayCardsDynamically(userQuery);