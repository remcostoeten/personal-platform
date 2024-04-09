import { Icons } from "@/components/icons";
import { User } from "firebase/auth";

export interface NavItem {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export interface FooterItem {
    title: string;
    items: {
        title: string;
        href: string;
        external?: boolean;
    }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


export type Auth = {
    currentUser: () => User | null;
    onAuthStateChanged: (
        auth: Auth,
        onNext: (user: User | null) => void,
        onError: (error: Error) => void,
    ) => () => void;
};