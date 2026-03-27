import { useState } from 'react';
import Icon from '@/components/ui/icon';

const GENERATE_ROOM_URL = 'https://functions.poehali.dev/a1b34cc3-6b69-435e-9a31-87b11beed4d7';
const ROOMS_API_URL = 'https://functions.poehali.dev/a75df6e1-ba56-4835-a3d8-14476885d98b';

interface RoomCreatePageProps {
  onNavigate: (page: string) => void;
}

type Step = 'form' | 'preview' | 'saving';

interface GeneratedRoom {
  name: string;
  genre: string;
  story_intro: string;
}

const MAX_PLAYERS_OPTIONS = [2, 3, 4, 5, 6, 8];

const GENRE_ICONS: Record<string, string> = {
  'Тёмное фэнтези': '🌑',
  'Эпика': '⚔️',
  'Магия': '✨',
  'Мистика': '🔮',
  'Приключение': '🗺️',
  'Хоррор': '💀',
  'Политика': '👑',
  'Морское приключение': '⚓',
};

export default function RoomCreatePage({ onNavigate }: RoomCreatePageProps) {
  const [step, setStep] = useState<Step>('form');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [creator, setCreator] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedRoom | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const resp = await fetch(GENERATE_ROOM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim(), max_players: maxPlayers }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка генерации');
      setGenerated(data.room);
      setEditedName(data.room.name);
      setStep('preview');
    } catch (e: unknown) {
      setGenerateError(e instanceof Error ? e.message : 'Что-то пошло не так');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const resp = await fetch(GENERATE_ROOM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim(), max_players: maxPlayers }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка генерации');
      setGenerated(data.room);
      setEditedName(data.room.name);
    } catch (e: unknown) {
      setGenerateError(e instanceof Error ? e.message : 'Что-то пошло не так');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    setStep('saving');
    setSaveError(null);

    try {
      const resp = await fetch(ROOMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName.trim() || generated.name,
          genre: generated.genre,
          description: description.trim(),
          story_intro: generated.story_intro,
          max_players: maxPlayers,
          creator: creator.trim() || 'Аноним',
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка сохранения');
      onNavigate('rooms');
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Не удалось сохранить комнату');
      setStep('preview');
    }
  };

  const genreIcon = generated ? (GENRE_ICONS[generated.genre] || '⚔️') : '';

  return (
    <div className="min-h-screen fantasy-bg flex flex-col">

      {/* Top bar */}
      <div className="border-b border-gold/15 bg-[#0D0B14]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => step === 'preview' ? setStep('form') : onNavigate('rooms')}
            className="btn-outline-gold p-1.5 rounded-lg shrink-0 flex items-center justify-center"
          >
            <Icon name="ArrowLeft" fallback="Star" size={16} />
          </button>
          <h1 className="font-cormorant text-xl font-semibold text-gold-gradient">
            {step === 'form' ? 'Новая комната' : 'Предпросмотр комнаты'}
          </h1>

          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 'form' ? 'bg-gold' : 'bg-gold/30'}`} />
            <div className={`w-6 h-px ${step !== 'form' ? 'bg-gold/40' : 'bg-gold/10'}`} />
            <div className={`w-2 h-2 rounded-full ${step !== 'form' ? 'bg-gold' : 'bg-gold/20'}`} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-5">

        {/* ── STEP 1: FORM ── */}
        {step === 'form' && (
          <div className="flex flex-col gap-5 animate-fade-in">

            <div className="fantasy-card rounded-xl p-6 border-gold-glow">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">🏰</span>
                <h2 className="font-cormorant text-2xl font-bold text-gold-gradient">Опиши свой мир</h2>
              </div>

              <div className="flex flex-col gap-4">

                <div>
                  <label className="block text-xs font-oswald tracking-wider text-gold/70 mb-2 uppercase">
                    Твоё имя / никнейм
                  </label>
                  <input
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Как тебя зовут, мастер?"
                    className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-3 font-golos text-sm focus:outline-none focus:border-gold/50 text-foreground/90 placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-oswald tracking-wider text-gold/70 mb-2 uppercase">
                    Описание сюжета и сеттинга
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder={`Опиши свой мир и сюжет своими словами. Например:\n\n«Постапокалиптическое фэнтези. Великая магическая война уничтожила цивилизацию 100 лет назад. Игроки — мародёры в руинах старой столицы, ищущие артефакты. По ночам руины оживают — духи павших магов охраняют свои секреты...»`}
                    className="w-full bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-3 font-golos text-sm resize-none focus:outline-none focus:border-gold/50 text-foreground/80 placeholder:text-foreground/30 leading-relaxed"
                  />
                  <p className="text-xs text-foreground/30 font-golos mt-1.5">
                    Чем подробнее описание — тем атмосфернее получится история
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-oswald tracking-wider text-gold/70 mb-3 uppercase">
                    Максимум игроков
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MAX_PLAYERS_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setMaxPlayers(n)}
                        className={`w-12 h-10 rounded-lg font-oswald text-sm border transition-all ${
                          maxPlayers === n
                            ? 'btn-gold border-transparent'
                            : 'btn-outline-gold'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {generateError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Icon name="AlertCircle" fallback="Star" size={15} className="text-red-400 shrink-0" />
                    <span className="text-sm text-red-400 font-golos">{generateError}</span>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !description.trim()}
                  className="btn-gold px-6 py-3 rounded-lg font-oswald tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ИИ создаёт комнату...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" fallback="Star" size={17} />
                      Сгенерировать комнату
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: PREVIEW ── */}
        {(step === 'preview' || step === 'saving') && generated && (
          <div className="flex flex-col gap-5 animate-fade-in">

            {/* Room card preview */}
            <div className="fantasy-card rounded-xl p-6 border-gold-glow">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-oswald tracking-wider text-gold/50 uppercase">Предпросмотр</span>
                <span className="text-xs border border-gold/20 rounded-full px-3 py-1 text-gold/60 font-golos">
                  {genreIcon} {generated.genre}
                </span>
              </div>

              {/* Editable name */}
              <div className="mb-4">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      className="flex-1 bg-[#1A1228] border border-gold/40 rounded-lg px-3 py-2 font-cormorant text-2xl font-bold text-gold focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="font-cormorant text-3xl font-bold text-gold-gradient leading-tight">
                      {editedName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-gold/40 hover:text-gold/80"
                      title="Редактировать название"
                    >
                      <Icon name="Pencil" fallback="Star" size={14} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-foreground/30 font-golos mt-1">
                  Наведи на название чтобы изменить
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-foreground/50 font-golos">
                  <Icon name="Users" fallback="Star" size={13} className="text-gold/50" />
                  до {maxPlayers} игроков
                </span>
                <span className="flex items-center gap-1.5 text-xs text-foreground/50 font-golos">
                  <Icon name="User" fallback="Star" size={13} className="text-gold/50" />
                  Мастер: {creator || 'Аноним'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-green-400/70 font-golos">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/70 inline-block" />
                  Открыта
                </span>
              </div>

              {/* Story intro */}
              <div className="bg-[#1A1228] rounded-xl p-5 border border-gold/10">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="BookOpen" fallback="Star" size={14} className="text-gold/50" />
                  <span className="text-xs font-oswald tracking-wider text-gold/50 uppercase">Вступление</span>
                </div>
                <p className="story-text text-sm leading-relaxed">{generated.story_intro}</p>
              </div>
            </div>

            {/* Description block */}
            <div className="fantasy-card rounded-xl p-5 border-gold-glow">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ScrollText" fallback="Star" size={14} className="text-gold/50" />
                <span className="text-xs font-oswald tracking-wider text-gold/50 uppercase">Описание сеттинга</span>
              </div>
              <p className="text-sm text-foreground/60 font-golos leading-relaxed">{description}</p>
            </div>

            {saveError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <Icon name="AlertCircle" fallback="Star" size={15} className="text-red-400 shrink-0" />
                <span className="text-sm text-red-400 font-golos">{saveError}</span>
              </div>
            )}

            {generateError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <Icon name="AlertCircle" fallback="Star" size={15} className="text-red-400 shrink-0" />
                <span className="text-sm text-red-400 font-golos">{generateError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pb-4">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating || step === 'saving'}
                className="btn-outline-gold px-5 py-2.5 rounded-lg font-golos text-sm flex items-center gap-2 disabled:opacity-40"
              >
                {isGenerating ? (
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon name="RefreshCw" fallback="Star" size={15} />
                )}
                Перегенерировать
              </button>
              <button
                onClick={handleSave}
                disabled={step === 'saving' || isGenerating}
                className="btn-gold px-6 py-2.5 rounded-lg font-oswald tracking-wider flex items-center gap-2 flex-1 justify-center disabled:opacity-40"
              >
                {step === 'saving' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Сохраняем...
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircle" fallback="Star" size={16} />
                    Создать комнату
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
