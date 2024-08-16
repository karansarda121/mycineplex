import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Button,
  ModalFooter,
  Box,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { AppContext } from "./context"; // Ensure the context is correctly exported/imported
import Trailer from "./Trailer"; // Correctly import the Trailer component

const Moviemodal = ({ isOpen, onClose, movie }) => {
  const { getTrailerUrl } = useContext(AppContext);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [movieData, setMovieData] = useState(null);

  const omdbUrl = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`;

  // Close the trailer modal
  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
  };

  // Open the trailer modal
  const handleOpenTrailer = () => {
    setIsTrailerOpen(true);
  };

  useEffect(() => {
    if (movie) {
      // Fetch trailer URL when movie data is available
      const fetchTrailer = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
          const response = await fetch(`${omdbUrl}&i=${movie}`);
          const data = await response.json();
          setMovieData(data);

          const url = await getTrailerUrl(data.Title, data.Year);
          setTrailerUrl(url); // Set the trailer URL if found
        } catch (error) {
          console.error("Error fetching trailer URL:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching completes
        }
      };
      fetchTrailer();
    }
  }, [movie]);

  if (!movieData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{movieData.Title}</ModalHeader>
        <ModalCloseButton
          _hover={{
            bg: "red.500",
            color: "white",
            transform: "scale(1.1)",
          }}
        />
        <ModalBody>
          <Flex>
            <Box flex="3" mr={4}>
              <Image
                src={movieData.Poster}
                alt={movieData.Title}
                borderRadius="md"
                w="100%"
              />
            </Box>
            <Box flex="4">
              <Text fontSize="lg" fontWeight="bold">
                {movieData.Title}
              </Text>
              <Text>
                <strong>Year:</strong> {movieData.Year}
              </Text>
              <Text>
                <strong>Genre:</strong> {movieData.Genre}
              </Text>
              <Text>
                <strong>IMDB Rating:</strong> {movieData.imdbRating}
              </Text>
              <Text mt={4}>
                <strong>Plot:</strong> {movieData.Plot}
              </Text>
            </Box>
          </Flex>
          <Box>
            {loading ? (
              <Center mt={6}>
                <Spinner size="md" />
              </Center>
            ) : trailerUrl ? (
              // Show the "Watch Trailer" button if a trailer is found
              <Button
                mt={8}
                w="100%"
                onClick={handleOpenTrailer}
                fontSize="xl"
                colorScheme="teal"
                py={6}
              >
                Watch Trailer
              </Button>
            ) : (
              <Text mt={4} color="red.500" textAlign="center">
                Trailer not found
              </Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Show the Trailer component if isTrailerOpen is true */}
      {isTrailerOpen && (
        <Trailer
          isOpen={isTrailerOpen}
          Close={handleCloseTrailer}
          trailerUrl={trailerUrl}
        />
      )}
    </Modal>
  );
};

export default Moviemodal;
