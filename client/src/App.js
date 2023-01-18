import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import Password from './components/Password'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import Register from './components/Register'
import Reset from './components/Reset'
import Username from './components/Username'

/**auth middleware to protect routes */
import { AuthorizeUser, ProtectRoute } from './middleman/auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Username />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/password',
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
  {
    path: '/reset',
    element: <Reset />,
  },
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
