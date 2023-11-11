function writeProfile() {
    var user = firebase.auth().currentUser;

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
                tobacco_id = tobacco[i].getAttribute('id');
                tobacco_val = $(`#${tobacco_id}Label`).text();
                break;
            }
        }
        for (i = 0; i < alcohol.length; i++) {
            if (alcohol[i].checked) {
                alcohol_id = alcohol[i].getAttribute('id');
                alcohol_val = $(`#${alcohol_id}Label`).text();
                break;
            }
        }
        user_profile_extension.doc('smoke_and_drink').set({
            tobacco: tobacco_val,
            alcohol: alcohol_val
        })
        console.log($("#exampleInputEmergengyName").val(), 'outside emergency')
        if ($("#exampleInputEmergengyName").val()) {
            console.log('inside the if for emergency')
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
    }).then(function() {
        window.location.assign("confirm_registration.html");
    }).catch(function (error) {
        console.log("Error adding user registration: " + error);
    });
}

function readProfile() {
    firebase.auth().onAuthStateChanged(user => {

        var user_profile = db.collection('userProfiles').doc(user.uid);
        var user_profile_extension = user_profile.collection('extension');
        // var tobacco = document.getElementsByName('tobacco');
        // var alcohol = document.getElementsByName('alcohol');

        user_profile.get().then(profile => {
            let data = profile.data();
            if (data) {
                $("#exampleInputFname").text(data.first_name);
                $("#exampleInputLname").text(data.last_name);
                $("#exampleInputEmail1").text(data.email);
                $("#exampleInputdof").text(data.date_of_birth);
                $("#exampleInputPhone").text(data.phone);
                $("#exampleInputPHN").text(data.phn);
                $("#exampleInputStreetNumber").text(data.street_no);
                $("#exampleInputStreetName").text(data.street_name);
                $("#exampleInputCity").text(data.city);
                $("#exampleInputProvince").text(data.province);
                $("#exampleInputPostalCode").text(data.postal_code);
            }
        })

        user_profile_extension.doc('emergency_contact').get().then(emergency => {
            let data = emergency.data();
            if (data) {
                $("#exampleInputEmergengyName").text(data.name);
                $("#exampleInputEmergengyPhone").text(data.phone);
                $("#exampleInputRelation").text(data.relationship);
            }
        })

        user_profile_extension.doc('medical_history').get().then(medical => {
            let data = medical.data();
            if (data) {
                $("#exampleInputMedications").text(data.medication);
                $("#exampleInputAllergies").text(data.allergy);
                $("#exampleInputSurgery").text(data.surgery);
            }
        })

        user_profile_extension.doc('family_doctor').get().then(doctor => {
            let data = doctor.data();
            if (data) {
                $("#exampleInputFamilyDoctorName").text(data.name);
                $("#exampleInputFamilyClinicName").text(data.clinic);
                $("#exampleInputDoctorPhone").text(data.phone);
            }
        })

        user_profile_extension.doc('smoke_and_drink').get().then(alcohol_cigarette => {
            let data = alcohol_cigarette.data();
            if (data) {
                $("#exampleInputAlcohol").text(data.alcohol);
                $("#exampleInputCigarette").text(data.tobacco);
            }
        })

        user_profile_extension.doc('additional').get().then(addition => {
            if (addition.data()) {
                $("#exampleInputAdditional").text(addition.data().info);
            }
        })


        // user_profile_extension.doc('additional').data().info);
        // })
        // .then(function () {
        //     for (i = 0; i < tobacco.length; i++) {
        //         if (tobacco[i].checked) {
        //             tobacco_val = tobacco[i].getAttribute('id')
        //             break;
        //         }
        //     }
        //     for (i = 0; i < alcohol.length; i++) {
        //         if (alcohol[i].checked) {
        //             alcohol_val = alcohol[i].getAttribute('id')
        //             break;
        //         }
        //     }
        //     user_profile_extension.doc('smoke_and_drink').set({
        //         tobacco: tobacco_val,
        //         alcohol: alcohol_val
        //     })
        // }).then(function () {
        //     console.log("user profile updated");
        //     window.location.assign("confirm_registration.html");
        // }).catch(function (error) {
        //     console.log("Error adding user registration: " + error);
        // });
    })
}
