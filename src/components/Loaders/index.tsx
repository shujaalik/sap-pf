import { Box, Spinner } from "@chakra-ui/react";

const FullScreen = () => {
    return <Box
        bgColor="gray.100"
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={9}>
        <Spinner size="xl" />
    </Box>
}

export default FullScreen;