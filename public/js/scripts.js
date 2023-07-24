document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.querySelector('.edit-button');
    const editForm = document.querySelector('.edit-form');
    const postContent = document.querySelector('.post-content');
    const cancelButton = document.querySelector('#post-cancel-button-main');

    editButton.addEventListener('click', (e) => {
        e.preventDefault();

        postContent.style.display = 'none';
        editButton.style.display = 'none';
        editForm.style.display = 'block';
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();

        postContent.style.display = 'block';
        editButton.style.display = 'inline-block';
        editForm.style.display = 'none';
    });

    const deleteButtons = document.querySelector("#post-delete-button-main");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async function (e) {
        e.preventDefault();
        const postId = button.getAttribute("data-post-id");
        console.log("Deleting post with id:", postId);

        button.disabled = true;

        try {
            const response = await deletePost(postId);
            if (response.ok) {
                window.location.href = "/user";
            } else {
                console.error("Error deleting post:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            button.disabled = false;
        }
        });
    });
});

async function deletePost(postId) {
    console.log("Deleting post with id:", postId);
  
    const response = await fetch(`/post/${postId}`, {
        method: "DELETE",
    });
  
    return response;
}