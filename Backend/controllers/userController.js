import { supabase } from "../app/supabase.js";

// 🛠️ Utility function: Validate UUID format
const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

// 📌 Fetch username by user ID
export const getusername = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "User not found." });

    res.status(200).json({ username: data.username });
  } catch (err) {
    console.error("Error fetching username:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 📝 Update username (Only for logged-in user)
export const updateusername = async (req, res) => {
  try {
    const user_id = req.params.user_id; // Authenticated user ID
    const { username } = req.body;
  console.log(username,user_id);
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const { error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user_id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Username updated successfully", username });
  } catch (err) {
    console.error("Error updating username:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 📜 Fetch bio
export const getbio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const { data, error } = await supabase
      .from("users")
      .select("bio")
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "User not found." });

    res.status(200).json({ bio: data.bio });
  } catch (err) {
    console.error("Error fetching bio:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✏️ Update bio (Only for logged-in user)
export const updatebio = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { bio } = req.body;

    if (!bio) {
      return res.status(400).json({ error: "Bio is required." });
    }

    const { error } = await supabase
      .from("users")
      .update({ bio })
      .eq("id", user_id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Bio updated successfully", bio });
  } catch (err) {
    console.error("Error updating bio:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 🖼️ Fetch profile picture
export const getpfp = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const { data, error } = await supabase
      .from("users")
      .select("pfp")
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "User not found." });

    res.status(200).json({ pfp: data.pfp });
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ❌ Delete profile picture (Only for logged-in user)
export const deletepfp = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const { error } = await supabase
      .from("users")
      .update({ pfp: null })
      .eq("id", user_id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile picture:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 📸 Update profile picture (Only for logged-in user)
export const updatepfp = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { pfp } = req.body;

    if (!pfp) {
      return res.status(400).json({ error: "Profile picture URL is required." });
    }

    const { error } = await supabase
      .from("users")
      .update({ pfp })
      .eq("id", user_id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Profile picture updated successfully", pfp });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
