import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'

const NewSignOut = () => {
    const { signOut } = useClerk();
    const router = useRouter()

    return (
        // Clicking on this button will sign out a user and reroute them to the "/" (home) page.
        <button onClick={() => signOut(() => router.push("/"))}>
            Sign out NOW
        </button>
    );
};