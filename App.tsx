import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useVoiceInteraction } from './hooks/useVoiceInteraction.ts';
import { useSettings } from './hooks/useSettings.ts';
import { useHistory } from './hooks/useHistory.ts';
import { AsclepioFace } from './components/AsclepioFace.tsx';
import { SystemMessage } from './components/SystemMessage.tsx';
import { InformationBoard } from './components/InformationBoard.tsx';
import { Controls } from './components/Controls.tsx';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { GearIcon } from './components/icons/GearIcon.tsx';
import { HistoryIcon } from './components/icons/HistoryIcon.tsx';
import { Subtitles } from './components/Subtitles.tsx';
import { InteractionStatus, InteractionTurn, ConversationSession, FaceCustomization } from './types.ts';
import { TutorialGuide, TutorialStep } from './components/TutorialGuide.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { HistoryPanel } from './components/HistoryPanel.tsx';
import { HistoryViewer } from './components/HistoryViewer.tsx';
import { Logo } from './components/Logo.tsx';
import { AppBackground } from './components/AppBackground.tsx';

const TransitionOverlay: React.FC<{ status: InteractionStatus, onAnimationEnd: () => void, faceCustomization: FaceCustomization }> = ({ status, onAnimationEnd, faceCustomization }) => {
    const animationClass = status === InteractionStatus.AWAKENING ? 'animate-wake-up' : 'animate-sleep';
    const showOverlay = status === InteractionStatus.AWAKENING || status === InteractionStatus.SLEEPING;

    if (!showOverlay) return null;

    return (
        <div
            onAnimationEnd={onAnimationEnd}
            className={`fixed inset-0 bg-[var(--background)] z-50 flex flex-col items-center justify-center ${animationClass}`}
        >
            <div className="animated-face">
                <AsclepioFace status={status} isBoardVisible={false} customization={faceCustomization} />
            </div>
            <div className="mt-4">
               <SystemMessage status={status} error={null} onStart={() => {}} />
            </div>
        </div>
    );
};

const tutorialSteps: TutorialStep[] = [
    { id: 'new-chat-button', text: 'Usa este botón para reiniciar la conversación y comenzar un nuevo diálogo desde cero.', position: 'top' },
    { id: 'interrupt-button', text: 'Si Asclepio está hablando, presiona aquí para interrumpirlo y poder dar una nueva instrucción.', position: 'top' },
    { id: 'presentation-mode-button', text: 'Activa este modo antes de hacer una pregunta para recibir la respuesta en formato de presentación con diapositivas.', position: 'top' },
    { id: 'search-mode-button', text: 'Activa este modo para que Asclepio busque en Google y te muestre la página web directamente en el tablero.', position: 'top' },
    { id: 'text-mode-button', text: '¿Prefieres escribir en lugar de hablar? Usa este botón para abrir un campo de texto y enviar tu mensaje.', position: 'top' },
    { id: 'subtitles-button', text: 'Activa o desactiva los subtítulos que aparecen mientras Asclepio habla.', position: 'top' },
    { id: 'history-button', text: 'Consulta aquí el historial de tus conversaciones pasadas para no perder ninguna idea.', position: 'left'},
    { id: 'settings-button', text: 'Aquí es donde estás ahora. Accede a este panel para personalizar tu experiencia, cambiar la voz, el tema y más.', position: 'left' },
];

