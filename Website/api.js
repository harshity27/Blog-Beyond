// API Service for Blog Website
// This file handles all API calls to the backend

const API_BASE_URL = 'http://localhost:3000/api/v1';

// API Service class to handle all API calls
class ApiService {
    // Authentication methods
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    static async register(name, email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    
    // Post methods
    static async getPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch posts');
            }
            
            return data.posts;
        } catch (error) {
            console.error('Get posts error:', error);
            throw error;
        }
    }
    
    static async createPost(content, imageUrl = null) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/new/${user.id}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ content, imageUrl })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }
            
            return data;
        } catch (error) {
            console.error('Create post error:', error);
            throw error;
        }
    }
    
    static async deletePost(postId) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/${user.id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete post');
            }
            
            return data;
        } catch (error) {
            console.error('Delete post error:', error);
            throw error;
        }
    }
    
    // Like methods
    static async likePost(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/likes/${postId}`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to like post');
            }
            
            return data;
        } catch (error) {
            console.error('Like post error:', error);
            throw error;
        }
    }
    
    static async unlikePost(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/deletelikes/${postId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to unlike post');
            }
            
            return data;
        } catch (error) {
            console.error('Unlike post error:', error);
            throw error;
        }
    }
    
    static async getLikes(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/likes/${postId}`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get likes');
            }
            
            return data.likes;
        } catch (error) {
            console.error('Get likes error:', error);
            throw error;
        }
    }
    
    // Comment methods
    static async getComments(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get comments');
            }
            
            return data.comments;
        } catch (error) {
            console.error('Get comments error:', error);
            throw error;
        }
    }
    
    static async addComment(postId, content) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/${user.id}/comments`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ content })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add comment');
            }
            
            return data;
        } catch (error) {
            console.error('Add comment error:', error);
            throw error;
        }
    }
    
    static async updateComment(postId, commentId, content) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ content })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update comment');
            }
            
            return data;
        } catch (error) {
            console.error('Update comment error:', error);
            throw error;
        }
    }
    
    static async deleteComment(postId, commentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/del-comments/${commentId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete comment');
            }
            
            return data;
        } catch (error) {
            console.error('Delete comment error:', error);
            throw error;
        }
    }
    
    // User profile methods
    static async getUserProfile(userId) {
        try {
            const [username, bio, pfp] = await Promise.all([
                this.getUsername(userId),
                this.getBio(userId),
                this.getProfilePicture(userId)
            ]);
            
            return {
                username,
                bio,
                profilePicture: pfp
            };
        } catch (error) {
            console.error('Get user profile error:', error);
            throw error;
        }
    }
    
    static async getUsername(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${userId}/username`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get username');
            }
            
            return data.username;
        } catch (error) {
            console.error('Get username error:', error);
            throw error;
        }
    }
    
    static async updateUsername(newUsername) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/update-username/${user.id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ username: newUsername })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update username');
            }
            
            return data;
        } catch (error) {
            console.error('Update username error:', error);
            throw error;
        }
    }
    
    static async getBio(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${userId}/bio`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get bio');
            }
            
            return data.bio;
        } catch (error) {
            console.error('Get bio error:', error);
            throw error;
        }
    }
    
    static async updateBio(newBio) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/${user.id}/update-bio`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ bio: newBio })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update bio');
            }
            
            return data;
        } catch (error) {
            console.error('Update bio error:', error);
            throw error;
        }
    }
    
    static async getProfilePicture(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${userId}/pfp`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get profile picture');
            }
            
            return data.pfp;
        } catch (error) {
            console.error('Get profile picture error:', error);
            throw error;
        }
    }
    
    static async updateProfilePicture(imageUrl) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/${user.id}/update-pfp`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ imageUrl })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile picture');
            }
            
            return data;
        } catch (error) {
            console.error('Update profile picture error:', error);
            throw error;
        }
    }
    
    static async deleteProfilePicture() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');
            
            const response = await fetch(`${API_BASE_URL}/posts/${user.id}/del-pfp`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete profile picture');
            }
            
            return data;
        } catch (error) {
            console.error('Delete profile picture error:', error);
            throw error;
        }
    }
    
    // Search methods
    static async searchPosts(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/search?q=${encodeURIComponent(query)}`, {
                headers: this.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to search posts');
            }
            
            return data.posts;
        } catch (error) {
            console.error('Search posts error:', error);
            throw error;
        }
    }
    
    // Helper method to get authentication headers
    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
    
    // Check if user is authenticated
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }
    
    // Get current user
    static getCurrentUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }
}

// Export the API service
export default ApiService; 