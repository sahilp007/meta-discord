const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <div className="h-full bg-amber-400">
      {children}
    </div>
   );
}
 
export default AuthLayout;