import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ArchivePageProps {
  onNavigate: (page: string) => void;
}

type StoryStatus = 'completed' | 'active';
type FilterTab = 'all' | 'completed' | 'active';

interface Story {
  id: number;
  title: string;
  genre: string;
  desc: string;
  players: number;
  date: string;
  status: StoryStatus;
  progress: number;
}

const stories: Story[] = [
  { id: 1, title: 'Пепел Эльдориана', genre: 'Тёмное фэнтези', desc: 'Герои исследуют пепельные руины некогда великой империи.', players: 4, date: '12 марта 2026', status: 'completed', progress: 100 },
  { id: 2, title: 'Хроники Железного Трона', genre: 'Эпическое фэнтези', desc: 'Война за корону раздирает королевство на части.', players: 3, date: '5 марта 2026', status: 'completed', progress: 100 },
  { id: 3, title: 'Последний маг Аркании', genre: 'Магическое приключение', desc: 'Единственный выживший маг ищет утраченные знания.', players: 2, date: 'В процессе', status: 'active', progress: 34 },
  { id: 4, title: 'Морские Демоны Нарака', genre: 'Морское приключение', desc: 'Экипаж проклятого корабля ищет путь домой.', players: 5, date: '1 марта 2026', status: 'completed', progress: 100 },
  { id: 5, title: 'Тени Старого Леса', genre: 'Мистика', desc: 'Древний лес скрывает тайны, которых лучше не знать.', players: 2, date: 'В процессе', status: 'active', progress: 67 },
  { id: 6, title: 'Дракон Медных Гор', genre: 'Классическое фэнтези', desc: 'Дракон пробудился и требует жертвы от горного народа.', players: 6, date: '20 фев 2026', status: 'completed', progress: 100 },
];

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'completed', label: 'Завершённые' },
  { key: 'active', label: 'В процессе' },
];

export default function ArchivePage({ onNavigate }: ArchivePageProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = stories.filter((s) => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="text-center animate-fade-in stagger-1">
          <h1 className="font-cormorant text-4xl font-bold text-gold-gradient mb-2">
            Архив Историй
          </h1>
          <div className="ornament-divider my-3 max-w-xs mx-auto">
            <Icon name="BookOpen" fallback="Star" size={14} className="text-gold/60" />
          </div>
          <p className="font-golos text-sm text-foreground/50 max-w-sm mx-auto">
            Летопись всех странствий — от первых шагов до финальной страницы.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 animate-fade-in stagger-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-xs transition-all duration-200 ${
                activeTab === tab.key
                  ? 'btn-gold'
                  : 'btn-outline-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in stagger-3">
          {filtered.map((story, i) => (
            <div
              key={story.id}
              onClick={() => onNavigate('game')}
              className={`fantasy-card rounded-xl p-5 border-gold-glow cursor-pointer animate-fade-in stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-cormorant text-xl font-semibold text-fantasy-parchment leading-tight">
                  {story.title}
                </h3>
                <span className="shrink-0 text-xs border rounded-full px-2 py-0.5 text-gold/70 border-gold/30 font-golos whitespace-nowrap">
                  {story.genre}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/60 font-golos mb-4 leading-relaxed">
                {story.desc}
              </p>

              {/* Progress bar */}
              <div className="stat-bar-bg h-1.5 mb-3">
                <div
                  className="stat-bar-fill h-1.5"
                  style={{ width: `${story.progress}%` }}
                />
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-foreground/50 text-xs font-golos">
                    <Icon name="Users" fallback="Star" size={12} className="text-gold/50" />
                    <span>{story.players}</span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground/40 text-xs font-golos">
                    <Icon name="Calendar" fallback="Star" size={12} className="text-gold/40" />
                    <span>{story.date}</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-oswald tracking-wide ${
                    story.status === 'active'
                      ? 'border-green-500/30 text-green-400 bg-green-500/10'
                      : 'border-gold/30 text-gold/70 bg-gold/5'
                  }`}
                >
                  {story.status === 'active' ? 'Активна' : 'Завершена'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 animate-fade-in stagger-2">
            <Icon name="ScrollText" fallback="Star" size={32} className="text-gold/30 mx-auto mb-3" />
            <p className="font-cormorant text-xl text-foreground/40">Историй не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
