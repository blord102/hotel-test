import { useState, useRef, useCallback } from "react";

// --- AIRTABLE CONFIGURATION ---
const AIRTABLE_PAT = "YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN"; 
const AIRTABLE_BASE_ID = "YOUR_BASE_ID";
const AIRTABLE_TABLE_NAME = "Comparisons"; // Must match your exact table name

const PROPERTIES_TEMPLATE = [
  {
    id: "oak_ember", lat: 39.9458, lng: -105.8183, name: "Oak & Ember", tagline: "Elemental Wellness Retreat",
    price: 315, priceSuffix: "/night · suites from $369", suitePrice: 429, suiteLabel: "Signature Suite", rating: 4.8, reviews: 178,
    location: "Fraser, CO · 15 min to Winter Park",
    amenities: ["Hot Tub","Sauna","Steam Room","Cold Plunge","Game Room","Great Room","Fireplace","Kitchen","Lounge","Shuffleboard"],
    images: ["https://i.postimg.cc/pdRJk9SW/Pub_Hero.jpg", "https://i.postimg.cc/nXSmhLZ3/Pub_Loft.jpg", "https://i.postimg.cc/NKCXj0Yp/Pub_Lounge.jpg", "https://i.postimg.cc/0zXSyNxn/Pub_Std_Rm.jpg"],
    accent: "#C27D4A", isYours: true,
  },
  {
    id: "aframe_club", lat: 39.893, lng: -105.764, name: "A-Frame Club", tagline: "Mid-century cabins at the base",
    price: 425, priceSuffix: "/night · loft cabins from $650", suitePrice: 369, suiteLabel: "Loft Cabin", rating: 4.3, reviews: 312,
    location: "Winter Park, CO",
    amenities: ["2 Hot Tubs","Sauna","Restaurant","Bar","Fireplaces","Kitchenettes","Pet Friendly","Ski Storage"],
    images: ["https://i.postimg.cc/XvXwYXsw/AFrame_Club.jpg","https://i.postimg.cc/9QLd2yYF/Aframeclub_room.jpg","https://i.postimg.cc/Z5w8m6xn/AFrame_Club_Lobby.jpg","https://i.postimg.cc/zGxCNTF3/AFrame_Club_Hot_Tub.jpg"],
    accent: "#7B6FA0", isYours: false,
  },
  {
    id: "gravity_haus", lat: 39.907, lng: -105.787, name: "Gravity Haus", tagline: "Boutique motel for enthusiasts",
    price: 365, priceSuffix: "/night · loft suites from $550", suitePrice: 349, suiteLabel: "Bunk Suite", rating: 4.0, reviews: 145,
    location: "Downtown Winter Park, CO",
    amenities: ["Outdoor Hot Tubs","Fitness Center","Restaurant","Coffee Shop","Bar","Firepit","Free WiFi","Pet Friendly"],
    images: ["https://i.postimg.cc/MGXypX9R/Gravity_Haus_WP.jpg","https://i.postimg.cc/3xtXh2Fk/Gravity_Haus_Lobby.jpg","https://i.postimg.cc/dV52FGj0/Gravity_Haus_Room.jpg","https://i.postimg.cc/JzpN8j5q/Gravity_Haus_Hot_Tub.jpg"],
    accent: "#5A8A6E", isYours: false,
  },
  {
    id: "zephyr_lodge", lat: 39.887, lng: -105.759, name: "Zephyr Mountain Lodge", tagline: "Ski-in / ski-out base village",
    price: 389, priceSuffix: "/night · 2BR condos from $575", suitePrice: 469, suiteLabel: "2BR Condo", rating: 4.2, reviews: 534,
    location: "Winter Park Resort Base Village",
    amenities: ["Ski-In / Ski-Out","4 Hot Tubs","Fitness Center","Full Kitchen","In-Room Fireplace","Ski Storage","Free Shuttle"],
    images: ["https://i.postimg.cc/FHTyv0VJ/Zephyr_Mountain_Lodge_Exterior_Sunset.jpg","https://i.postimg.cc/nLMvhM3D/Zephyr_Mountain_Lodge.jpg","https://i.postimg.cc/ht2LnV1g/Zephyr_Mountain_Lodge_Lobby.jpg","https://i.postimg.cc/Mp97w1mB/Zephyr_Mountain_Lodge_Hot_Tub.jpg"],
    accent: "#5B8CB8", isYours: false,
  },
  {
    id: "wp_chateau", lat: 39.903, lng: -105.784, name: "Winter Park Chateau", tagline: "Highest-rated boutique hotel",
    price: 385, priceSuffix: "/night · suites from $575", suitePrice: 339, suiteLabel: "Junior Suite", rating: 5.0, reviews: 423,
    location: "Downtown Winter Park, CO",
    amenities: ["Hot Tub","Private Bar","Soaking Tubs","Mountain Views","Free Breakfast","Free Parking","Pet Friendly"],
    images: ["https://i.postimg.cc/VN5jk5Kn/Winter_Park_Chateau.jpg","https://i.postimg.cc/6pMrKCf7/Winter_Park_Chateau_Exterior.jpg","https://i.postimg.cc/Z5b8Xwp5/Winter_Park_Chateau_Room.jpg","https://i.postimg.cc/VkKqwXW0/Winter_Park_Chateau_Hot_Tub.jpg"],
    accent: "#A0704A", isYours: false,
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- SHIMMER IMAGE COMPONENT ---
function OptimizedImage({ src, alt, style = {} }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#111", overflow: "hidden" }}>
      {!isLoaded && <div className="shimmer-effect" style={{ position: "absolute", inset: 0, zIndex: 1 }} />}
      <img
        src={src} alt={alt} loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{ ...style, display: "block", width: "100%", height: "100%", objectFit: "cover", opacity: isLoaded ? 1 : 0, transition: "opacity 0.4s" }}
      />
    </div>
  );
}

