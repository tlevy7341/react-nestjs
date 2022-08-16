import { AxiosResponse } from "axios";
import create from "zustand";
import axios from "../api/axios";

interface User {
    id: number;
    email: string;
    avatar: string;
}

interface UserState {
    user: User | null;
    accessToken: string | null;
    persist: boolean;
    signInUser: (email: string, password: string) => Promise<string | void>;
    signUpUser: (email: string, password: string) => Promise<string | void>;
    signOutUser: () => void;
    sendForgotPasswordEmail: (email: string) => Promise<string | void>;
    resetPassword: (
        authToken: string,
        password: string
    ) => Promise<string | void>;
    changeAvatar: (avatar: string, id: number) => Promise<string | void>;
    deleteAccount: (id: number, token: string) => Promise<string | void>;
}

const returnError = (error: any): string => {
    return error?.response.data.message || "Something went wrong";
};

const persist = localStorage.getItem("persist")
    ? (JSON.parse(localStorage.getItem("persist") as string) as boolean)
    : false;

export const userStore = create<UserState>((set) => ({
    user: null,
    accessToken: null,
    persist: persist,

    signInUser: async (email: string, password: string) => {
        try {
            const { data }: AxiosResponse = await axios.post(
                "/signin",
                { email, password },
                {
                    withCredentials: true
                }
            );

            const user: User = {
                id: data.id,
                email: data.email,
                avatar: data.avatar
            };

            set({
                user: user,
                accessToken: data.accessToken
            });
        } catch (e) {
            return returnError(e);
        }
    },

    signUpUser: async (email: string, password: string) => {
        try {
            await axios.post("/signup", { email, password });
        } catch (e) {
            return returnError(e);
        }
    },

    signOutUser: async () => {
        try {
            await axios("/signout", { withCredentials: true });
            set({ user: null, accessToken: null });
        } catch (e) {
            return returnError(e);
        }
    },

    sendForgotPasswordEmail: async (email: string) => {
        try {
            await axios.post("/user/forgot-password", { email });
        } catch (e) {
            return returnError(e);
        }
    },

    resetPassword: async (accessToken: string, password: string) => {
        try {
            await axios.patch("/user/reset-password", {
                password,
                accessToken
            });
        } catch (e) {
            return returnError(e);
        }
    },

    changeAvatar: async (avatar: string, id: number) => {
        try {
            await axios.patch("/user/update-avatar", { avatar, id });
        } catch (e) {
            return returnError(e);
        }
    },
    deleteAccount: async (id: number, token: string) => {
        try {
            await axios.delete("/user/delete-account", {
                data: { id },
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            return returnError(e);
        }
    }
}));
