import { env } from "./config/vairable";
import "@material-tailwind/react/tailwind.css";
import "antd/dist/antd.css";
import { Router } from "./router/router";

const App = () => {
  return <Router />;
};

export default App;
