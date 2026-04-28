/**
 * ============================================================
 *  REACT MASTER REFERENCE PAGE
 *  Covers: JSX, Props, State, Hooks, Context, Refs,
 *          Lifecycle, Custom Hooks, HOC, Error Boundaries,
 *          useReducer, useMemo, useCallback, Portals, Lazy/Suspense
 * ============================================================
 */

import {
  useState,          // Manages local component state
  useEffect,         // Side effects (data fetch, subscriptions, DOM)
  useContext,        // Consume Context values
  useReducer,        // State management for complex logic (Redux-like)
  useRef,            // Mutable ref to DOM nodes or values
  useMemo,           // Memoize expensive computed values
  useCallback,       // Memoize callback functions
  createContext,     // Create a Context object
  Component,         // Class component base
  lazy,              // Lazy load components
  Suspense,          // Fallback while lazy component loads
  memo,              // Prevent re-renders if props unchanged
  forwardRef,        // Pass refs through to child DOM nodes
  createPortal,      // Render outside current DOM tree
} from "react";

// ─── FONTS (Google Fonts via @import) ────────────────────────────────────────
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
`;

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const lightVars = `
  --bg: #f5f5f7; --surface: #ffffff; --card: #ffffff; --border: #d1d1e0;
  --accent: #5b4fcf; --accent2: #e8366b; --accent3: #0fa86e;
  --text: #1a1a2e; --muted: #6b6b8a; --code: #b5460f;
`;
const darkVars = `
  --bg: #0a0a0f; --surface: #13131a; --card: #1a1a24; --border: #2a2a3a;
  --accent: #7c6af7; --accent2: #f76a8c; --accent3: #6af7c8;
  --text: #e8e8f0; --muted: #7070a0; --code: #f0e68c;
`;

const globalStyle = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --radius: 12px;
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Syne', sans-serif;
  }
  :root[data-theme="light"] { ${lightVars} }
  :root[data-theme="dark"]  { ${darkVars}  }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    line-height: 1.6;
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; opacity: 0.6; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes pulse  { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes slide  { from { transform: translateX(-12px); opacity: 0; } to { transform: none; opacity: 1; } }

  .fade-in   { animation: fadeIn .5s ease both; }
  .slide-in  { animation: slide .4s ease both; }

  /* Section wrapper */
  .section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    margin-bottom: 24px;
    animation: fadeIn .5s ease both;
  }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
  }
  .section-heading {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 16px;
    color: var(--text);
  }
  .tag {
    display: inline-block;
    background: rgba(124,106,247,.15);
    color: var(--accent);
    border: 1px solid rgba(124,106,247,.3);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 2px 8px;
    margin: 2px;
  }
  .tag.green  { background: rgba(106,247,200,.1); color: var(--accent3); border-color: rgba(106,247,200,.3); }
  .tag.pink   { background: rgba(247,106,140,.1); color: var(--accent2); border-color: rgba(247,106,140,.3); }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    padding: 9px 18px; border-radius: 8px; font-family: var(--font-display);
    font-size: 13px; font-weight: 700; transition: all .2s;
  }
  .btn:hover   { background: #9b8df9; transform: translateY(-1px); }
  .btn.ghost   { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn.ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn.danger  { background: var(--accent2); }
  .btn.success { background: var(--accent3); color: #ffffff; }
  .mono { font-family: var(--font-mono); font-size: 12px; color: var(--code); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .flex { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .badge {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 4px 10px; font-size: 12px; color: var(--muted);
  }
  .input {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); border-radius: 8px; padding: 8px 12px;
    font-family: var(--font-display); font-size: 13px; outline: none;
    transition: border-color .2s; width: 100%;
  }
  .input:focus { border-color: var(--accent); }
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .note {
    background: rgba(124,106,247,.08);
    border-left: 3px solid var(--accent);
    padding: 10px 14px; border-radius: 0 8px 8px 0;
    font-size: 13px; color: var(--muted); margin: 12px 0;
  }
  .todo-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 8px; background: var(--surface);
    border: 1px solid var(--border); margin-bottom: 8px; transition: all .2s;
  }
  .todo-item.done span { text-decoration: line-through; color: var(--muted); }
  .progress-bar {
    background: var(--surface); border-radius: 99px; height: 8px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    transition: width .4s ease;
  }
  @media (max-width: 640px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }
`;

// ═══════════════════════════════════════════════════════════════
// 1️⃣  CONTEXT — Global state accessible anywhere in the tree
// ═══════════════════════════════════════════════════════════════

