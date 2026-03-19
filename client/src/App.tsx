import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/result" component={Result} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/diary" component={Diary} />
      <Route path="/routine" component={Routine} />
      <Route path="/ingredients" component={Ingredients} />
      <Route path="/conflict" component={Conflict} />
      <Route path="/discover" component={Discover} />
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
