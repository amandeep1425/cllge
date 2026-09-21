/* =========================================
   SDSP STUDENT PROFILE - PART 4
========================================= */


/* =========================================
   GET APPLICATION
========================================= */

function getApplication() {

    const saved =
        localStorage.getItem(
            "sdspAdmissionApplication"
        );

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Invalid application data.",
            error
        );

        return null;
    }
}


/* =========================================
   LOAD APPLICATION
========================================= */

function loadApplication() {

    const application =
        getApplication();


    if (!application) {

        showMessage(
            "No admission application was found. Please complete registration first.",
            "error"
        );

        document.getElementById(
            "saveProfileBtn"
        ).disabled = true;

        return;
    }


    document.getElementById(
        "applicationNumber"
    ).textContent =
        application.applicationNumber || "-";


    document.getElementById(
        "studentName"
    ).textContent =
        application.studentName || "-";


    document.getElementById(
        "studentCourse"
    ).textContent =
        application.course || "-";


    document.getElementById(
        "testStatus"
    ).textContent =
        application.testStatus || "-";


    /*
        Student should only continue if
        entrance test was passed.
    */

    if (
        application.testStatus !==
        "Test Passed"
    ) {

        showMessage(
            "Your entrance test has not been cleared. You cannot continue with the profile at this stage.",
            "error"
        );

        document.getElementById(
            "saveProfileBtn"
        ).disabled = true;

        return;
    }


    /*
        If profile was previously saved,
        load existing information.
    */

    if (application.profile) {

        const profile =
            application.profile;


        document.getElementById(
            "fatherName"
        ).value =
            profile.fatherName || "";


        document.getElementById(
            "motherName"
        ).value =
            profile.motherName || "";


        document.getElementById(
            "dob"
        ).value =
            profile.dob || "";


        document.getElementById(
            "gender"
        ).value =
            profile.gender || "";


        document.getElementById(
            "category"
        ).value =
            profile.category || "";


        document.getElementById(
            "aadhaar"
        ).value =
            profile.aadhaar || "";


        document.getElementById(
            "address"
        ).value =
            profile.address || "";


        document.getElementById(
            "board"
        ).value =
            profile.board || "";


        document.getElementById(
            "passingYear"
        ).value =
            profile.passingYear || "";


        document.getElementById(
            "marks"
        ).value =
            profile.marks || "";


        document.getElementById(
            "rollNumber"
        ).value =
            profile.rollNumber || "";

    }

}


/* =========================================
   FILE VALIDATION
========================================= */

function validateFile(
    inputId,
    required = true
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) {
        return false;
    }


    const file =
        input.files[0];


    if (!file) {

        if (required) {

            showMessage(
                "Please upload all required documents.",
                "error"
            );

            return false;
        }

        return true;
    }


    const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/png"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showMessage(
            "Only PDF, JPG and PNG files are allowed.",
            "error"
        );

        return false;
    }


    /*
        Frontend demo file-size limit.

        Final limit should also be enforced
        by the backend.
    */

    const maxSize =
        5 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        showMessage(
            "Each document must be smaller than 5 MB.",
            "error"
        );

        return false;
    }


    return true;
}


/* =========================================
   PROFILE FORM
========================================= */

const profileForm =
    document.getElementById(
        "studentProfileForm"
    );


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const application =
                getApplication();


            if (!application) {

                showMessage(
                    "Application data not found.",
                    "error"
                );

                return;
            }


            if (
                application.testStatus !==
                "Test Passed"
            ) {

                showMessage(
                    "You must pass the entrance test before completing your profile.",
                    "error"
                );

                return;
            }


            /* Aadhaar validation */

            const aadhaar =
                document
                    .getElementById("aadhaar")
                    .value
                    .trim();


            if (
                !/^[0-9]{12}$/.test(
                    aadhaar
                )
            ) {

                showMessage(
                    "Please enter a valid 12-digit Aadhaar number.",
                    "error"
                );

                return;
            }


            /* File validation */

            if (
                !validateFile(
                    "photo",
                    true
                )
            ) {
                return;
            }


            if (
                !validateFile(
                    "aadhaarDocument",
                    true
                )
            ) {
                return;
            }


            if (
                !validateFile(
                    "qualificationDocument",
                    true
                )
            ) {
                return;
            }


            if (
                !validateFile(
                    "categoryDocument",
                    false
                )
            ) {
                return;
            }


            /* Profile object */

            const profile = {

                fatherName:
                    document
                        .getElementById(
                            "fatherName"
                        )
                        .value
                        .trim(),

                motherName:
                    document
                        .getElementById(
                            "motherName"
                        )
                        .value
                        .trim(),

                dob:
                    document
                        .getElementById(
                            "dob"
                        )
                        .value,

                gender:
                    document
                        .getElementById(
                            "gender"
                        )
                        .value,

                category:
                    document
                        .getElementById(
                            "category"
                        )
                        .value,

                aadhaar:
                    aadhaar,

                address:
                    document
                        .getElementById(
                            "address"
                        )
                        .value
                        .trim(),

                board:
                    document
                        .getElementById(
                            "board"
                        )
                        .value
                        .trim(),

                passingYear:
                    document
                        .getElementById(
                            "passingYear"
                        )
                        .value,

                marks:
                    document
                        .getElementById(
                            "marks"
                        )
                        .value,

                rollNumber:
                    document
                        .getElementById(
                            "rollNumber"
                        )
                        .value
                        .trim()

            };


            /*
                Demo document metadata.

                IMPORTANT:
                Actual files are NOT uploaded to college
                by localStorage.

                Real backend will upload files securely.
            */

            const documents = {

                photo:
                    getFileName("photo"),

                aadhaar:
                    getFileName(
                        "aadhaarDocument"
                    ),

                qualification:
                    getFileName(
                        "qualificationDocument"
                    ),

                category:
                    getFileName(
                        "categoryDocument"
                    )

            };


            application.profile =
                profile;


            application.documents =
                documents;


            application.status =
                "Payment Pending";


            application.profileCompletedAt =
                new Date().toISOString();


            localStorage.setItem(
                "sdspAdmissionApplication",
                JSON.stringify(
                    application
                )
            );


            showMessage(
                `
                <strong>Profile Saved Successfully.</strong><br>
                Your information has been saved.
                You can now continue to the payment stage.
                `,
                "success"
            );


            const button =
                document.getElementById(
                    "saveProfileBtn"
                );


            button.innerHTML =
                "Proceed to Payment <span>→</span>";


            button.onclick =
                function() {

                    window.location.href =
                        "payment.html";

                };

        }
    );
}


/* =========================================
   GET FILE NAME
========================================= */

function getFileName(inputId) {

    const input =
        document.getElementById(
            inputId
        );


    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {

        return null;
    }


    return input.files[0].name;
}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "profileMessage"
        );


    if (!box) {
        return;
    }


    box.className =
        `profile-message ${type}`;


    box.innerHTML =
        message;


    window.scrollTo({
        top: 250,
        behavior: "smooth"
    });

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadApplication();

    }
);
