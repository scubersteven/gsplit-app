import { Toaster } from "@/components/ui/sonner";
import { WaveDivider } from "@/components/WaveDivider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Wave Divider with integrated navigation */}
      <WaveDivider />

      {/* Black Stout - Main Content */}
      <main className="flex-1 bg-[hsl(var(--guinness-black))]">
        {children}
      </main>

      {/* Toast notifications */}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default Layout;
