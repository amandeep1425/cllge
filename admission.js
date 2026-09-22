/* =========================================
   SDSP ADMISSION SYSTEM
   GOOGLE SHEET CONNECTED VERSION
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxp1t5L3GCP2QDqE3FRuIim3tmGNdTi3HcJCR-wg3x-xxtS7Mhm87BFsmg2w9tMr5WK/exec";


/* =========================================
   COURSE ELIGIBILITY RULES

   Frontend screening only.
========================================= */

const eligibilityRules = {

    "BA": {
        qualification: ["12th"],
        minimumPercentage: 0
    },

    "BSc Economics": {
        qualification: ["12th"],
        minimumPercentage: 40
    },

    "BCA": {
        qualification: ["12th"],
        minimumPercentage: 40
    },

    "BCom": {
        qualification: ["12th"],
        minimumPercentage: 40
    },

    "BBA": {
        qualification: ["12th"],
        minimumPercentage: 45
    },

    "PGDCA": {
        qualification: [
            "Graduation",
            "Post Graduation"
        ],
        minimumPercentage: 45
    },

    "DCA": {
        qualification: ["12th"],
        minimumPercentage: 40
    },

    "MSc Computer Science": {
        qualification: [
            "Graduation",
            "Post Graduation"
        ],
        minimumPercentage: 50
    },

    "Diploma Stitching Tailoring": {
        qualification: ["12th"],
        minimumPercentage: 0
    },

    "Diploma Cosmetology": {
        qualification: ["12th"],
        minimumPercentage: 0
    }

};


/* =========================================
   APPLICATION NUMBER
========================================= */

function generateApplicationNumber() {

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `SDSP-${year}-${randomNumber}`;
}


/* =========================================
   ELIGIBILITY CHECK
========================================= */

function checkEligibility(
    course,
    qualification,
    percentage
) {

    const rule =
        eligibilityRules[course];

    if (!rule) {

        return {
            eligible: false,
            message:
                "Eligibility information for this course is not configured yet."
        };

    }


    if (
        !rule.qualification.includes(
            qualification
        )
    ) {

        return {
            eligible: false,
            message:
                `The selected qualification does not meet the basic eligibility requirement for ${course}.`
        };

    }


    if (
        percentage <
        rule.minimumPercentage
    ) {

        return {
            eligible: false,
            message:
                `The minimum percentage required for ${course} is ${rule.minimumPercentage}%.`
        };

    }


    return {

        eligible: true,

        message:
            "You meet the basic eligibility criteria for the selected course."

    };

}


/* =========================================
   FORM
========================================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );

const registrationMessage =
    document.getElementById(
        "registrationMessage"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* -----------------------------
               GET FORM VALUES
            ----------------------------- */

            const name =
                document
                    .getElementById(
                        "studentName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "studentEmail"
                    )
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById(
                        "studentMobile"
                    )
                    .value
                    .trim();


            const course =
                document
                    .getElementById(
                        "course"
                    )
                    .value;


            const qualification =
                document
                    .getElementById(
                        "qualification"
                    )
                    .value;


            const percentage =
                Number(
                    document
                        .getElementById(
                            "percentage"
                        )
                        .value
                );


            /* -----------------------------
               BASIC VALIDATION
            ----------------------------- */

            if (
                !name ||
                !email ||
                !mobile ||
                !course ||
                !qualification
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                return;
            }


            if (
                Number.isNaN(
                    percentage
                ) ||
                percentage < 0 ||
                percentage > 100
            ) {

                showMessage(
                    "Please enter a valid percentage between 0 and 100.",
                    "error"
                );

                return;
            }


            /* -----------------------------
               ELIGIBILITY
            ----------------------------- */

            const eligibility =
                checkEligibility(
                    course,
                    qualification,
                    percentage
                );


            if (
                !eligibility.eligible
            ) {

                showMessage(
                    eligibility.message,
                    "error"
                );

                return;
            }


            /* -----------------------------
               BUTTON
            ----------------------------- */

            const button =
                registrationForm.querySelector(
                    ".registration-btn"
                );


            if (button) {

                button.disabled = true;

                button.innerHTML =
                    "Registering...";

            }


            /* -----------------------------
               SEND TO GOOGLE SHEET
            ----------------------------- */

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

                            body: JSON.stringify({

                                action:
                                    "register",

                                studentName:
                                    name,

                                email:
                                    email,

                                mobile:
                                    mobile,

                                course:
                                    course,

                                qualification:
                                    qualification,

                                percentage:
                                    percentage,

                                eligibility:
                                    "Basic Eligibility Passed"

                            })

                        }
                    );


                const result =
                    await response.json();


                /* -----------------------------
                   GOOGLE SHEET SUCCESS
                ----------------------------- */

                if (
                    result.success
                ) {

                    const application = {

                        applicationNumber:
                            result.applicationId,

                        studentId:
                            result.studentId,

                        password:
                            result.password,

                        studentName:
                            name,

                        email:
                            email,

                        mobile:
                            mobile,

                        course:
                            course,

                        qualification:
                            qualification,

                        percentage:
                            percentage,

                        status:
                            "Entrance Test Pending",

                        eligibility:
                            "Basic Eligibility Passed",

                        createdAt:
                            new Date().toISOString()

                    };


                    /* -----------------------------
                       SAVE LOCAL COPY
                    ----------------------------- */

                    localStorage.setItem(

                        "sdspAdmissionApplication",

                        JSON.stringify(
                            application
                        )

                    );


                    /* -----------------------------
                       SHOW SUCCESS
                    ----------------------------- */

                    showMessage(
                        `
                        <strong>
                            Registration Successful!
                        </strong>

                        <br><br>

                        Application Number:
                        <strong>
                            ${result.applicationId}
                        </strong>

                        <br><br>

                        Student ID:
                        <strong>
                            ${result.studentId}
                        </strong>

                        <br><br>

                        Your basic eligibility
                        screening has been completed.

                        <br><br>

                        Your next stage is the
                        <strong>
                            Entrance Test
                        </strong>.
                        `,
                        "success"
                    );


                    /* -----------------------------
                       BUTTON CHANGE
                    ----------------------------- */

                    if (button) {

                        button.disabled =
                            false;

                        button.innerHTML =
                            'Proceed to Entrance Test <span>→</span>';

                        button.onclick =
                            function() {

                                window.location.href =
                                    "entrance-test.html";

                            };

                    }


                } else {

                    throw new Error(
                        result.message ||
                        "Registration failed."
                    );

                }


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    `
                    Registration could not be
                    submitted right now.

                    <br><br>

                    Please try again.
                    `,
                    "error"
                );


                if (button) {

                    button.disabled =
                        false;

                    button.innerHTML =
                        'Register <span>→</span>';

                }

            }

        }
    );

}


/* =========================================
   MESSAGE FUNCTION
========================================= */

function showMessage(
    message,
    type
) {

    if (!registrationMessage) {
        return;
    }


    registrationMessage.className =
        `registration-message ${type}`;


    registrationMessage.innerHTML =
        message;

}


/* =========================================
   GET SAVED APPLICATION
========================================= */

function getSavedApplication() {

    const data =
        localStorage.getItem(
            "sdspAdmissionApplication"
        );


    if (!data) {
        return null;
    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Invalid application data.",
            error
        );

        return null;

    }

}


/* =========================================
   DEVELOPMENT MESSAGE
========================================= */

console.log(
    "SDSP Admission System + Google Sheets loaded."
);
