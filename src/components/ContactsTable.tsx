import React, { useState } from 'react';
import type { ContactRecord } from './Uploader';
import type { AppSettings } from './SettingsPanel';
import { MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ContactsTableProps {
  contacts: ContactRecord[];
  settings: AppSettings;
  onToggleContacted: (id: string, contacted: boolean) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, settings, onToggleContacted }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  if (contacts.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const getUrl = (contact: ContactRecord) => {
    const firstName = contact.name.split(' ')[0] || contact.name;
    const msg = settings.messageTemplate
      .replace(/{Nome}/gi, firstName)
      .replace(/{Corretor}/gi, settings.brokerName)
      .replace(/\\n/g, '\n');
    
    // Default country code if missing
    let finalPhone = contact.phone;
    if (finalPhone.length <= 11) {
      finalPhone = '55' + finalPhone; // assuming Brazil
    }
    
    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${finalPhone}?text=${encoded}`;
  };

  const currentData = contacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Sua Lista ({contacts.length} contatos)</h2>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)', width: '60px' }}>Ok</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>Nome</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((contact) => (
              <tr key={contact.id} style={{ 
                  borderBottom: '1px solid var(--border)', 
                  opacity: contact.contacted ? 0.6 : 1,
                  backgroundColor: contact.contacted ? 'var(--surface-hover)' : 'transparent' 
                }}>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={contact.contacted || false} 
                    onChange={(e) => onToggleContacted(contact.id, e.target.checked)}
                    style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                </td>
                <td style={{ padding: '1rem 1.5rem', textDecoration: contact.contacted ? 'line-through' : 'none' }}>
                  {contact.name}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {!contact.contacted ? (
                    <a 
                      href={getUrl(contact)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => onToggleContacted(contact.id, true)}
                    >
                      <MessageCircle size={18} />
                      Chamar no Zap
                    </a>
                  ) : (
                    <button className="btn" disabled style={{ whiteSpace: 'nowrap' }}>
                      <Check size={18} />
                      Já Contatado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-hover)' }}>
          <span className="text-sm">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button className="btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft size={18} />
              Anterior
            </button>
            <button className="btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Próxima
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
