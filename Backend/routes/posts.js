import express from 'express';
import { supabase } from '../app/supabase.js';
const router = express.Router();

import { createPost,getPosts,deletePost } from "../controllers/postControllers.js";
import { likePost,deletelike,getlikes,getcomments,commentPost,updatecomment,deletecomment} from '../controllers/likecomentsController.js';
import { deletepfp, getbio, getpfp, getusername, updatebio, updatepfp, updateusername } from '../controllers/userController.js';


// const checkAuth = async (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "Unauthorized" });
  
//     const { data, error } = await supabase.auth.getUser(token);
//     if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });
  
//     req.user = data.user;  
//     next();
//   };
  
//   // **Protected Route: Get Posts**
//   router.get('/', checkAuth, async (req, res) => {
//     const { data, error } = await supabase.from("posts").select("*");
//     if (error) return res.status(400).json({ error: error.message });
    
//     res.status(200).json({ posts: data });
//   });
  


router.post('/new/:user_id',createPost);
router.delete('/:id/:user_id',deletePost);
router.get('/',getPosts);
router.post('/likes/:id',likePost);
router.delete('/deletelikes/:id',deletelike);
router.get('/likes/:id',getlikes);
router.get('/:id/comments',getcomments);
router.post('/:posts_id/:user_id/comments',commentPost);
router.put('/:posts_id/comments/:id',updatecomment);
router.delete('/:posts_id/del-comments/:id',deletecomment);
router.get('/:id/username',getusername);
router.put('/update-username/:user_id',updateusername);
router.get('/:id/bio',getbio);
router.put('/:user_id/update-bio',updatebio);
router.get('/:id/pfp',getpfp);
router.delete('/:user_id/del-pfp',deletepfp);
router.put('/:user_id/update-pfp',updatepfp);
export default router;
