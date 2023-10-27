import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className=''>
        <h1 className=' text-3xl font-bold text-center'
        >You've signed in</h1>
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  )
}
