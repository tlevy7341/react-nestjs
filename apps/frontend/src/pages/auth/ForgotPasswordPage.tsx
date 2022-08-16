import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
    forgotPasswordFormSchema,
    forgotPasswordFormSchemaType
} from "../../schemas/AuthSchemas";
import { themeStore } from "../../zustand/themeStore";
import { userStore } from "../../zustand/userStore";

const ForgotPasswordPage = () => {
    const { sendForgotPasswordEmail } = userStore();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = themeStore();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<forgotPasswordFormSchemaType>({
        resolver: zodResolver(forgotPasswordFormSchema)
    });

    const sendForgotPassword = async (
        formData: forgotPasswordFormSchemaType
    ) => {
        setIsLoading(true);
        await sendForgotPasswordEmail(formData.email);

        reset();
        navigate("/check-email", { state: { from: location.pathname } });
    };

    useEffect(() => {
        return () => {
            setIsLoading(false);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <main className="flex items-center justify-center min-h-screen ">
                <div className="flex flex-col px-4 py-5 border rounded shadow-full sm:max-w-xl sm:mx-auto gap-y-7 sm:p-10">
                    <div>
                        <h1 className="text-2xl font-semibold text-center ">
                            Forgot your password?
                        </h1>
                    </div>
                    <div>
                        <p className="text-sm ">
                            Don't fret! Just type in your email and we will send
                            you an email to reset your password!
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(sendForgotPassword)}>
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
                        <button className="mt-4 btn btn-accent btn-block">
                            {isLoading ? (
                                <BeatLoader
                                    color={`${
                                        theme === "dark" ? "#fff" : "#000"
                                    }`}
                                />
                            ) : (
                                "Send Email"
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ForgotPasswordPage;