/** createContext creates a context object with an optional default value */
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });
const UserContext  = createContext(null);

// ═══════════════════════════════════════════════════════════════
// 2️⃣  REDUCER — Predictable state transitions (like Redux)
// ══════════════════════════════════════════

/**
 * A pure function: (state, action) => newState
 * NEVER mutate state directly; always return a new object.
 */
const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    default:
      return state; // Always have a default case
  }
};

// ═══════════════════════════════════════════════════════════════
// 3️⃣  CUSTOM HOOK — Reusable stateful logic extracted into a function
// ═══════════════════════════════════════════════════════════════

/**
 * Custom hooks start with "use" and can call other hooks.
 * They let you share logic without sharing UI.
 */
function useCounter(initial = 0, step = 1) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount(c => c + step), [step]);
  const decrement = useCallback(() => setCount(c => c - step), [step]);
  const reset     = useCallback(() => setCount(initial),       [initial]);
  return { count, increment, decrement, reset };
}

/** Custom hook that persists state to localStorage */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]); // Runs whenever key or value changes

  return [value, setValue];
}

/** Custom hook for debounced value */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // Cleanup on every change
  }, [value, delay]);
  return debounced;
}

// ═══════════════════════════════════════════════════════════════
// 4️⃣  HIGHER-ORDER COMPONENT (HOC) — Wraps a component to add behavior
// ═══════════════════════════════════════════════════════════════

/**
 * HOC: A function that takes a component and returns a new enhanced component.
 * Used for cross-cutting concerns: logging, auth-guard, analytics, etc.
 */
function withBadge(WrappedComponent, label) {
  // Returns a new component
  return function WithBadgeComponent(props) {
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <WrappedComponent {...props} />
        {/* Spread original props to avoid losing them */}
        <span style={{
          position: "absolute", top: -8, right: -8,
          background: "var(--accent2)", color: "#fff",
          borderRadius: "99px", fontSize: 9, fontWeight: 700,
          padding: "2px 6px", fontFamily: "var(--font-mono)",
        }}>
          {label}
        </span>
      </div>
    );
  };
}

// ═══════════════════════════════════════════════════════════════
// 5️⃣  CLASS COMPONENT — The legacy (pre-hooks) way; still valid
// ═══════════════════════════════════════════════════════════════

class ClassCounter extends Component {
  // State is an object in class components
  state = { count: 0, mounted: false };

  // Lifecycle: runs after component mounts to the DOM
  componentDidMount() {
    this.setState({ mounted: true });
  }

  // Lifecycle: runs after props/state change
  componentDidUpdate(prevProps, prevState) {
    // Compare to prevent infinite loops
    if (prevState.count !== this.state.count) {
      // Could do side-effects here
    }
  }

  // Lifecycle: runs just before component is removed from DOM
  componentWillUnmount() {
    // Cleanup: cancel timers, subscriptions, etc.
  }

  render() {
    const { count, mounted } = this.state;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Mounted: <span className="mono">{String(mounted)}</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>
          {count}
        </div>
        <div className="flex">
          <button className="btn ghost" onClick={() => this.setState({ count: count - 1 })}>−</button>
          <button className="btn" onClick={() => this.setState({ count: count + 1 })}>+</button>
          <button className="btn ghost" onClick={() => this.setState({ count: 0 })}>Reset</button>
        </div>
      </div>
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// 6️⃣  ERROR BOUNDARY — Catches JS errors in child component tree
// ═══════════════════════════════════════════════════════════════

/**
 * Error Boundaries MUST be class components.
 * They catch errors during: render, lifecycle methods, constructors of children.
 */
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  // Called when a descendant throws; update state to show fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after an error has been thrown; use for logging
  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 16, borderRadius: 8, background: "rgba(247,106,140,.1)",
          border: "1px solid rgba(247,106,140,.3)", color: "var(--accent2)"
        }}>
          ⚠️ Something went wrong: <span className="mono">{this.state.error?.message}</span>
          <br />
          <button
            className="btn danger"
            style={{ marginTop: 10, fontSize: 12 }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// A component that intentionally throws for demo
function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) throw new Error("Intentional crash for demo!");
  return <div style={{ color: "var(--accent3)", fontSize: 13 }}>✅ Component rendered safely.</div>;
}

// ═══════════════════════════════════════════════════════════════
// 7️⃣  forwardRef — Pass a ref from parent into a child component's DOM node
// ═══════════════════════════════════════════════════════════════

