// =========================================
// SDSP STUDENT LOGIN
// =========================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxp1t5L3GCP2QDqE3FRuIim3tmGNdTi3HcJCR-wg3x-xxtS7Mhm87BFsmg2w9tMr5WK/exec";

const loginForm = document.getElementById("studentLoginForm");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

// =========================================
// SHOW MESSAGE
// =========================================

function showLoginMessage(message, type) {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;

    loginMessage.style.display = "block";
}

// =========================================
// LOGIN FORM
// =========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const studentId =
                document
                    .getElementById("studentId")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value
                    .trim();

            // =========================================
            // VALIDATION
            // =========================================

            if (!studentId || !password) {

                showLoginMessage(
                    "Please enter Student ID and Password.",
                    "error"
                );

                return;
            }

            // =========================================
            // DISABLE BUTTON
            // =========================================

            loginBtn.disabled = true;
            loginBtn.textContent = "Logging in...";

            showLoginMessage(
                "Checking your login details...",
                "info"
            );

            // =========================================
            // SEND LOGIN REQUEST
            // =========================================

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

                                action: "login",

                                studentId:
                                    studentId,

                                password:
                                    password

                            })
                        }
                    );

                const result =
                    await response.json();

                // =========================================
                // LOGIN SUCCESS
                // =========================================

                if (result.success) {

                    showLoginMessage(
                        "Login successful. Opening your profile...",
                        "success"
                    );

                    localStorage.setItem(
                        "sdspLoggedInStudent",
                        JSON.stringify(
                            result.student || {
                                studentId:
                                    studentId
                            }
                        )
                    );

                    if (result.application) {

                        localStorage.setItem(
                            "sdspAdmissionApplication",
                            JSON.stringify(
                                result.application
                            )
                        );

                    }

                    // Open Student Profile
                    setTimeout(
                        function () {

                            window.location.href =
                                "student-profile.html";

                        },
                        1000
                    );

                    return;
                }

                // =========================================
                // LOGIN FAILED
                // =========================================

                showLoginMessage(
                    result.message ||
                    "Invalid Student ID or Password.",
                    "error"
                );

                loginBtn.disabled = false;
                loginBtn.textContent = "Login";

            } catch (error) {

                console.error(
                    "Student login error:",
                    error
                );

                showLoginMessage(
                    "Unable to connect to the admission database. Please try again.",
                    "error"
                );

                loginBtn.disabled = false;
                loginBtn.textContent = "Login";
            }

        }
    );
}
