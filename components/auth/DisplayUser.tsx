'use client';

import useUserData from "./useUserData";

type userProps = {
    hasWelcome?: boolean;
    userNameProp?: string;
}

const WelcomeUser: React.FC<userProps> = ({ hasWelcome = false, userNameProp }) => {
    const userData = useUserData();
    const userName = userData?.name || userNameProp;
    console.log(userData, "userdta")
    console.log(userName, "username")
    return (
        hasWelcome ? (
            <h2 className='text-3xl font-bold tracking-tight'>Welcome back {userName}</h2>
        ) : <>{userName}</>
    )
}

export { WelcomeUser };