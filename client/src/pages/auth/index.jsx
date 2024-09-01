import React, { useState } from "react";
import Background from "../../assets/login2.png";
import victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from 'sonner';
import apiClient from '../../../../server/lib/api-client.js';
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "../../../../server/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index";

const Auth = () => {

  const navigate = useNavigate()
  const {setUserInfo,userInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin =()=>{
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    
    return true;
  }
  

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        setUserInfo(response.data.user)
        if(response.data.user.id){
          if(response.data.user.profileSetup){
            navigate("/chat")
          }
          else{
            navigate("/profile")
          }
        }
        console.log(response.data); // You can see the response data here
        toast.success('Login successful!');
        // You can add further logic here, like redirecting the user after successful login
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        toast.error(`Login failed: ${error.response?.data || error.message}`);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, {withCredentials:true});
        console.log(response.data); // This should show the success message or any returned data
        toast.success('Signup successful!');

        if(response.status == 201){
          setUserInfo(response.data.user)
          navigate("/profile")
        }
      } catch (error) {
        console.error('Signup error:', error.response?.data || error.message);
        toast.error(`Signup failed: ${error.response?.data || error.message}`);
      }
    }

  };
  
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[80vh] bg-white border-2 text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Enter your details to start the best chat app ever_made!
            </p>
          </div>
          <div className="w-full flex flex-col items-center">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="flex w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent
                className="flex flex-col gap-5 mt-10 w-full"
                value="login"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full w-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full w-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin}>Login</Button>
              </TabsContent>

              <TabsContent
                className="flex flex-col gap-5 w-full"
                value="signup"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full w-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full w-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full w-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="background login"
            className="h-[500px] w-auto"
          />
        </div>
      </div>
      <Toaster /> {/* Add Toaster here */}
    </div>
  );

}

  


export default Auth;
