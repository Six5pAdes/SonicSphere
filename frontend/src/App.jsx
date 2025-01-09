import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import LandingPage from './components/LandingPage/LandingPage';
import GroupList from './components/ItemListings/Groups/GroupList';
import GroupDetails from './components/Groups/GroupDetails';
import CreateGroup from './components/Groups/CreateGroup';
import UpdateGroup from './components/Groups/UpdateGroup';
import UserGroups from './components/ItemListings/UserLists/UserGroups';
import EventList from './components/ItemListings/Events/EventList';
import EventDetails from './components/Events/EventDetails'
import CreateEvent from './components/Events/CreateEvent';
import UpdateEvent from './components/Events/UpdateEvent';
import UserEvents from './components/ItemListings/UserLists/UserEvents';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal />
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/groups',
        element: <GroupList />
      },
      {
        path: '/groups/:groupId',
        element: <GroupDetails />
      },
      {
        path: '/groups/new',
        element: <CreateGroup />
      },
      {
        path: '/groups/:groupId/edit',
        element: <UpdateGroup />
      },
      {
        path: '/groups/current',
        element: <UserGroups />
      },
      {
        path: '/events',
        element: <EventList />
      },
      {
        path: '/events/:eventId',
        element: <EventDetails />
      },
      {
        path: '/groups/:groupId/events/new',
        element: <CreateEvent />
      },
      {
        path: '/events/:eventId/edit',
        element: <UpdateEvent />
      },
      {
        path: '/events/current',
        element: <UserEvents />
      },
      {
        path: '*',
        element: <h2>PAGE NOT FOUND</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
