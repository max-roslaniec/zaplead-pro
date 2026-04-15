import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Type, Copy, ExternalLink, Check } from 'lucide-react';

const PROMPT_TEXT = `Aja como um transcritor e organizador de dados. Vou te enviar fotos de uma lista impressa de clientes.
Sua única tarefa é ler a imagem, extrair todos os nomes e telefones e estruturar tudo EXATAMENTE em um formato CSV.

Siga estas regras ESTRITAMENTE:
1. A primeira linha deve ser o cabeçalho exato: Nome,Telefone
2. Formate e junte os nomes próprios (Ex: "Joao Da Silva").
3. Nos telefones, escreva APENAS números (mantenha o DDD, mas remova todos os traços, parênteses e espaços em branco). Ex: ao invés de "(51) 98888-7777", escreva 51988887777.
4. Ignore logos, títulos da página ou anotações a caneta rasuradas que não pareçam contatos.
5. MUITO IMPORTANTE: Responda apenas e puramente com o bloco de código CSV, sem nenhuma saudação, conclusão ou explicação.`;

export interface ContactRecord {
  id: string;
  name: string;
  phone: string;
  contacted?: boolean;
}

interface UploaderProps {
  onDataLoaded: (data: ContactRecord[]) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onDataLoaded }) => {
  const [importMethod, setImportMethod] = useState<'text' | 'file'>('text');
  const [rawText, setRawText] = useState('');
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleParseResults = (results: Papa.ParseResult<unknown>) => {
    const data = results.data as any[];
    const contacts: ContactRecord[] = [];
    
    for (const row of data) {
      if (!row || typeof row !== 'object') continue;
      const nameKey = Object.keys(row).find(k => k && k.toLowerCase().includes('nome')) || Object.keys(row)[0];
      const phoneKey = Object.keys(row).find(k => k && (k.toLowerCase().includes('telefone') || k.toLowerCase().includes('celular') || k.toLowerCase().includes('numero'))) || Object.keys(row)[1];
      
      if (nameKey && phoneKey && row[nameKey] && row[phoneKey]) {
        let phone = String(row[phoneKey]).replace(/\D/g, '');
        if (phone.length > 0) {
          contacts.push({
            id: crypto.randomUUID(),
            name: String(row[nameKey]).trim(),
            phone: phone,
            contacted: false
          });
        }
      }
    }

    if (contacts.length > 0) {
      setStatus('success');
      onDataLoaded(contacts);
    } else {
      setStatus('error');
      setErrorMessage('Não foi possível encontrar colunas de "Nome" e "Telefone" válidas.');
    }
  };

  const processFile = (file: File) => {
    setStatus('processing');
    setErrorMessage('');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: handleParseResults,
      error: (error: Error) => {
        setStatus('error');
        setErrorMessage(`Erro ao processar arquivo: ${error.message}`);
      }
    });
  };

  const processText = () => {
    if (!rawText.trim()) return;
    setStatus('processing');
    setErrorMessage('');
    Papa.parse(rawText, {
      header: true,
      skipEmptyLines: true,
      complete: handleParseResults,
      error: (error: Error) => {
        setStatus('error');
        setErrorMessage(`Erro ao processar texto: ${error.message}`);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        setStatus('error');
        setErrorMessage('Por favor, envie apenas arquivos .CSV');
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', marginBottom: 0 }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => { setImportMethod('text'); setStatus('idle'); }}
          style={{ flex: 1, padding: '1rem', background: importMethod === 'text' ? 'var(--surface)' : 'var(--surface-hover)', border: 'none', borderBottom: importMethod === 'text' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: importMethod === 'text' ? 600 : 400, color: 'var(--text-main)', transition: 'var(--transition)' }}
        >
          <div className="flex justify-center items-center gap-2"><Type size={18}/> Colar Texto</div>
        </button>
        <button 
          onClick={() => { setImportMethod('file'); setStatus('idle'); }}
          style={{ flex: 1, padding: '1rem', background: importMethod === 'file' ? 'var(--surface)' : 'var(--surface-hover)', border: 'none', borderBottom: importMethod === 'file' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: importMethod === 'file' ? 600 : 400, color: 'var(--text-main)', transition: 'var(--transition)' }}
        >
          <div className="flex justify-center items-center gap-2"><UploadCloud size={18}/> Arquivo CSV</div>
        </button>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {status === 'error' && (
           <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <AlertCircle size={20} style={{ flexShrink: 0 }} />
             <span>{errorMessage}</span>
           </div>
        )}

        {importMethod === 'text' ? (
          <div className="flex-col gap-4">
            
            <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💡 Extraia contatos de fotos usando IA
              </h4>
              <p className="text-sm mb-4">Copie a instrução mágica abaixo, envie junto com a foto da sua lista na sua IA favorita, e cole a resposta retornada na caixa de texto mais abaixo.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
                <button className="btn" onClick={handleCopyPrompt} style={{ backgroundColor: copied ? 'var(--primary)' : 'var(--surface)', color: copied ? 'white' : 'var(--text-main)', borderColor: copied ? 'var(--primary)' : 'var(--border)', width: '100%' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copiado!' : 'Copiar Prompt'}
                </button>
                <a href="https://gemini.google.com/" target="_blank" rel="noreferrer" className="btn" style={{ width: '100%' }}>
                  <ExternalLink size={16} /> Abrir Gemini
                </a>
                <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="btn" style={{ width: '100%' }}>
                  <ExternalLink size={16} /> Abrir ChatGPT
                </a>
                <a href="https://chat.deepseek.com/" target="_blank" rel="noreferrer" className="btn" style={{ width: '100%' }}>
                  <ExternalLink size={16} /> Abrir DeepSeek
                </a>
                <a href="https://copilot.microsoft.com/" target="_blank" rel="noreferrer" className="btn" style={{ width: '100%' }}>
                  <ExternalLink size={16} /> Abrir Copilot
                </a>
                <a href="https://grok.com/" target="_blank" rel="noreferrer" className="btn" style={{ width: '100%' }}>
                  <ExternalLink size={16} /> Abrir Grok
                </a>
              </div>
            </div>

            <textarea
              className="form-control"
              placeholder="Exemplo:&#10;Nome,Telefone&#10;João Silva,51999990001&#10;Maria Luz,51999990002"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={8}
            />
            <button className="btn btn-primary" onClick={processText} disabled={!rawText.trim()}>
              <FileText size={18} /> Processar Lista
            </button>
          </div>
        ) : (
          <div 
            className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              backgroundColor: isDragActive ? 'rgba(37, 211, 102, 0.05)' : 'transparent',
              transition: 'var(--transition)',
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => document.getElementById('csvInput')?.click()}
          >
            <input 
              id="csvInput"
              type="file" 
              accept=".csv" 
              style={{ display: 'none' }} 
              onChange={handleFileInput}
            />
            <div className="flex-col items-center gap-2">
              <UploadCloud size={48} color="var(--text-muted)" />
              <h3>Importar Contatos</h3>
              <p>Arraste e solte o seu arquivo CSV aqui, ou clique para buscar</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <CheckCircle size={32} color="var(--primary)" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '0.5rem' }}>Lista gerada com sucesso!</p>
          </div>
        )}
      </div>
    </div>
  );
};
