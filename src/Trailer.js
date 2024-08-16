// Trailer.js

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
} from "@chakra-ui/react";

const Trailer = ({ isOpen, Close, trailerUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={Close} isCentered size="1xl">
      <ModalOverlay />
      <ModalContent
        width={{ base: "120vw", md: "1000px" }}
        height={{ base: "90vw", md: "650px" }}
      >
        <ModalHeader mt="7px" p="5px" textAlign="center">
          Watch Trailer
        </ModalHeader>
        <ModalCloseButton
          _hover={{
            bg: "red.500",
            color: "white",
            transform: "scale(1.1)",
          }}
        />
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          {trailerUrl ? (
            <Box
              as="iframe"
              width="100%"
              height="100%"
              src={trailerUrl.replace("watch?v=", "embed/")}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            />
          ) : (
            <Box textAlign="center">
              <p>Trailer not available.</p>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Make sure to use the correct export
export default Trailer;
