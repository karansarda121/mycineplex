import React, { useEffect, useState } from "react";

// Create the context
const AppContext = React.createContext();

// Your API URL with the environment variable for the key
const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`;

const AppProvider = ({ children }) => {
  const [movie, setmovie] = useState([]);
  const [error, iserror] = useState({ show: false, mess: "" });
  const [loading, isloading] = useState(false);
  const [query, setquery] = useState("Iron man");
  const [totalResults, setTotalResults] = useState(0);
   const [suggestions, setSuggestions] = useState([]);

  // Fetch movies with pagination
  const getmovies = async (query) => {
    isloading(true);
    let allMovies = [];
    let currentPage = 1;
    const resultsPerPage = 10; 
    try {
      while (true) {
        const response = await fetch(`${url}&s=${query}&page=${currentPage}`);
        const data = await response.json();
        console.log(data);

        if (data.Response === "True") {
          allMovies = [...allMovies, ...data.Search]; 
          setTotalResults(parseInt(data.totalResults, 10));
          if (
            data.Search.length < resultsPerPage ||
            allMovies.length >= totalResults
          )
            break;
          currentPage += 1;
        } else {
          iserror({ show: true, mess: data.Error });
          break;
        }
      }

      setmovie(allMovies); 
      iserror({ show: false, mess: "" });
    } catch (error) {
      console.log(error);
      iserror({ show: true, mess: "Something went wrong!" });
    } finally {
      isloading(false);
    }
  };
   const getSuggestions = async (searchTerm) => {
     try {
       const response = await fetch(`${url}&s=${searchTerm}`);
       const data = await response.json();
       console.log(data)
       if (data.Response === "True") {
         setSuggestions(data.Search);
       } else {
         setSuggestions([]);
       }
     } catch (error) {
       console.log("Error fetching suggestions:", error);
     }
  };
  
const getTrailerUrl = async (movieTitle, movieYear) => {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error(
      "YouTube API key is missing. Please check your environment variables."
    );
    return null;
  }

  // Construct the search query with both title and year
  const searchQuery = `${movieTitle} ${movieYear} trailer`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&key=${apiKey}&type=video&maxResults=5`
    );

    if (!response.ok) {
      console.error(
        "Error fetching data from YouTube API:",
        response.statusText
      );
      return null;
    }

    const data = await response.json();

    // Filter the results to find the most accurate match for both title and year
    const matchingVideo = data.items.find((item) => {
      const videoTitle = item.snippet.title.toLowerCase();
      return (
        videoTitle.includes(movieTitle.toLowerCase()) &&
        videoTitle.includes(movieYear)
      );
    });

    if (matchingVideo) {
      const videoId = matchingVideo.id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      console.warn("No trailers found for the given title and year.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};




  useEffect(() => {
    if (query) {
      const timeout = setTimeout(() => {
        getmovies(query);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [query]);

  return (
    <AppContext.Provider
      value={{
        movie,
        error,
        loading,
        isloading,
        query,
        setquery,
        totalResults,
        getSuggestions,
        suggestions,
        getTrailerUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
