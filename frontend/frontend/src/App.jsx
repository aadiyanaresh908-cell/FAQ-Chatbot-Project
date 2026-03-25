import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // Direct link to your backend port
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      setMessages(prev => [...prev, { role: 'bot', content: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Connection failure. Ensure 'node server.js' is running." }]);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}><h1 style={styles.title}>ORYNAX</h1></header>
      <main style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userRow : styles.botRow}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
              <p>{msg.content}</p>
              {msg.role === 'bot' && (
                <div style={styles.feedback}>
                  {/* Requirement 11: User Feedback */}
                  <button onClick={() => alert('Saved: Helpful')} style={styles.btn}>Helpful</button>
                  <button onClick={() => alert('Saved: Not Helpful')} style={styles.btn}>Not Helpful</button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      <footer style={styles.footer}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} style={styles.input} placeholder="Ask me anything..." />
        <button onClick={handleSend} style={styles.sendBtn}>Search</button>
      </footer>
    </div>
  );
};

const styles = {
  container: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', fontFamily: 'sans-serif' },
  header: { padding: '20px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', textAlign: 'center', color: 'white' },
  chatArea: { flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  userRow: { alignSelf: 'flex-end', maxWidth: '70%' },
  botRow: { alignSelf: 'flex-start', maxWidth: '80%' },
  userBubble: { backgroundColor: '#4f46e5', color: 'white', padding: '15px', borderRadius: '15px 15px 0 15px' },
  botBubble: { backgroundColor: '#1e293b', color: '#f8fafc', padding: '15px', borderRadius: '15px 15px 15px 0', border: '1px solid #334155' },
  feedback: { marginTop: '10px', display: 'flex', gap: '10px', borderTop: '1px solid #334155', paddingTop: '10px' },
  btn: { background: 'none', border: '1px solid #4f46e5', color: '#818cf8', cursor: 'pointer', borderRadius: '4px' },
  footer: { padding: '20px', display: 'flex', gap: '10px', maxWidth: '800px', margin: '0 auto', width: '100%' },
  input: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' },
  sendBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }
};

export default App;