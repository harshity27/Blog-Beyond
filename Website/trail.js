// Initialize like and comment system
document.addEventListener('DOMContentLoaded', function() {
  initLikeSystem();
  initCommentSystem();
});

// Like system functions
function initLikeSystem() {
  // Load like counts from local storage
  const posts = document.querySelectorAll('.post-card');
  posts.forEach(post => {
    const postId = post.getAttribute('data-post-id');
    const likeCount = localStorage.getItem(`likes_${postId}`) || 0;
    const likeCountElement = document.getElementById(`like-count-${postId}`);
    if (likeCountElement) {
      likeCountElement.textContent = likeCount;
    }
  });
}

function handleLike(postId) {
  const likeCountElement = document.getElementById(`like-count-${postId}`);
  if (!likeCountElement) return;
  
  const currentLikes = parseInt(localStorage.getItem(`likes_${postId}`) || 0);
  const newLikes = currentLikes + 1;
  
  localStorage.setItem(`likes_${postId}`, newLikes);
  likeCountElement.textContent = newLikes;
  
  // Add animation effect
  likeCountElement.classList.add('liked');
  setTimeout(() => {
    likeCountElement.classList.remove('liked');
  }, 1000);
}

// Comment system functions
function initCommentSystem() {
  // Load comment counts from local storage
  const posts = document.querySelectorAll('.post-card');
  posts.forEach(post => {
    const postId = post.getAttribute('data-post-id');
    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    const commentCountElement = document.getElementById(`comment-count-${postId}`);
    if (commentCountElement) {
      commentCountElement.textContent = comments.length;
    }
  });
}

function toggleComments(postId) {
  const commentsSection = document.getElementById(`comments-section-${postId}`);
  if (!commentsSection) return;
  
  if (commentsSection.style.display === 'none') {
    commentsSection.style.display = 'block';
    loadComments(postId);
  } else {
    commentsSection.style.display = 'none';
  }
}

function loadComments(postId) {
  const commentsList = document.getElementById(`comments-list-${postId}`);
  if (!commentsList) return;
  
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  commentsList.innerHTML = '';
  
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <strong>${comment.name}</strong>
      <p>${comment.text}</p>
      <small>${comment.date}</small>
    `;
    commentsList.appendChild(commentElement);
  });
}

function handleComment(event, postId) {
  event.preventDefault();
  
  const form = event.target;
  const nameInput = form.querySelector('input[type="text"]');
  const commentInput = form.querySelector('textarea');
  
  const name = nameInput.value.trim();
  const text = commentInput.value.trim();
  
  if (!name || !text) return;
  
  const comment = {
    name,
    text,
    date: new Date().toLocaleDateString()
  };
  
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  comments.push(comment);
  
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
  
  // Update comment count
  const commentCountElement = document.getElementById(`comment-count-${postId}`);
  if (commentCountElement) {
    commentCountElement.textContent = comments.length;
  }
  
  // Refresh comments list
  loadComments(postId);
  
  // Reset form
  form.reset();
} 