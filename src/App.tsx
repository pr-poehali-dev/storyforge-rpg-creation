import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Icon from "@/components/ui/icon";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import RoomsPage from "./pages/RoomsPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import GamePage from "./pages/GamePage";
import CharacterCreatePage from "./pages/CharacterCreatePage";

const queryClient = new QueryClient();

type Page = "home" | "archive" | "rooms" | "profile" | "friends" | "game" | "character-create";

const navItems: { id: Page; label: string; icon: string; hideInGame?: boolean }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "archive", label: "Архив", icon: "BookOpen" },
  { id: "rooms", label: "Комнаты", icon: "Swords" },
  { id: "friends", label: "Союзники", icon: "Users" },
  { id: "profile", label: "Профиль", icon: "User" },
];

function Navigation({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  if (current === "game" || current === "character-create") return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      {/* Desktop top nav */}
      <div className="hidden md:flex items-center justify-between px-8 py-3 border-b border-gold/10"
        style={{ background: "linear-gradient(180deg, rgba(13,11,20,0.98) 0%, rgba(13,11,20,0.92) 100%)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => onNavigate("home")} className="font-cormorant text-2xl font-bold text-gold-gradient flex items-center gap-2">
          <span className="text-xl">⚔️</span> LoreForge
        </button>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-golos transition-all ${
                current === item.id
                  ? "text-gold bg-gold/10 border border-gold/20"
                  : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"
              }`}
            >
              <Icon name={item.icon} fallback="Star" size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-fantasy-mid border border-gold/30 flex items-center justify-center text-sm">
            🧙
          </div>
          <span className="text-xs text-foreground/50 font-golos">Мерлин</span>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-gold/15"
        style={{ background: "rgba(13,11,20,0.97)", backdropFilter: "blur(16px)" }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              current === item.id ? "text-gold" : "text-foreground/40"
            }`}
          >
            <Icon name={item.icon} fallback="Star" size={20} />
            <span className="text-[10px] font-golos">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function PageContent({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const navigate = (p: string) => onNavigate(p as Page);
  switch (page) {
    case "home": return <HomePage onNavigate={navigate} />;
    case "archive": return <ArchivePage onNavigate={navigate} />;
    case "rooms": return <RoomsPage onNavigate={navigate} />;
    case "profile": return <ProfilePage onNavigate={navigate} />;
    case "friends": return <FriendsPage onNavigate={navigate} />;
    case "game": return <GamePage onNavigate={navigate} />;
    case "character-create": return <CharacterCreatePage onNavigate={navigate} />;
    default: return <HomePage onNavigate={navigate} />;
  }
}

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen fantasy-bg">
          <Navigation current={currentPage} onNavigate={setCurrentPage} />
          <div className={currentPage !== "game" && currentPage !== "character-create" ? "md:pt-[57px] pb-[64px] md:pb-0" : ""}>
            <PageContent page={currentPage} onNavigate={setCurrentPage} />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;