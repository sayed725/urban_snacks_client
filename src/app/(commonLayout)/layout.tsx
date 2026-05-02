import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar3";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import MobileBottomNav from "@/components/shared/MobileBottomNav";
import ChatWidget from "@/components/chat/ChatWidget";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <Navbar/>
   {children}
   <WhatsAppButton  className="hidden lg:flex"  />
    <ChatWidget />
   <MobileBottomNav />
   <Footer/>
   </>
  );
}