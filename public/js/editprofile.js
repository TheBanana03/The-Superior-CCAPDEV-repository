document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.querySelector("#username");
    const newPasswordInput = document.querySelector("#new-password");
    const confirmNewPasswordInput = document.querySelector("#confirm-new-password");
    const submitButton = document.querySelector("#submitButton");
    const passwordMatchError = document.querySelector("#password-match-error");

    const currentUserUsername = "{{ currentUserUsername }}";

    function validateUsername(username) {
        return username.length >= 3 && username.length <= 16;
    }

    async function checkUsernameAvailability(username, currentUserUsername) {
        try {
            const response = await fetch(`/signup/checkUsername?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                return data.exists && (username !== currentUserUsername);
            } else {
                console.error("An error occurred while checking username");
                return false;
            }
        } catch (error) {
            console.error("An error occurred while checking username:", error);
            return false;
        }
    }  

    function validatePasswords(newPassword, confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
            passwordMatchError.textContent = "Passwords do not match";
            return false;
        } else {
            passwordMatchError.textContent = "";
            return true;
        }
    }

    function updateSubmitButton() {
        const username = usernameInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        const isUsernameValid = validateUsername(username);
        const arePasswordsMatching = validatePasswords(newPassword, confirmNewPassword);

        console.log("Username:", username);
        console.log("Password Match:", arePasswordsMatching);

        if (!username.trim()) {
            console.log("No username provided. Enabling submit button.");
            submitButton.disabled = false;
            document.querySelector("#username-error").textContent = "";
        } else if (!isUsernameValid) {
            console.log("Invalid username length. Disabling submit button.");
            submitButton.disabled = true;
            document.querySelector("#username-error").textContent = "Username must be between 3 and 16 characters";
        } else if (username.trim() === currentUserUsername) {
            console.log("Username unchanged. Enabling submit button.");
            submitButton.disabled = !arePasswordsMatching;
            document.querySelector("#username-error").textContent = "";
        } else {
            console.log("Checking username availability...");
            checkUsernameAvailability(username, currentUserUsername).then(isTaken => {
                console.log("Username Taken:", isTaken);
                if (!isTaken) {
                    submitButton.disabled = !arePasswordsMatching;
                    document.querySelector("#username-error").textContent = "";
                } else {
                    submitButton.disabled = true;
                    document.querySelector("#username-error").textContent = "Username is already taken";
                }
            });
        }
    }

    
    usernameInput.addEventListener("input", function () {
        updateSubmitButton();
    });

    newPasswordInput.addEventListener("input", function () {
        updateSubmitButton();
    });

    confirmNewPasswordInput.addEventListener("input", function () {
        updateSubmitButton();
    });

    updateSubmitButton();
});
