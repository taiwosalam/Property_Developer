"use client";

import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/general-store";
import { getIconByContentType } from "@/app/(nav)/(messages-reviews)/messages/data";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

type UseMessageUserProps = {
    id: number | string;
    fullname: string;
    pfp?: string;
    last_seen?: string;
    content_type?: string;
    type?: string;
    role?: string;
    tier?: number;
    onClick?: () => void;
};

export function useMessageUser({
    id,
    fullname,
    pfp,
    last_seen,
    content_type,
    type,
    role,
    tier,
    onClick,
}: UseMessageUserProps) {
    const router = useRouter();
    const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

    console.log({ content_type })

    console.log({
        id,
        fullname,
        pfp,
        last_seen,
        content_type,
        type,
        role,
        tier,
        onClick,
    })

    const IconComponent = getIconByContentType(content_type ?? "");
    console.log({ IconComponent })
    const isGroupChat = type?.toLowerCase() === "group";
    const isOnline = last_seen?.toLowerCase() === "online";

    // Badge color logic
    let badgeColor: string | undefined;
    if (!isGroupChat) {
        const specialRoles = [
            "director",
            "account",
            "staff",
            "manager",
            "super-admin",
        ];
        if (specialRoles.includes(role ?? "")) {
            badgeColor = tier === 2 ? "gray" : undefined;
        } else if (tier && tierColorMap[tier as keyof typeof tierColorMap]) {
            badgeColor = tierColorMap[tier as keyof typeof tierColorMap];
        }
    }

    const handleClick = () => {
        setGlobalStore("messageUserData", {
            id: Number(id),
            branch_id: 1,
            position: "",
            name: fullname,
            imageUrl: pfp as string,
            last_seen,
        });

        setGlobalStore("isGroupChat", isGroupChat);

        if (onClick) {
            onClick();
        } else {
            router.push(`/messages/${id}`);
        }
    };

    return {
        IconComponent,
        isGroupChat,
        isOnline,
        badgeColor,
        handleClick,
    };
}
