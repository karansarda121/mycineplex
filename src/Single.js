import {
  useToast,
  Box,
  Image,
  Text,
  Center,
  Flex,
  Spinner,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Single = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const getMovie = async (Url) => {
    setLoading(true);
    try {
      const response = await fetch(Url);
      const data = await response.json();
      console.log(data);
      if (data.Response === "True") {
        setMovie(data);
      } else {
        throw new Error(data.Error);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getMovie(`${url}&i=${id}`);
    }, 100);
    return () => clearTimeout(timeout);
  }, [id]);

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!movie) {
    return (
      <Center mt={10}>
        <Text fontSize="xl">No movie found.</Text>
      </Center>
    );
  }

  return (
    <Box m="0"  minH="100vh">
      <Center>
        <Box
          m="50px"
          p="20px"
          borderColor="black"
          borderWidth={2}
          borderRadius={25}
          maxW="600px"
          bg="white"
          h="400px"
                  position="relative"
                  mt='150px'
        >
          <Flex direction={{ base: "column", md: "row" }}>
            <Box>
              <Image
                src={movie.Poster}
                alt={movie.Title}
                borderRadius="15px"
                maxH="350px"
              />
            </Box>
            <Box ml='15px' mt='50px'>
              <Text fontWeight="bold" fontSize="2xl" mb={4}>
                {movie.Title}
              </Text>
              <Text mb={2}>Type: {movie.Type}</Text>
              <Text mb={2}>Released Year: {movie.Released}</Text>
              <Text mb={2}>Rated: {movie.Rated}</Text>
              <Text mb={2}>Runtime: {movie.Runtime}</Text>
            </Box>
          </Flex>
          <Button
            onClick={() => navigate("/home")}
            colorScheme="blue"
            borderRadius="20px"
            w="150px"
            position="absolute"
            bottom="20px"
            right="20px"
          >
            Go Back
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

export default Single;
