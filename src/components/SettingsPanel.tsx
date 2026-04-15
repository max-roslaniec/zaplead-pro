import React, { useState, useEffect } from 'react';

export interface AppSettings {
  brokerName: string;
  messageTemplate: string;
}

const DEFAULT_TEMPLATE = "Bom dia, {Nome}! Aqui é o(a) {Corretor}. Vi seu interesse em nossos serviços — ainda está buscando? Posso te ajudar em todo o processo. Qual o melhor horário pra conversarmos?";

interface SettingsPanelProps {
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [brokerName, setBrokerName] = useState('Max');
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_TEMPLATE);

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('zapLead_BrokerName');
    const savedTemplate = localStorage.getItem('zapLead_MessageTemplate');
    if (savedName) setBrokerName(savedName);
    if (savedTemplate) setMessageTemplate(savedTemplate);
  }, []);

  // Update localStorage and notify parent when values change
  useEffect(() => {
    localStorage.setItem('zapLead_BrokerName', brokerName);
    localStorage.setItem('zapLead_MessageTemplate', messageTemplate);
    onSettingsChange({ brokerName, messageTemplate });
  }, [brokerName, messageTemplate, onSettingsChange]);

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', marginBottom: 0 }}>
      <h2>Configurações da Campanha</h2>
      
      <div className="flex-col gap-4" style={{ flex: 1 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="brokerName">Seu Nome (Corretor)</label>
          <input
            id="brokerName"
            type="text"
            className="form-control"
            value={brokerName}
            onChange={(e) => setBrokerName(e.target.value)}
            placeholder="Ex: João Silva"
          />
        </div>

        <div className="form-group mb-2" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <label className="form-label" htmlFor="messageTemplate">Modelo de Mensagem</label>
          <p className="text-sm mb-2">
            Use <strong>{'{Nome}'}</strong> para inserir automaticamente o primeiro nome do cliente e <strong>{'{Corretor}'}</strong> para inserir seu nome.
          </p>
          <textarea
            id="messageTemplate"
            className="form-control"
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            placeholder="Digite a mensagem padrão..."
            style={{ resize: 'none', flex: 1 }}
          />
        </div>
      </div>
    </div>
  );
};
