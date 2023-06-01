import {
    Card,
    Center,
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Text,
    useToast,
    Flex,
    Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import BackdropLoader from "../../components/Loaders/BackdropLoader";
import { login as loginFB } from "../../components/firebase/api/auth";

const Login = () => {
    const toast = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePasswordView = () => setShowPassword(!showPassword);

    const login = async (e: any) => {
        e.preventDefault();
        const form: FormData = new FormData(e.target as HTMLFormElement);
        const email: string = form.get('email') as string;
        const password: string = form.get('password') as string;
        const remember_me: boolean = form.get('remember_me') !== null;
        setLoading('Logging in');
        try {
            await loginFB(email, password, remember_me);
            toast({
                title: "Login successful",
                description: "You are now logged in",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setLoading(null);
    }

    return <Center minH={'100vh'}>
        {loading && <BackdropLoader text={loading} />}
        <VStack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6}>
            <Heading color="gray.400">Sign in to your Portal</Heading>
            <Card
                minW={{
                    base: '90vw',
                    md: '468px',
                }}
                rounded={'lg'}
                boxShadow={'lg'}
                p={8}>
                <form onSubmit={login}>
                    <VStack gap={5}>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input name="email" type='email' />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    name="password"
                                    pr='4.5rem'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter password'
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={togglePasswordView}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Flex w="100%" justifyContent={"space-between"} alignItems={"center"}>
                            <FormControl>
                                <Checkbox name='remember_me' defaultChecked>Remember me</Checkbox>
                            </FormControl>
                            <Text w="100%" textAlign={"right"} color="blue.500" cursor="pointer">Forgot Password?</Text>
                        </Flex>
                        <Button mr="auto" colorScheme="blue" rightIcon={<FiLogIn />} type="submit">Sign in</Button>
                    </VStack>
                </form>
            </Card>
        </VStack>
    </Center>
}

export default Login