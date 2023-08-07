document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.querySelector("#new-password");
    const confirmNewPasswordInput = document.querySelector("#confirm-new-password");
    const submitButton = document.querySelector("#submitButton");
    const passwordMatchError = document.querySelector("#password-match-error");

    // Get the current user's username from the script tag in your template
    const currentUserUsername = "{{ currentUserUsername }}";

    function validateUsername(username) {
        return username.length >= 3 && username.length <= 16;
    }

    async function checkUsernameAvailability(username, currentUserUsername) {
        console.log('Checking username availability:', username);
        try {
            const response = await fetch(`/signup/checkUsername?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Username availability response:', data);
                return data.exists && username !== currentUserUsername;
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
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        const arePasswordsMatching = validatePasswords(newPassword, confirmNewPassword);

        if (!arePasswordsMatching) {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = false;
        }
    }

    newPasswordInput.addEventListener("input", function () {
        updateSubmitButton();
    });

    confirmNewPasswordInput.addEventListener("input", function () {
        updateSubmitButton();
    });

    updateSubmitButton();
});
