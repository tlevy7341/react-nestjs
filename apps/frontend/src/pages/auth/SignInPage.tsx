import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    signInFormSchema,
    signInFormSchemaType
} from "../../schemas/AuthSchemas";

import { userStore } from "../../zustand/userStore";

const SignInPage = () => {
    const { signInUser, persist, user } = userStore();
    const navigate = useNavigate();
    const location: any = useLocation();
    const from = location?.state?.from?.pathname || "/";

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<signInFormSchemaType>({
        resolver: zodResolver(signInFormSchema)
    });

    const handleSignInUser = async (formData: signInFormSchemaType) => {
        const response = await signInUser(formData.email, formData.password);

        if (response) {
            toast.error(response);
            return;
        }

        navigate(from, { replace: true });
        reset();
    };

    const togglePersist = () => {
        userStore.setState({ persist: !persist });
    };

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <main className="flex flex-col justify-center min-h-screen ">
                <div className="px-4 pt-10 border rounded shadow-full sm:max-w-xl sm:mx-auto sm:p-20 sm:pb-0">
                    <div>
                        <h1 className="text-2xl font-semibold text-center">
                            Sign In
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit(handleSignInUser)}>
                        <div className="pt-8 space-y-4 text-base sm:text-lg ">
                            <div>
                                <label htmlFor="email" className="invisible">
                                    Email Address
                                </label>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="text"
                                    className="w-full input input-bordered input-accent"
                                    placeholder="Email address"
                                />

                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password" className="invisible">
                                    Password
                                </label>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    className="w-full input input-bordered input-accent"
                                    placeholder="Password"
                                />

                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500 ">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Remember me
                                    </span>
                                    <input
                                        id={"persist"}
                                        name={"persist"}
                                        type="checkbox"
                                        checked={persist}
                                        onChange={togglePersist}
                                        className="rounded checkbox checkbox-sm checkbox-accent"
                                    />
                                </label>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="mt-2 btn btn-accent btn-block">
                                    Sign In
                                </button>
                            </div>
                            <div className="flex justify-center pt-5">
                                <Link
                                    to={"/forgot-password"}
                                    className="text-sm link-accent hover:underline">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-center pt-10 pb-2">
                        <p className="text-sm ">
                            Don't have an account?
                            <Link
                                to="/signup"
                                className="pl-1 text-sm link-accent hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default SignInPage;
