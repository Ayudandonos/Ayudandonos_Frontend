import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { donationsService } from '@/features/donations/services/donations.service';
import type { DonationMessage } from '@/features/donations/types/donations.types';
import { useAuth } from '@/context/useAuth';
import { parseApiError } from '@/utils/api-error';
import { cn } from '@/utils/cn';

const POLL_INTERVAL_MS = 12000;

interface DonationChatPanelProps {
  donationId: string;
}

/**
 * Entrada: donationId: UUID de la donacion con conversacion asociada.
 * Proceso: Carga mensajes, los actualiza por sondeo periodico y permite enviar nuevos.
 * Salida: Retorna el elemento JSX del panel de chat.
 */
export function DonationChatPanel({ donationId }: DonationChatPanelProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DonationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /**
   * Entrada: Ninguna.
   * Proceso: Consulta los mensajes de la conversacion de la donacion.
   * Salida: No retorna valor; actualiza el listado de mensajes.
   */
  const loadMessages = useCallback(async () => {
    try {
      const result = await donationsService.fetchDonationMessages(donationId, 1, 100);
      setMessages(result.items);
      setError('');
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.DONATIONS_MESSAGES_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [donationId]);

  useEffect(() => {
    void loadMessages();
    const interval = setInterval(() => void loadMessages(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  /**
   * Entrada: Ninguna (usa estado body).
   * Proceso: Envia el mensaje escrito y recarga la conversacion.
   * Salida: No retorna valor; limpia el campo de texto.
   */
  async function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }
    setIsSending(true);
    setError('');
    try {
      const created = await donationsService.sendDonationMessage(donationId, trimmed);
      setMessages((current) => [...current, created]);
      setBody('');
    } catch (sendError) {
      setError(parseApiError(sendError).message || UI_MESSAGES.DONATIONS_MESSAGE_SEND_ERROR);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card glass={false} className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">{UI_MESSAGES.DONATIONS_MESSAGES_TITLE}</h2>

      <div className="max-h-80 space-y-3 overflow-y-auto rounded-lg border border-border-default bg-vivid-50/40 p-3">
        {isLoading && <p className="text-sm text-text-muted">{UI_MESSAGES.LOADING}</p>}

        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-text-muted">{UI_MESSAGES.DONATIONS_MESSAGES_EMPTY}</p>
        )}

        {messages.map((message) => {
          const isOwn = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  isOwn ? 'bg-primary-700 text-white' : 'bg-white text-text-primary shadow-sm',
                )}
              >
                {!isOwn && (
                  <p className="mb-0.5 text-xs font-semibold opacity-80">{message.senderFullName}</p>
                )}
                <p>{message.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <textarea
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={UI_MESSAGES.DONATIONS_MESSAGE_PLACEHOLDER}
          className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-2 text-sm text-text-primary focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
        />
        <Button
          type="button"
          isLoading={isSending}
          onClick={() => void handleSend()}
          disabled={!body.trim()}
        >
          {UI_MESSAGES.DONATIONS_MESSAGE_SEND}
        </Button>
      </div>
    </Card>
  );
}
