import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import LandingPage from './components/LandingPage/LandingPage';
import GroupList from './components/Groups/Listings/GroupList';
import GroupDetails from './components/Groups/GroupDetails';
import CreateGroupForm from './components/Groups/Forms/CreateGroupForm';
import EditGroupForm from './components/Groups/Forms/EditGroupForm';
import EventList from './components/Events/Listings/EventList';
import EventDetails from './components/Events/EventDetails';
import CreateEventForm from './components/Events/Forms/CreateEventForm';
import EditEventForm from './components/Events/Forms/EditEventForm';
import ManageGroups from './components/Groups/Listings/ManageGroups';
import ManageEvents from './components/Events/Listings/ManageEvents';
import PageNotFound from './components/PageNotFound/PageNotFound';
import DarkModeButton from './components/DarkModeButton/DarkModeButton';

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
      <DarkModeButton />
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
        element: <CreateGroupForm />
      },
      {
        path: '/groups/:groupId/edit',
        element: <EditGroupForm />
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
        element: <CreateEventForm />
      },
      {
        path: '/events/:eventId/edit',
        element: <EditEventForm />
      },
      {
        path: '/groups/current',
        element: <ManageGroups />
      },
      {
        path: '/events/current',
        element: <ManageEvents />
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
