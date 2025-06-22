// Main JavaScript file for Blog Website
import ApiService from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initLikeSystem();
    initCommentSystem();
    initSearchFunctionality();
    initFormValidation();
    initAnimations();
    initBackToTop();
    initImageGallery();
    initDarkMode();
    initLoginSignup();
});

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

// Navigation
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Sticky header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Dropdown menus
    dropdowns.forEach(dropdown => {
        const parent = dropdown.parentElement;
        parent.addEventListener('mouseenter', function() {
            dropdown.style.display = 'block';
        });
        parent.addEventListener('mouseleave', function() {
            dropdown.style.display = 'none';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navigation') && !event.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Add login status check
    checkLoginStatus();
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn && userName) {
        // Update UI for logged in user
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }

        // Show user profile section
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <span>Welcome, ${userName}</span>
            <button id="logoutBtn">Logout</button>
        `;

        // Insert after login button
        loginBtn?.parentNode.insertBefore(userProfile, loginBtn.nextSibling);

        // Add logout handler
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.reload();
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// Like System
function initLikeSystem() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            if (!ApiService.isAuthenticated()) {
                showNotification('Please login to like posts', 'error');
                openLoginModal();
                return;
            }
            
            const postId = this.dataset.postId;
            const likeCount = this.querySelector('.like-count');
            const currentCount = parseInt(likeCount.textContent);
            
            try {
                // Toggle liked state
                if (this.classList.contains('liked')) {
                    // Unlike
                    await ApiService.unlikePost(postId);
                    this.classList.remove('liked');
                    likeCount.textContent = currentCount - 1;
                } else {
                    // Like
                    await ApiService.likePost(postId);
                    this.classList.add('liked');
                    likeCount.textContent = currentCount + 1;
                }
                
                // Add animation
                this.classList.add('animate-like');
                setTimeout(() => {
                    this.classList.remove('animate-like');
                }, 500);
            } catch (error) {
                showNotification('Failed to update like', 'error');
                console.error('Like error:', error);
            }
        });
        
        // Check if post was previously liked
        const postId = button.dataset.postId;
        checkIfPostLiked(postId, button);
    });
}

// Check if a post is liked by the current user
async function checkIfPostLiked(postId, button) {
    if (!ApiService.isAuthenticated()) return;
    
    try {
        const likes = await ApiService.getLikes(postId);
        const currentUser = ApiService.getCurrentUser();
        
        if (likes && likes.some(like => like.user_id === currentUser.id)) {
            button.classList.add('liked');
        }
    } catch (error) {
        console.error('Error checking like status:', error);
    }
}

// Comment System
function initCommentSystem() {
    const commentForms = document.querySelectorAll('.comment-form');
    
    commentForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!ApiService.isAuthenticated()) {
                showNotification('Please login to comment', 'error');
                openLoginModal();
                return;
            }
            
            const postId = this.dataset.postId;
            const commentInput = this.querySelector('textarea');
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                try {
                    // Add comment via API
                    await ApiService.addComment(postId, commentText);
                    
                    // Clear input
                    commentInput.value = '';
                    
                    // Refresh comments
                    loadComments(postId);
                    
                    // Show success message
                    showNotification('Comment added successfully!', 'success');
                } catch (error) {
                    showNotification('Failed to add comment', 'error');
                    console.error('Comment error:', error);
                }
            }
        });
    });
    
    // Load comments for all posts
    const postElements = document.querySelectorAll('[data-post-id]');
    postElements.forEach(post => {
        const postId = post.dataset.postId;
        loadComments(postId);
    });
}

// Load comments for a post
async function loadComments(postId) {
    const commentsSection = document.querySelector(`#comments-${postId}`);
    if (!commentsSection) return;
    
    try {
        const comments = await ApiService.getComments(postId);
        
        // Clear existing comments
        commentsSection.innerHTML = '';
        
        // Add comments to the section
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            
            const date = new Date(comment.created_at);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.username || 'User'}</span>
                    <span class="comment-date">${formattedDate} at ${formattedTime}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
            `;
            
            commentsSection.appendChild(commentElement);
        });
        
        // Update comment count
        const commentCountElement = document.querySelector(`#comment-count-${postId}`);
        if (commentCountElement) {
            commentCountElement.textContent = comments.length;
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchForm = document.querySelector('.header-search form');
    const searchInput = document.querySelector('.header-search input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                try {
                    // Perform search via API
                    const results = await ApiService.searchPosts(searchTerm);
                    
                    // Display results
                    displaySearchResults(results);
                } catch (error) {
                    showNotification('Search failed', 'error');
                    console.error('Search error:', error);
                }
            }
        });
        
        // Live search suggestions
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            
            // Clear previous timer
            clearTimeout(debounceTimer);
            
            if (searchTerm.length > 2) {
                // Debounce the search to avoid too many API calls
                debounceTimer = setTimeout(() => {
                    showSearchSuggestions(searchTerm);
                }, 300);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

// Display search results
function displaySearchResults(results) {
    // Create results container if it doesn't exist
    let resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        document.querySelector('.header-search').appendChild(resultsContainer);
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }
    
    // Create results list
    const resultsList = document.createElement('ul');
    
    results.forEach(result => {
        const resultItem = document.createElement('li');
        resultItem.innerHTML = `
            <a href="/post.html?id=${result.id}">
                <h3>${result.title || 'Untitled Post'}</h3>
                <p>${result.content.substring(0, 100)}...</p>
            </a>
        `;
        
        resultsList.appendChild(resultItem);
    });
    
    resultsContainer.appendChild(resultsList);
    
    // Show results
    resultsContainer.style.display = 'block';
}

// Show search suggestions
async function showSearchSuggestions(searchTerm) {
    try {
        const results = await ApiService.searchPosts(searchTerm);
        
        // Create suggestions container if it doesn't exist
        let suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            document.querySelector('.header-search').appendChild(suggestionsContainer);
        }
        
        // Clear previous suggestions
        suggestionsContainer.innerHTML = '';
        
        if (results.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Create suggestions list
        const suggestionsList = document.createElement('ul');
        
        // Limit to 5 suggestions
        const limitedResults = results.slice(0, 5);
        
        limitedResults.forEach(result => {
            const suggestionItem = document.createElement('li');
            suggestionItem.innerHTML = `
                <a href="/post.html?id=${result.id}">
                    ${result.title || 'Untitled Post'}
                </a>
            `;
            
            suggestionsList.appendChild(suggestionItem);
        });
        
        suggestionsContainer.appendChild(suggestionsList);
        
        // Show suggestions
        suggestionsContainer.style.display = 'block';
    } catch (error) {
        console.error('Error showing suggestions:', error);
    }
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    showFieldError(field, 'Please enter a valid email address');
                }
            });
            
            // Validate password fields
            const passwordFields = form.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => {
                if (field.value.trim() && field.value.length < 6) {
                    isValid = false;
                    showFieldError(field, 'Password must be at least 6 characters');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// Show field error
function showFieldError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
    } else {
        const newErrorElement = document.createElement('div');
        newErrorElement.className = 'error-message';
        newErrorElement.textContent = message;
        field.parentNode.insertBefore(newErrorElement, field.nextSibling);
    }
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Animations
function initAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
    
    // Add hover animations
    const hoverElements = document.querySelectorAll('.hover-animate');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Image Gallery
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const src = this.getAttribute('src');
            const alt = this.getAttribute('alt');
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${src}" alt="${alt}">
                    <span class="lightbox-close">&times;</span>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Close lightbox
            lightbox.addEventListener('click', function() {
                this.remove();
            });
            
            // Prevent closing when clicking on the image
            lightbox.querySelector('.lightbox-content').addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Close button
            lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
                lightbox.remove();
            });
        });
    });
}

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved preference
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.classList.add('active');
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.classList.toggle('active');
            
            // Save preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Login/Signup Integration
