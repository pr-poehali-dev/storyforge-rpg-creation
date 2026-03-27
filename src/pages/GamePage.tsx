import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const NARRATOR_URL = 'https://functions.poehali.dev/d2cd2549-782f-4049-9c97-a56f8510a730';

interface GamePageProps {
  onNavigate: (page: string) => void;
}

interface Player {
  name: string;
  playerClass: string;
  avatar: string;
  turn: boolean;
  hp: number;
  maxHp: number;
}

interface ChatMessage {
  author: string;
  text: string;
  time: string;
}

interface Choice {
  letter: string;
  text: string;
  votes: number;
  highlighted: boolean;
}

const players: Player[] = [
  { name: 'Мерлин',  playerClass: 'Архимаг',    avatar: '🧙', turn: true,  hp: 85,  maxHp: 100 },
  { name: 'Леандра', playerClass: 'Паладин',    avatar: '⚔️', turn: false, hp: 100, maxHp: 100 },
  { name: 'Ворон',   playerClass: 'Плут',        avatar: '🗡️', turn: false, hp: 62,  maxHp: 80  },
  { name: 'Элара',   playerClass: 'Волшебница',  avatar: '✨', turn: false, hp: 90,  maxHp: 90  },
];

const initialChoices: Choice[] = [
  { letter: 'A', text: 'Осторожно подняться по разрушенной лестнице, прислушиваясь к каждому звуку', votes: 0, highlighted: false },
  { letter: 'B', text: 'Исследовать тёмный коридор, держа оружие наготове', votes: 0, highlighted: false },
  { letter: 'C', text: 'Изучить руны на стальной двери — возможно, это ключ к тайне', votes: 2, highlighted: true },
  { letter: 'D', text: 'Позвать союзников и обсудить план действий перед движением', votes: 0, highlighted: false },
];

const initialMessages: ChatMessage[] = [
  { author: 'Леандра', text: 'Думаю, надо идти через дверь с рунами', time: '14:32' },
  { author: 'Ворон',   text: 'Я согласен, но нужен маг чтобы их прочесть',   time: '14:33' },
  { author: 'Мерлин',  text: 'Я знаю эти руны — это защитная магия!',         time: '14:33' },
  { author: 'Элара',   text: 'Голосую за вариант C',                           time: '14:34' },
];

const INITIAL_STORY =
  'Вы стоите у входа в проклятые руины Эльдориана. Серый туман стелется по каменным плитам, а где-то в глубинах башни слышится зловещий перезвон. Ваш факел едва отгоняет тьму. Перед вами три пути: разрушенная лестница ведёт вверх, тёмный коридор уходит влево, а стальная дверь с рунами стоит прямо перед вами...';

