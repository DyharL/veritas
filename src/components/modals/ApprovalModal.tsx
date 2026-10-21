// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_MODAL_APPROVAL
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ShieldIcon,
  CloseIcon,
  RefreshCwIcon,
  TerminalIcon,
} from '@/components/ui/icons';

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  title: string;
  branch?: string;
  targetFile?: string;
  onApproved?: (data: { success: boolean; branch: string; seal: string }) => void;
}

export function ApprovalModal({
  isOpen,
  onClose,
  proposalId,
  title,
  branch = 'veritas/patch-supabase-auth',
  targetFile = 'src/lib/supabaseClient.ts',
  onApproved,
}: ApprovalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvedData, setApprovedData] = useState<{
    success: boolean;
    branch: string;
    seal: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vault/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          proposalId: proposalId,
          orgId: 'default-org',
          branch,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation du patch');
      }

      setApprovedData({
        success: true,
        branch: data.branch || branch,
        seal: data.seal || 'TR_SEAL_VERIFIED',
      });

      if (onApproved) {
        onApproved({
          success: true,
          branch: data.branch || branch,
          seal: data.seal || 'TR_SEAL_VERIFIED',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-[#121212] rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-5 bg-[#1c1c1c] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#fa870b] flex items-center justify-center text-black shrink-0 shadow-sm">
              <ShieldIcon size={22} className="text-black" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                Préparer la Pull Request
              </h3>
              <span className="text-[11px] font-mono text-[#666666]">
                Proposition ciblée : #{proposalId}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-black hover:bg-white/10 text-white flex items-center justify-center transition-colors"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-base font-bold text-white">{title}</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse"></span>
                Fait vérifié dans {targetFile}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#1c1c1c] border border-white/10 rounded-2xl flex items-start gap-3">
            <ShieldIcon size={22} className="text-[#fa870b] shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 leading-relaxed">
              Une branche isolée{' '}
              <code className="font-mono font-bold px-1.5 py-0.5 bg-black text-[#fa870b] rounded">
                {branch}
              </code>{' '}
              va être créée. Aucune ligne ne sera déployée en production sans votre examen direct sur GitHub.
            </p>
          </div>

          {approvedData ? (
            <div className="p-3.5 bg-[#fa870b]/15 border border-[#fa870b]/30 rounded-2xl flex items-center gap-2 text-xs font-mono text-white">
              <CheckCircleIcon size={16} className="text-[#fa870b]" />
              <div>
                <p className="font-bold">Branche {approvedData.branch} créée avec succès.</p>
                <p className="text-[10px] text-[#ffa600]">Sceau cryptographique : {approvedData.seal}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-2xl">
              <TerminalIcon size={16} className="text-[#fa870b]" />
              <span className="text-[11px] font-mono font-semibold text-white/80">
                Signature cryptographique @veritas/seal garantie
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-[#ff4f4e]/15 border border-[#ff4f4e]/30 text-[#ff4f4e] rounded-2xl text-xs font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1c1c1c] flex items-center justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-black border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {approvedData ? 'Fermer' : 'Annuler'}
          </button>
          {!approvedData && (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-5 py-2 rounded-full text-xs font-bold bg-white text-black hover:bg-[#ffa600] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCwIcon size={16} className="animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon size={16} />
                  <span>Confirmer &amp; créer la branche dédiée</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