function initLoginSignup() {
    // Add event listener to login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Login Modal
function openLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Login</h2>
            <form class="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn">Login</button>
                <p>Don't have an account? <a href="#" class="signup-link">Sign up</a></p>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    modal.querySelector('.login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;
        
        try {
            // Login via API
            await ApiService.login(email, password);
            
            // Show success message
            showNotification('Login successful!', 'success');
            
            // Close modal
            modal.remove();
            
            // Update UI for logged-in user
            updateUIForLoggedInUser();
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
        }
    });
    
    // Sign up link
    modal.querySelector('.signup-link').addEventListener('click', function(e) {
        e.preventDefault();
        modal.remove();
        openSignupModal();
    });
}

// Signup Modal
function openSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Sign Up</h2>
            <form class="signup-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="signup-email">Email</label>
                    <input type="email" id="signup-email" required>
                </div>
                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" required>
                </div>
                <button type="submit" class="btn">Sign Up</button>
                <p>Already have an account? <a href="#" class="login-link">Login</a></p>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    modal.querySelector('.signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#signup-email').value;
        const password = this.querySelector('#signup-password').value;
        const confirmPassword = this.querySelector('#confirm-password').value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        try {
            // Register via API
            await ApiService.register(name, email, password);
            
            // Show success message
            showNotification('Account created successfully! Please login.', 'success');
            
            // Close modal
            modal.remove();
            
            // Open login modal
            openLoginModal();
        } catch (error) {
            showNotification(error.message || 'Registration failed', 'error');
        }
    });
    
    // Login link
    modal.querySelector('.login-link').addEventListener('click', function(e) {
        e.preventDefault();
        modal.remove();
        openLoginModal();
    });
}

