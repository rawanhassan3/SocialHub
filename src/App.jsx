
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import Feed from './pages/Feed';
import Signin from './pages/Signin';

import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Postdetails from './pages/Postdetails';
import Notfound from './pages/Notfound';
import MainLayout from './Layouts/MainLayout';
import Authlayout from './Layouts/Authlayout';
import Protectedroutes from './protectedroutes/protectedroutes';
import ProtectedAuthroute from './protectedroutes/ProtectedAuthroute';
import AuthContextProvider from "./contexts/Authcontext";
import CounterContextProvider from "./contexts/Countercontext";


const router = createBrowserRouter([

  {
    path: '', element: <MainLayout />, children: [
      { index: true, element: <Protectedroutes><Feed /></Protectedroutes> },
      { path: 'Profile', element: <Protectedroutes><Profile /></Protectedroutes> },
      { path: 'Post/:postId', element: <Protectedroutes><Postdetails /></Protectedroutes> },
      { path: '*', element: <Notfound /> },
      { path: 'postdetails', element: <Postdetails /> }
    ]
  },
  {
    path: '', element: <Authlayout />, children: [
      { path: 'Signin', element: <ProtectedAuthroute><Signin /></ProtectedAuthroute> },
      { path: 'Signup', element: <ProtectedAuthroute><Signup /></ProtectedAuthroute> },
      ]
  }
])
export default function App() {
  return <>
    <AuthContextProvider>
      <CounterContextProvider>
        <HeroUIProvider>
          <ToastProvider />
          <RouterProvider router={router} />
        </HeroUIProvider>
      </CounterContextProvider>
    </AuthContextProvider>



  </>
}
