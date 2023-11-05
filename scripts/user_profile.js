function writeProfile() {
    user = firebase.auth().currentUser;
    
    var user_profile = db.collection('userProfiles').doc(user.uid);
    var user_profile_extension = user_profile.collection('extension');
    user_profile.set({
        first_name: $("#exampleInputFname").val(),
        last_name: $("#exampleInputLname").val(),
        surgery: $("#exampleInputSurgery").val(),
        email: $("#exampleInputEmail1").val(),
        date_of_birth: $("#exampleInputdof").val(),
        phone: $("#exampleInputPhone").val(),
        phn: $("#exampleInputPHN").val(),
        street_no: $("#exampleInputStreetNumber").val(),
        street_name: $("#exampleInputStreetName").val(),
        city: $("#exampleInputCity").val(),
        province: $("#exampleInputProvince").val(),
        postal_code: $("#exampleInputPostalCode").val(),
        
        // date_of_birth: $("#").val(),
        // date_of_birth: $("#").val(),
        // date_of_birth: $("#").val(),
    }).then(function () {
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
    }).then(function () {
        console.log("user profile updated");
        window.location.assign("confirm_registration.html");
    }).catch(function (error) {
        console.log("Error adding user registration: " + error);
    });
}