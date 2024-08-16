import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Text,
  Flex,
  Spinner,
  Button,
  List,
  ListItem,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AppContext } from "./context";
import { useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const {
    query,
    setquery,
    loading,
    isloading,
    getSuggestions,
    suggestions,
  } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null); // Ref to detect clicks outside
  const { colorMode, toggleColorMode } = useColorMode();

  // Define custom colors based on color mode
  const iconColor = colorMode === "light" ? "gray.800" : "gray.100";
  const bgColor = colorMode === "light" ? "#f0f0f0" : "#2d2d2d"; // Light gray and dark gray
  const inputBgColor = colorMode === "light" ? "white" : "#333";
  const buttonBgColor = colorMode === "light" ? "#007bff" : "#0056b3"; // Blue shades
  const buttonHoverColor = colorMode === "light" ? "#0056b3" : "#003d7a";

  const handleToggle = () => {
    toggleColorMode(); // Toggles between light and dark mode
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== "") {
      getSuggestions(e.target.value); // Fetch suggestions dynamically
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = () => {
    isloading(true);
    setquery(searchTerm);
    setShowSuggestions(false);
      isloading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.Title); // Set the input to the clicked suggestion
    setquery(suggestion.Title); // Perform the search
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false); // Hide suggestions when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Flex
      as="nav"
      w="100%"
      bg='blue.200'
      p="10px"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="sm"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={iconColor}
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        MovieVerse
      </Text>
      <Flex
        alignItems="center"
        maxW="600px"
        position="relative"
        ref={wrapperRef}
      >
        <Icon
          as={colorMode === "light" ? SunIcon : MoonIcon}
          w={6}
          h={6}
          color={iconColor}
          onClick={handleToggle} // Toggle on click
          cursor="pointer"
          mr={4}
        />
        <Input
          placeholder="Search for movies..."
          borderRadius="full"
          borderColor="gray"
          borderWidth="1px"
          bg='default'
          _hover={{ borderColor: "blue.300" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          mr={2}
          flex="1"
          width="300px"
        />
        <Button
          borderRadius="full"
          bg={buttonBgColor}
          color="white"
          _hover={{ bg: buttonHoverColor }}
          _active={{ bg: "blue.700" }}
          onClick={handleClick}
          px="6"
          mr="5px"
        >
          Search
        </Button>
        {loading && <Spinner size="sm" color="white" ml={4} />}
        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <Box
            position="absolute"
            top="40px"
            left="0"
            w="100%"
            bg={inputBgColor}
            border="1px solid #ccc"
            borderRadius="md"
            boxShadow="md"
            zIndex="10"
            maxH="200px"
            overflowY="auto"
          >
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.imdbID}
                  p="8px"
                  borderBottom="1px solid #eee"
                  cursor="pointer"
                  _hover={{ bg: "blue.100" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.Title}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