/**
 * forwardRef lets a parent access a child's DOM node via ref.
 * Common use: focus management, animations, measuring dimensions.
 */
const FancyInput = forwardRef(function FancyInput({ placeholder, label }, ref) {
  return (
    <div>
      {label && (
        <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 4 }}>
          {label}
        </label>
      )}
      <input
        ref={ref}   // Attach forwarded ref to the actual DOM input
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════
// 8️⃣  MEMO — Prevents functional component re-render if props didn't change
// ═══════════════════════════════════════════════════════════════

/**
 * React.memo does a shallow comparison of props.
 * Wrap pure presentational components that receive stable props.
 */
const StatCard = memo(function StatCard({ label, value, color, renderCount }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "14px 16px",
    }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || "var(--accent)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
        renders: <span className="mono">{renderCount}</span>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════
// 9️⃣  LAZY + SUSPENSE — Code-split and defer loading of components
// ═══════════════════════════════════════════════════════════════

/**
 * lazy() + Suspense simulate dynamic import/code splitting.
 * In real apps: const LazyPage = lazy(() => import('./HeavyPage'))
 * Here we fake it with a timer-based Promise.
 */
const LazyChart = lazy(() =>
  new Promise(resolve =>
    setTimeout(() =>
      resolve({
        default: function FakeChart() {
          return (
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                Fake Bar Chart (lazy loaded after 1.5s)
              </div>
              {[65, 40, 88, 55, 72, 33, 90].map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 0 }}>
                  <div style={{
                    width: 28, height: h * 0.8,
                    background: `hsl(${200 + i * 20}, 70%, 60%)`,
                    borderRadius: "4px 4px 0 0",
                    transition: "height .4s ease",
                    animation: `fadeIn .3s ${i * 0.08}s ease both`,
                  }} />
                </div>
              )).reduce((acc, bar) => [...acc, bar], [])}
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                Mon  Tue  Wed  Thu  Fri  Sat  Sun
              </div>
            </div>
          );
        }
      }), 1500)
  )
);

// ═══════════════════════════════════════════════════════════════
// 🔟  PORTAL — Render a child component outside its parent DOM node
// ═══════════════════════════════════════════════════════════════

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  /**
   * createPortal(children, domNode)
   * Renders `children` into `domNode` which is OUTSIDE React's root.
   * Perfect for modals, tooltips, dropdowns — avoids z-index/overflow issues.
   */
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()} // Prevent close when clicking inside
        style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 28, maxWidth: 400, width: "90%",
          animation: "fadeIn .25s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Portal Modal</span>
          <button className="btn ghost" style={{ padding: "4px 10px" }} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body  // Mount into <body>, outside the React root
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT — Ties everything together
// ═══════════════════════════════════════════════════════════════

