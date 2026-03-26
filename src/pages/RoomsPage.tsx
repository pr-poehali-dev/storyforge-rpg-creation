import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface RoomsPageProps {
  onNavigate: (page: string) => void;
}

type RoomStatus = 'open' | 'full' | 'playing';
type GenreFilter = 'Все' | 'Тёмное фэнтези' | 'Эпика' | 'Магия' | 'Мистика' | 'Приключение';

interface Room {
  id: number;
  name: string;
  genre: string;
  players: number;
  maxPlayers: number;
  desc: string;
  status: RoomStatus;
  creator: string;
}

const rooms: Room[] = [
  { id: 1, name: 'Пепел Эльдориана', genre: 'Тёмное фэнтези', players: 3, maxPlayers: 6, desc: 'Исследуйте руины павшей империи и раскройте её тайны.', status: 'open', creator: 'Мерлин' },
  { id: 2, name: 'Охотники за Артефактами', genre: 'Приключение', players: 4, maxPlayers: 4, desc: 'Гонка за древними реликвиями в джунглях забытых богов.', status: 'full', creator: 'Леандра' },
  { id: 3, name: 'Совет Теней', genre: 'Мистика', players: 2, maxPlayers: 6, desc: 'Тайное общество разгадывает убийства в великом городе.', status: 'open', creator: 'Ворон' },
  { id: 4, name: 'Флот Проклятых', genre: 'Морское приключение', players: 5, maxPlayers: 6, desc: 'Семь морей, семь тайн, один проклятый экипаж.', status: 'playing', creator: 'Джек' },
  { id: 5, name: 'Башня Тысячи Магов', genre: 'Магия', players: 1, maxPlayers: 6, desc: 'Взберитесь на вершину башни, где каждый этаж — испытание.', status: 'open', creator: 'Элара' },
];

const genreFilters: GenreFilter[] = ['Все', 'Тёмное фэнтези', 'Эпика', 'Магия', 'Мистика', 'Приключение'];

const statusConfig: Record<RoomStatus, { label: string; classes: string }> = {
  open: { label: 'Открыта', classes: 'border-green-500/30 text-green-400 bg-green-500/10' },
  playing: { label: 'В игре', classes: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' },
  full: { label: 'Полная', classes: 'border-red-500/30 text-red-400 bg-red-500/10' },
};

export default function RoomsPage({ onNavigate }: RoomsPageProps) {
  const [activeGenre, setActiveGenre] = useState<GenreFilter>('Все');
  const [search, setSearch] = useState('');

  const filtered = rooms.filter((room) => {
    const matchesGenre = activeGenre === 'Все' || room.genre === activeGenre;
    const query = search.toLowerCase();
    const matchesSearch =
      query === '' ||
      room.name.toLowerCase().includes(query) ||
      room.genre.toLowerCase().includes(query);
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between animate-fade-in stagger-1">
          <div>
            <h1 className="font-cormorant text-4xl font-bold text-gold-gradient">
              Игровые Комнаты
            </h1>
            <p className="font-golos text-sm text-foreground/50 mt-1">
              Найди свою историю или создай новую
            </p>
          </div>
          <button
            onClick={() => onNavigate('game')}
            className="btn-gold px-6 py-2 rounded-lg flex items-center gap-2 shrink-0"
          >
            <Icon name="Plus" fallback="Star" size={16} />
            Создать комнату
          </button>
        </div>

        {/* Search */}
        <div className="animate-fade-in stagger-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или жанру..."
            className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-foreground/80 focus:outline-none focus:border-gold/50 font-golos mb-6"
          />

          {/* Genre filter pills */}
          <div className="flex flex-wrap gap-2">
            {genreFilters.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`rounded-full border text-xs px-3 py-1 transition-all duration-200 ${
                  activeGenre === genre
                    ? 'btn-gold'
                    : 'btn-outline-gold'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Room list */}
        <div className="space-y-4 animate-fade-in stagger-3">
          {filtered.map((room, i) => {
            const statusInfo = statusConfig[room.status];
            const isFull = room.status === 'full';

            return (
              <div
                key={room.id}
                className={`fantasy-card rounded-xl p-5 border-gold-glow animate-fade-in stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <h3 className="font-cormorant text-xl font-semibold text-fantasy-parchment leading-tight truncate">
                      {room.name}
                    </h3>
                    <span className="shrink-0 text-xs border rounded-full px-2 py-0.5 text-gold/70 border-gold/30 font-golos mt-0.5 whitespace-nowrap">
                      {room.genre}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-foreground/50 text-sm font-golos">
                    <Icon name="Users" fallback="Star" size={14} className="text-gold/50" />
                    <span>{room.players}/{room.maxPlayers}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/60 font-golos mb-4 leading-relaxed">
                  {room.desc}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border font-oswald tracking-wide ${statusInfo.classes}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-foreground/40 font-golos">
                      Создатель: {room.creator}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('game')}
                    disabled={isFull}
                    className={`btn-outline-gold text-xs px-4 py-1.5 rounded-lg transition-opacity duration-200 ${
                      isFull ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    Войти
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 animate-fade-in stagger-2">
            <Icon name="Search" fallback="Star" size={32} className="text-gold/30 mx-auto mb-3" />
            <p className="font-cormorant text-xl text-foreground/40">Комнат не найдено</p>
            <p className="font-golos text-sm text-foreground/30 mt-1">
              Попробуйте изменить поисковый запрос или фильтр
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
