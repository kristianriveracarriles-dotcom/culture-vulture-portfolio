import {
  Alignment,
  EventType,
  Fit,
  Layout,
  RiveEventPayload,
  useRive,
  useViewModelInstanceNumber,
  useViewModelInstanceEnum,
  useViewModelInstanceString,
} from "@rive-app/react-webgl2";
import { useEffect, useState, useRef } from "react";
import { riveAssetLoaderHandler } from "./utils";

const STATE_MACHINE_NAME = "State Machine 1";
const ASSET_PATH = "/assets/rive/";

interface Skin {
  id: string;
  name: string;
  file: string;
}

interface WheelConfig {
  title: string;
  description: string;
  outcomeIndex: number;
  slices: string[];
}

const SKINS: Skin[] = [
  { id: "latam", name: "LATAM", file: "wheelspin_latam.riv" },
  { id: "usa", name: "USA", file: "wheelspin_usa.riv" },
  { id: "canada", name: "Canada", file: "wheelspin_canada.riv" },
  { id: "ll", name: "LL (Scripted)", file: "wheelspin_ll.riv" },
  { id: "vip", name: "VIP (Scripted)", file: "wheelspin_vip.riv" },
];

const DEFAULT_SLICES = [
  "$10", "$2", "$5", "$2", "$10", "$2", 
  "$5", "$2", "$25", "$2", "$10", "$2"
];

const MainVM = {
  resultSliceNumber: "resultSliceNumber",
  title: "title",
  prize: "prize",
  description: "description",
};

const spinEventName = "Spin";

function RiveWheelContent({ skin, config }: { skin: Skin; config: WheelConfig }) {
  const configRef = useRef(config);
  configRef.current = config;

  const { rive, RiveComponent } = useRive({
    src: `${ASSET_PATH}${skin.file}`,
    artboard: "Wheelspin Main",
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    autoplay: true,
    autoBind: true,
    assetLoader: riveAssetLoaderHandler,
    onLoadError: (e) => console.error(`[Rive Error] Failed to load ${skin.name}:`, e),
  });

  const mainInstance = rive?.viewModelInstance;

  const { setValue: setResultSliceNumber } = useViewModelInstanceNumber(MainVM.resultSliceNumber, mainInstance);
  const { setValue: setBrand } = useViewModelInstanceEnum("property of logoDynamic/brands", mainInstance);
  const { setValue: setResultTitle } = useViewModelInstanceString(MainVM.title, mainInstance);
  const { setValue: setResultPrize } = useViewModelInstanceString(MainVM.prize, mainInstance);
  const { setValue: setResultPrize2 } = useViewModelInstanceString("resultPrize", mainInstance); // Fallback for some skins
  const { setValue: setResultDescription } = useViewModelInstanceString(MainVM.description, mainInstance);
  const { setValue: setButtonText } = useViewModelInstanceString("spinButton/buttonText", mainInstance);
  
  const sSetters = [
    useViewModelInstanceString("wheelspin/slice1/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice2/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice3/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice4/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice5/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice6/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice7/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice8/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice9/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice10/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice11/sliceText", mainInstance).setValue,
    useViewModelInstanceString("wheelspin/slice12/sliceText", mainInstance).setValue,
  ];

  // Sync with Props
  useEffect(() => {
    if (rive && mainInstance) {
      sSetters.forEach((setter, idx) => {
        if (typeof setter === 'function' && config.slices[idx]) 
          setter(config.slices[idx]);
      });
      
      if (typeof setBrand === 'function') setBrand("betRivers");
      if (typeof setButtonText === 'function') setButtonText("Spin_now");
      if (typeof setResultTitle === 'function') setResultTitle(config.title);
      if (typeof setResultDescription === 'function') setResultDescription(config.description);
    }
  }, [rive, mainInstance, skin, config]);

  // Handle Spin Event
  useEffect(() => {
    if (!rive) return;

    const handleRiveEvent = (e: any) => {
      if (e.data) {
        const { name } = e.data as RiveEventPayload;
        if (name === spinEventName && setResultSliceNumber) {
          setResultSliceNumber(0);
          setTimeout(() => {
            setResultSliceNumber(configRef.current.outcomeIndex + 1);
            if (setResultPrize) setResultPrize(configRef.current.slices[configRef.current.outcomeIndex]);
            if (setResultPrize2) setResultPrize2(configRef.current.slices[configRef.current.outcomeIndex]);
          }, 300);
        }
      }
    };

    rive.on(EventType.RiveEvent, handleRiveEvent);
    return () => rive.off(EventType.RiveEvent, handleRiveEvent);
  }, [rive, setResultSliceNumber, setResultPrize, setResultPrize2]);

  return <RiveComponent />;
}

