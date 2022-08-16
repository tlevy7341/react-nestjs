import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAvatar from "../utils/getAvatar";
import { themeStore } from "../zustand/themeStore";
import { userStore } from "../zustand/userStore";

const UserProfilePage = () => {
    const navigate = useNavigate();

    const { user, changeAvatar, deleteAccount, accessToken } = userStore();
    const { toggleTheme, theme } = themeStore();
    const [avatar, setAvatar] = useState(user?.avatar);

    const handleOnChangeAvatar = (id: number) => {
        const newAvatar = getAvatar();
        changeAvatar(newAvatar, id);
        setAvatar(newAvatar);
    };

    const handleDeleteAccount = async (id: number) => {
        const response = await deleteAccount(id, accessToken!);
        if (response) {
            toast.error(response);
            return;
        }
        toast.success("Account deleted successfully");
        navigate("/signin", { replace: true });
    };

    return (
        <>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <main className="flex items-center justify-center w-screen h-screen">
                <div className="flex flex-col justify-around h-full">
                    <p className="flex items-center">
                        <span className="pr-2 text-2xl font-bold ">Hello</span>
                        <span>{user?.email}</span>
                    </p>
                    <div className="flex flex-col justify-center space-y-4">
                        <div>
                            <div className="flex items-center justify-center p-3 border-2 rounded-3xl">
                                <img
                                    src={avatar}
                                    alt="picture of the user avatar"
                                />
                            </div>
                            <button
                                onClick={() => handleOnChangeAvatar(user!.id)}
                                className="mt-3 btn btn-block">
                                Change Avatar
                            </button>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <label htmlFor="darkMode" className="label">
                                Dark Mode
                            </label>
                            <input
                                onChange={() => toggleTheme()}
                                id="darkMode"
                                type="checkbox"
                                className="toggle"
                                checked={theme === "dark"}
                            />
                        </div>
                    </div>

                    <label
                        htmlFor="confirm-delete-account"
                        className="btn btn-outline btn-error">
                        Delete Account
                    </label>
                </div>
            </main>

            <input
                type="checkbox"
                id="confirm-delete-account"
                className="modal-toggle"
            />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="p-10 modal-box">
                    <h3 className="text-lg font-bold text-center text-red-500">
                        Are you sure you want to delete your account?
                    </h3>
                    <div className="flex items-stretch justify-around">
                        <div className="modal-action">
                            <label
                                htmlFor="confirm-delete-account"
                                className="btn btn-outline btn-error">
                                Cancel
                            </label>
                        </div>
                        <div className="modal-action">
                            <label
                                onClick={() => handleDeleteAccount(user!.id)}
                                htmlFor="confirm-delete-account"
                                className="btn btn-outline btn-success">
                                Confirm
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;
