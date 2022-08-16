import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FaPaperPlane } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CheckEmailPage = () => {
  const location: any = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.from !== "/forgot-password") {
      navigate("/forgot-password");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Check Email</title>
      </Helmet>
      <main className="flex flex-col items-center justify-center w-screen h-screen gap-y-4">
        <h1 className="font-bold">Check your email for the reset link</h1>
        <FaPaperPlane className="text-3xl" />
        <p>
          An email has been sent to your email address on file to reset your
          password.
        </p>
        <p>
          If the email doesn't arrive soon, please check your spam or junk
          folder.
        </p>
        <Link className="link-accent hover:underline" to="/signin">
          Back to login
        </Link>
      </main>
    </>
  );
};

export default CheckEmailPage;
