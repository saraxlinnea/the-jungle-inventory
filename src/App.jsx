import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcLeU9bCf4YcBE72eq1S4SdewUYWIog4E",
  authDomain: "the-jungle-inventory.firebaseapp.com",
  projectId: "the-jungle-inventory",
  storageBucket: "the-jungle-inventory.firebasestorage.app",
  messagingSenderId: "17587931596",
  appId: "1:17587931596:web:be3f5c63e5c988418bf569"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const EDIT_PASSWORD = "dracarys";

const PLANTS = {
  indoor: [
    {
      id: 101,
      nickname: "Mona",
      commonName: "Swiss Cheese Plant",
      scientific: "Monstera deliciosa",
      emoji: "🌿",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "The undisputed anchor of the living room. Those iconic split leaves are called fenestrations — no one knows exactly why Monsteras evolved them, but the leading theory is to let light through to lower leaves in dense jungle canopies. Water when the top two inches of soil are dry."
    },
    {
      id: 102,
      nickname: "Randy",
      commonName: "Dragon Tree",
      scientific: "Dracaena marginata",
      emoji: "🎋",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "Tall, dramatic, and completely unbothered. Dracaenas are near-indestructible and NASA-certified air purifiers. Randy will outlast us all. Let the soil dry out fully between waterings — overwatering is the one thing that will actually finish him."
    },
    {
      id: 103,
      nickname: "The Mists",
      commonName: "Pothos or Philodendron",
      scientific: "Epipremnum aureum or Philodendron hederaceum",
      emoji: "🍃",
      lastWatered: null,
      lastFertilized: null,
      notes: "Still needs ID — check leaf texture.",
      blurb: "Identity still undetermined. To tell them apart: Pothos leaves are waxy and slightly raised down the center. Philodendron leaves are thinner and more velvety to the touch. Either way, basically impossible to kill and happy in low light."
    },
    {
      id: 104,
      nickname: "The Outlaws",
      commonName: "Cacti & Succulents",
      scientific: "Cactaceae and Crassulaceae spp.",
      emoji: "🌵",
      lastWatered: null,
      lastFertilized: null,
      notes: "Water every 2–3 weeks max. They share a tray.",
      blurb: "A motley crew of desert survivors. They store water in their leaves and stems, which means the number one way to kill them is kindness. When in doubt, don't water. They want as much direct sun as they can get."
    },
    {
      id: 105,
      nickname: "The Herb",
      commonName: "Spearmint",
      scientific: "Mentha spicata",
      emoji: "🌱",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "Mint is aggressively alive. Left unchecked it will take over everything around it. Keep it in its own pot, water regularly, and harvest often — the more you cut it, the bushier it grows."
    },
  ],
  outdoor: [
    {
      id: 201,
      nickname: "Rapunzel",
      commonName: "Pink Jasmine",
      scientific: "Jasminum polyanthum",
      emoji: "🌸",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "Blooms in late winter and fills the whole yard with scent. The more it climbs, the more it flowers. Guide it along a trellis and it will reward you for years. The Bay Area climate is close to ideal."
    },
    {
      id: 202,
      nickname: "The Grove",
      commonName: "Bamboo",
      scientific: "Phyllostachys or Fargesia spp.",
      emoji: "🎍",
      lastWatered: null,
      lastFertilized: null,
      notes: "Worth IDing the variety — running vs. clumping matters.",
      blurb: "Bamboo is either a great neighbor or a hostile takeover, depending on the variety. Running bamboo spreads via underground rhizomes. Clumping bamboo stays politely in place. Worth knowing which one you have."
    },
    {
      id: 203,
      nickname: "The Elder",
      commonName: "Japanese Maple",
      scientific: "Acer palmatum",
      emoji: "🍁",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "Slow-growing and ancient-feeling. Prefers morning sun and afternoon shade — the Bay Area's cool coastal climate is close to ideal. Fall color is the reward for patience."
    },
    {
      id: 204,
      nickname: "Sunny",
      commonName: "Lemon Tree",
      scientific: "Citrus limon",
      emoji: "🍋",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "One of the most rewarding things you can grow in California. Full sun, deep infrequent watering, citrus fertilizer three times a year. Yellow leaves usually mean nitrogen deficiency — feed it."
    },
    {
      id: 205,
      nickname: "Pam",
      commonName: "Palm",
      scientific: "Arecaceae spp.",
      emoji: "🌴",
      lastWatered: null,
      lastFertilized: null,
      notes: "",
      blurb: "More cold-sensitive than they look, though most species handle coastal California fine. Fronds going brown from the bottom up is normal aging. Brown from the top down is worth investigating."
    },
  ]
};

