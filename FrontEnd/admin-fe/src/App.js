import { env } from "./config/vairable";
import "antd/dist/antd.min.css";
import "@material-tailwind/react/tailwind.css";
import { Router } from "./router/router";

const App = () => {
  return <Router />;
};

export default App;
