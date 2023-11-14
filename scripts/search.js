function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function createQueryFromURL() {
    const hospitalName = getQueryParam("query");
    console.log(hospitalName);
    const hospitalRef = db.collection("hospitals");
    console.log(hospitalRef);

    return hospitalRef.where("name", "==", hospitalName);
}

// Function to display cards dynamically based on query
async function displayCardsDynamically(query) {
    let cardTemplate = document.getElementById("hospitalCardTemplate");
    console.log(query)
    try {
        // Correct syntax for Firebase SDK 8.10.0
        const querySnapshot = await query.get();
        querySnapshot.forEach(doc => {
            var title = doc.data().name;
            var details = doc.data().details;
            var hospitalCode = doc.data().code;
            var hospitalHour = doc.data().hours;
            var docID = doc.id;
            let newcard = cardTemplate.content.cloneNode(true);

            // Assuming fillHeart is a defined function
            fillHeart(newcard, docID);
            newcard.querySelector('.card-title').innerHTML = title;
            newcard.querySelector('.card-hour').innerHTML = hospitalHour;
            newcard.querySelector('.card-text').innerHTML = details;
            newcard.querySelector('.card-image').src = `./images/${hospitalCode}.png`;
            newcard.querySelector('a').href = `hospital_detail.html?docID=${docID}`;

            document.getElementById("hospitals-go-here").appendChild(newcard);
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

const userQuery = createQueryFromURL();
displayCardsDynamically(userQuery);