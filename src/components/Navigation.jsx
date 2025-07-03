import { 
  ArrowLeftIcon,
  ArrowPathIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

export function Navigation({ currentStep, onBack, onReset, darkMode, setDarkMode }) {
  const steps = [
    { id: 'upload', label: 'Yükle' },
    { id: 'pieces', label: 'Parçalar' },
    { id: 'results', label: 'Sonuç' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <header className="border-b border-b-[var(--color-border)]">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Back */}
          <div className="flex items-center gap-md">
            {currentStep !== 'upload' && (
              <button
                onClick={onBack}
                className="btn btn-ghost btn-sm rounded-full"
                aria-label="Geri"
              >
                <ArrowLeftIcon className="icon-sm" />
              </button>
            )}
            
            <div className="flex items-center gap-sm">
              <h1 className="text-xl font-light">OptiCut</h1>
              <span className="text-xs text-tertiary">Pro</span>
            </div>
          </div>

          {/* Steps */}
          <nav className="hidden md:flex items-center gap-sm">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  className={`px-3 py-1 text-sm font-medium transition-all ${
                    index <= currentStepIndex
                      ? 'text-primary'
                      : 'text-tertiary'
                  }`}
                  disabled
                >
                  {step.label}
                </button>
                {index < steps.length - 1 && (
                  <span className="mx-2 text-tertiary">·</span>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-ghost btn-sm rounded-full"
              aria-label="Tema değiştir"
            >
              {darkMode ? (
                <SunIcon className="icon-sm" />
              ) : (
                <MoonIcon className="icon-sm" />
              )}
            </button>
            
            {currentStep !== 'upload' && (
              <button
                onClick={onReset}
                className="btn btn-ghost btn-sm"
              >
                <ArrowPathIcon className="icon-sm" />
                <span className="hidden sm:inline">Sıfırla</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Steps */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-center gap-xs">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 w-8 rounded-full transition-all ${
                  index <= currentStepIndex
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}