const WISHLIST_DEFAULT = [
  {
    id: 301,
    nickname: "The Spire",
    commonName: "Yucca",
    scientific: "Yucca elephantipes",
    emoji: "🗡️",
    notes: "",
    blurb: "Architectural and unfussy. Yuccas want full sun and very little water — they're essentially desert trees. Indoors they can handle bright indirect light. The sword-like leaves make a strong visual statement in a corner."
  },
  {
    id: 302,
    nickname: "The Grande Dame",
    commonName: "Southern Magnolia",
    scientific: "Magnolia grandiflora",
    emoji: "🌷",
    notes: "",
    blurb: "One of the most dramatic flowering trees you can plant. Large, glossy leaves year-round and enormous white flowers in summer with a scent that carries across a whole garden. Slow-growing but worth the wait."
  },
  {
    id: 303,
    nickname: "The Carpet",
    commonName: "Baby Tears",
    scientific: "Soleirolia soleirolii",
    emoji: "💚",
    notes: "",
    blurb: "Tiny, delicate, and surprisingly fast-spreading. Creates a lush green mat that works beautifully around the base of larger plants or trailing out of a hanging pot. Loves humidity and indirect light — a bathroom plant at heart."
  },
  {
    id: 304,
    nickname: "The Crop",
    commonName: "Tomato",
    scientific: "Solanum lycopersicum",
    emoji: "🍅",
    notes: "",
    blurb: "The most satisfying thing to grow. Wants full sun, deep watering, and a stake once it gets going. San Francisco's fog can slow ripening — a south-facing spot against a wall that holds heat is ideal. Cherry varieties do best in cool climates."
  },
  {
    id: 305,
    nickname: "The Italian",
    commonName: "Basil",
    scientific: "Ocimum basilicum",
    emoji: "🌿",
    notes: "",
    blurb: "Needs warmth and full sun — basil is the most cold-sensitive herb you can grow and will sulk in SF fog. Keep it in the warmest spot you have. Pinch flower buds off the moment they appear or the leaves turn bitter."
  },
  {
    id: 306,
    nickname: "The Provençal",
    commonName: "Rosemary",
    scientific: "Salvia rosmarinus",
    emoji: "🪴",
    notes: "",
    blurb: "Practically indestructible in California. Rosemary is native to the Mediterranean, which means it thrives in exactly the Bay Area's dry summers and mild winters. Plant it in full sun, water occasionally, and largely ignore it."
  },
];

const getDaysAgo = (iso) => !iso ? 999 : Math.floor((new Date() - new Date(iso)) / 86400000);

const formatDate = (iso) => {
  if (!iso) return null;
  const d = getDaysAgo(iso);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
};

const getStatus = (iso) => {
  const d = getDaysAgo(iso);
  if (d <= 2) return { color: "#4a7c59", label: "good" };
  if (d <= 6) return { color: "#a0732a", label: "soon" };
  return { color: "#9c3d2e", label: "thirsty" };
};

