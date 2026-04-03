import Navbar from "@/components/shared/Navbar3";


export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <Navbar/>
   {children}
   </>
  );
}