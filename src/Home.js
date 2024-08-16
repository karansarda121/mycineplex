import React, { useState } from 'react'
import Page from './Page'
import Search from './Search'
import { Box} from "@chakra-ui/react";

const Home = () => {
  const [colour, setcolour] = useState("white");
  return (
    <Box  >
      <Search></Search>
      <Page></Page>
    </Box>
  );
}

export default Home
