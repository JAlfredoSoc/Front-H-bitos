// src/components/dashboard/NovaCoach.jsx
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// RobotFace  — robot flotante con ojos expresivos, sin boca
// Modos: idle | listening | thinking | speaking
// ─────────────────────────────────────────────────────────────────────────────
const RobotFace = ({ mode }) => {
  const canvasRef = useRef(null);
  const modeRef   = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;

    // Paleta por modo
    const palette = {
      idle:      { primary: "#a78bfa", secondary: "#7c3aed", glow: "rgba(167,139,250,", scan: "#c4b5fd" },
      listening: { primary: "#fbbf24", secondary: "#d97706", glow: "rgba(251,191,36,",  scan: "#fde68a" },
      thinking:  { primary: "#38bdf8", secondary: "#0284c7", glow: "rgba(56,189,248,",  scan: "#bae6fd" },
      speaking:  { primary: "#34d399", secondary: "#059669", glow: "rgba(52,211,153,",  scan: "#6ee7b7" },
    };

    const draw = () => {
      t += 0.022;
      const m   = modeRef.current;
      const pal = palette[m] || palette.idle;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── Flotación + gestos por modo ──────────────────────────────────────
      // floatY: movimiento vertical suave
      // tiltX:  inclinación lateral (cabeza ladeada)
      // bobAmt: rebote de entusiasmo
      let floatY, tiltX, shakeX;
      if (m === "idle") {
        floatY = Math.sin(t * 1.1) * 6;          // respiración lenta
        tiltX  = Math.sin(t * 0.5) * 0.04;       // balanceo suave
        shakeX = 0;
      } else if (m === "listening") {
        floatY = Math.sin(t * 2.5) * 4 + Math.cos(t * 1.2) * 3; // levitación atenta
        tiltX  = Math.sin(t * 1.8) * 0.08;       // inclina la cabeza con curiosidad
        shakeX = 0;
      } else if (m === "thinking") {
        floatY = Math.sin(t * 3.5) * 3;           // vibración de procesamiento
        tiltX  = Math.cos(t * 2) * 0.06;          // mira hacia arriba
        shakeX = Math.sin(t * 18) * 1.2;          // micro-vibración horizontal
      } else {
        // speaking — rebota emocionado
        floatY = -Math.abs(Math.sin(t * 4)) * 7;  // salta hacia arriba
        tiltX  = Math.sin(t * 3) * 0.05;
        shakeX = 0;
      }

      const cx = W / 2 + shakeX;
      const cy = H / 2 + floatY;
      const fw = W * 0.72;
      const fh = H * 0.72;
      const fx = cx - fw / 2;
      const fy = cy - fh / 2;
      const cr = 16;

      // Aplicar inclinación de cabeza al canvas entero
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltX);
      ctx.translate(-cx, -cy);

      // ── Sombra + cuerpo de la cara ──────────────────────────────────────
      const faceBg = ctx.createLinearGradient(fx, fy, fx, fy + fh);
      faceBg.addColorStop(0,   "#1a1035");
      faceBg.addColorStop(0.5, "#0d0b1e");
      faceBg.addColorStop(1,   "#060410");
      ctx.save();
      ctx.shadowBlur  = m === "idle" ? 18 : 32;
      ctx.shadowColor = `${pal.glow}0.7)`;
      roundRect(ctx, fx, fy, fw, fh, cr);
      ctx.fillStyle = faceBg;
      ctx.fill();
      ctx.restore();

      // Borde exterior con color de modo
      ctx.save();
      ctx.shadowBlur  = 10;
      ctx.shadowColor = pal.primary;
      roundRect(ctx, fx, fy, fw, fh, cr);
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth   = 1.8;
      ctx.stroke();
      ctx.restore();

      // ── Línea de escaneo (scan line) ────────────────────────────────────
      const scanY = fy + ((t * 40) % fh);
      const scanGrad = ctx.createLinearGradient(fx, scanY - 8, fx, scanY + 8);
      scanGrad.addColorStop(0,   `${pal.glow}0)`);
      scanGrad.addColorStop(0.5, `${pal.glow}0.18)`);
      scanGrad.addColorStop(1,   `${pal.glow}0)`);
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, fx, fy, fw, fh, cr);
      ctx.clip();
      ctx.fillStyle = scanGrad;
      ctx.fillRect(fx, scanY - 8, fw, 16);
      ctx.restore();

      // ── Líneas de circuito decorativas ──────────────────────────────────
      ctx.save();
      ctx.strokeStyle = `${pal.glow}0.12)`;
      ctx.lineWidth   = 1;
      // horizontales
      [0.25, 0.5, 0.75].forEach(pct => {
        const ly = fy + fh * pct;
        ctx.beginPath(); ctx.moveTo(fx + cr, ly); ctx.lineTo(fx + fw - cr, ly); ctx.stroke();
      });
      // verticales
      [0.2, 0.8].forEach(pct => {
        const lx = fx + fw * pct;
        ctx.beginPath(); ctx.moveTo(lx, fy + cr); ctx.lineTo(lx, fy + fh - cr); ctx.stroke();
      });
      ctx.restore();

      // ── "Antenas" / indicadores en la parte superior ────────────────────
      const antBlink = Math.sin(t * (m === "thinking" ? 8 : 2)) > 0;
      [-1, 1].forEach((side) => {
        const ax = cx + side * fw * 0.22;
        const ay = fy - 8;
        ctx.save();
        ctx.shadowBlur  = antBlink ? 12 : 4;
        ctx.shadowColor = pal.primary;
        ctx.beginPath();
        ctx.arc(ax, ay, 4, 0, Math.PI * 2);
        ctx.fillStyle = antBlink ? pal.primary : `${pal.glow}0.3)`;
        ctx.fill();
        // palo
        ctx.beginPath();
        ctx.moveTo(ax, ay + 4);
        ctx.lineTo(ax, fy + 2);
        ctx.strokeStyle = `${pal.glow}0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      // ── Ojos expresivos grandes ─────────────────────────────────────────
      // Los ojos ocupan la mitad inferior de la cara y transmiten toda la emoción
      const eyeW  = fw * 0.30;   // ojos anchos y prominentes
      const eyeH  = fh * 0.24;
      const eyeY  = cy;          // centrados en la cara
      const eyeLX = cx - fw * 0.24;
      const eyeRX = cx + fw * 0.24;

      // Parpadeo natural cada ~4s
      const blinkCycle = t % 4.2;
      const blinking   = blinkCycle > 4.0;

      // Expresión por modo:
      // idle      → ojos normales, iris con latido suave
      // listening → ojos muy abiertos (+20%), pupila grande (atención)
      // thinking  → ojo izq entrecerrado, pupila mirando arriba-izq (concentración)
      // speaking  → ojos ligeramente cerrados (curva arriba), pupila brillante

      const eyeOpenL = blinking ? 0.07
        : m === "thinking"  ? 0.45
        : m === "speaking"  ? 0.82
        : m === "listening" ? 1.2
        : 1.0;

      const eyeOpenR = blinking ? 0.07
        : m === "speaking"  ? 0.82
        : m === "listening" ? 1.2
        : 1.0;

      // Dirección de mirada por modo
      const gazeX = m === "thinking" ? -eyeW * 0.15
        : m === "listening" ? Math.sin(t * 1.5) * eyeW * 0.05
        : m === "speaking"  ? Math.sin(t * 4) * eyeW * 0.08
        : Math.sin(t * 0.7) * eyeW * 0.04;

      const gazeY = m === "thinking" ? -eyeH * 0.18
        : m === "listening" ? -eyeH * 0.05
        : 0;

      [{ x: eyeLX, open: eyeOpenL }, { x: eyeRX, open: eyeOpenR }].forEach(({ x, open }) => {
        const eh = Math.max(eyeH * open, 2.5);
        const ew = eyeW;
        const ey = eyeY;

        // ── Sombra/glow del ojo ──
        ctx.save();
        ctx.shadowBlur  = open > 0.3 ? 20 : 6;
        ctx.shadowColor = pal.primary;

        // Marco del ojo
        roundRect(ctx, x - ew / 2, ey - eh / 2, ew, eh, Math.min(eh * 0.45, ew * 0.45));
        ctx.fillStyle = "#04020f";
        ctx.fill();
        ctx.strokeStyle = pal.primary;
        ctx.lineWidth   = 2;
        ctx.stroke();
        ctx.restore();

        if (open > 0.12) {
          // Clip al ojo para que nada salga fuera
          ctx.save();
          ctx.beginPath();
          roundRect(ctx, x - ew / 2, ey - eh / 2, ew, eh, Math.min(eh * 0.45, ew * 0.45));
          ctx.clip();

          // ── Iris circular grande ──
          const irisR = Math.min(ew, eh) * 0.36;
          const ipx = x + gazeX;
          const ipy = ey + gazeY;

          // Fondo iris con degradado radial (da profundidad)
          const irisGrad = ctx.createRadialGradient(ipx - irisR * 0.2, ipy - irisR * 0.2, 0, ipx, ipy, irisR);
          irisGrad.addColorStop(0,   pal.scan);
          irisGrad.addColorStop(0.4, pal.primary);
          irisGrad.addColorStop(0.85, pal.secondary);
          irisGrad.addColorStop(1,   "#04020f");
          ctx.save();
          ctx.shadowBlur  = 12;
          ctx.shadowColor = pal.primary;
          ctx.beginPath();
          ctx.arc(ipx, ipy, irisR, 0, Math.PI * 2);
          ctx.fillStyle = irisGrad;
          ctx.fill();
          ctx.restore();

          // Pupila
          const pupilR = irisR * 0.42;
          ctx.beginPath();
          ctx.arc(ipx, ipy, pupilR, 0, Math.PI * 2);
          ctx.fillStyle = "#000";
          ctx.fill();

          // Brillo especular principal
          ctx.beginPath();
          ctx.arc(ipx - irisR * 0.28, ipy - irisR * 0.3, irisR * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.75)";
          ctx.fill();

          // Brillo secundario pequeño
          ctx.beginPath();
          ctx.arc(ipx + irisR * 0.22, ipy - irisR * 0.15, irisR * 0.1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fill();

          // ── Detalles expresivos por modo ──

          // listening → anillo de "escucha activa" pulsante
          if (m === "listening") {
            const pulseR = irisR * (1.1 + Math.sin(t * 5) * 0.15);
            ctx.beginPath();
            ctx.arc(ipx, ipy, pulseR, 0, Math.PI * 2);
            ctx.strokeStyle = `${pal.glow}0.5)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // thinking → punto de escaneo que orbita dentro del iris
          if (m === "thinking") {
            const dotAngle = t * 4;
            const dotR = irisR * 0.55;
            ctx.beginPath();
            ctx.arc(ipx + Math.cos(dotAngle) * dotR, ipy + Math.sin(dotAngle) * dotR, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = pal.scan;
            ctx.shadowBlur = 8; ctx.shadowColor = pal.scan;
            ctx.fill();
          }

          // speaking → iris vibra con un latido rítmico
          if (m === "speaking") {
            const beatScale = 1 + Math.abs(Math.sin(t * 6)) * 0.15;
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.beginPath();
            ctx.arc(ipx, ipy, irisR * beatScale, 0, Math.PI * 2);
            ctx.strokeStyle = pal.scan;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
          }

          ctx.restore(); // fin clip
        }

        // ── Cejas (líneas sobre los ojos) ────────────────────────────────
        // Dan expresividad extra sin necesitar boca
        if (!blinking) {
          const browY  = ey - eh / 2 - 6;
          const browHalf = ew * 0.38;
          ctx.save();
          ctx.strokeStyle = pal.primary;
          ctx.lineWidth   = 2.5;
          ctx.lineCap     = "round";
          ctx.shadowBlur  = 6;
          ctx.shadowColor = pal.primary;
          ctx.beginPath();

          if (m === "idle") {
            // Cejas rectas neutras con ligera curva
            ctx.moveTo(x - browHalf, browY + 2);
            ctx.quadraticCurveTo(x, browY - 1, x + browHalf, browY + 2);
          } else if (m === "listening") {
            // Cejas levantadas — sorpresa/interés
            ctx.moveTo(x - browHalf, browY);
            ctx.quadraticCurveTo(x, browY - 6, x + browHalf, browY);
          } else if (m === "thinking") {
            // Ceja fruncida — concentración
            const isLeft = x < cx;
            if (isLeft) {
              ctx.moveTo(x - browHalf, browY - 3);
              ctx.quadraticCurveTo(x, browY + 3, x + browHalf, browY);
            } else {
              ctx.moveTo(x - browHalf, browY);
              ctx.quadraticCurveTo(x, browY + 3, x + browHalf, browY - 3);
            }
          } else {
            // speaking → cejas arqueadas arriba — feliz/animado
            ctx.moveTo(x - browHalf, browY + 1);
            ctx.quadraticCurveTo(x, browY - 8, x + browHalf, browY + 1);
          }
          ctx.stroke();
          ctx.restore();
        }
      });

      // ── Sombra proyectada debajo del robot (da sensación de flotación) ──
      ctx.save();
      ctx.globalAlpha = 0.18 - Math.abs(Math.sin(t * (m === "idle" ? 1.1 : 3))) * 0.06;
      const shadowEllipseW = fw * 0.55;
      const shadowEllipseH = 8;
      const shadowY = cy + fh / 2 + 18;
      const shadowGrad = ctx.createRadialGradient(cx, shadowY, 0, cx, shadowY, shadowEllipseW / 2);
      shadowGrad.addColorStop(0, pal.primary);
      shadowGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(cx, shadowY, shadowEllipseW / 2, shadowEllipseH / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      // Cerrar el ctx.save() del tilt
      ctx.restore();

      // (nariz eliminada)
      // (boca eliminada — solo ojos)

      // ── Tornillos en las esquinas ────────────────────────────────────────
      [[fx + 10, fy + 10], [fx + fw - 10, fy + 10],
       [fx + 10, fy + fh - 10], [fx + fw - 10, fy + fh - 10]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `${pal.glow}0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // ranura del tornillo
        ctx.beginPath();
        ctx.moveTo(sx - 2, sy); ctx.lineTo(sx + 2, sy);
        ctx.strokeStyle = `${pal.glow}0.5)`;
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labels = {
    idle:      { text: "En línea",      color: "#7c3aed" },
    listening: { text: "Escuchando…",   color: "#d97706" },
    thinking:  { text: "Procesando…",   color: "#0284c7" },
    speaking:  { text: "Respondiendo…", color: "#059669" },
  };
  const lbl = labels[mode] || labels.idle;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
        style={{ width: 150, height: 150 }}
        aria-hidden="true"
      />
      <span style={{
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: lbl.color,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: lbl.color,
          boxShadow: `0 0 6px ${lbl.color}`,
          display: "inline-block",
          animation: "nova-dot-pulse 1.8s ease-in-out infinite",
        }} />
        {lbl.text}
      </span>
    </div>
  );
};

// helper: roundRect compatible con navegadores sin soporte nativo
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─────────────────────────────────────────────────────────────────────────────
// NovaCoach — componente principal
// ─────────────────────────────────────────────────────────────────────────────
const NovaCoach = ({ webhookUrl }) => {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [error, setError]             = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const orbMode = isListening ? "listening"
    : isLoading  ? "thinking"
    : isSpeaking ? "speaking"
    : "idle";

  useEffect(() => {
    if (!webhookUrl) setError("⚠️ VITE_N8N_WEBHOOK_URL no está configurado en .env");
  }, [webhookUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || !webhookUrl) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data  = await res.json();
      const reply = data.reply || "Lo siento, no pude procesar tu mensaje.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(reply);
        utt.lang = "es-ES"; utt.rate = 1;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend   = () => setIsSpeaking(false);
        utt.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `❌ Error de conexión: ${err.message}`,
      }]);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("❌ Tu navegador no soporta reconocimiento de voz"); return; }
    if (recognitionRef.current && isListening) { recognitionRef.current.stop(); return; }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "es-ES"; rec.interimResults = false; rec.continuous = false;
    rec.onstart  = () => { setIsListening(true); setError(""); };
    rec.onend    = () => setIsListening(false);
    rec.onresult = (e) => { const tx = e.results[0][0].transcript; setInput(tx); sendMessage(tx); };
    rec.onerror  = (e) => { setError(`❌ Micrófono: ${e.error}`); setIsListening(false); };
    rec.start();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="nova-wrapper">

      {/* ── Header ── */}
      <div className="nova-header">
        <RobotFace mode={orbMode} />
        <div className="nova-title-block">
          <div className="nova-badge">IA · v2.0</div>
          <h2 className="nova-title">
            NOVA <span className="nova-title-accent">Coach</span>
          </h2>
          <p className="nova-subtitle">Asistente inteligente de hábitos personales</p>
          <div className="nova-stats-row">
            <span className="nova-stat">⚡ Activo</span>
            <span className="nova-stat-sep" />
            <span className="nova-stat">🧠 GPT-powered</span>
            <span className="nova-stat-sep" />
            <span className="nova-stat">🔒 Seguro</span>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && <div className="nova-error">{error}</div>}

      {/* ── Chat ── */}
      <div className="nova-chat-area">
        {messages.length === 0 && (
          <div className="nova-empty-state">
            <p className="nova-empty-title">// SISTEMA LISTO</p>
            <p className="nova-empty-sub">Hola, soy NOVA — tu coach de hábitos impulsada por IA.<br />¿En qué puedo ayudarte hoy?</p>
            <div className="nova-suggestions">
              {["¿Cómo mejorar mi constancia?", "Consejo de productividad", "¿Cómo crear un hábito?"].map((s) => (
                <button key={s} className="nova-suggestion-chip" onClick={() => sendMessage(s)}>
                  <span className="nova-chip-arrow">›</span> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`nova-message nova-message--${msg.role}`}>
            <div className="nova-message-label">
              {msg.role === "user"
                ? <><span className="nova-label-icon">▶</span> TÚ</>
                : <><span className="nova-label-icon nova-label-icon--ai">◆</span> NOVA</>}
            </div>
            <div className="nova-message-bubble">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="nova-message nova-message--assistant">
            <div className="nova-message-label">
              <span className="nova-label-icon nova-label-icon--ai">◆</span> NOVA
            </div>
            <div className="nova-message-bubble nova-message-bubble--typing">
              <span className="nova-typing-dot" />
              <span className="nova-typing-dot" />
              <span className="nova-typing-dot" />
              <span className="nova-typing-text">Procesando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="nova-input-bar">
        <span className="nova-input-prefix">&gt;_</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un comando a NOVA..."
          disabled={isLoading}
          className="nova-input"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="nova-btn nova-btn--send"
          title="Enviar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        <button
          onClick={startListening}
          className={`nova-btn nova-btn--mic ${isListening ? "nova-btn--mic-active" : ""}`}
          title={isListening ? "Detener" : "Hablar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>

      {/* ── Estilos ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .nova-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);
          padding: 24px;
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Líneas de cuadrícula sutiles en el fondo */
        .nova-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(109,40,217,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(109,40,217,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        .nova-wrapper > * { position: relative; z-index: 1; }

        /* ── Header ── */
        .nova-header {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #ececf3;
        }

        .nova-title-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nova-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 2px 9px;
          border-radius: 4px;
          width: fit-content;
        }

        .nova-title {
          font-family: 'Space Grotesk', 'Poppins', sans-serif;
          font-size: 1.7rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .nova-title-accent {
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nova-subtitle {
          font-size: 0.78rem;
          color: #6b7280;
          margin: 0;
        }

        .nova-stats-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .nova-stat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #9ca3af;
          letter-spacing: 0.04em;
        }

        .nova-stat-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #d1d5db;
        }

        /* ── Error ── */
        .nova-error {
          background: #fef2f2;
          border-left: 3px solid #ef4444;
          color: #991b1b;
          border-radius: 0 8px 8px 0;
          padding: 10px 14px;
          margin-bottom: 12px;
          font-size: 0.83rem;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ── Chat area ── */
        .nova-chat-area {
          flex: 1;
          overflow-y: auto;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(109,40,217,0.2) transparent;
        }
        .nova-chat-area::-webkit-scrollbar { width: 3px; }
        .nova-chat-area::-webkit-scrollbar-thumb {
          background: rgba(109,40,217,0.2); border-radius: 3px;
        }

        /* ── Empty state ── */
        .nova-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          height: 100%;
          text-align: center;
          padding: 20px;
        }

        .nova-empty-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.1em;
          margin: 0 0 8px;
        }

        .nova-empty-sub {
          font-size: 0.88rem;
          color: #6b7280;
          margin: 0 0 22px;
          line-height: 1.6;
        }

        .nova-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .nova-suggestion-chip {
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          color: #6d28d9;
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nova-chip-arrow {
          font-size: 1rem;
          line-height: 1;
          color: #a78bfa;
        }

        .nova-suggestion-chip:hover {
          background: #ede9fe;
          border-color: #a78bfa;
          transform: translateX(2px);
          box-shadow: 2px 2px 0 #ddd6fe;
        }

        /* ── Mensajes ── */
        .nova-message {
          margin-bottom: 16px;
          animation: nova-msg-in 0.25s ease-out;
        }

        .nova-message--user      { display: flex; flex-direction: column; align-items: flex-end; }
        .nova-message--assistant { display: flex; flex-direction: column; align-items: flex-start; }

        .nova-message-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #9ca3af;
        }

        .nova-label-icon { font-size: 0.55rem; }
        .nova-message--user      .nova-message-label { color: #7c3aed; }
        .nova-message--assistant .nova-message-label { color: #0284c7; }
        .nova-label-icon--ai { color: #38bdf8; }

        .nova-message-bubble {
          max-width: 78%;
          padding: 11px 16px;
          font-size: 0.88rem;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .nova-message--user .nova-message-bubble {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          border-radius: 14px 14px 2px 14px;
          box-shadow: 3px 3px 0 rgba(109,40,217,0.25);
        }

        .nova-message--assistant .nova-message-bubble {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #7c3aed;
          color: #111827;
          border-radius: 2px 14px 14px 14px;
          box-shadow: 2px 2px 0 #f3f4f6;
        }

        /* ── Typing ── */
        .nova-message-bubble--typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 12px 16px;
        }

        .nova-typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: nova-bounce 1.1s ease-in-out infinite;
        }
        .nova-typing-dot:nth-child(2) { animation-delay: 0.18s; }
        .nova-typing-dot:nth-child(3) { animation-delay: 0.36s; }

        .nova-typing-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: #a78bfa;
          margin-left: 4px;
          letter-spacing: 0.06em;
          animation: nova-blink 1s step-end infinite;
        }

        @keyframes nova-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes nova-blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes nova-msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nova-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.7); }
        }

        /* ── Input bar ── */
        .nova-input-bar {
          display: flex;
          gap: 8px;
          align-items: center;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 6px 6px 6px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nova-input-bar:focus-within {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(109,40,217,0.08), 3px 3px 0 rgba(109,40,217,0.1);
        }

        .nova-input-prefix {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #7c3aed;
          font-weight: 700;
          user-select: none;
          flex-shrink: 0;
        }

        .nova-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #111827;
          caret-color: #7c3aed;
          padding: 6px 0;
        }
        .nova-input::placeholder { color: #9ca3af; font-style: normal; }
        .nova-input:disabled     { opacity: 0.5; cursor: not-allowed; }

        .nova-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 8px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .nova-btn--send {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          box-shadow: 2px 2px 0 rgba(109,40,217,0.3);
        }
        .nova-btn--send:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 rgba(109,40,217,0.4);
        }
        .nova-btn--send:disabled {
          background: #e5e7eb; color: #9ca3af;
          cursor: not-allowed; box-shadow: none;
        }

        .nova-btn--mic {
          background: #f5f3ff;
          border-color: #ddd6fe;
          color: #7c3aed;
          box-shadow: 2px 2px 0 #ddd6fe;
        }
        .nova-btn--mic:hover {
          background: #ede9fe;
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 #c4b5fd;
        }
        .nova-btn--mic-active {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
          box-shadow: 2px 2px 0 #fca5a5;
          animation: nova-mic-pulse 0.9s ease-in-out infinite;
        }

        @keyframes nova-mic-pulse {
          0%, 100% { box-shadow: 2px 2px 0 #fca5a5; }
          50%      { box-shadow: 4px 4px 0 rgba(220,38,38,0.3); }
        }
      `}</style>
    </div>
  );
};

export default NovaCoach;
