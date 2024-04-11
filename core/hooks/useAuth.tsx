import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/core/database/firebase'; // Replace with the path to your firebase.ts

export function useAuth() {
    const [user, loading, error] = useAuthState(auth);

    return { user, loading, error };
}