function App() {
  const { settings, setSettings, voices } = useSettings();
  const { history, addSession, clearHistory } = useHistory();

  const handleSessionEnd = useCallback((turns: InteractionTurn[]) => {
      if (turns.length === 0) return;

      const newSession: ConversationSession = {
          id: `session_${Date.now()}`,
          title: turns[0].userInput.substring(0, 50) + (turns[0].userInput.length > 50 ? '...' : ''),
          startTime: Date.now(),
          turns: turns,
      };
      addSession(newSession);
  }, [addSession]);

  const { 
    status, 
    error, 
    startSession,
    resetSession,
    boardContent, 
    interrupt, 
    submitTextMessage,
    handleContinue,
    currentSpokenText,
    currentHighlightId,
    handleAnimationEnd,
    isPresentationMode,
    togglePresentationMode,
    isSearchMode,
    toggleSearchMode,
  } = useVoiceInteraction({ settings, onSessionEnd: handleSessionEnd });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [viewingSession, setViewingSession] = useState<ConversationSession | null>(null);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const isBoardVisible = useMemo(() => boardContent !== null, [boardContent]);
  const isInteractionActive = useMemo(() => status !== InteractionStatus.IDLE && status !== InteractionStatus.INITIALIZING && status !== InteractionStatus.AWAKENING && status !== InteractionStatus.SLEEPING, [status]);
  const isUIHidden = useMemo(() => status === InteractionStatus.AWAKENING || status === InteractionStatus.SLEEPING, [status]);

  const startTutorial = () => {
    setIsSettingsOpen(false);
    setTimeout(() => {
        setTutorialStep(0);
        setIsTutorialActive(true);
    }, 100);
  };

  const advanceTutorial = () => setTutorialStep(prev => prev + 1);

  const endTutorial = () => {
    setIsTutorialActive(false);
    setShowCompletionMessage(true);
    setTimeout(() => setShowCompletionMessage(false), 4000);
  };
  
  const handleSelectSession = (session: ConversationSession) => {
    setViewingSession(session);
    setIsHistoryPanelOpen(false);
  };

  return (
    <div className={`${settings.theme}`}>
       {/* AppBackground is now the single source of truth for the app's background */}
       <AppBackground setting={settings.background} theme={settings.theme} />
       <TransitionOverlay status={status} onAnimationEnd={handleAnimationEnd} faceCustomization={settings.face} />
       
       {isTutorialActive && (
            <TutorialGuide
                steps={tutorialSteps}
                currentStep={tutorialStep}
                onNext={advanceTutorial}
                onEnd={endTutorial}
            />
        )}
        
        {showCompletionMessage && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--control-bg)] backdrop-blur-xl text-[var(--text-primary)] px-8 py-4 rounded-xl shadow-2xl z-[10001] animate-fade-in">
                <p className="text-lg font-semibold">¡Felicidades! Has completado el recorrido.</p>
            </div>
        )}

      <div className={`flex flex-col h-screen w-screen bg-transparent text-[var(--text-primary)] relative overflow-hidden p-4 sm:p-6 transition-opacity duration-500 ${isUIHidden ? 'opacity-0' : 'opacity-100'}`}>
        
        <Logo isIdle={status === InteractionStatus.IDLE} />
        
        <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
           <button 
            onClick={() => setIsHistoryPanelOpen(true)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
            data-tutorial-id="history-button"
            aria-label="Ver historial"
          >
            <HistoryIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
            data-tutorial-id="settings-button"
            aria-label="Ajustes"
          >
            <GearIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </header>

        <main className="flex-1 relative w-full h-full">
            {status === InteractionStatus.IDLE && <WelcomeScreen />}

            <div className={`
                absolute left-1/2 w-full max-w-lg px-4
                transition-all duration-700 ease-in-out
                ${isBoardVisible
                    ? 'top-[15%] -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:-translate-x-[calc(50%+24vw)]'
                    : 'top-1/2 -translate-x-1/2 -translate-y-1/2'
                }`}
            >
                <div className="flex flex-col items-center justify-center">
                    <AsclepioFace status={status} isBoardVisible={isBoardVisible} customization={settings.face} />
                    <SystemMessage status={status} error={error} onStart={startSession} />
                    {settings.showSubtitles && <Subtitles text={currentSpokenText} />}
                </div>
            </div>

            <div className={`
                absolute left-1/2 w-[95%] max-w-2xl lg:w-[48vw] max-h-[50vh] lg:max-h-[70vh]
                overflow-y-auto custom-scrollbar
                transition-all duration-700 ease-in-out
                ${isBoardVisible
                    ? 'opacity-100 bottom-4 -translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-auto lg:right-0 lg:-translate-y-1/2 lg:translate-x-[-2vw]'
                    : 'opacity-0 -bottom-full -translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-auto lg:right-0 lg:translate-x-full lg:-translate-y-1/2'
                }
                ${!isBoardVisible && 'pointer-events-none'}
                `}
            >
                <InformationBoard
                    content={boardContent}
                    currentHighlightId={currentHighlightId}
                    theme={settings.theme}
                />
            </div>
        </main>

        <footer className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-auto">
           {status === InteractionStatus.AWAITING_CONTINUATION && (
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 animate-fade-in">
                 <button 
                     onClick={handleContinue}
                     className="px-6 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-xl hover:opacity-90 transition-opacity duration-300 text-base font-medium border border-[var(--accent)]/30"
                 >
                     Continuar
                 </button>
             </div>
           )}
           {isInteractionActive && (
              <Controls 
                  status={status} 
                  onInterrupt={interrupt} 
                  onSubmitText={submitTextMessage}
                  onReset={resetSession}
                  subtitlesEnabled={settings.showSubtitles}
                  onToggleSubtitles={() => setSettings({ showSubtitles: !settings.showSubtitles })}
                  isPresentationMode={isPresentationMode}
                  onTogglePresentationMode={togglePresentationMode}
                  isSearchMode={isSearchMode}
                  onToggleSearchMode={toggleSearchMode}
              />
           )}
        </footer>
        
        <SettingsPanel 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          voices={voices}
          onStartTutorial={startTutorial}
        />

        <HistoryPanel
          isOpen={isHistoryPanelOpen}
          onClose={() => setIsHistoryPanelOpen(false)}
          history={history}
          onSelectSession={handleSelectSession}
          onClearHistory={clearHistory}
        />

        <HistoryViewer
            session={viewingSession}
            onClose={() => setViewingSession(null)}
            theme={settings.theme}
        />
      </div>
    </div>
  );
}

export default App;
