// ------------------------------
// Call functions to populate user profile page
// ------------------------------
function populateUserInfo() {
    console.log('populate user info from firestore database');
    readProfile(true);
}

// ------------------------------
// Call functions to write user profile to firestore database
// ------------------------------
function writeProfile() {
    //  get extension collection from firestore
    var user = firebase.auth().currentUser;
    var user_profile = db.collection('userProfiles').doc(user.uid);
    var user_profile_extension = user_profile.collection('extension');

    var tobacco = document.getElementsByName('tobacco');
    var alcohol = document.getElementsByName('alcohol');

    // write basic info
    user_profile.get()
        .then((currentUser) => {
            if (currentUser.exists) { // if user profile exists, update user profile
                user_profile.update({
                    bookmarks: firebase.firestore.FieldValue.arrayUnion(), // add bookmarks field to user profile
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
                })
            } else { // if user profile does not exist, create user profile
                user_profile.set({
                    bookmarks: firebase.firestore.FieldValue.arrayUnion(), // add bookmarks field to user profile
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
                })
            }
        })
    // retrieve smoking frequency
    for (i = 0; i < tobacco.length; i++) {
        if (tobacco[i].checked) { // if tobacco[i] is checked, retrieve the id and value of the checked element
            tobacco_id = tobacco[i].getAttribute('id');
            tobacco_val = $(`#${tobacco_id}Label`).text();
            break;
        }
    };

    // retrieve drinking frequency
    for (i = 0; i < alcohol.length; i++) {
        if (alcohol[i].checked) { // if alcohol[i] is checked, retrieve the id and value of the checked element
            alcohol_id = alcohol[i].getAttribute('id');
            alcohol_val = $(`#${alcohol_id}Label`).text();
            break;
        }
    };

    // write emergency contact
    if ($("#exampleInputEmergengyName").val()) { // if emergency contact name is not empty, write emergency contact
        user_profile_extension.doc('emergency_contact').set({
            name: $("#exampleInputEmergengyName").val(),
            phone: $("#exampleInputEmergengyPhone").val(),
            relationship: $("#exampleInputRelation").val(),
        })
    };

    // write family doctor
    if ($("#exampleInputFamilyDoctorName").val()) { // if family doctor name is not empty, write family doctor
        user_profile_extension.doc('family_doctor').set({
            name: $("#exampleInputFamilyDoctorName").val(),
            clinic: $("#exampleInputFamilyClinicName").val(),
            phone: $("#exampleInputDoctorPhone").val(),
        })
    };

    // write medical history
    if ($("#exampleInputMedications").val()) { // if medication is not empty, write medical history
        user_profile_extension.doc('medical_history').set({
            medication: $("#exampleInputMedications").val(),
            allergy: $("#exampleInputAllergies").val(),
            surgery: $("#exampleInputSurgery").val(),
        })
    };

    // write additional info
    if ($("#exampleInputAdditional").val()) { // if additional info is not empty, write additional info
        user_profile_extension.doc('additional').set({
            info: $("#exampleInputAdditional").val()
        })
    };

    var edit = sessionStorage.getItem('edit') // check if user is editing profile

    // write drinking and smoking frequency
    user_profile_extension.doc('smoke_and_drink').set({ // write drinking and smoking frequency
        tobacco: tobacco_val,
        alcohol: alcohol_val
    }).then(() => {
        console.log("user profile updated");
    }).then(() => {
        if (edit == 'true') { // if user is editing profile, redirect to confirm registration edit page
            window.location.assign("confirm_registration_edit.html");
        } else { // if user is not editing profile, redirect to confirm registration page
            window.location.assign("confirm_registration.html");
        }

    }).catch((error) => { 
        console.log("Error adding user registration: " + error);
    });
}

