import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaMinus, FaLightbulb } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: "bot", text: "Hello! I am NexGen AI. How can I assist with your mission today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { role: "user", text: message };
        setChat([...chat, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const role = localStorage.getItem("role") || "EMPLOYEE";
            const name = localStorage.getItem("loggedInEmail")?.split("@")[0] || "User";
            
            const token = localStorage.getItem("token");
            const res = await axios.post("/api/ai/chat", {
                message,
                role,
                name
            }, {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });
            
            if (res.data && res.data.response) {
                setChat(prev => [...prev, { role: "bot", text: res.data.response }]);
            } else {
                setChat(prev => [...prev, { role: "bot", text: "AI link is online but returned an unexpected signal." }]);
            }
        } catch (error) {
            setChat(prev => [...prev, { role: "bot", text: "Connection error. Re-establishing link..." }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "Total employees?",
        "Today's attendance?",
        "Pending leaves?",
        "What can you do?"
    ];

    return (
        <>
            <style>{`
                @keyframes ai-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); transform: scale(1); }
                    70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); transform: scale(1.05); }
                    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); transform: scale(1); }
                }
                .ai-pulse-effect {
                    animation: ai-pulse 2s infinite;
                }
                .ai-window-glass {
                    background: rgba(15, 23, 42, 0.9) !important;
                    backdrop-filter: blur(25px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            <div className="ai-assistant-container" style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 10000 }}>
                {/* Bubble Button */}
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="ai-bubble shadow-lg d-flex align-items-center justify-content-center ai-pulse-effect"
                    style={{ 
                        width: "65px", height: "65px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                        cursor: "pointer",
                        border: "3px solid rgba(255, 255, 255, 0.3)",
                        color: "white"
                    }}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaRobot size={30} />}
                </motion.div>

                {/* Chat Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                            className="ai-window ai-window-glass overflow-hidden"
                            style={{ 
                                position: "absolute", bottom: "80px", right: "0",
                                width: "320px", height: "450px",
                                borderRadius: "24px",
                                display: "flex", flexDirection: "column"
                            }}
                        >
                            {/* Header */}
                            <div className="p-3 d-flex align-items-center justify-content-between" style={{ background: "linear-gradient(to right, rgba(37, 99, 235, 0.2), transparent)" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded-circle bg-primary bg-opacity-20 shadow-inner"><FaRobot className="text-info" size={20} /></div>
                                    <div>
                                        <h6 className="mb-0 text-white fw-bold" style={{ letterSpacing: "1px" }}>NEXGEN AI</h6>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="d-flex align-items-center gap-1">
                                                <span className="bg-success rounded-circle" style={{ width: "6px", height: "6px" }}></span>
                                                <span className="text-success fw-bold" style={{ fontSize: "0.6rem" }}>DEEP SYNC ACTIVE</span>
                                            </div>
                                            <span className="text-white-25 small">|</span>
                                            <span className="text-white-50 extra-small fw-bold">CONTEXT-AWARE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button 
                                        onClick={() => setChat([{ role: "bot", text: "Link reset. How can I assist with your mission?" }])} 
                                        className="btn btn-link text-white-25 p-0 hover-white me-2" 
                                        title="Clear Mission Logs"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="btn btn-link text-white-50 p-0 hover-white">
                                        <FaMinus />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-2 hide-scrollbar" style={{ background: "rgba(0,0,0,0.1)" }}>
                                {chat.map((msg, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={idx} 
                                        className={`d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
                                    >
                                        <div 
                                            className={`p-3 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white ms-auto' : 'bg-white bg-opacity-5 text-white'}`}
                                            style={{ 
                                                maxWidth: "85%", 
                                                fontSize: "0.85rem", 
                                                lineHeight: "1.5",
                                                wordWrap: "break-word",
                                                whiteSpace: "pre-wrap",
                                                border: msg.role === 'bot' ? "1px solid rgba(255,255,255,0.05)" : "none"
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div className="d-flex align-items-center gap-2 text-info small animate-pulse px-2" style={{ fontSize: "0.7rem" }}>
                                        <FaRobot size={10} /> <span style={{ letterSpacing: "1px" }}>ANALYZING...</span>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Suggestions */}
                            <div className="px-3 py-2 d-flex gap-2 overflow-auto hide-scrollbar">
                                {suggestions.map((s, idx) => (
                                    <button key={idx} onClick={() => setMessage(s)} className="btn btn-outline-info btn-sm rounded-pill whitespace-nowrap border-opacity-25" style={{ fontSize: "0.65rem", padding: "3px 10px" }}>
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-white bg-opacity-10 border-top border-white border-opacity-5">
                                <form onSubmit={handleSend} className="d-flex align-items-center bg-white rounded-pill px-3 py-1 shadow-sm">
                                    <input 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Query..."
                                        className="form-control bg-transparent border-0 text-dark shadow-none"
                                        style={{ fontSize: "0.8rem", fontWeight: "500" }}
                                    />
                                    <button type="submit" className="btn btn-link text-primary p-0 ms-2 hover-scale">
                                        <FaPaperPlane size={14}/>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default AIAssistant;
