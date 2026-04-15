import { useState, useEffect } from 'react';
import { SettingsPanel, type AppSettings } from './components/SettingsPanel';
import { Uploader, type ContactRecord } from './components/Uploader';
import { ContactsTable } from './components/ContactsTable';
import { MessageSquareShare, Moon, Sun } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<AppSettings>({ brokerName: '', messageTemplate: '' });
  const [contacts, setContacts] = useState<ContactRecord[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleToggleContacted = (id: string, contacted: boolean) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, contacted } : c));
  };

  return (
    <div className="container">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)', color: 'white' }}>
            <MessageSquareShare size={28} />
          </div>
          <div>
            <h1 style={{ marginBottom: 0, fontSize: '1.5rem' }}>ZapLead Pro</h1>
            <p className="text-sm">Gerador de Campanhas do WhatsApp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle Dark Mode" title="Alternar Modo Escuro">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {contacts.length > 0 && (
            <button className="btn btn-danger" onClick={() => setContacts([])}>
              Limpar Lista
            </button>
          )}
        </div>
      </header>

      <main className="flex-col gap-4">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start', gridAutoFlow: 'row' }}>
          
          {/* Top row settings + uploader could be side by side on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <SettingsPanel onSettingsChange={setSettings} />
            {contacts.length === 0 && <Uploader onDataLoaded={setContacts} />}
          </div>

          <ContactsTable 
            contacts={contacts} 
            settings={settings} 
            onToggleContacted={handleToggleContacted}
          />

        </div>
      </main>
      
      <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.6 }}>
        <p className="text-sm">Projeto open-source para automatização de rotinas de contato. Segurança 100% (seus dados não saem do computador e são processados localmente).</p>
      </footer>
    </div>
  );
}

export default App;