// ------------------------------
// Call functions to read user profile from firestore database
// ------------------------------
function readProfile(autofillRegistration = false) {
    firebase.auth().onAuthStateChanged(user => {

        // get extension collection from firestore
        var user_profile = db.collection('userProfiles').doc(user.uid);
        var user_profile_extension = user_profile.collection('extension');

        user_profile.get().then(profile => {
            let data = profile.data();
            if (data) { // if user profile exists, retrieve user profile
                // List of element ids and attribute names
                let elementIds = ['exampleInputFname', 'exampleInputLname', 'exampleInputEmail1', 'exampleInputdof', 'exampleInputPhone',
                    'exampleInputPHN', 'exampleInputStreetNumber', 'exampleInputStreetName', 'exampleInputCity', 'exampleInputProvince',
                    'exampleInputPostalCode'];
                let attrNames = ['first_name', 'last_name', 'email', 'date_of_birth', 'phone', 'phn', 'street_no', 'street_name', 'city',
                    'province', 'postal_code']

                // loop through element ids and attribute names
                for (i = 0; i < elementIds.length; i++) {
                    let elementId = elementIds[i];
                    if (autofillRegistration) { // if user is registering, autofill the form
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else { // if user has registered before, display the user profile
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        }
        )

        // retrieve emergency contact
        user_profile_extension.doc('emergency_contact').get().then(emergency => {
            let data = emergency.data();
            if (data) { // if emergency contact exists, retrieve emergency contact
                let elementIds = ['exampleInputEmergengyName', 'exampleInputEmergengyPhone', 'exampleInputRelation'];
                let attrNames = ['name', 'phone', 'relationship']
                for (i = 0; i < elementIds.length; i++) { // loop through element ids and attribute names
                    let elementId = elementIds[i];
                    if (autofillRegistration) { // if user is registering, autofill the form
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else { // if user has registered before, display the user profile
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        // retrieve medical history
        user_profile_extension.doc('medical_history').get().then(medical => {
            let data = medical.data();
            if (data) { // if medical history exists, retrieve medical history
                let elementIds = ['exampleInputMedications', 'exampleInputAllergies', 'exampleInputSurgery'];
                let attrNames = ['medication', 'allergy', 'surgery']
                for (i = 0; i < elementIds.length; i++) { // loop through element ids and attribute names
                    let elementId = elementIds[i];
                    if (autofillRegistration) { // if user is registering, autofill the form
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else { // if user has registered before, display the user profile
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        // retrieve family doctor
        user_profile_extension.doc('family_doctor').get().then(doctor => {
            let data = doctor.data();
            if (data) { // if family doctor exists, retrieve family doctor
                let elementIds = ['exampleInputFamilyDoctorName', 'exampleInputFamilyClinicName', 'exampleInputDoctorPhone'];
                let attrNames = ['name', 'clinic', 'phone']
                for (i = 0; i < elementIds.length; i++) { // loop through element ids and attribute names
                    let elementId = elementIds[i];
                    if (autofillRegistration) { // if user is registering, autofill the form
                        $(`#${elementId}`).val(data[attrNames[i]]);
                    } else { // if user has registered before, display the user profile
                        $(`#${elementId}`).text(data[attrNames[i]]);
                    }
                }
            }
        })

        // retrieve drinking and smoking frequency
        user_profile_extension.doc('smoke_and_drink').get().then(alcohol_cigarette => {
            let data = alcohol_cigarette.data();
            if (data) { // if drinking and smoking frequency exists, retrieve drinking and smoking frequency
                if (!autofillRegistration) { // if user has registered before, display the user profile
                    $("#exampleInputAlcohol").text(data.alcohol);
                    $("#exampleInputCigarette").text(data.tobacco);
                } else { // if user is registering, autofill the form
                    // get form-control classes from html
                    let formControl = document.getElementsByClassName('form-check-label');

                    // loop through elements in form-control classes
                    for (i = 0; i < formControl.length; i++) {
                        labelElementId = formControl[i].id;
                        // get input element id from label element id
                        inputElementId = labelElementId.substring(0, labelElementId.indexOf('Label'));
                        // get input element innerHTML from inputElementId
                        inputElementInnerHTML = $(`#${labelElementId}`).text().trim();
                        console.log(1, data.alcohol.trim(), data.tobacco.trim(), 2, inputElementInnerHTML)
                        // if input element innerHTML is equal to drinking or smoking frequency, select the radio button
                        if ([data.alcohol.trim(), data.tobacco.trim()].includes(inputElementInnerHTML)) {
                            $(`#${inputElementId}`)[0].checked = true;
                        } else {
                            $(`#${inputElementId}`)[0].checked = false;
                        };
                    }
                }
            }
        });

        // retrieve additional info
        user_profile_extension.doc('additional').get().then(addition => {
            if (addition.data()) { // if additional info exists, retrieve additional info
                if (autofillRegistration) { // if user is registering, autofill the form
                    $("#exampleInputAdditional").val(addition.data().info);
                } else { // if user has registered before, display the user profile
                    $("#exampleInputAdditional").text(addition.data().info);
                }
            }
        })
    })
}

// ------------------------------
// Update session storage to indicate user is editing profile
// ------------------------------
function saveEditAndRedirect() {
    // save edit as true to session storage
    sessionStorage.setItem('edit', 'true')
}