// Update UI for logged-in user
function updateUIForLoggedInUser() {
    const user = ApiService.getCurrentUser();
    if (!user) return;
    
    // Update login button to show user name
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = user.name || 'My Account';
        loginBtn.classList.add('logged-in');
        
        // Change click handler to open profile dropdown
        loginBtn.removeEventListener('click', openLoginModal);
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleProfileDropdown();
        });
    }
    
    // Create profile dropdown if it doesn't exist
    let profileDropdown = document.querySelector('.profile-dropdown');
    if (!profileDropdown) {
        profileDropdown = document.createElement('div');
        profileDropdown.className = 'profile-dropdown';
        document.querySelector('header').appendChild(profileDropdown);
    }
    
    // Update profile dropdown content
    profileDropdown.innerHTML = `
        <div class="profile-header">
            <img src="${user.profilePicture || 'images/default-avatar.png'}" alt="Profile" class="profile-avatar">
            <div class="profile-info">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        </div>
        <ul class="profile-menu">
            <li><a href="/profile.html">My Profile</a></li>
            <li><a href="/settings.html">Settings</a></li>
            <li><a href="#" class="logout-btn">Logout</a></li>
        </ul>
    `;
    
    // Add logout handler
    profileDropdown.querySelector('.logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        ApiService.logout();
        showNotification('Logged out successfully', 'success');
        location.reload();
    });
    
    // Hide dropdown initially
    profileDropdown.style.display = 'none';
}

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.querySelector('.profile-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.profile-dropdown');
    const loginBtn = document.getElementById('loginBtn');
    
    if (dropdown && !dropdown.contains(e.target) && !loginBtn.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

function handleLike(postId) {
    // Check login status first
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login to like posts');
        return;
    }

    const likeButton = document.querySelector(`button.btn-like[data-post-id="${postId}"]`);
    const likeCountElement = document.getElementById(`like-count-${postId}`);
    
    if (!likeCountElement || !likeButton) return;
    
    // Get current likes from local storage or default to 0
    let currentLikes = parseInt(localStorage.getItem(`likes_${postId}`) || 0);
    
    // Increment likes
    currentLikes++;
    
    // Save to local storage
    localStorage.setItem(`likes_${postId}`, currentLikes);
    
    // Update the display
    likeCountElement.textContent = currentLikes;
    
    // Add animation effect
    likeButton.classList.add('liked');
    setTimeout(() => {
        likeButton.classList.remove('liked');
    }, 1000);

    // Add heart animation
    const heart = document.createElement('span');
    heart.className = 'heart-animation';
    heart.innerHTML = '❤';
    likeButton.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Add this CSS for the heart animation
const style = document.createElement('style');
style.textContent = `
  .heart-animation {
    position: absolute;
    font-size: 1.5em;
    color: #ff3366;
    pointer-events: none;
    animation: floatHeart 1s ease-out forwards;
  }

  @keyframes floatHeart {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-20px) scale(1.5);
      opacity: 0;
    }
  }

  .btn-like {
    position: relative;
    overflow: visible;
  }

  .btn-like.liked {
    animation: pulse 0.5s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
