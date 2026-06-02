// src/components/dashboard/NovaCoach.jsx
import { useState, useRef, useEffect } from "react";

const NovaCoach = ({ webhookUrl }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Validar que el webhook URL esté configurado
  useEffect(() => {
    if (!webhookUrl) {
      setError("⚠️ Error: VITE_N8N_WEBHOOK_URL no está configurado en .env");
    }
  }, [webhookUrl]);

  // Auto-scroll al agregar mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || !webhookUrl) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "Lo siento, no pude procesar tu mensaje.";
      const aiMsg = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMsg]);

      // Síntesis de voz (NOVA habla)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancelar síntesis anterior si existe
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = "es-ES";
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error de conexión: ${err.message}. Verifica tu red o el webhook.`,
        },
      ]);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("❌ Tu navegador no soporta reconocimiento de voz");
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      setError(`❌ Error de micrófono: ${event.error}`);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        padding: "20px",
        background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)",
      }}>
      {/* Encabezado con Avatar */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <HolographicOrb isActive={isLoading || isListening} />
        <p
          style={{
            color: "#6d28d9",
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            margin: "10px 0",
          }}>
          ⚡ NOVA Coach ⚡
        </p>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
          Tu asistente personal de hábitos
        </p>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "10px",
            fontSize: "0.9rem",
          }}>
          {error}
        </div>
      )}

      {/* Área de chat */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#fff",
          borderRadius: "20px",
          padding: "15px",
          boxShadow: "0 2px 12px rgba(17, 24, 39, 0.07)",
          marginBottom: "15px",
        }}>
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              marginTop: "50px",
            }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>💬</div>
            <p style={{ fontWeight: "600", marginBottom: "5px" }}>
              ¡Hola! Soy NOVA
            </p>
            <p style={{ marginBottom: "0" }}>Tu coach personal de hábitos</p>
            <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>
              Pregúntame sobre motivación, consejos de productividad o cualquier
              cosa sobre tus hábitos.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "12px",
              animation: "fadeIn 0.3s ease-in",
            }}>
            <div
              style={{
                display: "inline-block",
                background: msg.role === "user" ? "#6d28d9" : "#dbeafe",
                color: msg.role === "user" ? "#fff" : "#111827",
                borderRadius: "18px",
                padding: "10px 14px",
                maxWidth: "75%",
                wordWrap: "break-word",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                borderTopRightRadius: msg.role === "user" ? "4px" : "18px",
                borderTopLeftRadius: msg.role === "assistant" ? "4px" : "18px",
                lineHeight: "1.4",
              }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.7,
                  marginBottom: "3px",
                }}>
                {msg.role === "user" ? "👤 Tú" : "🤖 NOVA"}
              </div>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                display: "inline-block",
                background: "#dbeafe",
                borderRadius: "18px",
                padding: "10px 14px",
                color: "#111827",
              }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.7,
                  marginBottom: "3px",
                }}>
                🤖 NOVA
              </div>
              <em>✍️ NOVA está escribiendo...</em>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Controles de entrada */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu pregunta o consejo..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "30px",
            border: "2px solid #e5e7eb",
            outline: "none",
            fontSize: "14px",
            background: "#fff",
            color: "#111827",
            transition: "border-color 0.2s",
            ":focus": {
              borderColor: "#6d28d9",
            },
            cursor: isLoading ? "not-allowed" : "text",
            opacity: isLoading ? 0.6 : 1,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          style={{
            background: isLoading || !input.trim() ? "#ccc" : "#6d28d9",
            border: "none",
            borderRadius: "30px",
            padding: "12px 20px",
            color: "white",
            fontWeight: "bold",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            fontSize: "14px",
          }}
          onMouseOver={(e) => {
            if (!isLoading && input.trim()) {
              e.target.style.background = "#5a1f9d";
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading && input.trim()) {
              e.target.style.background = "#6d28d9";
            }
          }}>
          📤 Enviar
        </button>

        <button
          onClick={startListening}
          style={{
            background: isListening ? "#dc2626" : "#6d28d9",
            border: "none",
            borderRadius: "30px",
            padding: "12px 16px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: "16px",
            minWidth: "48px",
          }}
          onMouseOver={(e) => {
            e.target.style.background = isListening ? "#b91c1c" : "#5a1f9d";
          }}
          onMouseOut={(e) => {
            e.target.style.background = isListening ? "#dc2626" : "#6d28d9";
          }}
          title={isListening ? "Hablando..." : "Presionar para hablar"}>
          🎤
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Componente del Orbe Holográfico animado
const HolographicOrb = ({ isActive }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let hue = 200; // Comienza en azul/morado

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;

      // Incrementar hue según si está activo
      hue = (hue + (isActive ? 2 : 0.5)) % 360;

      // Gradiente radial con efecto holográfico
      const gradient = ctx.createRadialGradient(
        centerX - 15,
        centerY - 15,
        5,
        centerX,
        centerY,
        radius,
      );

      gradient.addColorStop(0, `hsl(${hue}, 100%, 75%)`);
      gradient.addColorStop(0.4, `hsl(${hue}, 85%, 55%)`);
      gradient.addColorStop(0.7, `hsl(${hue}, 70%, 40%)`);
      gradient.addColorStop(1, `hsl(${hue}, 60%, 25%)`);

      // Dibuja círculo principal
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Efecto de brillo
      ctx.shadowBlur = 25;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Aro exterior adicional
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={180}
      style={{
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        filter: "drop-shadow(0 0 15px rgba(109, 40, 217, 0.3))",
      }}
    />
  );
};

export default NovaCoach;
