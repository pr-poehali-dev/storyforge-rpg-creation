import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const ROOMS_API_URL = 'https://functions.poehali.dev/a75df6e1-ba56-4835-a3d8-14476885d98b';

interface RoomsPageProps {
  onNavigate: (page: string) => void;
}

interface Room {
  id: number;
  name: string;
  genre: string;
  description: string;
  story_intro: string;
  max_players: number;
  status: string;
  creator: string;
  created_at: string;
  players_count: number;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  open:    { label: 'Открыта', classes: 'border-green-500/30 text-green-400 bg-green-500/10' },
  playing: { label: 'В игре',  classes: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' },
  full:    { label: 'Полная',  classes: 'border-red-500/30 text-red-400 bg-red-500/10' },
};

const ALL_GENRES = 'Все';

export default function RoomsPage({ onNavigate }: RoomsPageProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(ALL_GENRES);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch(ROOMS_API_URL);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка загрузки');
      setRooms(data.rooms);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить комнаты');
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [ALL_GENRES, ...Array.from(new Set(rooms.map((r) => r.genre)))];

  const filtered = rooms.filter((room) => {
    const matchesGenre = activeGenre === ALL_GENRES || room.genre === activeGenre;
    const q = search.toLowerCase();
    const matchesSearch = q === '' || room.name.toLowerCase().includes(q) || room.genre.toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in stagger-1">
          <div>
            <h1 className="font-cormorant text-4xl font-bold text-gold-gradient">Игровые Комнаты</h1>
            <p className="font-golos text-sm text-foreground/50 mt-1">Найди свою историю или создай новую</p>
          </div>
          <button
            onClick={() => onNavigate('room-create')}
            className="btn-gold px-6 py-2 rounded-lg flex items-center gap-2 shrink-0"
          >
            <Icon name="Plus" fallback="Star" size={16} />
            Создать комнату
          </button>
        </div>

        {/* Search + filters */}
        <div className="animate-fade-in stagger-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или жанру..."
            className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-foreground/80 focus:outline-none focus:border-gold/50 font-golos mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`rounded-full border text-xs px-3 py-1 transition-all duration-200 ${
                  activeGenre === genre ? 'btn-gold' : 'btn-outline-gold'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <span className="w-5 h-5 border-2 border-gold/50 border-t-transparent rounded-full animate-spin" />
            <span className="text-foreground/40 font-golos text-sm">Загружаем комнаты...</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Icon name="AlertCircle" fallback="Star" size={32} className="text-red-400/50" />
            <p className="text-red-400/70 font-golos text-sm">{error}</p>
            <button onClick={fetchRooms} className="btn-outline-gold px-4 py-2 rounded-lg text-sm font-golos flex items-center gap-2">
              <Icon name="RefreshCw" fallback="Star" size={14} />
              Повторить
            </button>
          </div>
        )}

        {/* Room list */}
        {!isLoading && !error && (
          <div className="space-y-4 animate-fade-in stagger-3">
            {filtered.map((room, i) => {
              const statusInfo = statusConfig[room.status] ?? statusConfig.open;
              const isFull = room.status === 'full';
              const playersCount = room.players_count ?? 0;

              return (
                <div
                  key={room.id}
                  className={`fantasy-card rounded-xl p-5 border-gold-glow animate-fade-in stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                >
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
                      <span>{playersCount}/{room.max_players}</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/60 font-golos mb-4 leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full border font-oswald tracking-wide ${statusInfo.classes}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-foreground/40 font-golos">
                        Мастер: {room.creator}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('character-create')}
                      disabled={isFull}
                      className={`btn-outline-gold text-xs px-4 py-1.5 rounded-lg transition-opacity duration-200 ${isFull ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      Войти
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Icon name="Search" fallback="Star" size={32} className="text-gold/30 mx-auto mb-3" />
                <p className="font-cormorant text-xl text-foreground/40">
                  {rooms.length === 0 ? 'Комнат пока нет' : 'Комнат не найдено'}
                </p>
                <p className="font-golos text-sm text-foreground/30 mt-1">
                  {rooms.length === 0
                    ? 'Стань первым мастером — создай свою историю'
                    : 'Попробуй изменить поисковый запрос или фильтр'}
                </p>
                {rooms.length === 0 && (
                  <button
                    onClick={() => onNavigate('room-create')}
                    className="btn-gold px-6 py-2.5 rounded-lg font-oswald tracking-wider mt-5 inline-flex items-center gap-2"
                  >
                    <Icon name="Plus" fallback="Star" size={16} />
                    Создать первую комнату
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
