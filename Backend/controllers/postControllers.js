import { supabase } from "file:///D:/BlogWebsite/Backend/app/supabase.js";
import crypto from 'crypto';

// 📝 Create a new post
export const createPost = async (req, res) => {
  try {
    const { pic, caption } = req.body;
    
    // Extract user_id from authenticated request (Ensure middleware is setting req.user)
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const id = crypto.randomUUID();
    console.log(pic, user_id, id);

    const { data, error } = await supabase
      .from("posts")
      .insert([{ id, pic, caption, likes: 0, comments: 0, user_id }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Post created successfully",
      post: data,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // 📜 Fetch all posts
// export const getPosts = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("posts")
//       .select("*");

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(200).json({ posts: data });
//   } catch (err) {
//     console.error("Error fetching posts:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const getPosts = async (req, res) => {
  try {
    console.log("Fetching posts...");

    const { data, error } = await supabase
      .from("posts")
      .select("*");

    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Fetched Posts:", data);
    res.status(200).json({ posts: data });
  } catch (err) {
    console.error("Unexpected Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// ❌ Delete a post (Only if the user owns it)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.params.user_id;

    if (!id) return res.status(400).json({ error: "Post ID is required" });
    if (!user_id) return res.status(401).json({ error: "Unauthorized: Please log in" });

    // Validate UUID
    const isValidUUID = (str) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    // Fetch the post to check ownership before deleting
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user_id !== user_id) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own posts" });
    }

    // Delete post
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", id);

    if (deleteError) {
      console.error("Supabase error:", deleteError);
      return res.status(400).json({ error: deleteError.message });
    }

    res.status(200).json({
      message: `Post with id ${id} deleted successfully.`,
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