// --- COMPARISON OVERLAY ---
function ComparisonModal({ items, onClose, onSelect }) {
  if (items.length < 2) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 2000, display: "flex", flexDirection: "column", padding: "40px" }}>
      <button onClick={onClose} style={{ alignSelf: "flex-end", background: "none", border: "1px solid #444", color: "#fff", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", marginBottom: "20px" }}>Close Comparison</button>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: "25px", flex: 1, overflowY: "auto" }}>
        {items.map(p => (
          <div key={p.id} style={{ background: "#0F0F0F", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", border: `1px solid ${p.accent}44` }}>
            <div style={{ height: "200px" }}><OptimizedImage src={p.images[0]} alt={p.name} /></div>
            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>{p.name}</h2>
              <div style={{ fontSize: "20px", color: p.accent, fontWeight: "bold", marginBottom: "16px" }}>${p.price} <span style={{ fontSize: "12px", color: "#666" }}>/night</span></div>
              <div style={{ marginBottom: "16px", fontSize: "14px" }}><strong>Rating:</strong> ⭐ {p.rating}</div>
              <div style={{ marginBottom: "20px", flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {p.amenities.map(a => <span key={a} style={{ background: "#222", fontSize: "11px", padding: "4px 8px", borderRadius: "4px" }}>{a}</span>)}
                </div>
              </div>
              <button onClick={() => onSelect(p.id)} style={{ width: "100%", padding: "14px", background: p.accent, border: "none", borderRadius: "10px", color: "#fff", fontWeight: "bold", cursor: "pointer", marginTop: "auto" }}>Book {p.name}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FEEDBACK MODAL ---
function FeedbackModal({ property, onSubmit, onCancel }) {
  const [feedback, setFeedback] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 22, padding: "38px 36px", maxWidth: 500, width: "100%" }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#F5F5F5" }}>You chose {property.name}</h2>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 16 }}>What was the main reason for your choice? (Optional)</p>
        <textarea 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)} 
          placeholder="e.g. Best value, loved the amenities, great location..." 
          style={{ width: "100%", padding: "13px", background: "#0A0A0A", border: "1px solid #222", borderRadius: 10, color: "#E5E5E5", minHeight: 100, fontFamily: "sans-serif" }} 
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid #333", borderRadius: 10, color: "#fff", cursor: "pointer" }}>Back</button>
          <button onClick={() => onSubmit(feedback)} style={{ flex: 2, padding: "13px", background: property.accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>Submit Selection</button>
        </div>
      </div>
    </div>
  );
}

// --- MAP VIEW ---
function MapView({ properties, onSelect, onHoverStart, onHoverEnd }) {
  const [hoverId, setHoverId] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const W = 900, H = 600;
  const PIN_POSITIONS = {
    "devils_thumb": [430, 60], "hi_express": [195, 390], "oak_ember": [160, 440],
    "gravity_haus": [430, 280], "bw_alpenglo": [480, 310], "wp_chateau": [455, 340],
    "aframe_club": [680, 430], "zephyr_lodge": [710, 470],
  };

  return (
    <div style={{ position: "relative", background: "#0D0D0D", height: "calc(100vh - 160px)", overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill="#111213" />
        {properties.map((p) => {
          const [x, y] = PIN_POSITIONS[p.id] || [450, 300];
          const isHovered = hoverId === p.id;
          const label = `$${p.price}`;
          const labelW = label.length * 8.5 + 20;
          return (
            <g key={p.id} style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHoverId(p.id);
                onHoverStart(p.id);
                setTooltip({ x: (x / W) * e.currentTarget.ownerSVGElement.clientWidth, y: (y / H) * e.currentTarget.ownerSVGElement.clientHeight, property: p });
              }}
              onMouseLeave={() => { setHoverId(null); setTooltip(null); onHoverEnd(p.id); }}
              onClick={() => onSelect(p.id)}
            >
              <rect x={x - labelW/2} y={y - 14} width={labelW} height={26} rx={13} fill={isHovered ? "#2A2A2A" : "#1A1A1A"} stroke={isHovered ? "#666" : "#333"} />
              <text x={x} y={y + 3.5} textAnchor="middle" fill={isHovered ? "#F5F5F5" : "#BBB"} fontSize="12" fontWeight="700">{label}</text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", left: Math.min(tooltip.x + 12, window.innerWidth - 260), top: Math.max(tooltip.y - 180, 10), width: 240, background: "#111", border: "1px solid #2A2A2A", borderRadius: 12, overflow: "hidden", pointerEvents: "none", zIndex: 50 }}>
          <div style={{ height: 120 }}><OptimizedImage src={tooltip.property.images[0]} alt="" /></div>
          <div style={{ padding: "10px 13px" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>{tooltip.property.name}</div></div>
        </div>
      )}
    </div>
  );
}

// --- PHOTO GRID ---
function PhotoGrid({ images, accent }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [fading, setFading] = useState(false);
  return (
    <div>
      <div style={{ position: "relative", paddingBottom: "58%", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: fading ? 0 : 1, transition: "opacity 0.15s" }}><OptimizedImage src={images[heroIdx]} alt="Main" /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, padding: "2px", background: "#000" }}>
        {images.slice(0,4).map((img, i) => (
          <div key={i} onClick={() => { setFading(true); setTimeout(() => { setHeroIdx(i); setFading(false); }, 150); }} style={{ position: "relative", paddingBottom: "65%", cursor: "pointer", outline: i === heroIdx ? `2px solid ${accent}` : "none", outlineOffset: "-2px" }}>
            <OptimizedImage src={img} alt="Thumb" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PROPERTY CARD ---
function PropertyCard({ property, onSelect, onCompare, isComparing, onHoverStart, onHoverEnd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => { setHovered(true); onHoverStart(property.id); }} 
      onMouseLeave={() => { setHovered(false); onHoverEnd(property.id); }} 
      style={{ background: "#0F0F0F", borderRadius: 18, border: `1px solid ${hovered ? "#333" : "#1C1C1C"}`, overflow: "hidden", transition: "transform 0.2s", transform: hovered ? "translateY(-5px)" : "none", display: "flex", flexDirection: "column" }}
    >
      <PhotoGrid images={property.images} accent={property.accent} />
      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "17px", fontWeight: "bold", color: "#F5F5F5", marginBottom: "4px" }}>{property.name}</div>
        <div style={{ fontSize: "11px", color: property.accent, marginBottom: "16px" }}>{property.tagline}</div>
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button onClick={() => onSelect(property.id)} style={{ flex: 2, padding: "10px", background: property.accent, border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>Book Now</button>
          <button onClick={() => onCompare(property)} style={{ flex: 1, padding: "10px", background: isComparing ? "#333" : "transparent", border: "1px solid #333", borderRadius: "8px", color: isComparing ? property.accent : "#666", cursor: "pointer", fontSize: "12px" }}>
            {isComparing ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("survey");
  const [surveyView, setSurveyView] = useState("list");
  const [properties] = useState(() => shuffle(PROPERTIES_TEMPLATE));
  const [compareStack, setCompareStack] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  // Feedback & Selection State
  const [pendingSelection, setPendingSelection] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);

  // Hover Tracking Refs
  const hoverTimers = useRef({});
  const interactions = useRef(Object.fromEntries(PROPERTIES_TEMPLATE.map((p) => [p.id, { timeMs: 0 }])));

  const handleHoverStart = useCallback((id) => { 
    hoverTimers.current[id] = Date.now(); 
  }, []);

  const handleHoverEnd = useCallback((id) => {
    if (hoverTimers.current[id]) {
      interactions.current[id].timeMs += Date.now() - hoverTimers.current[id];
      delete hoverTimers.current[id];
    }
  }, []);

  // Airtable Logging Function (Comprehensive)
  const logSessionToAirtable = async (finalProp, feedbackText) => {
    // Flush any active hovers before logging
    Object.entries(hoverTimers.current).forEach(([id, start]) => {
      interactions.current[id].timeMs += Date.now() - start;
      delete hoverTimers.current[id];
    });

    if (AIRTABLE_PAT === "YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN") {
        console.warn("Airtable keys missing - skipping log.");
        return;
    }

    try {
      const records = [{
        fields: {
          "Session ID": Date.now().toString(),
          "Selected Property": finalProp.name,
          "Compared Properties": compareStack.map(p => p.name).join(", "),
          "Feedback": feedbackText || "No feedback provided",
          "Hover Data": JSON.stringify(interactions.current),
          "Timestamp": new Date().toISOString()
        }
      }];

      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records })
      });
      console.log("Logged full session to Airtable successfully.");
    } catch (error) {
      console.error("Failed to log to Airtable:", error);
    }
  };

  const toggleCompare = (p) => {
    if (compareStack.find(i => i.id === p.id)) {
      setCompareStack(compareStack.filter(i => i.id !== p.id));
    } else if (compareStack.length < 3) {
      setCompareStack([...compareStack, p]);
    }
  };

  // Triggers the feedback modal
  const handleInitialSelect = (id) => {
    setShowCompareModal(false); // Close compare modal if open
    setPendingSelection(properties.find(p => p.id === id));
  };

  // Triggers the final save and API call
  const handleFinalizeSelection = async (feedbackText) => {
    await logSessionToAirtable(pendingSelection, feedbackText);
    setFinalChoice(pendingSelection);
    setPendingSelection(null);
    setView("done");
  };

  if (view === "done") return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#fff" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${finalChoice.accent}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={finalChoice.accent} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h1>Selection Confirmed</h1>
      <p style={{ color: "#666", marginTop: "10px" }}>You chose <strong>{finalChoice.name}</strong></p>
      <button onClick={() => window.location.reload()} style={{ marginTop: "30px", background: "none", border: "1px solid #333", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Start Over</button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        .shimmer-effect { background: linear-gradient(90deg, #111 25%, #222 50%, #111 75%); background-size: 1000px 100%; animation: shimmer 2s infinite linear; }
        body { background: #080808; color: #fff; font-family: sans-serif; margin: 0; }
      `}</style>

      <header style={{ padding: "20px 40px", borderBottom: "1px solid #161616", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#080808", zIndex: 100 }}>
        <div style={{ fontSize: "14px", color: "#666" }}>Research Study: Winter Park Hotels</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setSurveyView(surveyView === "list" ? "map" : "list")} style={{ background: "#222", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
            View: {surveyView === "list" ? "Map" : "List"}
          </button>
          {compareStack.length > 0 && (
            <button onClick={() => setShowCompareModal(true)} disabled={compareStack.length < 2} style={{ background: compareStack.length >= 2 ? "#C27D4A" : "#222", color: compareStack.length >= 2 ? "#fff" : "#666", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: compareStack.length >= 2 ? "pointer" : "not-allowed" }}>
              Compare ({compareStack.length}/3)
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Find Your Perfect Escape</h1>
        {surveyView === "list" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} onSelect={handleInitialSelect} onCompare={toggleCompare} isComparing={!!compareStack.find(i => i.id === p.id)} onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
            ))}
          </div>
        ) : (
          <MapView properties={properties} onSelect={handleInitialSelect} onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
        )}
      </main>

      {showCompareModal && <ComparisonModal items={compareStack} onClose={() => setShowCompareModal(false)} onSelect={handleInitialSelect} />}
      {pendingSelection && <FeedbackModal property={pendingSelection} onSubmit={handleFinalizeSelection} onCancel={() => setPendingSelection(null)} />}
    </>
  );
}
