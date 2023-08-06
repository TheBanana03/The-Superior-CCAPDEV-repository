document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.querySelector("#username");
    const usernameError = document.querySelector("#usernameError");
    const emailInput = document.querySelector("#email");
    const confirmEmailInput = document.querySelector("#confirm-email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirm-password");
    const submitButton = document.querySelector("#submitButton");
    const checkUsernameAction = document.querySelector("#check-username-action");

    let isUsernameInvalid = false;
    let isUsernameTaken = false;

    async function checkUsernameAvailability(username) {
        console.log('Checking username availability:', username);
        try {
            const response = await fetch(`/signup/checkUsername?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Username availability response:', data);
                return data.exists;
            } else {
                console.error("An error occurred while checking username");
                return false;
            }
        } catch (error) {
            console.error("An error occurred while checking username:", error);
            return false;
        }
    }

    function validateUsername(username) {
        if (username.length < 3 || username.length > 16) {
            usernameError.textContent = "Username must be between 3 and 16 characters long.";
            isUsernameInvalid = true;
            return false;
        } else {
            usernameError.textContent = "";
            isUsernameInvalid = false;
            return true;
        }
    }

    async function updateUsernameStatus(username) {
        const isValidLength = validateUsername(username);

        if (isValidLength) {
            const exists = await checkUsernameAvailability(username);
            if (exists) {
                usernameError.textContent = "Username already exists. Please choose another one.";
                isUsernameTaken = true;
                submitButton.disabled = true;
            } else if (!isUsernameTaken) {
                usernameError.textContent = "";
                submitButton.disabled = false;
            }
        } else {
            submitButton.disabled = true;
        }
    }

    usernameInput.addEventListener("input", function () {
        const username = usernameInput.value;
        updateUsernameStatus(username);
    });

    confirmEmailInput.addEventListener("input", updateSubmitButton);
    confirmPasswordInput.addEventListener("input", updateSubmitButton);
    
    function validateEmail(email, confirmEmail) {
        if (email !== confirmEmail) {
            emailInput.setCustomValidity("Emails do not match");
            confirmEmailInput.setCustomValidity("Emails do not match");
            document.querySelector("#emailError").textContent = "Emails do not match";
            return false;
        } else {
            emailInput.setCustomValidity("");
            confirmEmailInput.setCustomValidity("");
            document.querySelector("#emailError").textContent = "";
            return true;
        }
    }

    function validatePassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            passwordInput.setCustomValidity("Passwords do not match");
            confirmPasswordInput.setCustomValidity("Passwords do not match");
            document.querySelector("#passwordError").textContent = "Passwords do not match";
            return false;
        } else {
            passwordInput.setCustomValidity("");
            confirmPasswordInput.setCustomValidity("");
            document.querySelector("#passwordError").textContent = "";
            return true;
        }
    }

    function updateSubmitButton() {
        const email = emailInput.value;
        const confirmEmail = confirmEmailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const isEmailValid = validateEmail(email, confirmEmail);
        const isPasswordValid = validatePassword(password, confirmPassword);

        submitButton.disabled = !(isUsernameInvalid || isUsernameTaken) || !isEmailValid || !isPasswordValid;
    }

    usernameInput.addEventListener("input", updateSubmitButton);
    confirmEmailInput.addEventListener("input", updateSubmitButton);
    confirmPasswordInput.addEventListener("input", updateSubmitButton);

    updateSubmitButton();

});