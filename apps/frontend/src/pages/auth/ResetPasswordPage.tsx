import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    passwordResetFormSchema,
    passwordResetFormSchemaType
} from "../../schemas/AuthSchemas";
import { userStore } from "../../zustand/userStore";

const ResetPasswordPage = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const { resetPassword } = userStore();
    const [accessToken, setAccessToken] = useState("");

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<passwordResetFormSchemaType>({
        resolver: zodResolver(passwordResetFormSchema)
    });

    const handleResetPassword = async (data: passwordResetFormSchemaType) => {
        const response = await resetPassword(accessToken, data.password);
        if (response) {
            toast.error(response);
            return;
        }
        toast.success("Password successfully reset");
        reset();
        navigate("/signin", { replace: true });
    };

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) navigate("/forgot-password", { replace: true });

        setAccessToken(token as string);
    }, []);

    return (
        <>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>
            <main className="flex flex-col justify-center min-h-screen">
                <div className="px-4 py-10 border rounded shadow-full sm:max-w-xl sm:mx-auto sm:p-20">
                    <div>
                        <h1 className="text-2xl font-semibold text-center ">
                            Reset Password
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit(handleResetPassword)}>
                        <div className="pt-8 space-y-2 text-base sm:text-lg ">
                            <div>
                                <label htmlFor="email" className="invisible">
                                    New Password
                                </label>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    className="w-full input input-bordered input-accent"
                                    placeholder="New Password"
                                />

                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="passwordconfirm"
                                    className="invisible">
                                    Confirm Password
                                </label>
                                <input
                                    {...register("passwordconfirm")}
                                    id="passwordconfirm"
                                    type="password"
                                    className="w-full input input-bordered input-accent"
                                    placeholder="Confirm Password"
                                />

                                {errors.passwordconfirm && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.passwordconfirm.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <button className="mt-4 btn btn-accent btn-block">
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ResetPasswordPage;
