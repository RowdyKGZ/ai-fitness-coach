"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

type Props = {};

const routes = [
  { name: "Chat", path: "/" },
  { name: "Profile", path: "/profile" },
];

export const Nvabar = (props: Props) => {
  const pathname = usePathname();

  return (
    <div className="p-4 flex flex-row justify-between items-center bg-black text-white">
      <Link href="/">
        <h1 className="text-2xl font-bold">Goggins AI</h1>
      </Link>

      <div className="flex gap-x-6 text-lg items-center">
        {routes.map((route, inx) => (
          <Link
            key={inx}
            href={route.path}
            className={
              pathname === route.path ? "border-b-2" : "border-yellow-50"
            }
          >
            {route.name}
          </Link>
        ))}

        <UserButton />
      </div>
    </div>
  );
};
