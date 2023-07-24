console.log("Loaded Scripts2.js");

let loggedIn = false;

document.addEventListener('DOMContentLoaded', function () {

    const navUserElement = document.querySelector('.nav-user');
    loggedIn = navUserElement.classList.contains('loggedin');

    const editButtons = document.querySelectorAll('.post-comment .edit-comment');
    setupEditButtonListeners(editButtons);
    const commentCollapseButtons = document.querySelectorAll('.comment-collapse-button');
    setupCommentCollapseButtonListeners(commentCollapseButtons);
});

function fetchNestedComments(postId, commentId) {
    const apiUrl = `http://localhost:3000/post/${postId}/comment/getchildren/${commentId}`;
    
    return new Promise((resolve, reject) => {
        // Simulate a delay for fetching nested comments
        axios.get(apiUrl)
            .then(response => {
                resolve(response.data); // Assuming the API returns the nested comments as an array
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Replace this function with your actual code to render nested comments
function renderNestedComments(nestedComments, container, postId, commentId) {

    console.log("Rendering nested comments");

    //if user is logged in, show reply form
    if (loggedIn) {
        container.innerHTML = `
        <span style="margin-top:0.5rem;">Reply</span>
        <form action="/post/${postId}/comment/nest/${commentId}" method="POST">
            <textarea type="text" name="comment" class="submit-comment-input" placeholder="Enter your comment"></textarea>
            <button type="submit" class="submit-comment-button">Submit</button>
        </form>
        <hr>`;
    }

    console.log("Nested comments: ", nestedComments);

    // Generate the HTML for the nested comments
    const html = nestedComments.map((comment) => {
        return `
        <div class="post-comment">
            <span class="post-comment-username">${ comment.creator.username.toUpperCase() }: </span>
            <div class="post-comment-content">
                <span>${comment.content}</span>
            </div>

            <!--EDIT COMMENT FORM-->
            <div class="edit-comment-form" style="display: none;">
                <form action="/post/${comment.post._id}/comment/${comment._id}?_method=PUT" method="POST">
                    <input type="hidden" name="_method" value="PUT">
                    <textarea name="comment" class="submit-comment-input">${comment.content}</textarea>
                    <div>
                        <input type="submit" value="Save" class="save-button">
                        <a href="#" class="delete-button" data-post-id="${comment.post._id}" data-comment-id="${comment._id}">Delete</a>
                        <button class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
            <div class="date">
                <span>
                    <a class="comment-collapse-button" data-bs-toggle="collapse" href="#commentcollapse-${comment._id}" role="button" aria-expanded="false" aria-controls="collapseExample" data-post-id="${comment.post._id}" data-comment-id="${comment._id}">
                        View Replies
                    </a>
                    &#x2022;

                        <a href="" class="edit-comment">Edit</a>
                        &#x2022;

                    ${renderDate(comment.lastEdited, comment.postDate)}
                </span>
            </div>
            <div id="commentcollapse-${comment._id}" class="collapse">
                
            </div>
        </div>
        `;
    }).join('');
    
    container.innerHTML += html;
}

function setupCommentCollapseButtonListeners(commentCollapseButtons) {

    console.log("Setting up comment collapse button listeners");

    /* INFINITE NESTING */
    commentCollapseButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const postId = button.getAttribute('data-post-id');
            const commentId = button.getAttribute('data-comment-id');
            const collapseId = button.getAttribute('href').substring(1); // Get the ID of the collapse section
            const collapseSection = document.getElementById(collapseId);

            // Fetch nested comments through an API call
            fetchNestedComments(postId, commentId)
            .then(nestedComments => {
                // Render nested comments
                renderNestedComments(nestedComments, collapseSection, postId, commentId);

                const editButtons = document.querySelectorAll('.post-comment .edit-comment');
                setupEditButtonListeners(editButtons);
                const commentCollapseButtons = document.querySelectorAll('.comment-collapse-button');
                setupCommentCollapseButtonListeners(commentCollapseButtons);
            })
            .catch(error => {
                console.log('Error loading nested comments:', error);
            });
        });
    });
}
 
function setupEditButtonListeners(editButtons) {

    console.log("Setting up edit button listeners");

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
  }

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


// Function to format the date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to render the formatted date based on the condition
function renderDate(lastEdited, postDate) {
    const formattedDate = `
        ${lastEdited
            ? `LAST EDITED: ${formatDate(lastEdited)}`
            : formatDate(postDate)
        }
    `;
    return formattedDate;
}