import { BiznexaNavbar } from "@/components/layout/BiznexaNavbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <BiznexaNavbar />
      <main className="flex-1 pt-28 w-full">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
