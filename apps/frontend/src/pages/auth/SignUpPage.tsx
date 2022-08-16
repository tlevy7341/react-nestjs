import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    signUpFormSchema,
    signUpFormSchemaType
} from "../../schemas/AuthSchemas";
import { userStore } from "../../zustand/userStore";

const SignUpPage = () => {
    const { signUpUser } = userStore();
    const navigate = useNavigate();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<signUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema)
    });

    const handleSignUpUser = async (formData: signUpFormSchemaType) => {
        const response = await signUpUser(formData.email, formData.password);
        if (response) {
            toast.error(response);
            return;
        }
        toast.success("Successfully signed up");
        navigate("/signin");
        reset();
    };

    return (
        <>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <main className="flex flex-col justify-center min-h-screen">
                <div className="px-4 pt-10 border rounded shadow-full sm:max-w-xl sm:mx-auto sm:p-20 sm:pb-0">
                    <div>
                        <h1 className="text-2xl font-semibold text-center">
                            Sign Up
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit(handleSignUpUser)}>
                        <div className="pt-8 space-y-2 text-base sm:text-lg ">
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
                                <button className="mt-4 btn btn-block btn-accent ">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-center pt-20 pb-2">
                        <p className="text-sm text-gray-500">
                            Already have an account?
                            <Link
                                to="/signin"
                                className="pl-1 text-sm link-accent hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default SignUpPage;
