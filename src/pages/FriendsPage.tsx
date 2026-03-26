import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface FriendsPageProps {
  onNavigate: (page: string) => void;
}

type FriendStatus = 'online' | 'in_game' | 'offline';

interface Friend {
  id: number;
  name: string;
  class: string;
  level: number;
  status: FriendStatus;
  lastStory: string;
  avatar: string;
}

interface FriendRequest {
  name: string;
  avatar: string;
}

const friends: Friend[] = [
  { id: 1, name: 'Леандра',  class: 'Паладин',    level: 18, status: 'online',   lastStory: 'Пепел Эльдориана',    avatar: '⚔️' },
  { id: 2, name: 'Ворон',    class: 'Плут',        level: 21, status: 'in_game',  lastStory: 'Совет Теней',         avatar: '🗡️' },
  { id: 3, name: 'Элара',    class: 'Волшебница',  level: 15, status: 'offline',  lastStory: 'Башня Тысячи Магов',  avatar: '✨' },
  { id: 4, name: 'Браг',     class: 'Варвар',      level: 12, status: 'online',   lastStory: 'Морские Демоны',      avatar: '🪓' },
  { id: 5, name: 'Сильвия',  class: 'Друид',       level: 19, status: 'offline',  lastStory: 'Тени Старого Леса',   avatar: '🌿' },
];

const friendRequests: FriendRequest[] = [
  { name: 'Артемида', avatar: '🏹' },
  { name: 'Горм',     avatar: '⚒️' },
];

const statusConfig: Record<FriendStatus, { dot: string; label: string }> = {
  online:  { dot: 'bg-green-400',  label: 'В сети'    },
  in_game: { dot: 'bg-yellow-400', label: 'В игре'    },
  offline: { dot: 'bg-gray-500',   label: 'Не в сети' },
};

export default function FriendsPage({ onNavigate }: FriendsPageProps) {
  const [inviteValue, setInviteValue] = useState('https://loreforge.app/invite/merlin-dark');

  const handleCopy = () => {
    void navigator.clipboard.writeText(inviteValue);
  };

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="animate-fade-in stagger-1">
          <h1 className="font-cormorant text-4xl font-bold text-gold-gradient">
            Союзники
          </h1>
          <p className="text-sm text-foreground/50 font-golos mt-1">
            Зови друзей в свои истории
          </p>
        </div>

        {/* ── Invite Block ── */}
        <div className="fantasy-card rounded-xl p-5 border border-gold/30 animate-fade-in stagger-2">
          <h2 className="font-cormorant text-xl font-semibold text-gold-gradient mb-4">
            Пригласить Друга
          </h2>

          {/* Link row */}
          <div className="flex items-center gap-2 mb-4">
            <input
              value={inviteValue}
              onChange={(e) => setInviteValue(e.target.value)}
              className="flex-1 bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/50 font-golos text-foreground/70"
            />
            <button
              onClick={handleCopy}
              className="btn-gold rounded-lg px-4 py-2 text-xs flex items-center gap-2 shrink-0"
            >
              <Icon name="Copy" fallback="Star" size={14} />
              Скопировать ссылку
            </button>
          </div>

          {/* Social share row */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/40 font-golos mr-1">Или отправить через:</span>
            <button className="btn-outline-gold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5">
              <Icon name="Send" fallback="Star" size={13} />
              Telegram
            </button>
            <button className="btn-outline-gold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5">
              <Icon name="MessageSquare" fallback="Star" size={13} />
              VK
            </button>
          </div>
        </div>

        {/* ── Friends List ── */}
        <div className="animate-fade-in stagger-3">
          <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient mb-4">
            Мои Союзники{' '}
            <span className="text-xl text-foreground/40 font-golos font-normal">
              {friends.length}
            </span>
          </h2>

          <div className="space-y-3">
            {friends.map((friend, i) => {
              const statusInfo = statusConfig[friend.status];
              const isInGame = friend.status === 'in_game';

              return (
                <div
                  key={friend.id}
                  className={`fantasy-card rounded-xl p-4 border-gold-glow flex items-center gap-4 animate-fade-in stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-fantasy-mid border border-gold/20 flex items-center justify-center text-xl shrink-0">
                    {friend.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-cormorant text-lg font-semibold text-fantasy-parchment leading-tight">
                        {friend.name}
                      </span>
                      <span className="text-xs text-foreground/50 font-golos">
                        {friend.class} • Ур. {friend.level}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusInfo.dot}`} />
                      <span className="text-xs text-foreground/50 font-golos">{statusInfo.label}</span>
                    </div>

                    {/* Last story */}
                    <p className="text-xs text-foreground/40 font-golos mt-0.5 truncate">
                      Последняя история: {friend.lastStory}
                    </p>
                  </div>

                  {/* Invite button */}
                  <button
                    onClick={() => !isInGame && onNavigate('rooms')}
                    disabled={isInGame}
                    className={`btn-outline-gold text-xs px-3 py-1.5 rounded-lg shrink-0 transition-opacity duration-200 ${
                      isInGame ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Пригласить
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Friend Requests ── */}
        <div className="animate-fade-in stagger-4">
          <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient mb-4">
            Запросы в друзья{' '}
            <span className="text-xl text-foreground/40 font-golos font-normal">
              ({friendRequests.length})
            </span>
          </h2>

          <div className="space-y-3">
            {friendRequests.map((req) => (
              <div
                key={req.name}
                className="fantasy-card rounded-xl p-4 border-gold-glow flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-fantasy-mid border border-gold/20 flex items-center justify-center text-xl shrink-0">
                  {req.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant text-lg font-semibold text-fantasy-parchment leading-tight">
                    {req.name}
                  </p>
                  <p className="text-xs text-foreground/40 font-golos mt-0.5">
                    хочет стать союзником
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="btn-gold text-xs px-3 py-1.5 rounded">
                    Принять
                  </button>
                  <button className="btn-outline-gold text-xs px-3 py-1.5 rounded">
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
