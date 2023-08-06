document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.querySelector("#username");
    const usernameError = document.querySelector("#usernameError");
    const submitButton = document.querySelector("#submitButton");

    async function checkUsernameAvailability(username) {
        try {
            const response = await fetch(`/checkUsername?username=${username}`);
            if (response.ok) {
                const data = await response.json();
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
            usernameError.textContent = "Username must be between 3 and 16 characters long";
            return false;
        } else {
            usernameError.textContent = "";
            return true;
        }
    }

    async function updateUsernameStatus(username) {
        const isValidLength = validateUsername(username);

        if (isValidLength) {
            const exists = await checkUsernameAvailability(username);
            if (exists) {
                usernameError.textContent = "Username already exists";
                submitButton.disabled = true;
            } else {
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
});
