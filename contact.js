/* =========================================
   SDSP MEMORIAL COLLEGE
   CONTACT FORM
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxp1t5L3GCP2QDqE3FRuIim3tmGNdTi3HcJCR-wg3x-xxtS7Mhm87BFsmg2w9tMr5WK/exec";


/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("contactName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("contactEmail")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("contactAddress")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("contactMessage")
                    .value
                    .trim();


            const submitButton =
                document.getElementById(
                    "contactSubmitBtn"
                );


            const messageBox =
                document.getElementById(
                    "contactFormMessage"
                );


            /* =========================================
               VALIDATION
            ========================================= */

            if (
                !name ||
                !email ||
                !address ||
                !message
            ) {

                showContactMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                showContactMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* =========================================
               DISABLE BUTTON
            ========================================= */

            submitButton.disabled = true;

            submitButton.textContent =
                "Sending...";


            showContactMessage(
                "Sending your enquiry...",
                "success"
            );


            /* =========================================
               DATA FOR GOOGLE SHEET
            ========================================= */

            const contactData = {

                action: "contact",

                name: name,

                email: email,

                address: address,

                query:
                    message

            };


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
                                    contactData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Unable to submit enquiry."
                    );

                }


                /* =========================================
                   SUCCESS
                ========================================= */

                showContactMessage(
                    "Your enquiry has been submitted successfully. The college will contact you if required.",
                    "success"
                );


                contactForm.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                showContactMessage(
                    "Unable to submit your enquiry right now. Please try again.",
                    "error"
                );

            }


            /* =========================================
               ENABLE BUTTON
            ========================================= */

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit Enquiry";

        }
    );

}


/* =========================================
   MESSAGE
========================================= */

function showContactMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "contactFormMessage"
        );


    if (!box) {
        return;
    }


    box.className =
        `contact-form-message ${type}`;


    box.textContent =
        message;

}
