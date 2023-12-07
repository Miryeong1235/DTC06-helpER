// -----------------------------
// This script is used to display cards dynamically based on query
// -----------------------------
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to display cards dynamically based on query
async function displayCardsDynamically(query) {
    // Get the query from the URL
    var user = firebase.auth().currentUser;
    let cardTemplate = document.getElementById("hospitalCardTemplate");
    console.log('Query is "' + query + '"')
    try {
        // Get all the hospitals
        db.collection('hospitals').get().then((docs) => {
            docs.forEach(doc => {
                if (doc.data().name.toLowerCase().includes(query.toLowerCase())) { // If the hospital name contains the query
                    // Get the hospital details from the database
                    var title = doc.data().name;
                    var details = doc.data().details;
                    var hospitalCode = doc.data().code;
                    var hospitalHour = doc.data().hours;
                    var docID = doc.id;
                    let newcard = cardTemplate.content.cloneNode(true);

                    // Add the hospital details to the card
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-hour').innerHTML = hospitalHour;
                    newcard.querySelector('.card-text').innerHTML = details;
                    newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`;
                    newcard.querySelector('a').href = `hospital_detail.html?docID=${docID}`;
                    newcard.querySelector('i').id = "heart-" + docID;
                    newcard.querySelector('i').onclick = () => updateBookmark(docID); // Add event listener to the bookmark icon

                    // Add the card to the page
                    document.getElementById("hospitals-go-here").appendChild(newcard);

                    // Check if the user is logged in
                    firebase.auth().onAuthStateChanged(user => {
                        if (user) { // If user is logged in
                            let currentUser = db.collection("userProfiles").doc(user.uid);
                            currentUser.get().then(userDoc => {
                                if (userDoc.exists) { // If user profile exists, check if the hospital is bookmarked
                                    var bookmarks = userDoc.data().bookmarks;
                                    if (bookmarks.includes(docID)) { // If already bookmarked, change the bookmark icon
                                        document.getElementById('heart-' + docID).innerHTML = 'bookmark'
                                    }
                                }
                            });
                        } else { // If user is not logged in
                            console.log('user not logged in')
                        }
                    })
                }
            });
            if (document.getElementById("hospitals-go-here").innerHTML.trim() == '') { // If no result match to the query, display error message
                document.getElementById("hospitals-go-here").innerHTML += `<p class="pt-5 mt-5 text-secondary">No result match to "${query}"!</p>`;
                document.getElementById("hospitals-go-here").innerHTML += `<p class="py-1 text-secondary">Please try again with different query!</p>`;
            }
        })

    } catch (error) { // If error, log the error
        console.error("Error fetching data: ", error);
    }
}

// Get the query from the URL and display cards dynamically
const userQuery = getQueryParam('query');
displayCardsDynamically(userQuery);