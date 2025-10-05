import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Styles and Theme
import './assets/css/global.css';
import theme from './theme/theme';

// Page Components
import LandingPage from './pages/LandingPage';
import Index3Page from './pages/Index';
import HomeCollage from './pages/HomeCollage';
import AboutPage from './pages/About';

// Magazine Pages
import Issues1 from './pages/Issues1';
import Issues2 from './pages/Issues2';
import Issues3 from './pages/Issues3';
import Issues4 from './pages/Issues4';
import Issues5 from './pages/issues5';
import MagazineGallery from './pages/Issues';

// Blog Pages
import Blog from './pages/Blog';
import BlogDetailPage from './pages/BlogDetail';
import BlogUpload from './pages/BlogUpload';

// Team and Member Pages
import Team from './pages/team';
import MemberUpload from './pages/MemberUpload';

// Event Pages
import Events from './pages/Events_fixed';
import EventsUpload from './pages/EventsUpload';

// Affiliate Pages
import Affiliates from './pages/Affiliates';
import Affiliates2 from './pages/Affiliates2';
import Affiliates3 from './pages/Affiliates3';


// Auth Components
import ProtectedRoute from './components/ProtectedRoute';
import LoginPrompt from './pages/LoginPrompt';
import AuthCallback from './pages/AuthCallback';

// Other Pages
import JoinUs from './pages/JoinUs';
import ComingSoon from './pages/ComingSoon';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>

          <Route path="/homee" element={<LandingPage />} />
          <Route path="/index" element={<Index3Page />} />
          {/*different website style */}
          <Route path="/" element={<HomeCollage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/affiliates2" element={<Affiliates2 />} />
          <Route path="/affiliates" element={<Affiliates3 />} />
          {/* Public Routes */}
          <Route path="/team" element={<Team />} />
          {/* Public Magazine Page */}
          <Route path="/magazines" element={<MagazineGallery />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/issue1" element={<Issues1 />} /> 
           <Route path="/issue2" element={<Issues2 />} /> 
            <Route path="/issue3" element={<Issues3 />} /> 
             <Route path="/issue4" element={<Issues4 />} /> 
          <Route path="/issue5" element={<Issues5 />} />
             <Route path="/blog" element={<Blog />} />
          <Route path="/joinus" element={<JoinUs />} />
          <Route path="/affiliates3" element={<Affiliates />} />
          <Route path="/events" element={<Events />} />
     

          {/* Protected Routes */}

         
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/events-upload" element={<EventsUpload />} />
            <Route path="/member-upload" element={<MemberUpload />} />
            <Route path="/blog-upload" element={<BlogUpload />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPrompt />} />
          <Route path="/login-callback" element={<AuthCallback />} />
          
          {/* Blog Routes */}
          <Route path="/blog/:title" element={<BlogDetailPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

