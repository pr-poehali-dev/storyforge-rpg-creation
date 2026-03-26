import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

type SkillRarity = 'legendary' | 'epic' | 'rare' | 'common';

interface CharStat {
  name: string;
  value: number;
  max: number;
  icon: string;
}

interface Skill {
  name: string;
  level: number;
  rarity: SkillRarity;
}

interface Achievement {
  emoji: string;
  name: string;
}

interface PastStory {
  title: string;
  genre: string;
  date: string;
}

const charStats: CharStat[] = [
  { name: 'Сила',         value: 14, max: 20, icon: 'Sword'         },
  { name: 'Интеллект',    value: 19, max: 20, icon: 'Brain'         },
  { name: 'Ловкость',     value: 11, max: 20, icon: 'Wind'          },
  { name: 'Харизма',      value: 16, max: 20, icon: 'MessageCircle' },
  { name: 'Выносливость', value: 13, max: 20, icon: 'Shield'        },
  { name: 'Мудрость',     value: 18, max: 20, icon: 'Eye'           },
];

const skills: Skill[] = [
  { name: 'Некромантия',       level: 5, rarity: 'legendary' },
  { name: 'Огненная магия',    level: 4, rarity: 'epic'      },
  { name: 'Телепатия',         level: 3, rarity: 'rare'      },
  { name: 'Зельеварение',      level: 4, rarity: 'epic'      },
  { name: 'Руническое письмо', level: 2, rarity: 'rare'      },
  { name: 'Астрология',        level: 3, rarity: 'common'    },
];

const achievements: Achievement[] = [
  { emoji: '🏆', name: 'Хранитель Хроник' },
  { emoji: '🗡️', name: 'Первая Кровь'     },
  { emoji: '📖', name: 'Сказитель'        },
  { emoji: '🌟', name: 'Легенда'          },
  { emoji: '⚔️', name: 'Воин Пера'        },
  { emoji: '🎭', name: 'Мастер Ролей'     },
];

const pastStories: PastStory[] = [
  { title: 'Пепел Эльдориана',        genre: 'Тёмное фэнтези',      date: '12 марта 2026' },
  { title: 'Хроники Железного Трона', genre: 'Эпическое фэнтези',   date: '5 марта 2026'  },
  { title: 'Морские Демоны Нарака',   genre: 'Морское приключение', date: '1 марта 2026'  },
];

const romanNumerals: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
};

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  return (
    <div className="min-h-screen fantasy-bg">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* ── Header / Banner ── */}
        <div className="animate-fade-in stagger-1">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-fantasy-mid via-fantasy-purple to-[#0D0B14] rounded-xl mb-0 relative" />

          {/* Avatar + name row — overlaps banner */}
          <div className="fantasy-card rounded-xl border-gold-glow px-6 pt-0 pb-6 -mt-10 relative">
            <div className="flex items-end gap-5 mb-4">
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full border-2 border-gold bg-gradient-to-br from-fantasy-mid to-fantasy-deep flex items-center justify-center text-3xl shrink-0 -mt-10 relative z-10">
                🧙
              </div>
              <div className="pb-1">
                <h1 className="font-cormorant text-3xl font-bold text-gold-gradient leading-tight">
                  Мерлин Тёмный
                </h1>
                <p className="text-sm text-foreground/60 font-golos mt-0.5">
                  Архимаг • Уровень 23
                </p>
              </div>
            </div>

            {/* XP bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 font-golos">Опыт: 7&thinsp;840 / 10&thinsp;000 XP</span>
                <span className="text-xs text-gold/70 font-oswald tracking-wide">78%</span>
              </div>
              <div className="stat-bar-bg h-2">
                <div className="stat-bar-fill h-2" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Character Stats ── */}
        <div className="animate-fade-in stagger-2">
          <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient mb-4">
            Характеристики
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {charStats.map((stat) => (
              <div key={stat.name} className="fantasy-card rounded-lg p-3 border-gold-glow">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={stat.icon} fallback="Star" size={14} className="text-gold/60 shrink-0" />
                  <span className="text-sm text-foreground/60 font-golos">{stat.name}</span>
                </div>
                <div className="font-cormorant text-2xl font-bold text-gold-gradient leading-none mb-2">
                  {stat.value}/{stat.max}
                </div>
                <div className="stat-bar-bg h-1.5">
                  <div
                    className="stat-bar-fill h-1.5"
                    style={{ width: `${Math.round((stat.value / stat.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills ── */}
        <div className="animate-fade-in stagger-3">
          <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient mb-4">
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className={`border rounded-full px-3 py-1.5 text-sm font-golos badge-${skill.rarity}`}
              >
                {skill.name} • {romanNumerals[skill.level] ?? skill.level}
              </span>
            ))}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="animate-fade-in stagger-4">
          <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient mb-4">
            Достижения
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.name}
                className="fantasy-card rounded-lg p-3 text-center border-gold-glow"
              >
                <div className="text-2xl">{ach.emoji}</div>
                <p className="text-xs text-foreground/60 mt-1 font-golos leading-tight">{ach.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Story History ── */}
        <div className="animate-fade-in stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cormorant text-2xl font-semibold text-gold-gradient">
              История Приключений
            </h2>
            <button
              onClick={() => onNavigate('archive')}
              className="btn-outline-gold text-xs px-4 py-1.5 rounded-lg"
            >
              Весь архив
            </button>
          </div>
          <div className="fantasy-card rounded-xl border-gold-glow divide-y divide-gold/10">
            {pastStories.map((story, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5 gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-cormorant text-fantasy-parchment font-semibold truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-foreground/40 font-golos mt-0.5">{story.genre}</p>
                </div>
                <span className="text-xs text-foreground/40 font-golos shrink-0">{story.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
