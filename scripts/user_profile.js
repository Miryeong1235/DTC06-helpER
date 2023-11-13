function populateUserInfo() {
    console.log('populate user info from firestore database');
    readProfile(true);
}

function writeProfile() {
    var user = firebase.auth().currentUser;

    var user_profile = db.collection('userProfiles').doc(user.uid);
    var user_profile_extension = user_profile.collection('extension');
    var tobacco = document.getElementsByName('tobacco');
    var alcohol = document.getElementsByName('alcohol');

    // write basic info
    user_profile.set({
        first_name: $("#exampleInputFname").val(),
        last_name: $("#exampleInputLname").val(),
        email: $("#exampleInputEmail1").val(),
        date_of_birth: $("#exampleInputdof").val(),
        phone: $("#exampleInputPhone").val(),
        phn: $("#exampleInputPHN").val(),
        street_no: $("#exampleInputStreetNumber").val(),
        street_name: $("#exampleInputStreetName").val(),
        city: $("#exampleInputCity").val(),
        province: $("#exampleInputProvince").val(),
        postal_code: $("#exampleInputPostalCode").val(),
    });

    // retrieve smoking frequency
    for (i = 0; i < tobacco.length; i++) {
        if (tobacco[i].checked) {
            tobacco_id = tobacco[i].getAttribute('id');
            tobacco_val = $(`#${tobacco_id}Label`).text();
            break;
        }
    };

    // retrieve drinking frequency
    for (i = 0; i < alcohol.length; i++) {
        if (alcohol[i].checked) {
            alcohol_id = alcohol[i].getAttribute('id');
            alcohol_val = $(`#${alcohol_id}Label`).text();
            break;
        }
    };

    // write emergency contact
    console.log($("#exampleInputEmergengyName").val(), 'outside emergency')
    if ($("#exampleInputEmergengyName").val()) {
        console.log('inside the if for emergency')
        user_profile_extension.doc('emergency_contact').set({
            name: $("#exampleInputEmergengyName").val(),
            phone: $("#exampleInputEmergengyPhone").val(),
            relationship: $("#exampleInputRelation").val(),
        })
    };

    // write family doctor
    if ($("#exampleInputFamilyDoctorName").val()) {
        user_profile_extension.doc('family_doctor').set({
            name: $("#exampleInputFamilyDoctorName").val(),
            clinic: $("#exampleInputFamilyClinicName").val(),
            phone: $("#exampleInputDoctorPhone").val(),
        })
    };

    // write medical history
    if ($("#exampleInputMedications").val()) {
        user_profile_extension.doc('medical_history').set({
            medication: $("#exampleInputMedications").val(),
            allergy: $("#exampleInputAllergies").val(),
            surgery: $("#exampleInputSurgery").val(),
        })
    };

    // write additional info
    if ($("#exampleInputAdditional").val()) {
        user_profile_extension.doc('additional').set({
            info: $("#exampleInputAdditional").val()
        })
    };

    // write drinking and smoking frequency
    user_profile_extension.doc('smoke_and_drink').set({
        tobacco: tobacco_val,
        alcohol: alcohol_val
    }).then(() => {
        console.log("user profile updated");
    }).then(() => {
        window.location.assign("confirm_registration.html");
    }).catch((error) => {
        console.log("Error adding user registration: " + error);
    });
}

function readProfile(autofillRegistration = false) {
    firebase.auth().onAuthStateChanged(user => {

        var user_profile = db.collection('userProfiles').doc(user.uid);
        var user_profile_extension = user_profile.collection('extension');

        user_profile.get().then(profile => {
            let data = profile.data();
            if (data) {
                let elementIds = ['exampleInputFname', 'exampleInputLname', 'exampleInputEmail1', 'exampleInputdof', 'exampleInputPhone',
                    'exampleInputPHN', 'exampleInputStreetNumber', 'exampleInputStreetName', 'exampleInputCity', 'exampleInputProvince', 
                    'exampleInputPostalCode'];
                let attrNames = ['first_name', 'last_name', 'email', 'date_of_birth', 'phone', 'phn', 'street_no', 'street_name', 'city', 
                    'province', 'postal_code']
                for (i = 0; i < elementIds.length; i++) {
                    let elementId = elementIds[i];
                    if (autofillRegistration) {
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else {
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }}
            }
        )

        user_profile_extension.doc('emergency_contact').get().then(emergency => {
            let data = emergency.data();
            if (data) {
                let elementIds = ['exampleInputEmergengyName', 'exampleInputEmergengyPhone', 'exampleInputRelation'];
                let attrNames = ['name', 'phone', 'relationship']
                for (i = 0; i < elementIds.length; i++) {
                    let elementId = elementIds[i];
                    if (autofillRegistration) {
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else {
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        user_profile_extension.doc('medical_history').get().then(medical => {
            let data = medical.data();
            if (data) {
                let elementIds = ['exampleInputMedications', 'exampleInputAllergies', 'exampleInputSurgery'];
                let attrNames = ['medication', 'allergy', 'surgery']
                for (i = 0; i < elementIds.length; i++) {
                    let elementId = elementIds[i];
                    if (autofillRegistration) {
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else {
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        user_profile_extension.doc('family_doctor').get().then(doctor => {
            let data = doctor.data();
            if (data) {
                let elementIds = ['exampleInputFamilyDoctorName', 'exampleInputFamilyClinicName', 'exampleInputDoctorPhone'];
                let attrNames = ['name', 'clinic', 'phone']
                for (i = 0; i < elementIds.length; i++) {
                    let elementId = elementIds[i];
                    if (autofillRegistration) {
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else {
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        user_profile_extension.doc('smoke_and_drink').get().then(alcohol_cigarette => {
            let data = alcohol_cigarette.data();
            if (data) {
                if (!autofillRegistration) {
                    $("#exampleInputAlcohol").text(data.alcohol);
                    $("#exampleInputCigarette").text(data.tobacco);
                } else {
                    let formControl = document.getElementsByClassName('form-check-label');

                    // loop through elements in form-control classes
                    for (i = 0; i < formControl.length; i++) {
                        labelElementId = formControl[i].id;
                        inputElementId = labelElementId.substring(0, labelElementId.indexOf('Label'));
                        inputElementInnerHTML = $(`#${labelElementId}`).text().trim();
                        console.log(1, data.alcohol.trim(), data.tobacco.trim(), 2, inputElementInnerHTML)
                        if ([data.alcohol.trim(), data.tobacco.trim()].includes(inputElementInnerHTML)) {
                            $(`#${inputElementId}`)[0].checked = true;
                        } else {
                            $(`#${inputElementId}`)[0].checked = false;
                        };
                    }
                }
            }
        });

        user_profile_extension.doc('additional').get().then(addition => {
            if (addition.data()) {
                if (autofillRegistration) {
                    $("#exampleInputAdditional").val(addition.data().info);
                } else {
                    $("#exampleInputAdditional").text(addition.data().info);
                }
            }
        })
    })
}
