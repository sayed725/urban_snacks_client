import Navbar2 from "@/components/shared/Navbar2";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <Navbar2/>
   {children}
   </>
  );
}