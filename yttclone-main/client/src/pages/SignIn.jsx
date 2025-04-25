import { axiosInstance } from "..//config";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 8px;
  padding: 30px 50px;
  gap: 20px;
  min-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 4px;
  padding: 12px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.text};
  }
`;

const Button = styled.button`
  border-radius: 4px;
  border: none;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme, variant }) =>
    variant === "primary" ? theme.text : theme.soft};
  color: ${({ theme, variant }) =>
    variant === "primary" ? theme.bgLighter : theme.textSoft};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  gap: 10px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.soft};
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const endpoint = isSignIn ? "/auth/signin" : "/auth/signup";
      const res = await axiosInstance.post(endpoint, formData);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await axiosInstance.post("/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      });
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
      dispatch(loginFailure());
      setError("Google sign in failed");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>{isSignIn ? "Sign in" : "Create Account"}</Title>
        <SubTitle>to continue to NibTube</SubTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {!isSignIn && (
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="primary">
            {isSignIn ? "Sign in" : "Sign up"}
          </Button>
        </Form>
        
        <Divider>or</Divider>
        
        <Button onClick={signInWithGoogle}>
          Continue with Google
        </Button>
        
        <Button 
          variant="text" 
          onClick={() => setIsSignIn(!isSignIn)}
        >
          {isSignIn ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </Button>
        
        {error && <Error>{error}</Error>}
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
