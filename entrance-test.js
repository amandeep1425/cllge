/* =========================================
   SDSP MEMORIAL COLLEGE
   ENTRANCE TEST SYSTEM
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxp1t5L3GCP2QDqE3FRuIim3tmGNdTi3HcJCR-wg3x-xxtS7Mhm87BFsmg2w9tMr5WK/exec";


/* =========================================
   TEST SETTINGS
========================================= */

const TEST_DURATION = 15 * 60; // 15 minutes

const PASS_PERCENTAGE = 40;


/* =========================================
   TEST QUESTIONS
========================================= */

const questions = [

    {
        question: "What is the capital of India?",
        options: [
            "Mumbai",
            "New Delhi",
            "Kolkata",
            "Chennai"
        ],
        answer: "New Delhi"
    },

    {
        question: "Which of the following is a computer input device?",
        options: [
            "Monitor",
            "Printer",
            "Keyboard",
            "Speaker"
        ],
        answer: "Keyboard"
    },

    {
        question: "What is 15 + 25?",
        options: [
            "30",
            "35",
            "40",
            "45"
        ],
        answer: "40"
    },

    {
        question: "Which language is primarily used to structure web pages?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ],
        answer: "HTML"
    },

    {
        question: "Which planet is known as the Red Planet?",
        options: [
            "Earth",
            "Mars",
            "Jupiter",
            "Venus"
        ],
        answer: "Mars"
    },

    {
        question: "Which of the following is an operating system?",
        options: [
            "Windows",
            "Google",
            "Facebook",
            "Chrome"
        ],
        answer: "Windows"
    },

    {
        question: "What is 100 divided by 4?",
        options: [
            "20",
            "25",
            "30",
            "40"
        ],
        answer: "25"
    },

    {
        question: "Which one is a programming language?",
        options: [
            "Python",
            "Google",
            "Windows",
            "Yahoo"
        ],
        answer: "Python"
    },

    {
        question: "How many days are there in a week?",
        options: [
            "5",
            "6",
            "7",
            "8"
        ],
        answer: "7"
    },

    {
        question: "Which device is commonly used to display information from a computer?",
        options: [
            "Keyboard",
            "Mouse",
            "Monitor",
            "Scanner"
        ],
        answer: "Monitor"
    }

];


/* =========================================
   GET HTML ELEMENTS
========================================= */

const applicationNumberElement =
    document.getElementById("applicationNumber");

const studentNameElement =
    document.getElementById("studentName");

const studentCourseElement =
    document.getElementById("studentCourse");

const timerElement =
    document.getElementById("timer");

const questionsContainer =
    document.getElementById("questionsContainer");

const testMessage =
    document.getElementById("testMessage");

const entranceTestForm =
    document.getElementById("entranceTestForm");

const submitTestBtn =
    document.getElementById("submitTestBtn");


/* =========================================
   GET SAVED APPLICATION
========================================= */

function getSavedApplication() {

    const data =
        localStorage.getItem("sdspAdmissionApplication");

    if (!data) {
        return null;
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Invalid admission application data.",
            error
        );

        return null;
    }
}


/* =========================================
   LOAD STUDENT INFORMATION
========================================= */

const application = getSavedApplication();


if (!application) {

    showMessage(
        "No admission application was found. Please complete registration first.",
        "error"
    );

    if (entranceTestForm) {
        entranceTestForm.style.display = "none";
    }

} else {

    applicationNumberElement.textContent =
        application.applicationId ||
        application.applicationNumber ||
        "Not Available";

    studentNameElement.textContent =
        application.studentName ||
        "Not Available";

    studentCourseElement.textContent =
        application.course ||
        "Not Available";

}


/* =========================================
   RENDER QUESTIONS
========================================= */

function renderQuestions() {

    if (!questionsContainer) {
        return;
    }

    questionsContainer.innerHTML = "";

    questions.forEach(function(question, index) {

        const questionBox =
            document.createElement("div");

        questionBox.className = "question-box";

        let optionsHTML = "";

        question.options.forEach(function(option) {

            optionsHTML += `
                <label class="question-option">

                    <input
                        type="radio"
                        name="question-${index}"
                        value="${escapeHTML(option)}"
                    >

                    <span>${escapeHTML(option)}</span>

                </label>
            `;

        });


        questionBox.innerHTML = `

            <div class="question-number">
                Question ${index + 1}
            </div>

            <h3>
                ${escapeHTML(question.question)}
            </h3>

            <div class="question-options">
                ${optionsHTML}
            </div>

        `;

        questionsContainer.appendChild(questionBox);

    });

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   TIMER
========================================= */

let remainingSeconds = TEST_DURATION;

let timerInterval = null;

function startTimer() {

    updateTimerDisplay();

    timerInterval =
        setInterval(function() {

            remainingSeconds--;

            updateTimerDisplay();

            if (remainingSeconds <= 0) {

                clearInterval(timerInterval);

                submitTest(true);

            }

        }, 1000);
}


function updateTimerDisplay() {

    if (!timerElement) {
        return;
    }

    const minutes =
        Math.floor(remainingSeconds / 60);

    const seconds =
        remainingSeconds % 60;

    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


/* =========================================
   GET ANSWERS
========================================= */

function calculateScore() {

    let score = 0;

    questions.forEach(function(question, index) {

        const selected =
            document.querySelector(
                `input[name="question-${index}"]:checked`
            );

        if (selected) {

            if (selected.value === question.answer) {
                score++;
            }

        }

    });

    return score;
}


/* =========================================
   SUBMIT TEST
========================================= */

if (entranceTestForm) {

    entranceTestForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            submitTest(false);

        }
    );

}


