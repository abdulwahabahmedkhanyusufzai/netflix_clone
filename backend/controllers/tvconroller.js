import { fetchFromTMDB } from "../services/tmdbservice.js";

export async function getTrendingTv(req, res) {
    try {
        console.log("Fetching trending movies...");

        // Log the API URL being called
        const apiUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
        console.log("Calling TMDB API with URL:", apiUrl);

        // Fetch the data from TMDB
        const data = await fetchFromTMDB(apiUrl);

        // Log the raw response data
        console.log("Fetched data from TMDB:", data);

        // Check if 'results' is present in the response
        if (!data.results || data.results.length === 0) {
            console.log("No results found in TMDB response.");
            return res.status(404).json({ success: false, message: "No trending movies found." });
        }

        // Pick a random movie from the results
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

        // Log the selected random movie
        console.log("Selected random movie:", randomMovie);

        // Send the response with the selected movie
        res.json({ success: true, content: randomMovie });
    } catch (error) {
        // Log detailed error information
        console.error("Error in getTrendingMovie:", error);
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);

        // Respond with a detailed error message
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export async function getTvTrailers(req,res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`)
        res.json({success:true, trailer:data.results})
    } catch (error) {
        if(error.message.includes("404")){
            return res.status(404).send(null);
        }
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export async function getTvDetails(req,res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
        res.json({success:true, similar:data.results})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(500).json({success:false,message:"Internal Server Error"})		}
        
    }
}

export async function getSimilarTvs(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
        res.status(200).json({ success: true, similar: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getTvsByCategory(req, res) {
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}