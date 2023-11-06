function writeProfile() {
    user = firebase.auth().currentUser;
    
    var user_profile = db.collection('userProfiles').doc(user.uid);
    var user_profile_extension = user_profile.collection('extension');
    var tobacco = document.getElementsByName('tobacco');
    var alcohol = document.getElementsByName('alcohol');
    
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
    }).then(function () {
        for (i = 0; i < tobacco.length; i++) {
            if (tobacco[i].checked) {
                tobacco_val = tobacco[i].getAttribute('id')
                break;
            }
        }
        for (i = 0; i < alcohol.length; i++) {
            if (alcohol[i].checked) {
                alcohol_val = alcohol[i].getAttribute('id')
                break;
            }
        }
        user_profile_extension.doc('smoke_and_drink').set({
            tobacco: tobacco_val,
            alcohol: alcohol_val
        })
        if ($("#exampleInputEmergengyName").val()) {
            user_profile_extension.doc('emergency_contact').set({
                name: $("#exampleInputEmergengyName").val(),
                phone: $("#exampleInputEmergengyPhone").val(),
                relationship: $("#exampleInputRelation").val(),
            })
        }
        if ($("#exampleInputFamilyDoctorName").val()) {
            user_profile_extension.doc('family_doctor').set({
                name: $("#exampleInputFamilyDoctorName").val(),
                clinic: $("#exampleInputFamilyClinicName").val(),
                phone: $("#exampleInputDoctorPhone").val(),
            })
        }
        if ($("#exampleInputMedications").val()) {
            user_profile_extension.doc('medical_history').set({
                medication: $("#exampleInputMedications").val(),
                allergy: $("#exampleInputAllergies").val(),
                surgery: $("#exampleInputSurgery").val(),
            })
        }
        if ($("#exampleInputAdditional").val()) {
            user_profile_extension.doc('additional').set({
                info: $("#exampleInputAdditional").val()
            })
        }
    }).then(function () {
        console.log("user profile updated");
        // window.location.assign("confirm_registration.html");
    }).catch(function (error) {
        console.log("Error adding user registration: " + error);
    });
}