import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Mail, MessageSquare, User, Tag } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Dúvida Geral',
    subject: '',
    message: '',
    _website_hp: '', // Campo honeypot anti-spam
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Verificação Honeypot Anti-Spam: Se um robô preencheu o campo oculto, simula sucesso sem enviar
    if (formData._website_hp) {
      console.log('Spam bot detectado.');
      setStatus('success');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, preencha seu nome, e-mail e mensagem.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('google_apps_script_url') : null;
      const scriptUrl = storedUrl || 'https://script.google.com/macros/s/AKfycbwB_uAmKMtUFPnr-osaEnqq55AdpOB2eVntEwr1XhSRcK6bhu0fNmmiECR9s2HWaZ2XCA/exec';

      const payload = {
        timestamp: new Date().toISOString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim() || 'Sem Assunto',
        message: formData.message.trim(),
      };

      if (scriptUrl.includes('placeholder')) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        category: 'Dúvida Geral',
        subject: '',
        message: '',
        _website_hp: '',
      });
    } catch (err: any) {
      console.error('Erro ao enviar contato:', err);
      setStatus('error');
      setErrorMessage('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    }
  };

  return (
    <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs transition-colors">
      {status === 'success' ? (
        <div className="text-center py-10 space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ink-primary)]">Mensagem Enviada com Sucesso!</h3>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] max-w-md mx-auto leading-relaxed">
            Obrigado pelo seu contato. Lemos todas as sugestões, dúvidas e relatos de melhorias enviados pelos nossos usuários.
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--canvas-inset)] hover:bg-[var(--hairline)] text-xs font-semibold text-[var(--ink-primary)] transition cursor-pointer"
          >
            Enviar Outra Mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Honeypot invisível */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="_website_hp"
              value={formData._website_hp}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
                Seu Nome <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[var(--ink-mute)] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Ana Silva"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-3 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl text-xs sm:text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-mute)]/50 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
                Seu E-mail <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[var(--ink-mute)] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-3 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl text-xs sm:text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-mute)]/50 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
                Categoria
              </label>
              <div className="relative flex items-center">
                <Tag className="w-4 h-4 text-[var(--ink-mute)] absolute left-3 pointer-events-none" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-3 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl text-xs sm:text-sm text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40 cursor-pointer"
                >
                  <option value="Dúvida Geral">Dúvida Geral</option>
                  <option value="Sugestão de Calculadora">Sugestão de Nova Calculadora</option>
                  <option value="Relato de Bug / Erro">Relato de Erro no Cálculo</option>
                  <option value="Parceria / Contato Comercial">Parceria / Contato Comercial</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
                Assunto (Opcional)
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Ex: Sugestão para cálculo de datas"
                value={formData.subject}
                onChange={handleChange}
                className="w-full h-10 px-3.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl text-xs sm:text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-mute)]/50 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
              Sua Mensagem <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Digite aqui sua mensagem com o máximo de detalhes possível..."
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl text-xs sm:text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-mute)]/50 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40"
            />
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full h-11 rounded-xl bg-[#0070f3] hover:bg-[#0761d1] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando Mensagem...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
