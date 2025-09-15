import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export function FirestoreDemo() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'messages')).then(snapshot => {
      setMessages(snapshot.docs.map(doc => doc.data().text));
    });
  }, []);

  async function handleAdd() {
    if (!input.trim()) return;
    await addDoc(collection(db, 'messages'), { text: input });
    setInput('');
    // Refresh
    const snapshot = await getDocs(collection(db, 'messages'));
    setMessages(snapshot.docs.map(doc => doc.data().text));
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h3>Firestore Demo</h3>
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
