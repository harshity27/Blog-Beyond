// import express from 'express';
// import cors from "cors";
// import postRoutes from '../routes/posts.js'
// import {supabase} from "file:///C:/Users/Vaibhav%20Sharma/Desktop/codes/Echo/EchoBackend/app/supabase.js"

// const app = express();

// app.use(cors());

// app.use(express.json());
// app.use('/api/v1/posts',postRoutes);
// app.use('/api/v1/user',postRoutes);
// const PORT = 3000;



// app.listen(PORT, () =>{
//     console.log(`Server is running on port ${PORT}`);
// })
import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.js";  // Import auth routes
import postRoutes from "../routes/posts.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);  // Add auth routes
app.use("/api/v1/posts", postRoutes); // Posts routes

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



