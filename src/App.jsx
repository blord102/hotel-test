import { useState, useEffect, useRef, useCallback } from "react";


const YOUR_PROPERTY_ID = "oak_ember";
const SHARED_KEY = "oak_ember_hotel_test_v1";

const PROPERTIES_TEMPLATE = [
  {
    id: "oak_ember", lat: 39.9458, lng: -105.8183, name: "Oak & Ember", tagline: "Elemental Wellness Retreat",
    price: 315, priceSuffix: "/night · suites from $369", suitePrice: 429, suiteLabel: "Signature Suite", rating: 4.8, reviews: 178,
    location: "Fraser, CO · 15 min to Winter Park",
    amenities: ["Hot Tub","Sauna","Steam Room & Aromatherapy","Cold Plunge","Game Room","Great Room","Fireplace","Kitchen Gathering Area","Lounge & Library","Shuffleboard"],
    images: [
    "https://i.postimg.cc/pdRJk9SW/Pub_Hero.jpg",
    "<a href="https://postimg.cc/nXSmhLZ3" target="_blank"><img src="https://i.postimg.cc/nXSmhLZ3/Pub_Loft.jpg" alt="Pub_Loft"></a>",
    "<a href="https://postimg.cc/NKCXj0Yp" target="_blank"><img src="https://i.postimg.cc/NKCXj0Yp/Pub_Lounge.jpg" alt="Pub_Lounge"></a>",
    "<a href="https://postimg.cc/0zXSyNxn" target="_blank"><img src="https://i.postimg.cc/0zXSyNxn/Pub_Std_Rm.jpg" alt="Pub_Std_Rm"></a>"
  ],
    accent: "#C27D4A", isYours: true,
  },
  {
    id: "aframe_club", lat: 39.893, lng: -105.764, name: "A-Frame Club", tagline: "Mid-century cabins at the mountain base",
    price: 425, priceSuffix: "/night · loft cabins from $650", suitePrice: 369, suiteLabel: "Loft Cabin", rating: 4.3, reviews: 312,
    location: "Winter Park, CO · Base of ski resort",
    amenities: ["2 Hot Tubs","Sauna","Wood-fired Restaurant","Bar & Saloon","Custom Fireplaces","Kitchenettes","Pet Friendly","Ski Storage","Fraser River Views"],
    images: [
    "https://i.postimg.cc/XvXwYXsw/AFrame_Club.jpg",
    "https://i.postimg.cc/9QLd2yYF/Aframeclub_room.jpg",
    "https://i.postimg.cc/Z5w8m6xn/AFrame_Club_Lobby.jpg",
    "https://i.postimg.cc/zGxCNTF3/AFrame_Club_Hot_Tub.jpg"
  ],
    accent: "#7B6FA0", isYours: false,
  },
  {
    id: "gravity_haus", lat: 39.907, lng: -105.787, name: "Gravity Haus", tagline: "Boutique motel for outdoor enthusiasts",
    price: 365, priceSuffix: "/night · loft suites from $550", suitePrice: 349, suiteLabel: "Bunk Suite", rating: 4.0, reviews: 145,
    location: "Downtown Winter Park, CO",
    amenities: ["2 Outdoor Hot Tubs","Fitness Center","Restaurant","Coffee Shop","Bar & Lounge","Outdoor Firepit","Free WiFi","Pet Friendly","Cycling Access"],
    images: [
    "https://i.postimg.cc/MGXypX9R/Gravity_Haus_WP.jpg",
    "https://i.postimg.cc/3xtXh2Fk/Gravity_Haus_Lobby.jpg",
    "https://i.postimg.cc/dV52FGj0/Gravity_Haus_Room.jpg",
    "https://i.postimg.cc/JzpN8j5q/Gravity_Haus_Hot_Tub.jpg"
  ],
    accent: "#5A8A6E", isYours: false,
  },
  {
    id: "zephyr_lodge", lat: 39.887, lng: -105.759, name: "Zephyr Mountain Lodge", tagline: "Ski-in / ski-out at the base village",
    price: 389, priceSuffix: "/night · 2BR condos from $575", suitePrice: 469, suiteLabel: "2BR Condo", rating: 4.2, reviews: 534,
    location: "Winter Park Resort Base Village",
    amenities: ["Ski-In / Ski-Out","4 Hot Tubs","Fitness Center","Full Kitchen","In-Room Fireplace","Ski Storage","Free Shuttle","Mountain Views","Underground Parking"],
    images: [
    "https://i.postimg.cc/FHTyv0VJ/Zephyr_Mountain_Lodge_Exterior_Sunset.jpg",
    "https://i.postimg.cc/nLMvhM3D/Zephyr_Mountain_Lodge.jpg",
    "https://i.postimg.cc/ht2LnV1g/Zephyr_Mountain_Lodge_Lobby.jpg",
    "https://i.postimg.cc/Mp97w1mB/Zephyr_Mountain_Lodge_Hot_Tub.jpg"
  ],
    accent: "#5B8CB8", isYours: false,
  },
  {
    id: "wp_chateau", lat: 39.903, lng: -105.784, name: "Winter Park Chateau", tagline: "Highest-rated boutique hotel in Winter Park",
    price: 385, priceSuffix: "/night · suites from $575", suitePrice: 339, suiteLabel: "Junior Suite", rating: 5.0, reviews: 423,
    location: "Downtown Winter Park, CO",
    amenities: ["Hot Tub (View Deck)","Private Bar & Lounge","Soaking Tubs","Mountain Views","Free Breakfast","Free Parking","Pet Friendly","Concierge"],
    images: [
    "https://i.postimg.cc/VN5jk5Kn/Winter_Park_Chateau.jpg",
    "https://i.postimg.cc/6pMrKCf7/Winter_Park_Chateau_Exterior.jpg",
    "https://i.postimg.cc/Z5b8Xwp5/Winter_Park_Chateau_Room.jpg",
    "https://i.postimg.cc/VkKqwXW0/Winter_Park_Chateau_Hot_Tub.jpg"
  ],
    accent: "#A0704A", isYours: false,
  },
  {
    id: "bw_alpenglo", lat: 39.911, lng: -105.792, name: "Best Western Alpenglo Lodge", tagline: "Award-winning lodge near the slopes",
    price: 269, priceSuffix: "/night · hot tub rooms from $319", suitePrice: 259, suiteLabel: "Hot Tub Room", rating: 4.1, reviews: 750,
    location: "Downtown Winter Park, CO",
    amenities: ["Indoor Hot Tub","Free Hot Breakfast","Free Parking","Ski Storage","Bike Rental","Free WiFi","Business Center","Pet Friendly","Shuttle Access"],
    images: [
    "https://i.postimg.cc/mgmY47yM/Best_Western_Alpenglo_Exterior.jpg",
    "https://i.postimg.cc/Sxg64cfc/Best_Western_Alpenglo_Room.jpg",
    "https://i.postimg.cc/JzpN8j5k/Best_Western_Alpenglo_Hot_Tub.jpg",
    "https://i.postimg.cc/rwf1T5NT/Best_Western_Alpenglow_Lodge_Lobby.jpg"
  ],
    accent: "#4A7AAA", isYours: false,
  },
  {
    id: "hi_express", lat: 39.939, lng: -105.808, name: "Holiday Inn Express & Suites", tagline: "Full-service comfort in Fraser Valley",
    price: 289, priceSuffix: "/night · king suites from $389", suitePrice: 269, suiteLabel: "King Suite", rating: 4.0, reviews: 172,
    location: "Fraser, CO · 10 min to Winter Park",
    amenities: ["Indoor Pool","Hot Tub","Free Breakfast","Fitness Center","Outdoor Firepit","Free WiFi","Ski Lockers","Free Parking","Lift Shuttle Stop"],
    images: [
    "https://i.postimg.cc/DzmqwmxG/Holiday_Inn_Express.jpg",
    "https://i.postimg.cc/x16vQL3K/Holiday_Inn_Express_Winter_Park_Lobby.jpg",
    "https://i.postimg.cc/jSMHTy46/Holiday_Inn_Express_Winter_Park_Room.jpg",
    "https://i.postimg.cc/qv1sr2xX/Holiday_Inn_Express_Winter_Park_Pool.jpg"
  ],
    accent: "#617B8A", isYours: false,
  },
  {
    id: "devils_thumb", lat: 40.019, lng: -105.842, name: "Devil's Thumb Ranch Resort & Spa", tagline: "6,500-acre luxury ranch & full spa",
    price: 424, priceSuffix: "/night · cabins from $664", suitePrice: 529, suiteLabel: "Log Cabin", rating: 4.5, reviews: 891,
    location: "Tabernash, CO · 20 min from Winter Park",
    amenities: ["Full-Service Spa","Heated Outdoor Pool","Hot Tub","Sauna","2 Restaurants & Bar","Nordic Skiing","Horseback Riding","Fly Fishing","Concierge"],
    images: [
    "https://i.postimg.cc/Lshz8hxk/Devils_Thumb_Ranch_Aerial_Winter.jpg",
    "https://i.postimg.cc/52sBJ8Sb/Devils_Thumb_Ranch_Room.jpg",
    "https://i.postimg.cc/vZ0ry5tc/Devils_Thumb_Restaurant.jpg",
    "https://i.postimg.cc/Qd8Qvf1t/lodges_high_lonesome_lodge.jpg"
  ],
    accent: "#8A7055", isYours: false,
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
function formatDuration(ms) {
  if (!ms || ms < 1000) return "<1s";
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}



// ─── SVG MAP VIEW (no external deps) ─────────────────────────────────────────
function MapView({ properties, onSelect }) {
  const [hoverId, setHoverId] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, property }
  const svgRef = useRef(null);

  // Real lat/lng bounds for the area

  const W = 900, H = 600;

  const PIN_POSITIONS = {
    "devils_thumb": [430, 60],
    "hi_express": [195, 390],
    "oak_ember": [160, 440],
    "gravity_haus": [430, 280],
    "bw_alpenglo": [480, 310],
    "wp_chateau": [455, 340],
    "aframe_club": [680, 430],
    "zephyr_lodge": [710, 470],
  };
  const project = (lat, lng, id) => PIN_POSITIONS[id] || [450, 300];

  // Road/terrain path data for visual context (simplified Winter Park area)
  const roads = [
    // US-40 main highway running roughly E-W through Fraser/Winter Park
    "M 20,340 Q 150,330 260,310 Q 380,290 460,275 Q 540,265 620,270 Q 700,278 780,300 Q 840,315 890,330",
    // Berthoud Pass road going south
    "M 620,270 Q 640,320 660,380 Q 680,440 700,500 Q 710,540 715,580",
    // Road to Devil's Thumb north
    "M 340,175 Q 360,210 380,250 Q 400,275 420,290",
    // County road 5001 area (Oak & Ember)
    "M 270,305 Q 290,295 310,290 Q 330,288 350,292",
  ];

  // Topographic-style contour lines for mountain feel
  const contours = [
    "M 550,580 Q 600,540 650,500 Q 700,460 740,420 Q 770,390 790,360 Q 810,330 820,300",
    "M 500,580 Q 560,530 610,480 Q 660,430 700,390 Q 730,360 750,330",
    "M 600,580 Q 640,550 680,510 Q 720,470 755,435 Q 780,405 800,375",
    "M 450,580 Q 510,525 565,470 Q 615,420 655,380 Q 685,350 705,320",
    "M 200,580 Q 240,540 270,490 Q 290,450 300,410 Q 310,375 320,340",
    "M 150,580 Q 200,530 235,475 Q 260,430 270,385 Q 278,350 285,315",
    "M 100,400 Q 120,370 145,340 Q 165,318 180,300",
    // Northern mountains
    "M 200,0 Q 250,40 300,80 Q 350,120 380,150 Q 400,170 410,190",
    "M 250,0 Q 290,45 330,90 Q 365,130 390,165",
    "M 150,0 Q 200,50 240,100 Q 270,140 290,175",
  ];

  // Forest areas (simple polygon blobs)
  const forests = [
    "M 480,0 L 650,0 L 720,80 L 750,180 L 700,260 L 640,280 L 580,250 L 530,200 L 490,130 L 470,60 Z",
    "M 100,0 L 280,0 L 320,60 L 330,130 L 310,200 L 270,240 L 220,230 L 170,200 L 130,150 L 100,80 Z",
  ];

  const hoverProp = properties.find(p => p.id === hoverId);

  return (
    <div style={{ position: "relative", background: "#0D0D0D", height: "calc(100vh - 160px)", overflow: "hidden" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "100%", display: "block" }}
        onMouseLeave={() => { setHoverId(null); setTooltip(null); }}
      >
        {/* Base terrain */}
        <rect width={W} height={H} fill="#111213" />

        {/* Forest blobs */}
        {forests.map((d, i) => (
          <path key={i} d={d} fill="#141A14" stroke="none" />
        ))}

        {/* Topographic contour lines */}
        {contours.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1E2420" strokeWidth="1" />
        ))}

        {/* Fraser River  */}
        <path d="M 260,580 Q 290,520 310,460 Q 325,410 335,365 Q 345,325 355,295 Q 365,270 385,250 Q 410,228 435,210 Q 455,195 465,175 Q 470,155 460,120 Q 450,90 440,60 Q 432,35 428,0"
          fill="none" stroke="#1A2B35" strokeWidth="3" opacity="0.8" />

        {/* Roads */}
        {roads.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#252520" strokeWidth={i === 0 ? 3.5 : 2} />
        ))}

        {/* US-40 label — runs along the main road */}
        <text x="115" y="418" fill="#3A3830" fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="2" transform="rotate(-6, 115, 418)">US-40</text>
        <text x="340" y="305" fill="#3A3830" fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="2" transform="rotate(-4, 340, 305)">US-40</text>

        {/* ── TOWN: FRASER ── left side, along US-40 */}
        <g>
          {/* town dot */}
          <circle cx="178" cy="408" r="4" fill="none" stroke="#3D3D35" strokeWidth="1.5" />
          <circle cx="178" cy="408" r="1.5" fill="#3D3D35" />
          <text x="178" y="397" textAnchor="middle" fill="#666" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif" letterSpacing="0.5">FRASER</text>
          <text x="178" y="407" textAnchor="middle" fill="#3A3830" fontSize="8" fontFamily="DM Sans, sans-serif" letterSpacing="1">TOWN</text>
        </g>

        {/* ── TOWN: WINTER PARK ── center, near property cluster */}
        <g>
          <circle cx="455" cy="268" r="4" fill="none" stroke="#3D3D35" strokeWidth="1.5" />
          <circle cx="455" cy="268" r="1.5" fill="#3D3D35" />
          <text x="455" y="257" textAnchor="middle" fill="#666" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif" letterSpacing="0.5">WINTER PARK</text>
          <text x="455" y="267" textAnchor="middle" fill="#3A3830" fontSize="8" fontFamily="DM Sans, sans-serif" letterSpacing="1">TOWN</text>
        </g>

        {/* ── SKI RESORT diagram — below A-Frame & Zephyr pins ── */}
        <g opacity="0.55">
          {/* Mountain peak */}
          <polyline points="700,530 670,490 640,530" fill="none" stroke="#2A3530" strokeWidth="1.5" strokeLinejoin="round" />
          <polyline points="740,530 715,495 688,530" fill="none" stroke="#2A3530" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Ski runs — lines down the slope */}
          <line x1="670" y1="492" x2="650" y2="530" stroke="#223328" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="670" y1="492" x2="670" y2="530" stroke="#223328" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="715" y1="497" x2="700" y2="530" stroke="#223328" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="715" y1="497" x2="725" y2="530" stroke="#223328" strokeWidth="1" strokeDasharray="3,2" />
          {/* Base lodge */}
          <rect x="648" y="526" width="85" height="12" rx="2" fill="#1E2820" stroke="#2A3530" strokeWidth="1" />
          {/* Lift line */}
          <line x1="660" y1="527" x2="672" y2="493" stroke="#1E2820" strokeWidth="1" strokeDasharray="2,4" />
          <line x1="740" y1="527" x2="716" y2="496" stroke="#1E2820" strokeWidth="1" strokeDasharray="2,4" />
          {/* Label */}
          <text x="690" y="550" textAnchor="middle" fill="#3A4A40" fontSize="8" fontFamily="DM Sans, sans-serif" letterSpacing="1.5">WINTER PARK RESORT</text>
        </g>

        {/* Property pins */}
        {properties.map((p) => {
          const [x, y] = project(p.lat, p.lng, p.id);
          const isHovered = hoverId === p.id;
          const bg = isHovered ? "#2A2A2A" : "#1A1A1A";
          const border = isHovered ? "#666" : "#333";
          const textColor = isHovered ? "#F5F5F5" : "#BBB";
          const label = `$${p.price}`;
          const labelW = label.length * 8.5 + 20;

          return (
            <g key={p.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHoverId(p.id);
                const rect = svgRef.current.getBoundingClientRect();
                const svgX = (x / W) * rect.width;
                const svgY = (y / H) * rect.height;
                setTooltip({ x: svgX, y: svgY, property: p });
              }}
              onMouseLeave={() => { setHoverId(null); setTooltip(null); }}
              onClick={() => onSelect(p.id)}
            >
              {/* Drop shadow */}
              <rect x={x - labelW/2 + 2} y={y - 14 + 3} width={labelW} height={26}
                rx={13} fill="rgba(0,0,0,0.5)" />
              {/* Pin body */}
              <rect x={x - labelW/2} y={y - 14} width={labelW} height={26}
                rx={13}
                fill={bg}
                stroke={border}
                strokeWidth={1}
              />

              <text x={x} y={y + 3.5} textAnchor="middle"
                fill={textColor} fontSize="12" fontWeight="700"
                fontFamily="DM Sans, sans-serif">
                {label}
              </text>
            </g>
          );
        })}

      {/* Tooltip popup */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: Math.min(tooltip.x + 12, window.innerWidth - 260),
          top: Math.max(tooltip.y - 180, 10),
          width: 240,
          background: "#111",
          border: "1px solid #2A2A2A",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
          pointerEvents: "none",
          zIndex: 50,
        }}>
          <div style={{ position: "relative", paddingBottom: "52%", overflow: "hidden" }}>
            <img src={tooltip.property.images[0]} alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute", bottom: 8, right: 8,
              background: "rgba(0,0,0,0.85)", color: "#fff",
              padding: "3px 9px", borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: "DM Sans, sans-serif",
            }}>
              ${tooltip.property.price}
              <span style={{ fontSize: 9, color: "#888" }}>/night</span>
            </div>
            <div style={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(0,0,0,0.75)",
              padding: "2px 7px", borderRadius: 6,
              fontSize: 9, color: "#888", fontFamily: "DM Sans, sans-serif",
            }}>
              {tooltip.property.suiteLabel}: <span style={{ color: "#bbb" }}>${tooltip.property.suitePrice}</span>
            </div>
          </div>
          <div style={{ padding: "10px 13px 13px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5", marginBottom: 2, fontFamily: "DM Sans, sans-serif" }}>
              {tooltip.property.name}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>
              {tooltip.property.location}
            </div>
            <div style={{ fontSize: 11, color: "#888", fontFamily: "DM Sans, sans-serif", marginBottom: 4 }}>
              {"★".repeat(Math.floor(tooltip.property.rating))} {tooltip.property.rating} · {tooltip.property.reviews} reviews
            </div>
            <div style={{ fontSize: 10, color: "#444", fontFamily: "DM Sans, sans-serif" }}>
              {tooltip.property.amenities.slice(0, 3).join(" · ")}
            </div>
          </div>
          <div style={{
            padding: "0 13px 12px", fontFamily: "DM Sans, sans-serif",
            fontSize: 11, color: "#555", textAlign: "center",
          }}>
            Click to select
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 20, left: 20,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(8px)",
        border: "1px solid #222", borderRadius: 10, padding: "10px 14px",
        fontFamily: "DM Sans, sans-serif",
      }}>
        <div style={{ fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Hover to preview · Click to select</div>
      </div>
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#F5C842" : "none"} stroke="#F5C842" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function PhotoGrid({ images, accent, hovered }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const thumbs = images.slice(0, 4);

  const swapHero = (e, i) => {
    e.stopPropagation();
    if (i === heroIdx) return;
    setFading(true);
    setTimeout(() => { setHeroIdx(i); setFading(false); }, 160);
  };

  return (
    <div>
      <div style={{ position: "relative", paddingBottom: "58%", overflow: "hidden" }}>
        <img src={images[heroIdx]} alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transition: "opacity 0.16s ease, transform 0.6s ease",
            opacity: fading ? 0 : 1,
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, #0F0F0F 0%, rgba(15,15,15,0.05) 50%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </div>
      {thumbs.length > 1 && (
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${thumbs.length}, 1fr)`,
          gap: 3, padding: "3px 3px 0", background: "#0A0A0A",
        }}>
          {thumbs.map((src, i) => (
            <div key={i} onClick={(e) => swapHero(e, i)}
              style={{
                position: "relative", paddingBottom: "65%", overflow: "hidden",
                cursor: "pointer",
                outline: i === heroIdx ? `2px solid ${accent}` : "2px solid transparent",
                outlineOffset: "-2px", borderRadius: 2, transition: "outline 0.15s",
              }}>
              <img src={src} alt="" style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", transition: "opacity 0.2s",
                opacity: i === heroIdx ? 1 : 0.55,
                filter: i === heroIdx ? "none" : "brightness(0.8)",
              }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property, onHoverStart, onHoverEnd, onSelect, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const handleEnter = () => { setHovered(true); onHoverStart(property.id); };
  const handleLeave = () => { setHovered(false); onHoverEnd(property.id); };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      style={{
        background: "#0F0F0F",
        border: `1.5px solid ${isSelected ? property.accent : hovered ? "#2A2A2A" : "#1C1C1C"}`,
        borderRadius: 18, overflow: "hidden", cursor: "pointer",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: isSelected
          ? `0 0 0 2px ${property.accent}44, 0 20px 60px rgba(0,0,0,0.6)`
          : hovered ? "0 14px 48px rgba(0,0,0,0.55)" : "0 4px 16px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column", position: "relative",
      }}>

      

      <div style={{ position: "relative" }}>
        <PhotoGrid images={property.images} accent={property.accent} hovered={hovered} />
        <div style={{
          position: "absolute", bottom: 54, right: 10, zIndex: 6,
          background: "rgba(8,8,8,0.85)", backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, padding: "7px 12px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: "#F5F5F5" }}>
              ${property.price}
            </span>
            <span style={{ fontSize: 9.5, color: "#7A7A7A", fontFamily: "'DM Mono', monospace" }}>
              /night
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#555", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
            {property.suiteLabel}: <span style={{ color: "#9CA3AF" }}>${property.suitePrice}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", color: "#F5F5F5", lineHeight: 1.2 }}>
            {property.name}
          </div>
          <div style={{ fontSize: 11, color: property.accent, marginTop: 4, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
            {property.tagline}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Stars rating={property.rating} />
          <span style={{ fontSize: 11, color: "#4B5563", fontFamily: "'DM Mono', monospace" }}>
            ({property.reviews.toLocaleString()})
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ fontSize: 11, color: "#5A5A5A", lineHeight: 1.4 }}>{property.location}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {property.amenities.slice(0, 8).map((a) => (
            <span key={a} style={{
              fontSize: 9.5, padding: "3px 7px",
              background: "#151515", border: "1px solid #222",
              borderRadius: 5, color: "#6B6B6B", fontFamily: "'DM Mono', monospace",
            }}>{a}</span>
          ))}
          {property.amenities.length > 8 && (
            <span style={{
              fontSize: 9.5, padding: "3px 7px", background: "#151515", border: "1px solid #222",
              borderRadius: 5, color: property.accent, fontFamily: "'DM Mono', monospace",
            }}>+{property.amenities.length - 8} more</span>
          )}
        </div>
        <button onClick={() => onSelect(property.id)}
          style={{
            marginTop: "auto", padding: "12px 16px",
            background: isSelected ? property.accent : "transparent",
            border: `1.5px solid ${isSelected ? property.accent : "#222"}`,
            borderRadius: 10, color: isSelected ? "#fff" : "#4A4A4A",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
          }}
          onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = property.accent; e.currentTarget.style.color = property.accent; } }}
          onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#4A4A4A"; } }}
        >
          {isSelected ? "This is my pick" : "Choose This Property"}
        </button>
      </div>
    </div>
  );
}

function ReasonModal({ property, properties, onSubmit, onSkip }) {
  const [text, setText] = useState("");
  const [secondChoice, setSecondChoice] = useState("");
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#111", border: "1px solid #222",
        borderRadius: 22, padding: "38px 36px", maxWidth: 500, width: "100%",
        boxShadow: `0 0 80px ${property.accent}15`,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: property.accent + "18", border: `1.5px solid ${property.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={property.accent} strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#F5F5F5" }}>
          You chose {property.name}
        </h2>
        <p style={{ color: "#9CA3AF", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
          What was the main reason for your choice? <span style={{ color: "#4B5563" }}>(optional)</span>
        </p>
        <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 18px", lineHeight: 1.6 }}>
          No time for feedback? No problem — if you're happy to skip the text, could you at least let us know your <strong style={{ color: "#6B7280" }}>second choice</strong>?
        </p>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Best value for the amenities, love the wellness circuit, great location..."
          style={{
            width: "100%", padding: "13px 15px",
            background: "#0A0A0A", border: "1px solid #222",
            borderRadius: 10, color: "#E5E5E5",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            resize: "vertical", minHeight: 90, boxSizing: "border-box", outline: "none",
          }}
        />
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 10 }}>
            Second choice <span style={{ color: "#4B5563" }}>(optional)</span>
          </label>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
          }}>
            {properties.filter(p => p.id !== property.id).map(p => (
              <div key={p.id} onClick={() => setSecondChoice(secondChoice === p.id ? "" : p.id)}
                style={{
                  cursor: "pointer", borderRadius: 8, overflow: "hidden",
                  border: secondChoice === p.id ? `2px solid ${property.accent}` : "2px solid transparent",
                  outline: secondChoice === p.id ? `0` : "1px solid #1E1E1E",
                  outlineOffset: "-1px",
                  transition: "border 0.15s",
                  opacity: secondChoice && secondChoice !== p.id ? 0.45 : 1,
                }}>
                <div style={{ position: "relative", paddingBottom: "70%", overflow: "hidden" }}>
                  <img src={p.images[0]} alt={p.name} style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.2s",
                  }} />
                  {secondChoice === p.id && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: `${property.accent}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: property.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{
                  padding: "5px 6px",
                  background: secondChoice === p.id ? "#1A1208" : "#0F0F0F",
                  fontSize: 10, color: secondChoice === p.id ? property.accent : "#9CA3AF",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={() => onSubmit(text, secondChoice)} style={{
            flex: 1, padding: "13px", background: property.accent,
            border: "none", borderRadius: 10, color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
          }}>Submit Response</button>
          <button onClick={() => onSubmit("", secondChoice)} style={{
            padding: "13px 18px", background: "transparent",
            border: "1px solid #222", borderRadius: 10,
            color: "#555", fontSize: 13, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>Skip feedback →</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationScreen({ property }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 24, padding: 32, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: "50%",
        background: property.accent + "18", border: `2px solid ${property.accent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, color: property.accent,
      }}>
      </div>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <h1 style={{ fontSize: 30, fontFamily: "'Libre Baskerville', serif", color: "#F5F5F5", margin: "0 0 10px" }}>
          Thanks for your time!
        </h1>
        <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
          You selected <strong style={{ color: property.accent }}>{property.name}</strong>. Your preference has been recorded.
        </p>
      </div>
    </div>
  );
}

function AdminDashboard({ responses, onBack }) {
  const total = responses.length;
  const wins = responses.filter((r) => r.selectedId === YOUR_PROPERTY_ID).length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  const propStats = PROPERTIES_TEMPLATE.map((p) => {
    const chosen = responses.filter((r) => r.selectedId === p.id).length;
    const clicks = responses.reduce((acc, r) => acc + (r.interactions[p.id]?.clicks || 0), 0);
    const totalTime = responses.reduce((acc, r) => acc + (r.interactions[p.id]?.timeMs || 0), 0);
    const avgTime = total ? Math.round(totalTime / total) : 0;
    return { ...p, chosen, clicks, avgTime, pct: total ? Math.round((chosen / total) * 100) : 0 };
  }).sort((a, b) => b.chosen - a.chosen);

  const maxChosen = Math.max(...propStats.map((p) => p.chosen), 1);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", padding: "40px 32px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #222", color: "#555",
          padding: "8px 16px", borderRadius: 8, cursor: "pointer", marginBottom: 32,
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em",
        }}>Back to Survey</button>

        <div style={{ marginBottom: 38 }}>
          <div style={{ fontSize: 10, color: "#4B5563", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
            Oak & Ember · Preference Research · Winter Park / Fraser Valley
          </div>
          <h1 style={{ fontSize: 34, fontFamily: "'Libre Baskerville', serif", margin: 0, fontWeight: 700 }}>Results Dashboard</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total Responses", value: total, sub: "survey participants" },
            { label: "Oak & Ember Win Rate", value: `${winRate}%`, sub: `${wins} of ${total} chose your concept`,
              accent: winRate >= 50 ? "#6EE7B7" : winRate >= 25 ? "#FCD34D" : "#FCA5A5" },
            { label: "Competing Properties", value: PROPERTIES_TEMPLATE.length - 1, sub: "in your comp set" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#0E0E0E", border: "1px solid #1C1C1C", borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontSize: 10, color: "#4B5563", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: k.accent || "#F5F5F5", fontFamily: "'Libre Baskerville', serif", lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#4B5563", marginTop: 6 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0E0E0E", border: "1px solid #1C1C1C", borderRadius: 14, padding: "28px 30px", marginBottom: 22 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 17, fontFamily: "'Libre Baskerville', serif" }}>Selection Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {propStats.map((p) => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: p.isYours ? 700 : 400, color: p.isYours ? "#F5F5F5" : "#C0C0C0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}{p.isYours && <span style={{ fontSize: 9, color: p.accent, fontFamily: "'DM Mono', monospace", marginLeft: 7 }}> YOUR CONCEPT</span>}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 18, fontSize: 11, color: "#555", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
                    <span>Chosen: <strong style={{ color: "#E5E5E5" }}>{p.chosen} ({p.pct}%)</strong></span>
                    <span>Clicks: <strong style={{ color: "#E5E5E5" }}>{p.clicks}</strong></span>
                    <span>Avg focus: <strong style={{ color: "#E5E5E5" }}>{formatDuration(p.avgTime)}</strong></span>
                  </div>
                </div>
                <div style={{ background: "#1A1A1A", borderRadius: 6, height: 7 }}>
                  <div style={{
                    height: "100%", background: p.accent,
                    width: `${Math.max((p.chosen / maxChosen) * 100, p.chosen > 0 ? 2 : 0)}%`,
                    borderRadius: 6, transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#0E0E0E", border: "1px solid #1C1C1C", borderRadius: 14, padding: "28px 30px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 17, fontFamily: "'Libre Baskerville', serif" }}>Individual Responses ({total})</h2>
          {responses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#333", fontStyle: "italic", fontSize: 14 }}>
              No responses yet. Share the survey link to begin collecting data.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...responses].reverse().map((r) => {
                const chosen = PROPERTIES_TEMPLATE.find((p) => p.id === r.selectedId);
                return (
                  <div key={r.id} style={{ background: "#0A0A0A", border: "1px solid #1C1C1C", borderRadius: 10, padding: "15px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: chosen?.accent, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#E5E5E5" }}>Chose: {chosen?.name}</span>
                          {chosen?.isYours && <span style={{ fontSize: 9, color: chosen.accent, fontFamily: "'DM Mono', monospace" }}>YOUR CONCEPT</span>}
                        </div>
                        {r.reason && <div style={{ fontSize: 12, color: "#6B7280", fontStyle: "italic", marginLeft: 15 }}>"{r.reason}"</div>}
                      </div>
                      <div style={{ fontSize: 10, color: "#333", fontFamily: "'DM Mono', monospace", textAlign: "right", flexShrink: 0 }}>
                        <div>{new Date(r.timestamp).toLocaleString()}</div>
                        <div style={{ marginTop: 2 }}>Session: {formatDuration(r.sessionDurationMs)}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {Object.entries(r.interactions).filter(([, v]) => v.clicks > 0 || v.timeMs > 500).map(([id, data]) => {
                        const prop = PROPERTIES_TEMPLATE.find((p) => p.id === id);
                        return (
                          <span key={id} style={{ fontSize: 9.5, padding: "2px 8px", background: "#121212", border: "1px solid #1C1C1C", borderRadius: 5, color: "#4A4A4A", fontFamily: "'DM Mono', monospace" }}>
                            {prop?.name}: {data.clicks}x · {formatDuration(data.timeMs)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("survey");
  const [surveyView, setSurveyView] = useState("list"); // "list" | "map"
  const [properties] = useState(() => shuffle(PROPERTIES_TEMPLATE));
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [responses, setResponses] = useState([]);
  const [chosenProperty, setChosenProperty] = useState(null);

  const sessionStart = useRef(Date.now());
  const hoverTimers = useRef({});
  const interactions = useRef(
    Object.fromEntries(PROPERTIES_TEMPLATE.map((p) => [p.id, { clicks: 0, timeMs: 0 }]))
  );

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(SHARED_KEY, true);
        if (result?.value) setResponses(JSON.parse(result.value));
      } catch {}
    })();
  }, []);

  const handleHoverStart = useCallback((id) => { hoverTimers.current[id] = Date.now(); }, []);
  const handleHoverEnd = useCallback((id) => {
    if (hoverTimers.current[id]) {
      interactions.current[id].timeMs += Date.now() - hoverTimers.current[id];
      delete hoverTimers.current[id];
    }
  }, []);
  const handleSelect = useCallback((id) => {
    interactions.current[id].clicks += 1;
    setSelectedId(id);
    setPendingId(id);
    setShowModal(true);
  }, []);

  const handleSubmitReason = async (reason, secondChoice = "") => {
    const prop = properties.find((p) => p.id === pendingId);
    Object.entries(hoverTimers.current).forEach(([id, start]) => {
      interactions.current[id].timeMs += Date.now() - start;
    });
    const response = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      selectedId: pendingId,
      reason: reason.trim(),
      secondChoiceId: secondChoice || null,
      interactions: JSON.parse(JSON.stringify(interactions.current)),
      sessionDurationMs: Date.now() - sessionStart.current,
      timestamp: new Date().toISOString(),
    };
    const updated = [...responses, response];
    setResponses(updated);
    try { await window.storage.set(SHARED_KEY, JSON.stringify(updated), true); } catch {}
    setChosenProperty(prop);
    setShowModal(false);
    setView("done");
  };

  if (view === "admin") return <AdminDashboard responses={responses} onBack={() => setView("survey")} />;
  if (view === "done" && chosenProperty) return <ConfirmationScreen property={chosenProperty} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808", color: "#F5F5F5" }}>
        <div style={{
          borderBottom: "1px solid #161616", padding: "18px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(8,8,8,0.94)", backdropFilter: "blur(16px)",
        }}>
          <div>
            <div style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Hotel Preference Study · Winter Park, CO
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {view === "survey" && (
              <div style={{
                display: "flex", background: "#111", border: "1px solid #222",
                borderRadius: 8, overflow: "hidden",
              }}>
                {["list","map"].map(v => (
                  <button key={v} onClick={() => setSurveyView(v)} style={{
                    padding: "7px 14px", background: surveyView === v ? "#222" : "transparent",
                    border: "none", color: surveyView === v ? "#F5F5F5" : "#555",
                    fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: surveyView === v ? 700 : 400,
                    display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
                  }}>
                    {v === "list"
                      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/></svg> List</>
                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> Map</>
                    }
                  </button>
                ))}
              </div>
            )}
            <span style={{ fontSize: 11, color: "#3A3A3A", fontFamily: "'DM Mono', monospace" }}>{responses.length} response{responses.length !== 1 ? "s" : ""}</span>
            <button onClick={() => setView("admin")} style={{
              padding: "8px 16px", background: "transparent",
              border: "1px solid #222", borderRadius: 8,
              color: "#666", fontSize: 11, cursor: "pointer",
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
            }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#C27D4A"; e.currentTarget.style.color = "#C27D4A"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#666"; }}
            >View Results</button>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "54px 32px 44px", maxWidth: 660, margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(24px, 3.5vw, 42px)", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, color: "#F5F5F5", lineHeight: 1.2, marginBottom: 14,
          }}>
            You're planning a Colorado mountain escape — March 27–29.
            <br />
            <span style={{ color: "#C27D4A" }}>Which hotel do you book?</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 6px" }}>
            Browse and compare as you would on a real booking site. Click any thumbnail to see more photos. When you've decided, select your preferred property.
          </p>
          <p style={{ color: "#4B5563", fontSize: 12, fontFamily: "'DM Mono', sans-serif", margin: 0 }}>
            Dates: March 27–29, 2026 · Prices shown per night
          </p>
        </div>

        {surveyView === "list" ? (
          <div style={{
            padding: "0 28px 80px", maxWidth: 1440, margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))",
            gap: 20,
          }}>
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p}
                onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd}
                onSelect={handleSelect} isSelected={selectedId === p.id}
              />
            ))}
          </div>
        ) : (
          <MapView
            properties={properties}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        )}
      </div>

      {showModal && pendingId && (
        <ReasonModal
          property={properties.find((p) => p.id === pendingId)}
          properties={properties}
          onSubmit={handleSubmitReason}
          onSkip={() => handleSubmitReason("", "")}
        />
      )}
    </>
  );
}
