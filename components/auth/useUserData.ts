'use client'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { auth } from '@/core/database/firebase';

type UserDataType = {
    email?: string;
    image?: string;
    name?: string;
};

export default function useUserData(): UserDataType | null {
    const [userData, setUserData] = useState<UserDataType | null>(null);
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists) {
                    setUserData(userDocSnap.data() as UserDataType);
                } else {
                    console.error('User document not found');
                }
            } else {
                setUserData(null);
            }
        });

        return unsubscribe;
    }, [auth, db]);

    return userData;
};