export default function ReactMasterPage() {
  // ── useState ──────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage("app-theme", "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  const [activeTab, setActiveTab]       = useState("hooks");
  const [searchText, setSearchText]     = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [shouldThrow, setShouldThrow]   = useState(false);
  const [lazyVisible, setLazyVisible]   = useState(false);
  const [renderCount, setRenderCount]   = useState(0);
  const [memoValue, setMemoValue]       = useState(42);

  // ── Custom hooks ──────────────────────────────────────────
  const { count, increment, decrement, reset } = useCounter(0, 1);
  const [notes, setNotes]   = useLocalStorage("react-demo-notes", "");
  const debouncedSearch     = useDebounce(searchText, 500);

  // ── useReducer ────────────────────────────────────────────
  const [todos, dispatch]   = useReducer(todoReducer, [
    { id: 1, text: "Learn useState",    done: true },
    { id: 2, text: "Learn useEffect",   done: true },
    { id: 3, text: "Learn useReducer",  done: false },
    { id: 4, text: "Build something!",  done: false },
  ]);
  const [todoInput, setTodoInput] = useState("");
  const [todoFilter, setTodoFilter] = useState("all"); // "all" | "done" | "pending"

  // ── useRef ────────────────────────────────────────────────
  /**
   * useRef returns a mutable object { current: value }.
   * Changes to ref.current do NOT trigger re-renders.
   * Uses: DOM access, storing previous values, timers.
   */
  const fancyInputRef  = useRef(null);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;        // Count renders without causing them

  // ── useEffect ─────────────────────────────────────────────
  /**
   * useEffect(fn, deps)
   * - No deps array  → runs after every render
   * - Empty []       → runs once after mount (like componentDidMount)
   * - [a, b]         → runs when a or b changes
   * - Return cleanup → runs before next effect OR on unmount
   */
  useEffect(() => {
    document.title = `React Master | Count: ${count}`;
    return () => { document.title = "React Master Demo"; }; // Cleanup
  }, [count]);

  useEffect(() => {
    if (debouncedSearch) {
      console.log("Would search for:", debouncedSearch);
    }
  }, [debouncedSearch]);

  // ── useMemo ───────────────────────────────────────────────
  /**
   * useMemo(() => compute(), [deps])
   * Recalculates only when deps change. Use for expensive computations.
   * Returns the memoized VALUE (not a function).
   */
  const expensiveStats = useMemo(() => {
    const done  = todos.filter(t => t.done).length;
    const pct   = todos.length ? Math.round((done / todos.length) * 100) : 0;
    return { done, total: todos.length, pct };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (todoFilter === "done")    return todos.filter(t => t.done);
    if (todoFilter === "pending") return todos.filter(t => !t.done);
    return todos;
  }, [todos, todoFilter]); // Only recomputes when todos array changes

  // ── useCallback ───────────────────────────────────────────
  /**
   * useCallback(() => fn, [deps])
   * Returns a memoized FUNCTION reference. Prevents child re-renders
   * when passing callbacks as props to memo-wrapped components.
   */
  const handleAddTodo = useCallback(() => {
    if (!todoInput.trim()) return;
    dispatch({ type: "ADD", payload: todoInput.trim() });
    setTodoInput("");
  }, [todoInput]); // New function only when todoInput changes

  // ── Context values ────────────────────────────────────────
  const themeCtx = useContext(ThemeContext);

  // ─── HOC demo ─────────────────────────────────────────────
  const BadgedButton = withBadge(
    ({ children, ...p }) => <button className="btn" {...p}>{children}</button>,
    "HOC"
  );

  // ─── Tabs config ──────────────────────────────────────────
  const tabs = [
    { id: "hooks",     label: "Hooks" },
    { id: "state",     label: "State" },
    { id: "advanced",  label: "Advanced" },
    { id: "patterns",  label: "Patterns" },
    { id: "forms",     label: "Forms" },
    {id: "context",    label: "Context" },
    { id: "custom-hooks", label: "Custom Hooks" },
  ];

  const donePct = expensiveStats.pct;

  return (
    <>
      {/* Inject styles */}
      <style>{fontStyle + globalStyle}</style>

      {/* ── CONTEXT PROVIDERS wrap the app so children can consume them ── */}
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <UserContext.Provider value={{ name: "Dev", role: "fullstack" }}>

          <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 20px 80px" }}>

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header style={{ marginBottom: 36 }}>
              <div className="flex" style={{ marginBottom: 8 }}>
                <span className="tag">React 18</span>
                <span className="tag green">Hooks</span>
                <span className="tag pink">Full Reference</span>
                <button
                  className="btn ghost"
                  style={{ fontSize: 12, padding: "4px 12px", marginLeft: "auto" }}
                  onClick={toggleTheme}
                >
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
              </div>
              <h1 style={{
                fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800,
                lineHeight: 1.1, marginBottom: 10,
              }}>
                React Master<br />
                <span style={{ color: "var(--accent)" }}>Reference Page</span>
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 520 }}>
                A complete, annotated reference covering every major React concept
                — all in one living, interactive file.
              </p>
              <div className="flex" style={{ marginTop: 16 }}>
                <div className="badge">Renders this session: <strong style={{ color: "var(--accent)" }}>{renderCountRef.current}</strong></div>
                <div className="badge">Todos done: <strong style={{ color: "var(--accent3)" }}>{expensiveStats.done}/{expensiveStats.total}</strong></div>
              </div>
            </header>

            {/* ── TABS ────────────────────────────────────────────────────── */}
            <div className="flex" style={{ marginBottom: 24, gap: 6 }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`btn ${activeTab === t.id ? "" : "ghost"}`}
                  style={{ fontSize: 13 }}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                TAB 1 — HOOKS
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "hooks" && (
              <div className="slide-in">

                {/* useState */}
                <div className="section">
                  <div className="section-title">01 — useState</div>
                  <div className="section-heading">Local Component State</div>
                  <div className="note">
                    <code className="mono">const [state, setState] = useState(initialValue)</code><br />
                    setState triggers a re-render. Pass a function for lazy init or to read current state.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
                      {count}
                    </div>
                    <div className="flex">
                      <button className="btn ghost" onClick={decrement}>−</button>
                      <button className="btn" onClick={increment}>+ increment</button>
                      <button className="btn ghost" onClick={reset}>Reset</button>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      (uses custom hook <span className="mono">useCounter</span>)
                    </div>
                  </div>
                </div>

                {/* useEffect */}
                <div className="section">
                  <div className="section-title">02 — useEffect</div>
                  <div className="section-heading">Side Effects & Lifecycle</div>
                  <div className="note">
                    Runs after render. Return a cleanup function. The browser tab title changes
                    with the counter above — that's a useEffect in action.
                  </div>
                  <div className="grid-2">
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                        Debounced search (500ms delay via useEffect)
                      </div>
                      <input
                        className="input"
                        placeholder="Type to search..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                      />
                      {debouncedSearch && (
                        <div style={{ fontSize: 12, color: "var(--accent3)", marginTop: 6 }}>
                          Debounced value: <span className="mono">"{debouncedSearch}"</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                        Notes (persisted via useLocalStorage + useEffect)
                      </div>
                      <textarea
                        className="input"
                        rows={3}
                        style={{ resize: "none" }}
                        placeholder="Type a note... (saved automatically)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* useRef */}
                <div className="section">
                  <div className="section-title">03 — useRef</div>
                  <div className="section-heading">DOM Access & Mutable Values</div>
                  <div className="note">
                    <span className="mono">useRef</span> gives you a box to put any mutable value.
                    Changing <span className="mono">.current</span> never triggers a re-render.
                  </div>
                  <FancyInput
                    ref={fancyInputRef}
                    label="FancyInput (built with forwardRef)"
                    placeholder="Will be focused by the button below..."
                  />
                  <div className="flex" style={{ marginTop: 12 }}>
                    <button className="btn" onClick={() => fancyInputRef.current?.focus()}>
                      Focus input via ref
                    </button>
                    <button className="btn ghost" onClick={() => {
                      if (fancyInputRef.current) fancyInputRef.current.value = "";
                    }}>
                      Clear value (no re-render)
                    </button>
                  </div>
                </div>

                {/* useContext */}
                <div className="section">
                  <div className="section-title">04 — useContext</div>
                  <div className="section-heading">Consuming Context</div>
                  <div className="note">
                    Context avoids "prop drilling" — passing data through many layers.
                    Any descendant can consume it directly.
                  </div>
                  <ContextConsumerDemo />
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 2 — STATE MANAGEMENT
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "state" && (
              <div className="slide-in">

                {/* useReducer */}
                <div className="section">
                  <div className="section-title">05 — useReducer</div>
                  <div className="section-heading">Complex State with Reducers</div>
                  <div className="note">
                    Preferred over useState when next state depends on previous state,
                    or when you have multiple sub-values with related transitions.
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                      Progress — <span className="mono">{donePct}%</span> (useMemo)
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${donePct}%` }} />
                    </div>
                  </div>

                  {/* Add todo */}
                  <div className="flex" style={{ marginBottom: 12 }}>
                    <input
                      className="input"
                      placeholder="New todo..."
                      value={todoInput}
                      onChange={e => setTodoInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddTodo()}
                      style={{ flex: 1 }}
                    />
                    <button className="btn" onClick={handleAddTodo} style={{ whiteSpace: "nowrap" }}>
                      Add (dispatch)
                    </button>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex" style={{ marginBottom: 12, gap: 6 }}>
                    {["all", "done", "pending"].map(f => (
                      <button
                        key={f}
                        className={`btn ${todoFilter === f ? "" : "ghost"}`}
                        style={{ fontSize: 12, padding: "5px 14px" }}
                        onClick={() => setTodoFilter(f)}
                      >
                        {f} {f === "all" ? `(${todos.length})` : f === "done" ? `(${expensiveStats.done})` : `(${expensiveStats.total - expensiveStats.done})`}
                      </button>
                    ))}
                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4, alignSelf: "center" }}>
                      useMemo recalculates on filter or todos change
                    </span>
                  </div>

                  {/* List */}
                  {filteredTodos.length === 0 && (
                    <div style={{ color: "var(--muted)", fontSize: 13, padding: "10px 0" }}>No items to show.</div>
                  )}
                  {filteredTodos.map(todo => (
                    <div key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => dispatch({ type: "TOGGLE", id: todo.id })}
                        style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
                      />
                      <span style={{ flex: 1, fontSize: 14 }}>{todo.text}</span>
                      <button
                        className="btn ghost"
                        style={{ padding: "2px 8px", fontSize: 11 }}
                        onClick={() => dispatch({ type: "DELETE", id: todo.id })}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* useMemo + useCallback */}
                <div className="section">
                  <div className="section-title">06 — useMemo & useCallback</div>
                  <div className="section-heading">Memoization</div>
                  <div className="note">
                    <strong>useMemo</strong> = memoized value. <strong>useCallback</strong> = memoized function.
                    Only re-compute when dependencies change.
                  </div>
                  <div className="grid-3">
                    <StatCard
                      label="Done"
                      value={expensiveStats.done}
                      color="var(--accent3)"
                      renderCount={renderCountRef.current}
                    />
                    <StatCard
                      label="Total"
                      value={expensiveStats.total}
                      color="var(--accent)"
                      renderCount={renderCountRef.current}
                    />
                    <StatCard
                      label="% Complete"
                      value={`${expensiveStats.pct}%`}
                      color="var(--accent2)"
                      renderCount={renderCountRef.current}
                    />
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                      Force parent re-render (StatCards are memo-wrapped, won't re-render if value unchanged):
                    </div>
                    <button
                      className="btn ghost"
                      onClick={() => setRenderCount(c => c + 1)}
                    >
                      Force re-render ({renderCount})
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 3 — ADVANCED
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "advanced" && (
              <div className="slide-in">

                {/* Class Component */}
                <div className="section">
                  <div className="section-title">07 — Class Component</div>
                  <div className="section-heading">Legacy Syntax (still valid)</div>
                  <div className="note">
                    Class components use <span className="mono">this.state</span> and lifecycle methods.
                    Hooks replaced most use-cases but Error Boundaries still require classes.
                  </div>
                  <ClassCounter />
                </div>

                {/* Error Boundary */}
                <div className="section">
                  <div className="section-title">08 — Error Boundary</div>
                  <div className="section-heading">Graceful Error Handling</div>
                  <div className="note">
                    Error Boundaries catch render-time errors in the subtree and display a fallback.
                    They must be class components.
                  </div>
                  <ErrorBoundary>
                    <BuggyComponent shouldThrow={shouldThrow} />
                  </ErrorBoundary>
                  <div className="flex" style={{ marginTop: 12 }}>
                    <button
                      className="btn danger"
                      onClick={() => setShouldThrow(true)}
                    >
                      Throw error
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => setShouldThrow(false)}
                    >
                      Recover
                    </button>
                  </div>
                </div>

                {/* Lazy + Suspense */}
                <div className="section">
                  <div className="section-title">09 — lazy + Suspense</div>
                  <div className="section-heading">Code Splitting</div>
                  <div className="note">
                    <span className="mono">React.lazy()</span> lets you defer loading a component
                    until it's first rendered. <span className="mono">Suspense</span> shows a fallback meanwhile.
                  </div>
                  {!lazyVisible ? (
                    <button className="btn" onClick={() => setLazyVisible(true)}>
                      Load lazy component
                    </button>
                  ) : (
                    <Suspense fallback={
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
                        <div style={{ width: 16, height: 16, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        Loading chart...
                      </div>
                    }>
                      <LazyChart />
                    </Suspense>
                  )}
                </div>

                {/* Portal */}
                <div className="section">
                  <div className="section-title">10 — createPortal</div>
                  <div className="section-heading">Render Outside the DOM Tree</div>
                  <div className="note">
                    Portals render children into a different DOM node than the parent.
                    Ideal for modals, tooltips, and dropdowns.
                  </div>
                  <button className="btn" onClick={() => setShowModal(true)}>
                    Open Portal Modal
                  </button>
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                      This modal is rendered via <span className="mono">createPortal</span> directly
                      into <span className="mono">document.body</span>, yet it's controlled by React state.
                    </p>
                    <button className="btn" onClick={() => setShowModal(false)}>
                      Close modal
                    </button>
                  </Modal>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 4 — PATTERNS
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "patterns" && (
              <div className="slide-in">

                {/* HOC */}
                <div className="section">
                  <div className="section-title">11 — Higher-Order Component</div>
                  <div className="section-heading">Enhance Components via Wrapping</div>
                  <div className="note">
                    A HOC is a function: <span className="mono">Component → EnhancedComponent</span>.
                    Used for auth-guards, analytics, feature flags, badge overlays, etc.
                  </div>
                  <div className="flex">
                    <BadgedButton onClick={() => alert("HOC button clicked!")}>
                      HOC-Enhanced Button
                    </BadgedButton>
                  </div>
                </div>

                {/* forwardRef */}
                <div className="section">
                  <div className="section-title">12 — forwardRef</div>
                  <div className="section-heading">Ref Forwarding to DOM Nodes</div>
                  <div className="note">
                    <span className="mono">forwardRef</span> lets a parent hold a ref to a child's
                    DOM element. See the FancyInput demo in the Hooks tab.
                  </div>
                  <FancyInput
                    ref={fancyInputRef}
                    label="Same FancyInput (forwardRef) shared across tabs"
                    placeholder="The button below focuses this..."
                  />
                  <button
                    className="btn"
                    style={{ marginTop: 10 }}
                    onClick={() => fancyInputRef.current?.focus()}
                  >
                    Focus via ref
                  </button>
                </div>

                {/* React.memo */}
                <div className="section">
                  <div className="section-title">13 — React.memo</div>
                  <div className="section-heading">Skip Unnecessary Re-renders</div>
                  <div className="note">
                    <span className="mono">memo(Component)</span> wraps a functional component.
                    It only re-renders if its props changed (shallow comparison).
                    Check the "renders" counter on the stat cards in the State tab.
                  </div>
                  <div className="grid-3">
                    <StatCard label="memo demo A" value={memoValue} color="var(--accent)"  renderCount={renderCountRef.current} />
                    <StatCard label="memo demo B" value={99}        color="var(--accent3)" renderCount={renderCountRef.current} />
                    <StatCard label="memo demo C" value="🚀"        color="var(--accent2)" renderCount={renderCountRef.current} />
                  </div>
                  <div className="flex" style={{ marginTop: 14 }}>
                    <button className="btn" onClick={() => setMemoValue(v => v + 1)}>
                      Change A ({memoValue})
                    </button>
                    <button className="btn ghost" onClick={() => setRenderCount(c => c + 1)}>
                      Force parent re-render (B & C stay same)
                    </button>
                  </div>
                </div>

                {/* Concept Map */}
                <div className="section">
                  <div className="section-title">Quick Reference</div>
                  <div className="section-heading">When to Use What</div>
                  {[
                    ["useState",     "Simple local state — counters, toggles, form fields"],
                    ["useReducer",   "Complex state with many transitions or related fields"],
                    ["useEffect",    "Side effects: fetch, subscriptions, DOM manipulation"],
                    ["useContext",   "Consume global data without prop drilling"],
                    ["useMemo",      "Expensive computed value; recalc only on dep change"],
                    ["useCallback",  "Stable function reference for memo-wrapped children"],
                    ["useRef",       "DOM access, interval IDs, previous value storage"],
                    ["memo",         "Skip renders of pure components with stable props"],
                    ["forwardRef",   "Expose child DOM node to parent via ref"],
                    ["HOC",          "Share cross-cutting behavior across multiple components"],
                    ["Error Boundary","Catch render errors gracefully in a subtree"],
                    ["lazy/Suspense","Defer loading of large components (code splitting)"],
                    ["createPortal", "Render outside the React root (modals, tooltips)"],
                  ].map(([hook, desc]) => (
                    <div
                      key={hook}
                      style={{
                        display: "flex", gap: 14, padding: "10px 0",
                        borderBottom: "1px solid var(--border)", alignItems: "flex-start",
                      }}
                    >
                      <span className="mono" style={{ minWidth: 120, color: "var(--accent)", fontSize: 12 }}>
                        {hook}
                      </span>
                      <span style={{ color: "var(--muted)", fontSize: 13 }}>{desc}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 5 — FORMS
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "forms" && (
              <div className="slide-in">

                <div className="section">
                  <div className="section-title">14 — Controlled Form</div>
                  <div className="section-heading">Forms with useState</div>
                  <div className="note">
                    A controlled input binds its value to React state via <span className="mono">value</span> +{" "}
                    <span className="mono">onChange</span>. React is the single source of truth.
                  </div>
                  <ControlledForm />
                </div>

              </div>
            )}
           {/* ================================================================
           TAB 6 — CONTEXT
========================================= */}
{activeTab === "context" && (
              <div className="slide-in">
                <div className="section">
                  <div className="section-title">15 — Context</div>
                  <div className="section-heading">Global State Without Prop Drilling</div>
                  <div className="note">
                    Context provides global data to any component without passing props down manually.
                    <br />
                    <span className="mono">useContext(Context)</span> reads the current value.

                  </div>
                  <ContextConsumerDemo />
                </div>

              </div>
            )}
            {/*==================================================================
            TAB 7 — CUSTOM HOOKS
            ==============================*/}
            {activeTab === "custom-hooks" && (
              <div className="slide-in">
                <div className="section">
                  <div className="section-title">16 — Custom Hooks</div>
                  <div className="section-heading">Extract Reusable Logic</div>
                  <div className="note">
                    A custom hook is a function that calls other hooks. It lets you extract
                    and reuse stateful logic across components.
                  </div>
                  <CustomHookDemo />
                </div>

          </div>
            )}

          </div>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

// ── Controlled Form component ───────────────────────────────────────────────
function ControlledForm() {
  const [form, setForm] = useState({ name: "", email: "", role: "frontend", agree: false });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name  = "Name is required";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.agree)                              e.agree = "You must agree to continue";
    return e;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors(ev => ({ ...ev, [name]: undefined })); // clear error on change
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(form);
    setForm({ name: "", email: "", role: "frontend", agree: false });
    setErrors({});
  };

  const handleReset = () => { setSubmitted(null); };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ color: "var(--accent3)", fontWeight: 700, fontSize: 15 }}>✅ Form submitted!</div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
          <div className="mono" style={{ whiteSpace: "pre" }}>{JSON.stringify(submitted, null, 2)}</div>
        </div>
        <button className="btn ghost" style={{ alignSelf: "flex-start" }} onClick={handleReset}>Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Name */}
      <div>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Full Name</label>
        <input
          className="input"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <div style={{ color: "var(--accent2)", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
      </div>

      {/* Email */}
      <div>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Email</label>
        <input
          className="input"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <div style={{ color: "var(--accent2)", fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
      </div>

      {/* Role select */}
      <div>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Role</label>
        <select
          className="input"
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ cursor: "pointer" }}
        >
          {["frontend", "backend", "fullstack", "devops"].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Checkbox */}
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
          />
          I agree to the terms
        </label>
        {errors.agree && <div style={{ color: "var(--accent2)", fontSize: 12, marginTop: 4 }}>{errors.agree}</div>}
      </div>

      {/* Live preview */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Live state preview (useState)</div>
        <div className="mono" style={{ whiteSpace: "pre", fontSize: 11 }}>{JSON.stringify(form, null, 2)}</div>
      </div>

      <div className="flex">
        <button className="btn" type="submit">Submit</button>
        <button className="btn ghost" type="button" onClick={() => setForm({ name: "", email: "", role: "frontend", agree: false })}>Reset</button>
      </div>

    </form>
  );
}
// ── Custom Hook Demo component ──────────────────────────────────────────────
function CustomHookDemo() {
  const { count, increment, decrement, reset } = useCounter(0, 2);
  const [name, setName] = useLocalStorage("demo-name", "");
  const debouncedName   = useDebounce(name, 500);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* useCounter */}
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
          <span className="mono">useCounter(0, step=2)</span> — increments by 2
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: "var(--accent)", marginBottom: 10 }}>{count}</div>
        <div className="flex">
          <button className="btn ghost" onClick={decrement}>− 2</button>
          <button className="btn" onClick={increment}>+ 2</button>
          <button className="btn ghost" onClick={reset}>Reset</button>
        </div>
      </div>

      {/* useLocalStorage */}
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
          <span className="mono">useLocalStorage("demo-name")</span> — persists across refreshes
        </div>
        <input
          className="input"
          placeholder="Type your name (saved to localStorage)..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {debouncedName && (
          <div style={{ fontSize: 12, color: "var(--accent3)", marginTop: 6 }}>
            Debounced: <span className="mono">"{debouncedName}"</span>
          </div>
        )}
      </div>

    </div>
  );
}

function ContextConsumerDemo() {
  const theme = useContext(ThemeContext); // Reads nearest ThemeContext
  const user  = useContext(UserContext);  // Reads nearest UserContext

  return (
    <div className="grid-2">
      <div style={{ background: "var(--surface)", borderRadius: 8, padding: 14, border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>ThemeContext</div>
        <div className="mono">{JSON.stringify(theme, null, 2)}</div>
      </div>
      <div style={{ background: "var(--surface)", borderRadius: 8, padding: 14, border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>UserContext</div>
        <div className="mono">{JSON.stringify(user, null, 2)}</div>
      </div>
    </div>
  );
}