/* =========================================
   PROCESS TEST SUBMISSION
========================================= */

async function submitTest(autoSubmitted) {

    if (!application) {
        return;
    }


    if (submitTestBtn) {
        submitTestBtn.disabled = true;
    }


    if (timerInterval) {
        clearInterval(timerInterval);
    }


    const score = calculateScore();

    const total = questions.length;

    const percentage =
        (score / total) * 100;


    const testStatus =
        percentage >= PASS_PERCENTAGE
            ? "Passed"
            : "Failed";


    showMessage(
        autoSubmitted
            ? "Time is over. Your test is being submitted..."
            : "Your test is being submitted...",
        "success"
    );


    /* =========================================
       DATA FOR GOOGLE SHEET
    ========================================= */

    const testData = {

        action: "testResult",

        applicationId:
            application.applicationId ||
            application.applicationNumber ||
            "",

        studentId:
            application.studentId ||
            "",

        studentName:
            application.studentName ||
            "",

        course:
            application.course ||
            "",

        score: score,

        total: total,

        percentage:
            Number(percentage.toFixed(2)),

        testStatus:
            testStatus,

        testCompletedAt:
            new Date().toISOString()

    };


    try {

        const response = await fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(testData)
            }
        );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to save test result."
            );

        }


        /* =========================================
           UPDATE LOCAL APPLICATION
        ========================================= */

        application.testScore =
            Number(percentage.toFixed(2));

        application.testStatus =
            testStatus;

        application.status =
            testStatus === "Passed"
                ? "Profile Pending"
                : "Entrance Test Failed";

        application.testCompletedAt =
            new Date().toISOString();


        localStorage.setItem(
            "sdspAdmissionApplication",
            JSON.stringify(application)
        );


        /* =========================================
           SHOW RESULT
        ========================================= */

        if (testStatus === "Passed") {

            showMessage(`

                <strong>Entrance Test Passed!</strong>

                <br><br>

                Your Score:
                <strong>${score}/${total}</strong>

                <br>

                Percentage:
                <strong>${percentage.toFixed(2)}%</strong>

                <br><br>

                You can now continue to
                <strong>Student Profile</strong>.

            `, "success");


            if (submitTestBtn) {

                submitTestBtn.disabled = false;

                submitTestBtn.innerHTML =
                    'Continue to Student Profile <span>→</span>';

                submitTestBtn.onclick =
                    function() {

                        window.location.href =
                            "student-profile.html";

                    };

            }


        } else {

            showMessage(`

                <strong>Entrance Test Result</strong>

                <br><br>

                Your Score:
                <strong>${score}/${total}</strong>

                <br>

                Percentage:
                <strong>${percentage.toFixed(2)}%</strong>

                <br><br>

                The minimum passing percentage is
                <strong>${PASS_PERCENTAGE}%</strong>.

                <br><br>

                Your application cannot proceed
                to the next stage at this time.

            `, "error");


            if (submitTestBtn) {

                submitTestBtn.style.display =
                    "none";

            }

        }


        /* Disable all answers */

        const inputs =
            document.querySelectorAll(
                "#questionsContainer input"
            );

        inputs.forEach(function(input) {

            input.disabled = true;

        });


    } catch (error) {

        console.error(
            "Test submission error:",
            error
        );


        showMessage(`

            <strong>Submission Error</strong>

            <br><br>

            Your test result could not be saved.

            <br><br>

            Please check your internet connection
            and try submitting again.

        `, "error");


        if (submitTestBtn) {
            submitTestBtn.disabled = false;
        }

    }

}


/* =========================================
   MESSAGE FUNCTION
========================================= */

function showMessage(message, type) {

    if (!testMessage) {
        return;
    }

    testMessage.className =
        `test-message ${type}`;

    testMessage.innerHTML =
        message;

}


/* =========================================
   START TEST
========================================= */

renderQuestions();

if (application) {

    startTimer();

}


console.log(
    "SDSP Entrance Test System loaded."
);
