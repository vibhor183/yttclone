import { useState } from "react";
// Importing styled components
import styled, { ThemeProvider } from "styled-components";
// impoting components
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
// importing theme 
import { darkTheme, lightTheme } from "./utils/Theme";
// importing react router dom to route components
import { BrowserRouter, Routes, Route } from "react-router-dom";
// route through diffrent pages
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
// reduc
import { useSelector } from "react-redux";

// stying components of styled components
const Container = styled.div`
  display: flex;
// height: 100%;
// height: 100vh;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 22px 96px; 
`;

function App() {
  // useState Hook to trigger an darkMode 
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  return (
    //Using styled component theme-provider to navigate themes
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          {/* passing a darktheme and setdarkMode as props */}
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              {/* Routing using react-router dom */}
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  {/* videos area and each video has its own unique id so for that reach route to each video  */}
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
