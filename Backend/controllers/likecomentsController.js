import { supabase } from "file:///D:/BlogWebsite/Backend/app/supabase.js";

// Middleware to extract user ID from token
const getUserIdFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  console.log(authHeader);

  const token = authHeader.split(" ")[1];
  const { data: user, error } = await supabase.auth.getUser(token);
  return error ? null : user.id;
  
};

// Utility function to validate UUID format
const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// Like a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isValidUUID(id)) return res.status(400).json({ error: "Invalid post ID." });

    const { data: post, error: fetchError } = await supabase.from("posts").select("likes").eq("id", id).single();
    if (fetchError || !post) return res.status(404).json({ error: "Post not found." });

    const { error } = await supabase.from("posts").update({ likes: post.likes + 1 }).eq("id", id);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Post liked successfully.", likes: post.likes + 1 });
  } catch (err) {
    console.error("Error in likePost:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Remove a like from a post
export const deletelike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isValidUUID(id)) return res.status(400).json({ error: "Invalid post ID." });

    const { data: post, error: fetchError } = await supabase.from("posts").select("likes").eq("id", id).single();
    if (fetchError || !post) return res.status(404).json({ error: "Post not found." });

    const newLikes = Math.max(0, post.likes - 1);
    const { error } = await supabase.from("posts").update({ likes: newLikes }).eq("id", id);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Like removed successfully.", likes: newLikes });
  } catch (err) {
    console.error("Error in deletelike:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

//getlikes
export const getlikes = async (req, res) => {
  try {
    const { id } = req.params; // Post ID

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid or missing post ID." });
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ likes: data.length });
  } catch (err) {
    console.error("Error fetching likes:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch comments for a post
export const getcomments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isValidUUID(id)) return res.status(400).json({ error: "Invalid post ID." });

    const { data, error } = await supabase.from("comments").select("text", { foreignTable: "posts" }).eq("posts_id", id);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ comments: data || [] });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Add a comment to a post
export const commentPost = async (req, res) => {
  try {
    const { posts_id ,user_id} = req.params;
    const { text } = req.body; // Extract user_id from body

    if (!user_id) return res.status(401).json({ error: "Unauthorized." });
    if (!posts_id || !isValidUUID(posts_id) || !text) return res.status(400).json({ error: "Invalid input." });

    // Check if post exists
    const { data: postExists, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", posts_id)
      .single();
    
    if (postError || !postExists) return res.status(400).json({ error: "Post does not exist." });

    // Insert comment
    const { data, error } = await supabase.from("comments").insert([{ posts_id, user_id, text }]).select();
    
    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Ensure data exists before accessing data[0]
    if (!data || data.length === 0) {
      return res.status(500).json({ error: "Comment insertion failed." });
    }

    res.status(201).json({ message: "Comment added successfully.", comment: data[0] });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

//update comment

export const updatecomment = async (req, res) => {
  try {
    const { posts_id, id } = req.params; // Post ID & Comment ID
    const { text } = req.body; // Updated text

    if (!isValidUUID(posts_id) || !isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid post or comment ID." });
    }

    if (!text) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const { data, error } = await supabase
      .from("comments")
      .update({ text })
      .eq("id", id)
      .eq("posts_id", posts_id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Comment updated successfully", updatedComment: data[0] });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// Delete a comment (only the owner can delete)
export const deletecomment = async (req, res) => {
  try {
    const { posts_id, id } = req.params;
    const {user_id} = req.body;

    if (!user_id) return res.status(401).json({ error: "Unauthorized." });
    if (!isValidUUID(posts_id) || !isValidUUID(id)) return res.status(400).json({ error: "Invalid ID." });

    const { data: comment, error: fetchError } = await supabase.from("comments").select("user_id").eq("id", id).single();
    if (fetchError || !comment || comment.user_id !== user_id) return res.status(403).json({ error: "Permission denied." });

    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
