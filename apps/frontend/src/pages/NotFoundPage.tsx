import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>404 - Not Found</title>
      </Helmet>
      <main className="flex items-center w-screen h-screen p-16 ">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h1 className="mb-8 font-extrabold text-9xl ">404</h1>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
            <p className="mt-4 mb-8 ">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="btn btn-accent btn-wide"
            >
              Back Home
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