export function LogicPanel({ 
  config, 
  setConfig, 
  isOpen, 
  setIsOpen 
}: { 
  config: WheelConfig; 
  setConfig: (c: WheelConfig) => void; 
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) {
  const handleSliceChange = (idx: number, val: string) => {
    const newSlices = [...config.slices];
    newSlices[idx] = val;
    setConfig({ ...config, slices: newSlices });
  };

  return (
    <div className={`logic-display ${isOpen ? "open" : "closed"}`}>
      <h2 className="category-label">&gt; LOGIC_CUSTOMIZER</h2>
      
      <div className="logic-section" style={{ marginTop: '1rem' }}>
        <div className="logic-item">
          <span className="logic-label">TITLE:</span>
          <input 
            className="logic-value" 
            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', textAlign: 'right', outline: 'none' }}
            value={config.title} 
            onChange={(e) => setConfig({ ...config, title: e.target.value })} 
          />
        </div>

        <div className="logic-item">
          <span className="logic-label">OUTCOME (1-12):</span>
          <input 
            className="logic-value"
            type="number"
            min="1"
            max="12"
            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', textAlign: 'right', width: '50px', outline: 'none' }}
            value={config.outcomeIndex + 1} 
            onChange={(e) => setConfig({ ...config, outcomeIndex: parseInt(e.target.value) - 1 })} 
          />
        </div>
        
        <div className="logic-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <span className="logic-label" style={{ marginBottom: '0.5rem' }}>SLICE_VALUES:</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', width: '100%' }}>
            {config.slices.map((s, i) => (
              <input 
                key={i} 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontSize: '0.7rem', padding: '2px 5px' }}
                value={s} 
                onChange={(e) => handleSliceChange(i, e.target.value)} 
                placeholder={`S${i+1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="status-box" style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid var(--color-accent)', fontSize: '0.7rem' }}>
        SKIN_CONTROL_ACTIVE: TRUE
      </div>
    </div>
  );
}

export default function WheelspinEngine() {
  const [currentSkin, setCurrentSkin] = useState(SKINS[0]);
  const [config, setConfig] = useState<WheelConfig>({
    title: "WHEELSPIN_ENGINE",
    description: "Real-time logic override active.",
    outcomeIndex: 2,
    slices: [...DEFAULT_SLICES]
  });

  return (
    <div className="case-study-grid">
        <div className="rive-portal">
             <div className="skin-selector" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '5px' }}>
                {SKINS.map((skin) => (
                    <button
                        key={skin.id}
                        style={{ 
                            background: currentSkin.id === skin.id ? 'var(--color-accent)' : 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            border: '1px solid var(--color-accent)',
                            fontSize: '0.6rem',
                            padding: '2px 8px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setCurrentSkin(skin)}
                    >
                        {skin.name}
                    </button>
                ))}
            </div>
            <RiveWheelContent key={currentSkin.id} skin={currentSkin} config={config} />
        </div>
        
        <LogicPanel 
            config={config} 
            setConfig={setConfig} 
            isOpen={true} 
            setIsOpen={() => {}} 
        />
    </div>
  );
}
