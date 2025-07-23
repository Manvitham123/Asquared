import {Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import LandingPage from './pages/LandingPage';
import './assets/css/global.css';
import Issues1 from './pages/Issues1';
import Issues2 from './pages/Issues2';
import Issues3 from './pages/Issues3';
import Issues4 from './pages/Issues4';

import Index3Page from './pages/Index';
import BlogUpload from './pages/BlogUpload';
import Blog from './pages/Blog';
import BlogDetailPage from './pages/BlogDetail';

import MagazineGallery from './pages/Issues';
import AboutPage from './pages/About';

import JoinUs from './pages/JoinUs';
import Affiliates from './pages/Affiliates';
import Events from './pages/Events';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoginPrompt from './pages/LoginPrompt';
import AuthCallback from './pages/AuthCallback';


function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
        
<Route path="/" element={<LandingPage />} />
<Route path="/index" element={<Index3Page />} />
          {/* Public Magazine Page */}
          <Route path="/magazines" element={<MagazineGallery />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/issue1" element={<Issues1 />} /> 
           <Route path="/issue2" element={<Issues2 />} /> 
            <Route path="/issue3" element={<Issues3 />} /> 
             <Route path="/issue4" element={<Issues4 />} /> 
             <Route path="/blog" element={<Blog />} />
          <Route path="/joinus" element={<JoinUs />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/events" element={<Events />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
           <Route path="/blog-upload" element={<BlogUpload />} />
           </Route>
           <Route path="/blog/:title" element={<BlogDetailPage />} />
           <Route path="/login-prompt" element={<LoginPrompt />} />
           <Route path="/login" element={<LoginPrompt />} />
           <Route path="/login-callback" element={<AuthCallback />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

