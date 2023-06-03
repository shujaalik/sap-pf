import { Box, Flex, GridItem, Heading, Image, SimpleGrid } from "@chakra-ui/react"
import { useMemo } from "react";
import { auth } from "../../components/firebase";
import Quote from "./Quote";
import quoteBG from "../../assets/images/quote-bg.svg";
import Students from "../../assets/images/students.svg";

const Home = () => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let text = "";
    if (hour >= 0 && hour < 12) text = "Good Morning";
    if (hour >= 12 && hour < 17) text = "Good Afternoon";
    if (hour >= 17 && hour < 20) text = "Good Evening";
    if (hour >= 20 && hour < 24) text = "Good Night";
    const { displayName } = auth.currentUser || {};
    text += `, ${displayName || "Student"}👋`;
    return text;
  }, []);

  return <Box p={8}>
    <Heading
      letterSpacing={"wide"}
      color="gray.700"
      fontSize="2xl">{greeting}</Heading>
    <SimpleGrid columns={3} mt={15} spacing={10}>
      <GridItem colSpan={2}>
        <Flex
          justifyContent="space-between"
          alignItems={"center"}
          h={"150px"}
          borderRadius="xl"
          boxShadow="xl"
          bgSize="cover"
          bgRepeat={"no-repeat"}
          bgImage={quoteBG}>
          <Quote m={10} fontWeight={500} size="md" color={"whiteAlpha.900"} />
          <Image h="100%" p={2} src={Students} />
        </Flex>
      </GridItem>
      <GridItem>
        gg
      </GridItem>
    </SimpleGrid>
  </Box>
}

export default Home;