import React, { useContext, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Image,
  Text,
  Center,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { AppContext } from "./context";
import Moviemodal from "./Moviemodal";

const Page = () => {
  const { movie } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 16; // Number of movies to show per page

  // Calculate the index range for the current page
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movie.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movie.length / moviesPerPage);

  const handleMovieClick = (curr) => {
    setSelectedMovie(curr);
    onOpen();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container maxW="1200px" mx="auto" mt={5} mb={5} p={5}>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} p={4}>
        {currentMovies.map((curr) => {
          const title =
            curr.Title.length > 15
              ? curr.Title.substring(0, 15) + "..."
              : curr.Title;
          return (
            <Card
              key={curr.imdbID}
              cursor="pointer"
              onClick={() => handleMovieClick(curr.imdbID)}
              borderColor="black"
              borderWidth="2px" // Reduced border width
              borderRadius="15px" // Reduced border radius
              bg="white"
              _hover={{
                bg: "blue.200",
                transform: "scale(1.03)", // Slightly reduced scale
                boxShadow: "md", // Reduced shadow size
              }}
              maxW="250px" // Fixed maximum width
              minH="350px" // Fixed minimum height
            >
              <CardHeader p={1}>
                {" "}
                {/* Reduced padding */}
                <Center>
                  <Text fontWeight="bold" fontSize="lg" textAlign="center" textColor='black'>
                    {title}
                  </Text>
                </Center>
              </CardHeader>
              <CardBody p={1}>
                {" "}
                {/* Reduced padding */}
                <Image
                  src={curr.Poster}
                  alt={curr.Title}
                  w="100%"
                  h="300px" // Reduced height
                  borderRadius="10px" // Reduced border radius
                />
              </CardBody>
            </Card>
          );
        })}
      </Grid>

      {/* Pagination Controls */}
      <Flex justify="center" align="center" mt={4}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1} mr={2}>
          Back
        </Button>

        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            mx={1}
            colorScheme={currentPage === index + 1 ? "blue" : "gray"}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          ml={2}
        >
          Next
        </Button>
      </Flex>

      <Moviemodal isOpen={isOpen} onClose={onClose} movie={selectedMovie} />
    </Container>
  );
};

export default Page;
