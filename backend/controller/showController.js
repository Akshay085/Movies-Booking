import axios from "axios"
import movieModel from "../models/movieModel.js";
import showModel from "../models/showModel.js";
import { set } from "mongoose";


const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 10000, // VERY IMPORTANT
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        Accept: "application/json"
    }
});

const fetchWithRetry = async (url, retries = 3) => {
    try {
        return await axiosInstance.get(url);
    } catch (error) {
        if (retries > 0) {
            console.log("Retrying...", retries);
            return fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
};

// API to get now playing movies from TMDB API 
const getNowPlayingMovies = async (req , res) => {
    try {
        const { data } = await fetchWithRetry('/movie/now_playing');
        res.json({ success: true, movies: data.results });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

//API to add a new show to the database
const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await movieModel.findById(movieId);

        if (!movie) {
            let movieApiData, movieCreditsData;

            try {
                const [details, credits] = await Promise.all([
                    fetchWithRetry(`/movie/${movieId}`),
                    fetchWithRetry(`/movie/${movieId}/credits`)
                ]);

                movieApiData = details.data;
                movieCreditsData = credits.data;

            } catch (apiError) {
                console.error("TMDB Error:", apiError.message);
                return res.json({
                    success: false,
                    message: "Failed to fetch movie data"
                });
            }

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast, // ✅ FIXED
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
            };

            movie = await movieModel.create(movieDetails);
        }

        const showToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;

            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;

                showToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showToCreate.length > 0) {
            await showModel.insertMany(showToCreate);
        }

        res.json({ success: true, message: 'Show Added successfully.' });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all shows from the database
const getShows = async (req , res) => {
    try {
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        //filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success: true , shows: Array.from(uniqueShows)})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

//API to get a single show from the database
const getShow = async (req , res) => {
    try {
        const {movieId} = req.params;
        const shows = await showModel.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await movieModel.findById(movieId);
        const dateTime = {}; 

        shows.forEach((show)=> {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime , showId: show._id})
        })

        res.json({success: true , movie , dateTime})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { getNowPlayingMovies , addShow , getShows , getShow };