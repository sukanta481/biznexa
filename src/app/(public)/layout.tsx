import { BiznexaNavbar } from "@/components/layout/BiznexaNavbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BiznexaNavbar />
      <main className="flex-1 pt-28 w-full">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
