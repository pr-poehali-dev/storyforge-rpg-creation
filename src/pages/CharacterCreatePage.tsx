import { useState } from 'react';
import Icon from '@/components/ui/icon';

const GENERATE_CHARACTER_URL = 'https://functions.poehali.dev/df212d01-256e-406b-ab5d-f9fb4a972f1d';

interface CharacterCreatePageProps {
  onNavigate: (page: string) => void;
}

interface CharacterStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

interface Character {
  name: string;
  class_name: string;
  subclass: string;
  race: string;
  background: string;
  level: number;
  hp: number;
  max_hp: number;
  armor_class: number;
  stats: CharacterStats;
  saving_throws: string[];
  skills: string[];
  traits: string[];
  equipment: string[];
  spells: string[];
  avatar: string;
  backstory: string;
}

const STAT_LABELS: Record<keyof CharacterStats, string> = {
  STR: 'Сила',
  DEX: 'Ловкость',
  CON: 'Телосложение',
  INT: 'Интеллект',
  WIS: 'Мудрость',
  CHA: 'Харизма',
};

function statModifier(val: number): string {
  const mod = Math.floor((val - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function CharacterCreatePage({ onNavigate }: CharacterCreatePageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);

  const handleGenerate = async () => {
    if (!name.trim() || !description.trim()) return;
    setIsLoading(true);
    setError(null);
    setCharacter(null);

    try {
      const resp = await fetch(GENERATE_CHARACTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка генерации');
      setCharacter(data.character);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen fantasy-bg flex flex-col">

      {/* Top bar */}
      <div className="border-b border-gold/15 bg-[#0D0B14]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => onNavigate('rooms')}
            className="btn-outline-gold p-1.5 rounded-lg shrink-0 flex items-center justify-center"
          >
            <Icon name="ArrowLeft" fallback="Star" size={16} />
          </button>
          <h1 className="font-cormorant text-xl font-semibold text-gold-gradient">
            Создание персонажа
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

        {/* Form */}
        <div className="fantasy-card rounded-xl p-6 border-gold-glow animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">⚔️</span>
            <h2 className="font-cormorant text-2xl font-bold text-gold-gradient">Кто ты, герой?</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-oswald tracking-wider text-gold/70 mb-2 uppercase">
                Имя персонажа
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Торин, Элара, Воронок..."
                className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-3 font-golos text-sm focus:outline-none focus:border-gold/50 text-foreground/90 placeholder:text-foreground/30"
              />
            </div>

            <div>
              <label className="block text-xs font-oswald tracking-wider text-gold/70 mb-2 uppercase">
                Описание персонажа
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Опиши своего персонажа своими словами. Например: «Тёмный эльф, изгнанный за изучение некромантии. Холодный и расчётливый, но верный союзникам. Предпочитает тени и магию смерти...»"
                className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-3 font-golos text-sm resize-none focus:outline-none focus:border-gold/50 text-foreground/80 placeholder:text-foreground/30"
              />
              <p className="text-xs text-foreground/30 font-golos mt-1.5">
                Чем подробнее описание — тем точнее персонаж
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <Icon name="AlertCircle" fallback="Star" size={15} className="text-red-400 shrink-0" />
                <span className="text-sm text-red-400 font-golos">{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !name.trim() || !description.trim()}
              className="btn-gold px-6 py-3 rounded-lg font-oswald tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ИИ создаёт персонажа...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" fallback="Star" size={17} />
                  Сгенерировать персонажа
                </>
              )}
            </button>
          </div>
        </div>

        {/* Character card */}
        {character && (
          <div className="animate-fade-in flex flex-col gap-4">

            {/* Header */}
            <div className="fantasy-card rounded-xl p-6 border-gold-glow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#1A1228] border border-gold/30 flex items-center justify-center text-4xl shrink-0">
                  {character.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-cormorant text-3xl font-bold text-gold-gradient">{character.name}</h2>
                  <p className="text-sm text-foreground/60 font-golos mt-0.5">
                    {character.race} · {character.class_name} {character.subclass && `(${character.subclass})`} · {character.background}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs font-oswald tracking-wider text-gold/70 border border-gold/20 rounded-full px-3 py-1">
                      Уровень {character.level}
                    </span>
                    <span className="text-xs font-oswald tracking-wider text-red-400/80 border border-red-500/20 rounded-full px-3 py-1">
                      ❤️ {character.max_hp} HP
                    </span>
                    <span className="text-xs font-oswald tracking-wider text-blue-400/80 border border-blue-500/20 rounded-full px-3 py-1">
                      🛡️ AC {character.armor_class}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground/60 font-golos leading-relaxed mt-4 pt-4 border-t border-gold/10 italic">
                {character.backstory}
              </p>
            </div>

            {/* Stats */}
            <div className="fantasy-card rounded-xl p-5 border-gold-glow">
              <h3 className="font-cormorant text-lg font-semibold text-gold mb-4">Характеристики</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {(Object.keys(STAT_LABELS) as (keyof CharacterStats)[]).map((stat) => (
                  <div key={stat} className="flex flex-col items-center bg-[#1A1228] rounded-lg p-3 border border-gold/10">
                    <span className="text-xs font-oswald tracking-wider text-gold/50 mb-1">{stat}</span>
                    <span className="text-2xl font-cormorant font-bold text-foreground/90">{character.stats[stat]}</span>
                    <span className="text-xs text-gold/70 font-golos">{statModifier(character.stats[stat])}</span>
                    <span className="text-[10px] text-foreground/30 font-golos mt-0.5 text-center leading-tight">{STAT_LABELS[stat]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traits + Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="fantasy-card rounded-xl p-5 border-gold-glow">
                <h3 className="font-cormorant text-lg font-semibold text-gold mb-3">Особенности</h3>
                <ul className="space-y-2">
                  {character.traits.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70 font-golos">
                      <span className="text-gold/50 mt-0.5 shrink-0">◆</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fantasy-card rounded-xl p-5 border-gold-glow">
                <h3 className="font-cormorant text-lg font-semibold text-gold mb-3">Навыки и спасброски</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[...character.saving_throws, ...character.skills].map((s, i) => (
                    <span key={i} className="text-xs bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1 text-foreground/70 font-golos">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment + Spells */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="fantasy-card rounded-xl p-5 border-gold-glow">
                <h3 className="font-cormorant text-lg font-semibold text-gold mb-3">Снаряжение</h3>
                <ul className="space-y-1.5">
                  {character.equipment.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-golos">
                      <Icon name="Package" fallback="Star" size={13} className="text-gold/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {character.spells && character.spells.length > 0 && (
                <div className="fantasy-card rounded-xl p-5 border-gold-glow">
                  <h3 className="font-cormorant text-lg font-semibold text-gold mb-3">Заклинания</h3>
                  <ul className="space-y-1.5">
                    {character.spells.map((spell, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-golos">
                        <Icon name="Zap" fallback="Star" size={13} className="text-purple-400/60 shrink-0" />
                        {spell}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-4">
              <button
                onClick={handleGenerate}
                className="btn-outline-gold px-5 py-2.5 rounded-lg font-golos text-sm flex items-center gap-2"
              >
                <Icon name="RefreshCw" fallback="Star" size={15} />
                Перегенерировать
              </button>
              <button
                onClick={() => onNavigate('game')}
                className="btn-gold px-6 py-2.5 rounded-lg font-oswald tracking-wider flex items-center gap-2 flex-1 justify-center"
              >
                <Icon name="Swords" fallback="Star" size={16} />
                Начать приключение
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
