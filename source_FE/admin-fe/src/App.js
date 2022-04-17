import { env } from "./config/vairable";
import {
  Login,
  Error,
  Profile,
  Forgot,
  GroupDash,
  UserDash,
  Dashboard,
} from "./components/index";

const App = () => {
  return (
    <div>
      <Dashboard />
      <UserDash />
      <GroupDash />
      {/* <Login /> */}
      {/* <Forgot /> */}
      {/* <Profile /> */}
      {/* <Error /> */}
    </div>
  );
};

export default App;
