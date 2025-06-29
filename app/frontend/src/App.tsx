import {Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
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

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
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
          {/* make these routes protected with OAUTH */}
           <Route path="/blog-upload" element={<BlogUpload />} />
           <Route path="/blog/:title" element={<BlogDetailPage />} />

        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
