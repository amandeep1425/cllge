/* =========================================
   SDSP ADMISSION SYSTEM - PART 2
========================================= */


/* =========================================
   COURSE ELIGIBILITY RULES

   These are frontend screening rules only.
   Final admission eligibility should be
   verified by the college according to
   applicable GNDU/college rules.
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

    const year = new Date().getFullYear();

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return `SDSP-${year}-${randomNumber}`;
}


/* =========================================
   ELIGIBILITY CHECK
========================================= */

function checkEligibility(course, qualification, percentage) {

    const rule = eligibilityRules[course];

    if (!rule) {

        return {
            eligible: false,
            message:
                "Eligibility information for this course is not configured yet."
        };

    }


    if (!rule.qualification.includes(qualification)) {

        return {
            eligible: false,
            message:
                `The selected qualification does not meet the basic eligibility requirement for ${course}.`
        };

    }


    if (percentage < rule.minimumPercentage) {

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
    document.getElementById("registrationForm");

const registrationMessage =
    document.getElementById("registrationMessage");


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* -----------------------------
               GET FORM VALUES
            ----------------------------- */

            const name =
                document
                    .getElementById("studentName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("studentEmail")
                    .value
                    .trim();

            const mobile =
                document
                    .getElementById("studentMobile")
                    .value
                    .trim();

            const course =
                document
                    .getElementById("course")
                    .value;

            const qualification =
                document
                    .getElementById("qualification")
                    .value;

            const percentage =
                Number(
                    document
                        .getElementById("percentage")
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


            if (!/^[0-9]{10}$/.test(mobile)) {

                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                return;
            }


            if (
                Number.isNaN(percentage) ||
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


            if (!eligibility.eligible) {

                showMessage(
                    eligibility.message,
                    "error"
                );

                return;
            }


            /* -----------------------------
               APPLICATION NUMBER
            ----------------------------- */

            const applicationNumber =
                generateApplicationNumber();


            /* -----------------------------
               APPLICATION OBJECT

               Temporary local storage.
               Backend database will replace
               this in the next stage.
            ----------------------------- */

            const application = {

                applicationNumber,

                studentName: name,

                email,

                mobile,

                course,

                qualification,

                percentage,

                status: "Entrance Test Pending",

                eligibility: "Basic Eligibility Passed",

                createdAt:
                    new Date().toISOString()

            };


            /* -----------------------------
               SAVE TEMPORARILY
            ----------------------------- */

            localStorage.setItem(
                "sdspAdmissionApplication",
                JSON.stringify(application)
            );


            /* -----------------------------
               SHOW SUCCESS
            ----------------------------- */

            showMessage(
                `
                <strong>Registration Successful!</strong><br><br>

                Application Number:
                <strong>${applicationNumber}</strong><br><br>

                You have passed the basic eligibility
                screening for <strong>${course}</strong>.

                <br><br>

                Your next stage is the
                <strong>Entrance Test</strong>.
                `,
                "success"
            );


            /* -----------------------------
               BUTTON CHANGE
            ----------------------------- */

            const button =
                registrationForm.querySelector(
                    ".registration-btn"
                );


            if (button) {

                button.innerHTML =
                    'Proceed to Entrance Test <span>→</span>';

                button.onclick = function() {

                    window.location.href =
                        "entrance-test.html";

                };

            }

        }
    );

}


/* =========================================
   MESSAGE FUNCTION
========================================= */

function showMessage(message, type) {

    if (!registrationMessage) {
        return;
    }

    registrationMessage.className =
        `registration-message ${type}`;

    registrationMessage.innerHTML =
        message;

}


/* =========================================
   CHECK EXISTING APPLICATION
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
   DEVELOPMENT HELPER

   Can be removed after backend
   is connected.
========================================= */

console.log(
    "SDSP Admission System loaded."
);