export default function App() {
  const [canEdit, setCanEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [plants, setPlants] = useState(PLANTS);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("indoor");
  const [openId, setOpenId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [adding, setAdding] = useState(false);
  const [newPlant, setNewPlant] = useState({ nickname: "", commonName: "", scientific: "", emoji: "🌿", blurb: "", notes: "" });
  const [wishlist, setWishlist] = useState(WISHLIST_DEFAULT);
  const [wishOpenId, setWishOpenId] = useState(null);
  const [addingWish, setAddingWish] = useState(false);
  const [newWish, setNewWish] = useState({ nickname: "", commonName: "", scientific: "", emoji: "🌱", blurb: "", notes: "" });
  const [editingPlant, setEditingPlant] = useState(null);
  const [editForm, setEditForm] = useState({});

// Load from Firebase on mount and listen for changes
useEffect(() => {
  const unsubPlants = onSnapshot(doc(db, "data", "plants"), (snap) => {
    if (snap.exists()) setPlants(snap.data());
    setLoaded(true);
  });
  const unsubWishlist = onSnapshot(doc(db, "data", "wishlist"), (snap) => {
    if (snap.exists()) setWishlist(snap.data().list);
  });
  return () => { unsubPlants(); unsubWishlist(); };
}, []);

// Save plants to Firebase whenever they change
useEffect(() => {
  if (!loaded) return;
  setDoc(doc(db, "data", "plants"), plants);
}, [plants, loaded]);

// Save wishlist to Firebase whenever it changes
useEffect(() => {
  if (!loaded) return;
  setDoc(doc(db, "data", "wishlist"), { list: wishlist });
}, [wishlist, loaded]);
  
  const attemptEdit = (action) => {
    if (canEdit) { action(); return; }
    setPendingAction(() => action);
    setShowModal(true);
  };

  const unlock = () => {
    if (pwInput === EDIT_PASSWORD) {
      setCanEdit(true);
      setShowModal(false);
      setPwInput("");
      setPwError(false);
      if (pendingAction) { pendingAction(); setPendingAction(null); }
    } else {
      setPwError(true);
      setPwInput("");
    }
  };

  const logAction = (id, type) => {
    setPlants(prev => ({
      ...prev,
      [tab]: prev[tab].map(p =>
        p.id === id ? { ...p, [type === "water" ? "lastWatered" : "lastFertilized"]: new Date().toISOString() } : p
      )
    }));
  };

  const saveNote = (id) => {
    setPlants(prev => ({
      ...prev,
      [tab]: prev[tab].map(p => p.id === id ? { ...p, notes: noteText } : p)
    }));
    setEditingNote(null);
  };

  const deletePlant = (id) => {
    if (!window.confirm("Remove this plant?")) return;
    setPlants(prev => ({ ...prev, [tab]: prev[tab].filter(p => p.id !== id) }));
    setOpenId(null);
  };

  const startEdit = (plant, isWish = false) => {
    setEditingPlant({ id: plant.id, isWish });
    setEditForm({
      nickname: plant.nickname,
      commonName: plant.commonName,
      scientific: plant.scientific,
      emoji: plant.emoji,
      blurb: plant.blurb || "",
    });
  };

  const saveEdit = () => {
    if (!editForm.nickname.trim()) return;
    if (editingPlant.isWish) {
      setWishlist(prev => prev.map(p => p.id === editingPlant.id ? { ...p, ...editForm } : p));
    } else {
      setPlants(prev => ({
        ...prev,
        [tab]: prev[tab].map(p => p.id === editingPlant.id ? { ...p, ...editForm } : p)
      }));
    }
    setEditingPlant(null);
    setEditForm({});
  };

  const addPlant = () => {
    if (!newPlant.nickname.trim()) return;
    setPlants(prev => ({
      ...prev,
      [tab]: [...prev[tab], { ...newPlant, id: Date.now(), lastWatered: null, lastFertilized: null }]
    }));
    setNewPlant({ nickname: "", commonName: "", scientific: "", emoji: "🌿", blurb: "", notes: "" });
    setAdding(false);
  };
  const current = plants[tab];

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#f7f3ec", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#9a8a72", fontSize: "14px", fontStyle: "italic" }}>
      loading the inventory...
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f3ec; }
        button:focus { outline: none; }
        .card-row { transition: background 0.15s ease; }
        .card-row:hover { background: #f0ebe0 !important; }
        .action-btn:hover { opacity: 0.85; }
        .tab-btn { transition: all 0.2s ease; }
      `}</style>

      {/* Password modal */}
      {showModal && (
        <div style={s.overlay} onClick={() => { setShowModal(false); setPwInput(""); setPwError(false); }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <p style={s.modalRule} />
            <p style={s.modalEyebrow}>restricted access</p>
            <h2 style={s.modalTitle}>The Jungle Inventory</h2>
            <p style={s.modalSub}>Enter the password to log waterings, add plants, or make changes.</p>
            <input
              style={{ ...s.input, ...(pwError ? { borderColor: "#9c3d2e" } : {}) }}
              type="password"
              placeholder="password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && unlock()}
              autoFocus
            />
            {pwError && <p style={s.errMsg}>Incorrect — try again.</p>}
            <button style={s.modalBtn} onClick={unlock}>Unlock</button>
            <p style={s.modalRule2} />
          </div>
        </div>
      )}

      {/* Masthead */}
      <header style={s.masthead}>
        <div style={s.mastheadInner}>
          <div style={s.mastheadTop}>
            <p style={s.mastheadLocation}>Benito's Place · San Francisco</p>
            {canEdit
              ? <span style={s.unlockedTag}>🐉 editing</span>
              : <button style={s.lockBtn} className="action-btn" onClick={() => setShowModal(true)}>Edit</button>
            }
          </div>
          <div style={s.titleBlock}>
            <div style={s.titleRule} />
            <h1 style={s.title}>The Jungle<br />Inventory</h1>
            <div style={s.titleRule} />
          </div>
          <p style={s.mastheadSub}>
            A living record of {plants.indoor.length + plants.outdoor.length} rooted residents · {wishlist.length} on the wishlist
          </p>
        </div>
      </header>

      {/* Tab bar */}
      <div style={s.tabWrap}>
        {["indoor", "outdoor", "wishlist"].map(t => (
          <button
            key={t}
            className="tab-btn"
            style={{ ...s.tab, ...(tab === t ? s.tabOn : s.tabOff) }}
            onClick={() => { setTab(t); setOpenId(null); setWishOpenId(null); setAdding(false); setAddingWish(false); }}
          >
            <span style={s.tabLabel}>{t === "indoor" ? "Indoor" : t === "outdoor" ? "Outdoor" : "Wishlist"}</span>
            <span style={{ ...s.tabCount, ...(tab === t ? s.tabCountOn : {}) }}>
              {t === "indoor" ? `${plants.indoor.length} specimens` : t === "outdoor" ? `${plants.outdoor.length} specimens` : `${wishlist.length} plants`}
            </span>
          </button>
        ))}
      </div>

      {/* Plant list — only shown on indoor/outdoor tabs */}
      {tab !== "wishlist" && (
      <div style={s.listWrap}>
        {current.map((plant, index) => {
          const ws = getStatus(plant.lastWatered);
          const isOpen = openId === plant.id;
          return (
            <div key={plant.id} style={s.entry}>

              {/* Entry number + divider */}
              <div style={s.entryMeta}>
                <span style={s.entryNum}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div style={s.entryLine} />
              </div>

              {/* Main card row */}
              <div
                className="card-row"
                style={s.cardRow}
                onClick={() => setOpenId(isOpen ? null : plant.id)}
              >
                <div style={s.cardMain}>
                  <span style={s.plantEmoji}>{plant.emoji}</span>
                  <div style={s.cardNames}>
                    <h2 style={s.nickname}>{plant.nickname}</h2>
                    <p style={s.commonName}>{plant.commonName}</p>
                    <p style={s.scientific}>{plant.scientific}</p>
                  </div>
                </div>
                <div style={s.cardRight}>
                  <span style={{ ...s.statusDot, color: ws.color }}>● {ws.label}</span>
                  <span style={s.chevron}>{isOpen ? "↑" : "↓"}</span>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div style={s.body}>

                  {/* Inline edit form */}
                  {canEdit && editingPlant?.id === plant.id && !editingPlant.isWish ? (
                    <div style={s.editFormWrap}>
                      <p style={s.editFormLabel}>Editing {plant.nickname}</p>
                      <div style={s.addTopRow}>
                        <input style={{ ...s.input, width: "52px", textAlign: "center", flexShrink: 0, padding: "10px 6px" }} value={editForm.emoji} onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))} />
                        <input style={{ ...s.input, flex: 1 }} value={editForm.nickname} onChange={e => setEditForm(f => ({ ...f, nickname: e.target.value }))} placeholder="Nickname" />
                      </div>
                      <input style={s.input} value={editForm.commonName} onChange={e => setEditForm(f => ({ ...f, commonName: e.target.value }))} placeholder="Common name" />
                      <input style={s.input} value={editForm.scientific} onChange={e => setEditForm(f => ({ ...f, scientific: e.target.value }))} placeholder="Scientific name" />
                      <textarea style={s.textarea} value={editForm.blurb} rows={3} onChange={e => setEditForm(f => ({ ...f, blurb: e.target.value }))} placeholder="About this plant..." />
                      <div style={s.miniRow}>
                        <button style={s.saveBtn} onClick={saveEdit}>Save changes</button>
                        <button style={s.ghostBtn} onClick={() => setEditingPlant(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                  {plant.blurb && (
                    <p style={s.blurb}>{plant.blurb}</p>
                  )}

                  <div style={s.logStrip}>
                    <div style={s.logItem}>
                      <p style={s.logLabel}>Last watered</p>
                      <p style={s.logVal}>{formatDate(plant.lastWatered) || "—"}</p>
                    </div>
                    <div style={s.logDivider} />
                    <div style={s.logItem}>
                      <p style={s.logLabel}>Last fertilized</p>
                      <p style={s.logVal}>{formatDate(plant.lastFertilized) || "—"}</p>
                    </div>
                  </div>

                  <div style={s.actionRow}>
                    <button
                      className="action-btn"
                      style={s.waterBtn}
                      onClick={() => attemptEdit(() => logAction(plant.id, "water"))}
                    >
                      💧 Log watering
                    </button>
                    <button
                      className="action-btn"
                      style={s.fertBtn}
                      onClick={() => attemptEdit(() => logAction(plant.id, "fertilize"))}
                    >
                      🌱 Log fertilizer
                    </button>
                  </div>

                  {editingNote === plant.id ? (
                    <div style={s.noteEditWrap}>
                      <textarea
                        style={s.textarea}
                        value={noteText}
                        rows={3}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add a field note..."
                      />
                      <div style={s.miniRow}>
                        <button style={s.saveBtn} onClick={() => saveNote(plant.id)}>Save note</button>
                        <button style={s.ghostBtn} onClick={() => setEditingNote(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={s.noteRow}
                      onClick={() => attemptEdit(() => { setEditingNote(plant.id); setNoteText(plant.notes || ""); })}
                    >
                      <p style={s.noteLabel}>Field notes</p>
                      <p style={s.noteText}>{plant.notes || "None recorded. Tap to add."}</p>
                      <span style={s.editMark}>✎</span>
                    </div>
                  )}

                  {canEdit && (
                    <div style={s.cardActions}>
                      <button style={s.editPlantBtn} onClick={() => startEdit(plant)}>
                        Edit plant details
                      </button>
                      <button style={s.deleteBtn} onClick={() => deletePlant(plant.id)}>
                        Remove from inventory
                      </button>
                    </div>
                  )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Add plant — only on indoor/outdoor */}
      {tab !== "wishlist" && canEdit && !adding && (
        <div style={s.addWrap}>
          <button style={s.addBtn} className="action-btn" onClick={() => setAdding(true)}>
            + Add to inventory
          </button>
        </div>
      )}

      {tab !== "wishlist" && canEdit && adding && (
        <div style={s.addCard}>
          <p style={s.addLabel}>New {tab} specimen</p>
          <div style={s.addTopRow}>
            <input
              style={{ ...s.input, width: "52px", textAlign: "center", flexShrink: 0, padding: "10px 6px" }}
              value={newPlant.emoji}
              onChange={e => setNewPlant(p => ({ ...p, emoji: e.target.value }))}
              placeholder="🌿"
            />
            <input
              style={{ ...s.input, flex: 1 }}
              value={newPlant.nickname}
              onChange={e => setNewPlant(p => ({ ...p, nickname: e.target.value }))}
              placeholder="Nickname"
              autoFocus
            />
          </div>
          <input style={s.input} value={newPlant.commonName} onChange={e => setNewPlant(p => ({ ...p, commonName: e.target.value }))} placeholder="Common name" />
          <input style={s.input} value={newPlant.scientific} onChange={e => setNewPlant(p => ({ ...p, scientific: e.target.value }))} placeholder="Scientific name" />
          <textarea style={s.textarea} value={newPlant.blurb} rows={2} onChange={e => setNewPlant(p => ({ ...p, blurb: e.target.value }))} placeholder="About this plant..." />
          <div style={s.miniRow}>
            <button style={s.saveBtn} onClick={addPlant}>Add specimen</button>
            <button style={s.ghostBtn} onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Wishlist tab */}
      {tab === "wishlist" && (
        <div style={s.listWrap}>
          <div style={{ ...s.entryMeta, paddingTop: "24px" }}>
            <span style={{ ...s.entryNum, fontStyle: "normal", letterSpacing: "0.15em" }}>WANTED</span>
            <div style={s.entryLine} />
          </div>
          <p style={s.wishIntro}>Plants earmarked for future acquisition. In no particular order of urgency.</p>

          {wishlist.map((plant, index) => {
            const isOpen = wishOpenId === plant.id;
            return (
              <div key={plant.id} style={s.entry}>
                <div style={s.entryMeta}>
                  <span style={s.entryNum}>{String(index + 1).padStart(2, "0")}</span>
                  <div style={s.entryLine} />
                </div>
                <div
                  className="card-row"
                  style={{ ...s.cardRow, borderLeft: "3px solid #c8bea8" }}
                  onClick={() => setWishOpenId(isOpen ? null : plant.id)}
                >
                  <div style={s.cardMain}>
                    <span style={s.plantEmoji}>{plant.emoji}</span>
                    <div style={s.cardNames}>
                      <h2 style={s.nickname}>{plant.nickname}</h2>
                      <p style={s.commonName}>{plant.commonName}</p>
                      <p style={s.scientific}>{plant.scientific}</p>
                    </div>
                  </div>
                  <div style={s.cardRight}>
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "10px", color: "#9a8a72", letterSpacing: "0.1em", textTransform: "uppercase" }}>wanted</span>
                    <span style={s.chevron}>{isOpen ? "↑" : "↓"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={s.body}>

                    {/* Inline edit form for wishlist */}
                    {canEdit && editingPlant?.id === plant.id && editingPlant.isWish ? (
                      <div style={s.editFormWrap}>
                        <p style={s.editFormLabel}>Editing {plant.nickname}</p>
                        <div style={s.addTopRow}>
                          <input style={{ ...s.input, width: "52px", textAlign: "center", flexShrink: 0, padding: "10px 6px" }} value={editForm.emoji} onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))} />
                          <input style={{ ...s.input, flex: 1 }} value={editForm.nickname} onChange={e => setEditForm(f => ({ ...f, nickname: e.target.value }))} placeholder="Nickname" />
                        </div>
                        <input style={s.input} value={editForm.commonName} onChange={e => setEditForm(f => ({ ...f, commonName: e.target.value }))} placeholder="Common name" />
                        <input style={s.input} value={editForm.scientific} onChange={e => setEditForm(f => ({ ...f, scientific: e.target.value }))} placeholder="Scientific name" />
                        <textarea style={s.textarea} value={editForm.blurb} rows={3} onChange={e => setEditForm(f => ({ ...f, blurb: e.target.value }))} placeholder="About this plant..." />
                        <div style={s.miniRow}>
                          <button style={s.saveBtn} onClick={saveEdit}>Save changes</button>
                          <button style={s.ghostBtn} onClick={() => setEditingPlant(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                    {plant.blurb && <p style={s.blurb}>{plant.blurb}</p>}
                    <div
                      style={s.noteRow}
                      onClick={() => attemptEdit(() => {
                        setEditingNote(`wish-${plant.id}`);
                        setNoteText(plant.notes || "");
                      })}
                    >
                      <p style={s.noteLabel}>Notes</p>
                      <p style={s.noteText}>{plant.notes || "None recorded. Tap to add."}</p>
                      <span style={s.editMark}>✎</span>
                    </div>
                    {editingNote === `wish-${plant.id}` && (
                      <div style={s.noteEditWrap}>
                        <textarea
                          style={s.textarea}
                          value={noteText}
                          rows={3}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Add a note..."
                        />
                        <div style={s.miniRow}>
                          <button style={s.saveBtn} onClick={() => {
                            setWishlist(prev => prev.map(p => p.id === plant.id ? { ...p, notes: noteText } : p));
                            setEditingNote(null);
                          }}>Save note</button>
                          <button style={s.ghostBtn} onClick={() => setEditingNote(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                    {canEdit && (
                      <div style={s.cardActions}>
                        <button style={s.editPlantBtn} onClick={() => startEdit(plant, true)}>
                          Edit plant details
                        </button>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            style={{ ...s.saveBtn, fontSize: "11px", padding: "8px 14px" }}
                            onClick={() => attemptEdit(() => {
                              setPlants(prev => ({ ...prev, indoor: [...prev.indoor, { ...plant, lastWatered: null, lastFertilized: null }] }));
                              setWishlist(prev => prev.filter(p => p.id !== plant.id));
                              setWishOpenId(null);
                              setTab("indoor");
                            })}
                          >
                            Move to indoor
                          </button>
                          <button
                            style={{ ...s.ghostBtn, fontSize: "11px", padding: "8px 14px" }}
                            onClick={() => attemptEdit(() => {
                              setPlants(prev => ({ ...prev, outdoor: [...prev.outdoor, { ...plant, lastWatered: null, lastFertilized: null }] }));
                              setWishlist(prev => prev.filter(p => p.id !== plant.id));
                              setWishOpenId(null);
                              setTab("outdoor");
                            })}
                          >
                            Move to outdoor
                          </button>
                          <button style={s.deleteBtn} onClick={() => attemptEdit(() => {
                            if (window.confirm("Remove from wishlist?")) {
                              setWishlist(prev => prev.filter(p => p.id !== plant.id));
                              setWishOpenId(null);
                            }
                          })}>Remove</button>
                        </div>
                      </div>
                    )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {canEdit && !addingWish && (
            <div style={{ ...s.addWrap, padding: "16px 0 0" }}>
              <button style={s.addBtn} className="action-btn" onClick={() => setAddingWish(true)}>
                + Add to wishlist
              </button>
            </div>
          )}

          {canEdit && addingWish && (
            <div style={{ ...s.addCard, marginTop: "16px", marginLeft: 0, marginRight: 0 }}>
              <p style={s.addLabel}>New wishlist plant</p>
              <div style={s.addTopRow}>
                <input
                  style={{ ...s.input, width: "52px", textAlign: "center", flexShrink: 0, padding: "10px 6px" }}
                  value={newWish.emoji}
                  onChange={e => setNewWish(p => ({ ...p, emoji: e.target.value }))}
                  placeholder="🌱"
                />
                <input
                  style={{ ...s.input, flex: 1 }}
                  value={newWish.nickname}
                  onChange={e => setNewWish(p => ({ ...p, nickname: e.target.value }))}
                  placeholder="Nickname"
                  autoFocus
                />
              </div>
              <input style={s.input} value={newWish.commonName} onChange={e => setNewWish(p => ({ ...p, commonName: e.target.value }))} placeholder="Common name" />
              <input style={s.input} value={newWish.scientific} onChange={e => setNewWish(p => ({ ...p, scientific: e.target.value }))} placeholder="Scientific name" />
              <textarea style={s.textarea} value={newWish.blurb} rows={2} onChange={e => setNewWish(p => ({ ...p, blurb: e.target.value }))} placeholder="About this plant..." />
              <div style={s.miniRow}>
                <button style={s.saveBtn} onClick={() => {
                  if (!newWish.nickname.trim()) return;
                  setWishlist(prev => [...prev, { ...newWish, id: Date.now(), notes: "" }]);
                  setNewWish({ nickname: "", commonName: "", scientific: "", emoji: "🌱", blurb: "", notes: "" });
                  setAddingWish(false);
                }}>Add to wishlist</button>
                <button style={s.ghostBtn} onClick={() => setAddingWish(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canEdit && (
        <p style={s.readOnly}>
          Viewing in read-only mode —{" "}
          <span style={{ borderBottom: "1px solid #9a8a72", cursor: "pointer", paddingBottom: "1px" }} onClick={() => setShowModal(true)}>
            unlock to edit
          </span>
        </p>
      )}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerRule} />
        <p style={s.footerText}>The Jungle Inventory · Ben's Place · San Francisco</p>
      </footer>
    </div>
  );
}

const FONT_DISPLAY = "'Playfair Display', 'Georgia', serif";
const FONT_BODY = "'EB Garamond', 'Georgia', serif";

const s = {
  page: {
    minHeight: "100vh",
    background: "#f7f3ec",
    fontFamily: FONT_BODY,
    maxWidth: "680px",
    margin: "0 auto",
    paddingBottom: "40px",
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(18, 15, 10, 0.65)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 50, padding: "20px",
    backdropFilter: "blur(3px)",
  },
  modal: {
    background: "#f7f3ec",
    border: "1px solid #c8bea8",
    padding: "40px 36px",
    width: "100%", maxWidth: "360px",
    textAlign: "center",
  },
  modalRule: {
    display: "block", height: "2px",
    background: "#2c2416",
    marginBottom: "24px",
  },
  modalRule2: {
    display: "block", height: "1px",
    background: "#c8bea8",
    marginTop: "24px",
  },
  modalEyebrow: {
    fontFamily: FONT_BODY,
    fontSize: "10px", letterSpacing: "0.2em",
    textTransform: "uppercase", color: "#9a8a72",
    marginBottom: "8px",
  },
  modalTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: "26px", color: "#2c2416",
    fontWeight: 400, marginBottom: "12px",
    lineHeight: 1.2,
  },
  modalSub: {
    fontFamily: FONT_BODY,
    fontSize: "14px", color: "#6a5e4a",
    marginBottom: "24px", lineHeight: 1.6,
    fontStyle: "italic",
  },
  modalBtn: {
    width: "100%", padding: "13px",
    background: "#2c2416", color: "#f0ebe0",
    border: "none", cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "14px",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },
  errMsg: {
    fontFamily: FONT_BODY,
    color: "#9c3d2e", fontSize: "13px",
    margin: "-12px 0 14px", fontStyle: "italic",
  },

  // Masthead
  masthead: {
    background: "#2c2416",
    padding: "0",
  },
  mastheadInner: {
    padding: "32px 24px 28px",
  },
  mastheadTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px",
  },
  mastheadLocation: {
    fontFamily: FONT_BODY,
    fontSize: "11px", color: "#7a6a52",
    letterSpacing: "0.15em", textTransform: "uppercase",
  },
  lockBtn: {
    padding: "6px 16px",
    background: "transparent",
    border: "1px solid #5a4e3a",
    color: "#9a8a6a",
    cursor: "pointer",
    fontFamily: FONT_BODY,
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  unlockedTag: {
    fontFamily: FONT_BODY,
    fontSize: "12px", color: "#7a6a52",
    fontStyle: "italic",
  },
  titleBlock: {
    marginBottom: "20px",
  },
  titleRule: {
    height: "1px", background: "#5a4e3a",
    marginBottom: "16px",
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: "clamp(36px, 8vw, 56px)",
    color: "#f0ebe0",
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    marginBottom: "16px",
  },
  mastheadSub: {
    fontFamily: FONT_BODY,
    fontSize: "13px", color: "#7a6a52",
    fontStyle: "italic",
  },

  // Tabs
  tabWrap: {
    display: "flex",
    borderBottom: "2px solid #2c2416",
    background: "#f0ebe0",
  },
  tab: {
    flex: 1, padding: "16px 20px",
    border: "none", cursor: "pointer",
    fontFamily: FONT_BODY,
    display: "flex", flexDirection: "column",
    alignItems: "flex-start", gap: "2px",
    borderRight: "1px solid #d8d0c0",
  },
  tabOn: { background: "#f7f3ec", borderBottom: "2px solid #f7f3ec", marginBottom: "-2px" },
  tabOff: { background: "#f0ebe0" },
  tabLabel: {
    fontSize: "15px", color: "#2c2416",
    letterSpacing: "0.02em",
  },
  tabCount: {
    fontSize: "10px", color: "#9a8a72",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },
  tabCountOn: { color: "#6a5e4a" },

  // List
  listWrap: {
    padding: "0 20px",
    marginTop: "8px",
  },

  // Entry
  entry: {
    paddingTop: "24px",
  },
  entryMeta: {
    display: "flex", alignItems: "center", gap: "12px",
    marginBottom: "12px",
  },
  entryNum: {
    fontFamily: FONT_DISPLAY,
    fontSize: "11px", color: "#b0a088",
    letterSpacing: "0.1em", flexShrink: 0,
    fontStyle: "italic",
  },
  entryLine: {
    flex: 1, height: "1px",
    background: "#ddd6c8",
  },

  // Card row
  cardRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", cursor: "pointer",
    padding: "16px 14px",
    background: "#faf7f2",
    border: "1px solid #ddd6c8",
    gap: "12px",
  },
  cardMain: {
    display: "flex", alignItems: "flex-start",
    gap: "14px", flex: 1, minWidth: 0,
  },
  plantEmoji: { fontSize: "24px", lineHeight: 1, flexShrink: 0, marginTop: "2px" },
  cardNames: { flex: 1, minWidth: 0 },
  nickname: {
    fontFamily: FONT_DISPLAY,
    fontSize: "20px", color: "#2c2416",
    fontWeight: 400, marginBottom: "3px",
    lineHeight: 1.2,
  },
  commonName: {
    fontFamily: FONT_BODY,
    fontSize: "13px", color: "#6a5e4a",
    marginBottom: "2px",
  },
  scientific: {
    fontFamily: FONT_BODY,
    fontSize: "11px", color: "#9a8a72",
    fontStyle: "italic",
  },
  cardRight: {
    display: "flex", flexDirection: "column",
    alignItems: "flex-end", gap: "8px",
    flexShrink: 0,
  },
  statusDot: {
    fontFamily: FONT_BODY,
    fontSize: "11px", letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  chevron: {
    fontSize: "14px", color: "#9a8a72",
    fontFamily: FONT_BODY,
  },

  // Body
  body: {
    padding: "20px 14px 24px",
    background: "#fff",
    border: "1px solid #ddd6c8",
    borderTop: "none",
  },
  blurb: {
    fontFamily: FONT_BODY,
    fontSize: "15px", color: "#4a3e2e",
    lineHeight: 1.8, marginBottom: "20px",
    fontStyle: "italic",
    borderLeft: "2px solid #c8bea8",
    paddingLeft: "14px",
  },
  logStrip: {
    display: "flex", gap: "0",
    marginBottom: "18px",
    border: "1px solid #ddd6c8",
  },
  logItem: {
    flex: 1, padding: "12px 14px",
  },
  logDivider: {
    width: "1px", background: "#ddd6c8", flexShrink: 0,
  },
  logLabel: {
    fontFamily: FONT_BODY,
    fontSize: "10px", color: "#9a8a72",
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: "4px",
  },
  logVal: {
    fontFamily: FONT_DISPLAY,
    fontSize: "15px", color: "#4a6741",
    fontStyle: "italic",
  },
  actionRow: {
    display: "flex", gap: "8px",
    marginBottom: "16px",
  },
  waterBtn: {
    flex: 1, padding: "11px 8px",
    background: "#f0f7ff",
    border: "1px solid #c0d4e8",
    cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "13px",
    color: "#2c2416", letterSpacing: "0.02em",
  },
  fertBtn: {
    flex: 1, padding: "11px 8px",
    background: "#f0f7f0",
    border: "1px solid #b8d4b8",
    cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "13px",
    color: "#2c2416", letterSpacing: "0.02em",
  },
  noteRow: {
    padding: "14px",
    background: "#faf7f2",
    border: "1px solid #ddd6c8",
    cursor: "pointer",
    marginBottom: "12px",
    position: "relative",
  },
  noteLabel: {
    fontFamily: FONT_BODY,
    fontSize: "10px", color: "#9a8a72",
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: "6px",
  },
  noteText: {
    fontFamily: FONT_BODY,
    fontSize: "14px", color: "#4a3e2e",
    fontStyle: "italic", lineHeight: 1.6,
    paddingRight: "20px",
  },
  editMark: {
    position: "absolute", top: "14px", right: "14px",
    fontSize: "13px", color: "#9a8a72",
  },
  noteEditWrap: { marginBottom: "12px" },
  editFormWrap: {
    padding: "4px 0 8px",
  },
  editFormLabel: {
    fontFamily: FONT_DISPLAY,
    fontSize: "14px", color: "#4a3e2e",
    fontStyle: "italic", marginBottom: "14px",
  },
  cardActions: {
    display: "flex", flexDirection: "column", gap: "10px",
    marginTop: "4px",
  },
  editPlantBtn: {
    background: "none", border: "none",
    color: "#4a6741", fontSize: "12px",
    cursor: "pointer", fontFamily: FONT_BODY,
    fontStyle: "italic", padding: "4px 0",
    letterSpacing: "0.05em", textTransform: "uppercase",
    textAlign: "left",
  },
  deleteBtn: {
    background: "none", border: "none",
    color: "#9c3d2e", fontSize: "11px",
    cursor: "pointer", fontFamily: FONT_BODY,
    fontStyle: "italic", padding: "4px 0",
    opacity: 0.7, letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  // Forms
  input: {
    width: "100%", padding: "11px 13px",
    border: "1px solid #c8bea8",
    background: "#faf7f2",
    fontSize: "14px", fontFamily: FONT_BODY,
    color: "#2c2416",
    boxSizing: "border-box", outline: "none",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%", padding: "11px 13px",
    border: "1px solid #c8bea8",
    background: "#faf7f2",
    fontSize: "14px", fontFamily: FONT_BODY,
    color: "#2c2416",
    boxSizing: "border-box", outline: "none",
    resize: "vertical", marginBottom: "10px",
    fontStyle: "italic",
  },
  miniRow: { display: "flex", gap: "8px" },
  saveBtn: {
    padding: "10px 22px",
    background: "#2c2416", color: "#f0ebe0",
    border: "none", cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "13px",
    letterSpacing: "0.08em", textTransform: "uppercase",
  },
  ghostBtn: {
    padding: "10px 22px",
    background: "transparent", color: "#6a5e4a",
    border: "1px solid #c8bea8", cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "13px",
    letterSpacing: "0.08em", textTransform: "uppercase",
  },

  // Add
  wishIntro: {
    fontFamily: FONT_BODY,
    fontSize: "13px", color: "#9a8a72",
    fontStyle: "italic", marginBottom: "8px",
    paddingTop: "4px",
  },
  addWrap: { padding: "8px 20px 0" },
  addBtn: {
    width: "100%", padding: "15px",
    background: "transparent",
    border: "1px solid #2c2416",
    color: "#2c2416", cursor: "pointer",
    fontFamily: FONT_BODY, fontSize: "13px",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },
  addCard: {
    margin: "16px 20px 0",
    padding: "24px",
    background: "#faf7f2",
    border: "1px solid #c8bea8",
  },
  addLabel: {
    fontFamily: FONT_DISPLAY,
    fontSize: "16px", color: "#4a3e2e",
    fontStyle: "italic", marginBottom: "16px",
  },
  addTopRow: { display: "flex", gap: "8px" },

  // Footer
  footer: { padding: "40px 20px 20px" },
  footerRule: { height: "1px", background: "#c8bea8", marginBottom: "16px" },
  footerText: {
    fontFamily: FONT_BODY,
    fontSize: "10px", color: "#9a8a72",
    letterSpacing: "0.15em", textTransform: "uppercase",
    textAlign: "center",
  },

  // Read only
  readOnly: {
    textAlign: "center", color: "#9a8a72",
    fontSize: "12px", fontStyle: "italic",
    marginTop: "20px", fontFamily: FONT_BODY,
    letterSpacing: "0.05em",
  },
};
