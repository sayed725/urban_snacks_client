import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar3";
import WhatsAppButton from "@/components/shared/WhatsAppButton";


export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <Navbar/>
   {children}
   <WhatsAppButton />
   <Footer/>
   </>
  );
}