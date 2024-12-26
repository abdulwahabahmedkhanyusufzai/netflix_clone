import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import tvRoutes from "./routes/tvroutes.js";
import { ENV_VARS } from "./config/envVers.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import path from "path";
const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/movie",protectRoute, movieRoutes);
app.use("/api/tv",protectRoute, tvRoutes);
app.use("/api/search", protectRoute, searchRoutes);

if(ENV_VARS.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"/frontend/dist")))

  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
  })
}

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT );
  connectDB();
});

