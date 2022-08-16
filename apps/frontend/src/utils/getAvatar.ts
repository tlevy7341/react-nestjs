import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

const getAvatar = () => {
  return createAvatar(style, { dataUri: true, size: 128 });
};

export default getAvatar;
