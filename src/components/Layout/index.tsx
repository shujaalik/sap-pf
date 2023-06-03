import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

const Layout = ({
    children
}: {
    children: JSX.Element | JSX.Element[]
}) => {
    return <Box bgColor="gray.100" minH="100vh">
        <Sidebar>
            {children}
        </Sidebar>
    </Box>
}

export default Layout;