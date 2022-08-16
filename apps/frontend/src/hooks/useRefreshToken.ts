import axios from "../api/axios";
import { userStore } from "../zustand/userStore";

const useRefreshToken = () => {
    const refresh = async () => {
        const { data } = await axios.get("/refresh", {
            withCredentials: true
        });
        const user = { id: data.id, email: data.email, avatar: data.avatar };

        if (data.accessToken) {
            userStore.setState({ accessToken: data.accessToken });
            userStore.setState({ user: user });
        }
        return data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
