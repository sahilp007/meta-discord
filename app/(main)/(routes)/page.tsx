import {SignOutButton, UserButton} from "@clerk/nextjs";
// import NewSignOut from "./NewSignOut";

export default function Home() {
    return (
        <div className='flex flex-col'>
            <h1 className='text-3xl font-bold text-center'
            >You have signed in</h1>
            <UserButton
                afterSignOutUrl="/"
            />
            <SignOutButton>SIGN OUT</SignOutButton>
            <div>Text After Sign out</div>
        </div>
    )
}
