import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PollsList from "./components/PollsList";
import Poll from "./components/Poll";
import CreatePoll from "./components/CreatePoll";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth/signin" component={SignIn} />
        <Route path="/auth/signup" component={SignUp} />
        <Route path="/polls" component={PollsList} />
        <Route path="/polls/:id" component={Poll} />
        <Route path="/create-poll" component={CreatePoll} />
      </Switch>
    </Router>
  );
}

export default App;
