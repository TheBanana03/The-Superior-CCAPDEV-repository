document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.post-comment a[href=""]');
  
    editButtons.forEach((editButton) => {
      editButton.addEventListener('click', function (e) {
        e.preventDefault();
        const postComment = editButton.closest('.post-comment');
        const commentText = postComment.querySelector('.post-comment-content');
        const editForm = postComment.querySelector('.edit-comment-form');
        const cancelButton = postComment.querySelector('.cancel-button');
        const submitButton = postComment.querySelector('.save-button');
        const deleteButton = postComment.querySelector('.delete-button');
  
        // Show edit form and hide comment text
        commentText.style.display = 'none';
        editForm.style.display = 'block';
  
        // Cancel button functionality
        cancelButton.addEventListener('click', function (e) {
          e.preventDefault();
          commentText.style.display = 'block';
          editForm.style.display = 'none';
        });
  
        // Submit button functionality
        submitButton.addEventListener('click', function (e) {
          e.preventDefault();
  
          const form = editForm.querySelector('form');
          form.submit();
        });
  
        // Delete button functionality
        deleteButton.addEventListener('click', async function (e) {
          e.preventDefault();
  
          const postId = deleteButton.getAttribute('data-post-id');
          const commentId = deleteButton.getAttribute('data-comment-id');
  
          deleteButton.disabled = true;
  
          console.log('Deleting comment with id:', commentId);
  
          try {
            const response = await deleteComment(postId, commentId);
            if (response.ok) {
              window.location.href = `/post/${postId}?openComment=true`;
            } else {
              console.error("Error deleting comment:", response.statusText);
            }
          } catch (error) {
            console.error("Error deleting comment:", error);
          } finally {
            deleteButton.disabled = false;
          }
        });
      });
    });
  });
  
  async function deleteComment(postId, commentId) {
    try {
      const response = await fetch(`/post/${postId}/comment/${commentId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }