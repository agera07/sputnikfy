import React, { useState, useEffect } from "react";
import { Image } from "semantic-ui-react";
import NoAvatar from "../../assests/png/user.png";

export default function UploadAvatar(props) {
  const { user } = props;

  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);
  return (
    <div className="user-avatar">
      <Image src={avatarUrl ? avatarUrl : NoAvatar} />
    </div>
  );
}
