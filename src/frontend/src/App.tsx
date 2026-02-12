import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AuthPage from './pages/AuthPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import UploadLessonPage from './pages/UploadLessonPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import AppHeader from './components/layout/AppHeader';
import BottomNav from './components/layout/BottomNav';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      <Layout />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const lessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LessonsPage
});

const lessonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lesson/$lessonId',
  component: LessonDetailPage
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadLessonPage
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage
});

const routeTree = rootRoute.addChildren([
  lessonsRoute,
  lessonDetailRoute,
  uploadRoute,
  profileRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

