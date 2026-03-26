import Icon from '@/components/ui/icon';

const HERO_IMAGE = "https://cdn.poehali.dev/projects/189d9916-c099-45d9-a46a-dbdf08dbb452/files/46aca2d0-2008-461d-b66d-8982da86258b.jpg";

const featuredStories = [
  { id: 1, title: "Пепел Эльдориана", genre: "Тёмное фэнтези", players: 4, status: "active", progress: 68 },
  { id: 2, title: "Хроники Железного Трона", genre: "Эпическое фэнтези", players: 3, status: "completed", progress: 100 },
  { id: 3, title: "Последний маг Аркании", genre: "Магическое приключение", players: 2, status: "active", progress: 34 },
];

const quickStats = [
  { label: "Историй сыграно", value: "12", icon: "BookOpen" },
  { label: "Часов в игре", value: "47", icon: "Clock" },
  { label: "Друзей", value: "8", icon: "Users" },
  { label: "Достижений", value: "23", icon: "Trophy" },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen fantasy-bg">
      {/* Hero Section */}
      <div className="relative h-[420px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Fantasy World"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0B14]/60 to-[#0D0B14]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="animate-fade-in stagger-1">
            <p className="text-gold-gradient font-oswald text-sm tracking-[0.3em] uppercase mb-3">Добро пожаловать в</p>
            <h1 className="font-cormorant text-6xl md:text-7xl font-bold text-gold-gradient mb-4 leading-tight">
              LoreForge
            </h1>
            <p className="text-fantasy-parchment/70 font-golos text-lg max-w-md mx-auto mb-8">
              Создавай эпические истории вместе с друзьями. ИИ ткёт судьбы — вы решаете их исход.
            </p>
          </div>
          <div className="flex gap-4 animate-fade-in stagger-2">
            <button
              onClick={() => onNavigate('rooms')}
              className="btn-gold px-8 py-3 rounded-lg font-oswald text-sm tracking-widest"
            >
              Начать Историю
            </button>
            <button
              onClick={() => onNavigate('archive')}
              className="btn-outline-gold px-8 py-3 rounded-lg text-sm"
            >
              Архив
            </button>
          </div>
        </div>

        {/* Floating rune decoration */}
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full border border-gold/20 animate-rune-spin opacity-40" />
        <div className="absolute top-12 left-12 w-8 h-8 rounded-full border border-gold/30 animate-rune-spin opacity-30" style={{animationDirection:'reverse', animationDuration:'12s'}} />
        <div className="absolute bottom-16 right-12 w-12 h-12 rounded-full border border-gold/20 animate-rune-spin opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in stagger-2">
          {quickStats.map((stat, i) => (
            <div key={i} className="fantasy-card rounded-xl p-4 text-center border-gold-glow">
              <Icon name={stat.icon} fallback="Star" size={20} className="text-gold mx-auto mb-2" />
              <div className="font-cormorant text-3xl font-bold text-gold-gradient">{stat.value}</div>
              <div className="text-xs text-foreground/50 font-golos mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Stories */}
        <div className="animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant text-3xl font-semibold text-gold-gradient">Активные Истории</h2>
            <button onClick={() => onNavigate('rooms')} className="btn-outline-gold text-xs px-4 py-2 rounded-lg">
              Все комнаты
            </button>
          </div>
          <div className="space-y-3">
            {featuredStories.map((story) => (
              <div key={story.id} className="fantasy-card rounded-xl p-5 cursor-pointer border-gold-glow" onClick={() => onNavigate('game')}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-cormorant text-xl font-semibold text-fantasy-parchment">{story.title}</h3>
                    <span className="text-xs text-gold/70 font-golos">{story.genre}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-foreground/50 text-xs">
                      <Icon name="Users" size={12} />
                      <span>{story.players}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-oswald tracking-wide ${
                      story.status === 'active'
                        ? 'border-green-500/30 text-green-400 bg-green-500/10'
                        : 'border-gold/30 text-gold/70 bg-gold/5'
                    }`}>
                      {story.status === 'active' ? 'Активна' : 'Завершена'}
                    </span>
                  </div>
                </div>
                <div className="stat-bar-bg h-1.5">
                  <div className="stat-bar-fill h-1.5" style={{ width: `${story.progress}%` }} />
                </div>
                <div className="text-right text-xs text-foreground/40 mt-1">{story.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Block */}
        <div className="animate-fade-in stagger-4 fantasy-card rounded-2xl p-8 text-center border border-gold/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fantasy-mid/30 to-transparent" />
          <div className="relative z-10">
            <div className="text-4xl mb-4">⚔️</div>
            <h2 className="font-cormorant text-3xl font-bold text-gold-gradient mb-2">Пригласи Союзников</h2>
            <p className="text-foreground/60 text-sm mb-6 font-golos max-w-xs mx-auto">
              Лучшие истории рождаются в компании. Позови друзей и сразитесь с судьбой вместе.
            </p>
            <button onClick={() => onNavigate('friends')} className="btn-gold px-8 py-3 rounded-lg text-sm">
              Найти Союзников
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}