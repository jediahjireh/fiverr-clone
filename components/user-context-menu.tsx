"use client";

import { useState } from "react";

import Image from "next/image";

export function UserContextMenu({
  user,
}: {
  user: { image?: string | null; username: string };
}) {
  const [imgError, setImgError] = useState(false);

  if (user.image && !imgError) {
    return (
      <Image
        src={user.image}
        alt={user.username}
        width={32}
        height={32}
        className="rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 font-semibold uppercase text-white">
      {user.username.charAt(0)}
    </div>
  );
}
