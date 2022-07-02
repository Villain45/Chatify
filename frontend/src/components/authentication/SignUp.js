import { VStack,  FormControl,FormLabel ,Input, InputRightElement, Button, InputGroup, useToast } from '@chakra-ui/react'
import {React , useState} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick = () => setShow(!show)
    const handleClick1 = () => setShow1(!show1)
    
    const postDetails = (pics) => {
        setLoading(true);
        
        if(pics === undefined){
        toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 5000,
          position: 'bottom',
          isClosable: true,
        })
        return;
    }
    if(pics.type === 'image/jpeg' || pics.type === 'image/png')
    {
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset","Chatify")
        data.append("cloud_name","dv0u6bwxw")
        fetch("https://api.cloudinary.com/v1_1/dv0u6bwxw/auto/upload",{
            method:'post',
            body:data
        })
        .then((res)=>res.json())
        .then((data)=>{
            setPic(data.url.toString());
            setLoading(false);
        })
        .catch((error)=>{
            console.log(error);;
            setLoading(false);
        })
    }
    else
    {
        toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 5000,
          position: 'bottom',
          isClosable: true,
        })
        setLoading(false);
        return;
    }
}


    const submitHandler = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword)
        {
            toast({
             title: 'Please fill all required fields',
             status: 'warning',
             duration: 5000,
             position: 'bottom',
             isClosable: true, 
            })
            setLoading(false);
        return;
        }
        if(password !==confirmPassword )
        {
          toast({
             title: 'Passwords did not match',
             status: 'warning',
             duration: 5000,
             position: 'bottom',
             isClosable: true, 
            })  
            return;
        }
        try 
        {
            const config={
                headers: {
                    "Content-type": "application/json",
                    
                }
            }
            const {data} =await axios.post(
                'api/user',
                {name,email,password,pic},
                config
            );
            toast({
             title: 'Registration Success',
             status: 'success',
             duration: 5000,
             position: 'bottom',
             isClosable: true, 
            });
        localStorage.setItem("userInfo",JSON.stringify(data))

        setLoading(false);

        history.push('/chats')  //Move user to chat page when successfully logged in
        } 
        catch (error) 
        {
            toast({
             title: 'Error Occurred',
             description:error.message,
             status: 'warning',
             duration: 5000,
             position: 'top',
             isClosable: true, 
            });
            setLoading(false);
        }
        
    }

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
                <Input placeholder='Please enter your name'
                onChange={(e)=>setName(e.target.value)}
                 />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
                <Input placeholder='Please enter your email'
                onChange={(e)=>setEmail(e.target.value)}
                 />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                     type={show ? "text" : "password"}
                     placeholder='Please enter your password'
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel >Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                     type={show1 ? "text" : "password"}
                     placeholder='Please enter your password'
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick1}>
                        {show1 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
        </FormControl>
        <FormControl id='pic' >
            <FormLabel>Upload a profile pic</FormLabel>
                <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=>postDetails(e.target.files[0])}
                 />
        </FormControl>
        <Button 
        colorScheme="blue"
        w="100%"
        color="white"
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default SignUp