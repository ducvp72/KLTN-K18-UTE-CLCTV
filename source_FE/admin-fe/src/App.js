import { env } from "./config/vairable";
import { ErrorPage } from "./components/errorPage/error";

const App = () => {
  console.log(process.env.DOMAIN);
  return (
    <div>
      {/* <div className=" border-8">
        <div className=" text-red-700">{env.domain}</div>
      </div> */}
      <ErrorPage />
    </div>
  );
};

export default App;
