document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('.edit-form');
    const cancelButton = document.querySelector('.cancel-button');

    editButton.addEventListener('click', (e) => {
        e.preventDefault();

        editButton.style.display = 'none';
        editForm.style.display = 'block';
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();

        editButton.style.display = 'inline-block';
        editForm.style.display = 'none';
    });
});