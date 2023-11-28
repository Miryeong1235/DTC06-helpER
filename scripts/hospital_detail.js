function displayHospitalInfo() {
    // get URL of search bar and extract the id
    let params = new URL(window.location.href);

    //get value for key "id"
    let ID = params.searchParams.get("docID");
    
    // Retrieve hospital document from hospitals collection in firestore
    db.collection("hospitals")
        .doc(ID)
        .get()
        .then(doc => {
            // extract title and some pertinant information
            thisHospital = doc.data();
            hospitalCode = thisHospital.code;
            hospitalName = doc.data().name;
            hospitalHour = thisHospital.hours;
            details = thisHospital.details;
            hospitalPhoneNumber = doc.data().phoneNumber;
            hospitalAddress = doc.data().address;

            // only populate title, and image
            document.getElementById("hospitalName").innerHTML = hospitalName;
            document.getElementById("hospitalHour").innerHTML = hospitalHour;
            document.getElementById("details").innerHTML = details;

            // populate hospital information
            let imgEvent = document.querySelector(".hospital-img");
            imgEvent.src = `./images/${hospitalCode}.png`;
            document.getElementById("hospitalPhoneNumber").innerHTML = hospitalPhoneNumber;
            document.getElementById("hospitalAddress").innerHTML = hospitalAddress;
        });
}

// execute the display hospital info when this script is loaded
displayHospitalInfo();