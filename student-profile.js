/* =========================================
   SDSP STUDENT PROFILE - PART 4
   GOOGLE SHEET INTEGRATION
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxp1t5L3GCP2QDqE3FRuIim3tmGNdTiHcJCR-wg3x-xxtS7Mhm87BFsmg2w9tMr5WK/exec";


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

        const button =
            document.getElementById(
                "saveProfileBtn"
            );

        if (button) {
            button.disabled = true;
        }

        return;
    }


    document.getElementById(
        "applicationNumber"
    ).textContent =
        application.applicationId ||
        application.applicationNumber ||
        "-";


    document.getElementById(
        "studentName"
    ).textContent =
        application.studentName ||
        "-";


    document.getElementById(
        "studentCourse"
    ).textContent =
        application.course ||
        "-";


    document.getElementById(
        "testStatus"
    ).textContent =
        application.testStatus ||
        "-";


    /* =========================================
       CHECK ENTRANCE TEST STATUS

       Supports:
       "Passed"
       "Test Passed"
    ========================================= */

    const testPassed =
        application.testStatus === "Passed" ||
        application.testStatus === "Test Passed";


    if (!testPassed) {

        showMessage(
            "Your entrance test has not been cleared. You cannot continue with the profile at this stage.",
            "error"
        );

        const button =
            document.getElementById(
                "saveProfileBtn"
            );

        if (button) {
            button.disabled = true;
        }

        return;
    }


    /* =========================================
       LOAD PREVIOUS PROFILE
    ========================================= */

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
        async function(event) {

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


            /* =========================================
               CHECK TEST STATUS
            ========================================= */

            const testPassed =
                application.testStatus === "Passed" ||
                application.testStatus === "Test Passed";


            if (!testPassed) {

                showMessage(
                    "You must pass the entrance test before completing your profile.",
                    "error"
                );

                return;
            }


            /* =========================================
               AADHAAR VALIDATION
            ========================================= */

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


            /* =========================================
               FILE VALIDATION
            ========================================= */

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


            /* =========================================
               GET PROFILE DATA
            ========================================= */

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


            /* =========================================
               DOCUMENT INFORMATION

               Actual files are not uploaded here yet.
               File names are stored for now.
            ========================================= */

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


            /* =========================================
               DISABLE BUTTON
            ========================================= */

            const button =
                document.getElementById(
                    "saveProfileBtn"
                );


            if (button) {

                button.disabled = true;

                button.innerHTML =
                    "Saving Profile...";

            }


            showMessage(
                "Saving your profile information...",
                "success"
            );


            /* =========================================
               GOOGLE SHEET DATA
            ========================================= */

            const profileData = {

                action:
                    "studentProfile",

                applicationId:
                    application.applicationId ||
                    application.applicationNumber ||
                    "",

                studentId:
                    application.studentId ||
                    "",

                fatherName:
                    profile.fatherName,

                motherName:
                    profile.motherName,

                dob:
                    profile.dob,

                gender:
                    profile.gender,

                category:
                    profile.category,

                aadhaar:
                    profile.aadhaar,

                address:
                    profile.address,

                board:
                    profile.board,

                passingYear:
                    profile.passingYear,

                marks:
                    profile.marks,

                rollNumber:
                    profile.rollNumber,

                profileStatus:
                    "Completed",

                submittedAt:
                    new Date().toISOString()

            };


            /* =========================================
               SEND PROFILE TO GOOGLE SHEET
            ========================================= */

            try {

                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(
                                    profileData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Unable to save student profile."
                    );

                }


                /* =========================================
                   SAVE LOCALLY
                ========================================= */

                application.profile =
                    profile;


                application.documents =
                    documents;


                application.profileStatus =
                    "Completed";


                application.documentsStatus =
                    "Pending";


                application.status =
                    "Documents Pending";


                application.profileCompletedAt =
                    new Date().toISOString();


                localStorage.setItem(
                    "sdspAdmissionApplication",
                    JSON.stringify(
                        application
                    )
                );


                /* =========================================
                   SUCCESS MESSAGE
                ========================================= */

                showMessage(
                    `
                    <strong>Profile Saved Successfully!</strong>
                    <br><br>
                    Your student profile has been submitted.
                    <br><br>
                    Next step:
                    <strong>Document Submission</strong>.
                    `,
                    "success"
                );


                /* =========================================
                   NEXT BUTTON
                ========================================= */

                if (button) {

                    button.disabled = false;

                    button.innerHTML =
                        "Proceed to Documents <span>→</span>";


                    button.onclick =
                        function() {

                            window.location.href =
                                "documents.html";

                        };

                }


            } catch (error) {

                console.error(
                    "Profile submission error:",
                    error
                );


                showMessage(
                    `
                    <strong>Unable to Save Profile</strong>
                    <br><br>
                    There was a problem connecting to
                    the admission database.
                    <br><br>
                    Please check your internet connection
                    and try again.
                    `,
                    "error"
                );


                if (button) {

                    button.disabled = false;

                    button.innerHTML =
                        "Save Student Profile <span>→</span>";

                }

            }

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