export default function GamePage({ onNavigate }: GamePageProps) {
  const [choices, setChoices] = useState<Choice[]>(initialChoices);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [storyText, setStoryText] = useState(INITIAL_STORY);
  const [storyHistory, setStoryHistory] = useState(INITIAL_STORY);
  const [isNarratorLoading, setIsNarratorLoading] = useState(false);
  const [narratorError, setNarratorError] = useState<string | null>(null);
  const [turn, setTurn] = useState(14);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChoiceClick = (letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? null : letter));
  };

  const handleAction = async () => {
    const chosenAction = selectedLetter
      ? choices.find(c => c.letter === selectedLetter)?.text || ''
      : '';
    const action = customAction.trim() || chosenAction;
    if (!action) return;

    setIsNarratorLoading(true);
    setNarratorError(null);

    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { author: 'Мерлин', text: `Действие: ${action}`, time }]);

    try {
      const resp = await fetch(NARRATOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_title: 'Пепел Эльдориана',
          story_history: storyHistory,
          chosen_action: chosenAction,
          custom_action: customAction.trim(),
          players: players.map(p => ({ name: p.name, playerClass: p.playerClass })),
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || 'Ошибка рассказчика');
      }

      setStoryText(data.story);
      setStoryHistory(prev => prev + '\n' + action + '\n' + data.story);
      if (data.choices && data.choices.length > 0) {
        setChoices(data.choices);
      }
      setTurn(prev => prev + 1);
      setSelectedLetter(null);
      setCustomAction('');

      const narratorTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { author: '🔮 Рассказчик', text: data.story.slice(0, 80) + '...', time: narratorTime }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Неизвестная ошибка';
      setNarratorError(msg);
    } finally {
      setIsNarratorLoading(false);
    }
  };

  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { author: 'Мерлин', text: trimmed, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatInput('');
  };

  const handleChatKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendChat();
  };

  return (
    <div className="min-h-screen fantasy-bg flex flex-col">

      {/* ── Top bar ── */}
      <div className="border-b border-gold/15 bg-[#0D0B14]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Left: back + room name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('rooms')}
              className="btn-outline-gold p-1.5 rounded-lg shrink-0 flex items-center justify-center"
              aria-label="Назад"
            >
              <Icon name="ArrowLeft" fallback="Star" size={16} />
            </button>
            <h1 className="font-cormorant text-xl font-semibold text-gold-gradient truncate">
              Пепел Эльдориана
            </h1>
          </div>

          {/* Center: turn indicator */}
          <span className="text-sm text-foreground/50 font-golos shrink-0 hidden sm:block">
            Ход {turn}
          </span>

          {/* Right: players + settings */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-foreground/60 text-sm font-golos">
              <Icon name="Users" fallback="Star" size={15} className="text-gold/60" />
              <span>4 игрока</span>
            </div>
            <button
              className="btn-outline-gold p-1.5 rounded-lg flex items-center justify-center"
              aria-label="Настройки"
            >
              <Icon name="Settings" fallback="Star" size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 flex flex-col lg:flex-row gap-5">

        {/* ════════════════════════════════
            LEFT PANEL  (2/3)
        ════════════════════════════════ */}
        <div className="flex-1 lg:w-0 flex flex-col gap-4 animate-fade-in stagger-1">

          {/* 1. Story display */}
          <div className="fantasy-card rounded-xl p-6 min-h-[280px] border-gold-glow flex flex-col">
            {/* AI narrator badge */}
            <span className="text-xs font-oswald tracking-wider text-gold/70 border border-gold/20 rounded-full px-3 py-1 inline-block mb-4 self-start">
              🔮 ИИ-Рассказчик
            </span>

            {/* Story text */}
            <p className="story-text flex-1">
              {storyText}
            </p>

            {/* Narrator status */}
            {narratorError && (
              <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center gap-2">
                <Icon name="AlertCircle" fallback="Star" size={14} className="text-red-400 shrink-0" />
                <span className="text-xs text-red-400 font-golos">{narratorError}</span>
              </div>
            )}
            {isNarratorLoading && (
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gold/10">
                <span className="text-xs text-foreground/40 font-golos">Рассказчик думает</span>
                <span className="flex items-end gap-[3px] h-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-typing-dot inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-typing-dot-2 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-typing-dot-3 inline-block" />
                </span>
              </div>
            )}
          </div>

          {/* 2. Choices */}
          <div className="animate-fade-in stagger-2">
            <h2 className="font-cormorant text-xl font-semibold text-gold-gradient mb-3">
              Ваш выбор, герой
            </h2>

            <div className="space-y-2">
              {choices.map((choice) => {
                const isSelected = selectedLetter === choice.letter;
                return (
                  <button
                    key={choice.letter}
                    onClick={() => handleChoiceClick(choice.letter)}
                    className={`fantasy-card rounded-lg p-4 cursor-pointer border transition-all text-left w-full flex items-center gap-0 group ${
                      isSelected
                        ? 'border-gold/60 bg-gold/5'
                        : choice.highlighted
                          ? 'border-gold/60 bg-gold/5'
                          : 'border-gold/10 hover:border-gold/40'
                    }`}
                  >
                    {/* Letter badge */}
                    <span className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-oswald flex items-center justify-center mr-3 shrink-0">
                      {choice.letter}
                    </span>

                    {/* Text */}
                    <span className="text-sm text-foreground/80 font-golos flex-1 text-left">
                      {choice.text}
                    </span>

                    {/* Votes badge */}
                    {choice.votes > 0 && (
                      <span className="ml-3 text-xs text-gold font-oswald shrink-0 border border-gold/30 rounded-full px-2 py-0.5 bg-gold/5">
                        {choice.votes} голоса
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Custom action */}
          <div className="animate-fade-in stagger-3">
            <textarea
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              rows={2}
              placeholder="Или опишите своё действие..."
              className="bg-[#1A1228] border border-gold/20 rounded-lg px-4 py-3 font-golos text-sm resize-none focus:outline-none focus:border-gold/40 w-full text-foreground/80 placeholder:text-foreground/30"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-foreground/40 font-golos">
                Очередь: Мерлин
              </span>
              <button
                onClick={handleAction}
                disabled={isNarratorLoading || (!selectedLetter && !customAction.trim())}
                className="btn-gold px-6 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isNarratorLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Рассказчик...
                  </>
                ) : (
                  <>
                    <Icon name="Send" fallback="Star" size={15} />
                    Действовать
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════
            RIGHT PANEL  (1/3)
        ════════════════════════════════ */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 animate-fade-in stagger-2">

          {/* 1. Players */}
          <div className="fantasy-card rounded-xl p-4 border-gold-glow">
            <h2 className="font-cormorant text-lg font-semibold text-gold mb-3">
              Участники
            </h2>

            <div className="space-y-3">
              {players.map((player) => {
                const hpPct = Math.round((player.hp / player.maxHp) * 100);
                return (
                  <div key={player.name}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-fantasy-mid border border-gold/20 text-lg flex items-center justify-center shrink-0">
                        {player.avatar}
                      </div>

                      {/* Name + class */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-golos text-fantasy-parchment font-medium leading-none">
                            {player.name}
                          </span>
                          {player.turn && (
                            <span className="text-[10px] font-oswald tracking-widest text-gold bg-gold/10 border border-gold/30 rounded-full px-1.5 py-0.5 leading-none">
                              ВАШ ХОД
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/40 font-golos">
                          {player.playerClass}
                        </span>
                      </div>

                      {/* HP label */}
                      <span className="text-xs text-foreground/40 font-golos shrink-0">
                        {player.hp}/{player.maxHp}
                      </span>
                    </div>

                    {/* HP bar — red gradient */}
                    <div className="stat-bar-bg h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-700"
                        style={{ width: `${hpPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Chat */}
          <div className="fantasy-card rounded-xl p-4 border-gold-glow flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="MessageCircle" fallback="Star" size={16} className="text-gold/70" />
              <h2 className="font-cormorant text-lg font-semibold text-gold">
                Совет Героев
              </h2>
            </div>

            {/* Messages */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 mb-3">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-xs font-oswald ${msg.author === '🔮 Рассказчик' ? 'text-purple-400' : 'text-gold'}`}>{msg.author}</span>
                    <span className="text-xs text-foreground/30 font-golos">{msg.time}</span>
                  </div>
                  <p className="text-sm text-foreground/70 font-golos leading-snug">
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 pt-3 border-t border-gold/10">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKey}
                placeholder="Сообщение..."
                className="flex-1 bg-[#1A1228] border border-gold/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/40 font-golos text-foreground/80 placeholder:text-foreground/30"
              />
              <button
                onClick={handleSendChat}
                className="btn-gold p-2 rounded-lg shrink-0 flex items-center justify-center"
                aria-label="Отправить"
              >
                <Icon name="Send" fallback="Star" size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}