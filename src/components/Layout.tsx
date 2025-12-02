import { Link, useLocation } from "react-router-dom";
import { Beer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import gSplitLogo from "@/assets/g-split-logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Creamy Guinness Head - Header */}
      <header className="bg-[#fdecd0] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={gSplitLogo} 
                alt="GSplit Logo" 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold text-[hsl(var(--header-fg))] tracking-tight">
                GSplit
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
                    isActive("/") ? "bg-[hsl(var(--cream-dark))]" : ""
                  }`}
                >
                  <span className="font-ui font-semibold">Bar</span>
                </Button>
              </Link>

              <Link to="/log">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
                    isActive("/log") ? "bg-[hsl(var(--cream-dark))]" : ""
                  }`}
                >
                  <span className="font-ui font-semibold">Pints</span>
                </Button>
              </Link>

              <Link to="/map">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
                    isActive("/map") ? "bg-[hsl(var(--cream-dark))]" : ""
                  }`}
                >
                  <span className="font-ui font-semibold">Pubs</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
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
