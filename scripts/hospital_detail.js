function displayHospitalInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    // console.log("param is =", params)
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("hospitals")
        .doc(ID)
        .get()
        .then(doc => {
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

            let imgEvent = document.querySelector(".hospital-img");
            imgEvent.src = `./images/${hospitalCode}.png`;
            document.getElementById("hospitalPhoneNumber").innerHTML = hospitalPhoneNumber;
            document.getElementById("hospitalAddress").innerHTML = hospitalAddress;
        });
        return ID
}

displayHospitalInfo();