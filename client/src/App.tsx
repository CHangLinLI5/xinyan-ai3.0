import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DesktopLayout from "./components/DesktopLayout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Result from "./pages/Result";
import Calendar from "./pages/Calendar";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Diary from "./pages/Diary";
import Routine from "./pages/Routine";
import Ingredients from "./pages/Ingredients";
import Conflict from "./pages/Conflict";
import Discover from "./pages/Discover";

/* Pages that use the desktop sidebar layout */
function WithSidebar({ component: Component }: { component: React.ComponentType }) {
  return (
    <DesktopLayout>
      <Component />
    </DesktopLayout>
  );
}

/* Pages that are full-screen (no sidebar on desktop) */
function FullScreen({ component: Component }: { component: React.ComponentType }) {
  return (
    <DesktopLayout hideSidebar>
      <Component />
    </DesktopLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <WithSidebar component={Home} />}</Route>
      <Route path="/chat">{() => <FullScreen component={Chat} />}</Route>
      <Route path="/result">{() => <FullScreen component={Result} />}</Route>
      <Route path="/calendar">{() => <WithSidebar component={Calendar} />}</Route>
      <Route path="/history">{() => <WithSidebar component={History} />}</Route>
      <Route path="/profile">{() => <WithSidebar component={Profile} />}</Route>
      <Route path="/login" component={Login} />
      <Route path="/diary">{() => <WithSidebar component={Diary} />}</Route>
      <Route path="/routine">{() => <WithSidebar component={Routine} />}</Route>
      <Route path="/ingredients">{() => <WithSidebar component={Ingredients} />}</Route>
      <Route path="/conflict">{() => <WithSidebar component={Conflict} />}</Route>
      <Route path="/discover">{() => <WithSidebar component={Discover} />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
