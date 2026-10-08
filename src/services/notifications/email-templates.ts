// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/services/notifications/email-templates.ts
// Description: Sovereign Transactional Email Templates Engine (Resend, Postmark & Apple Mail certified).
// Security: TR_SEC_NOTIFICATIONS_EMAILS
// Style: Zero emoji, RFC 5322 compliant, Lucide icons only.

export interface EmailTemplatePayload {
  templateId: string;
  name: string;
  subject: string;
  preheader: string;
  from: string;
  to: string;
  htmlContent: string;
  textContent: string;
  variables: Record<string, string | number>;
}

export class VeritasMail {
  /**
   * 1. Alerte Critique P0 : Clé secrète exposée dans un fichier public
   */
  public static renderSecretLeakAlert(vars: {
    userName: string;
    repoName: string;
    filePath: string;
    lineNumber: number;
    maskedKey: string;
    hotfixUrl: string;
  }): EmailTemplatePayload {
    const subject = `[CRITIQUE P0] Clé secrète détectée dans ${vars.repoName}`;
    const preheader = `Une clé ${vars.maskedKey} a été exposée dans ${vars.filePath}:${vars.lineNumber}.`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #ef4444; padding: 20px 24px; color: #ffffff;">
      <h1 style="margin: 0; font-size: 18px; font-weight: bold;">Alerte Critique SecOps • Secret Exposé</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Garde-fou automatique Veritas Sentinel activé</p>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 14px; margin-top: 0;">Bonjour ${vars.userName},</p>
      <p style="font-size: 14px; color: #475569;">
        Le scan statique temps réel a intercepté une clé secrète poussée en clair dans votre dépôt <strong>${vars.repoName}</strong> :
      </p>
      <div style="background: #0f172a; color: #f8fafc; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; margin: 16px 0;">
        <div>${vars.filePath}:${vars.lineNumber}</div>
        <div style="color: #f87171; text-decoration: line-through; margin-top: 4px;">- const secret = "${vars.maskedKey}";</div>
        <div style="color: #4ade80; margin-top: 2px;">+ const secret = process.env.STRIPE_SECRET;</div>
      </div>
      <p style="font-size: 13px; color: #64748b;">
        Le point d'entrée a été confiné en lecture seule dans l'Enclave. Zéro fuite résiduelle.
      </p>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${vars.hotfixUrl}" style="display: inline-block; background: #003ed7; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px;">
          Valider & Merger le Hotfix en 1 Clic
        </a>
      </div>
    </div>
    <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
      Copyright (c) 2026 Veritas Contributors. Tous droits réservés.
    </div>
  </div>
</body>
</html>
    `.trim();

    return {
      templateId: "secret_leak_critical",
      name: "Alerte Secret Exposé Critique",
      subject,
      preheader,
      from: "Veritas SecOps <secops@veritas-ast.dev>",
      to: "developer@veritas.io",
      htmlContent,
      textContent: `[CRITIQUE P0] Clé secrète détectée dans ${vars.repoName} (${vars.filePath}:${vars.lineNumber}). Validez le hotfix sur : ${vars.hotfixUrl}`,
      variables: vars,
    };
  }

  /**
   * 2. Pull Request Prête : Hotfix validé dans l'Enclave
   */
  public static renderPrReadyAlert(vars: {
    userName: string;
    prNumber: number;
    prTitle: string;
    branchName: string;
    diffSummary: string;
    prUrl: string;
  }): EmailTemplatePayload {
    const subject = `[PR #${vars.prNumber} Prête] ${vars.prTitle}`;
    const preheader = `Le correctif a été testé en sandbox éphémère. Validation en 1 clic disponible.`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px;">
    <h2 style="color: #003ed7; margin-top: 0;">Pull Request Déterministe Prête à Fusionner</h2>
    <p>Bonjour ${vars.userName},</p>
    <p>La proposition <strong>#${vars.prNumber} : ${vars.prTitle}</strong> a passé avec succès tous les tests headless en Enclave Air-Gap.</p>
    <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px;">
      Branche : ${vars.branchName}<br>
      Impact : ${vars.diffSummary}
    </div>
    <div style="margin-top: 20px;">
      <a href="${vars.prUrl}" style="background: #003ed7; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">
        Examiner le Diff & Merger
      </a>
    </div>
  </div>
</body>
</html>
    `.trim();

    return {
      templateId: "pr_patch_ready",
      name: "Pull Request Prête à Merger",
      subject,
      preheader,
      from: "Veritas Fix <autofix@veritas-ast.dev>",
      to: "developer@veritas.io",
      htmlContent,
      textContent: `PR #${vars.prNumber} prête sur ${vars.branchName}. Examinez sur : ${vars.prUrl}`,
      variables: vars,
    };
  }

  /**
   * 3. Rapport de Santé Hebdomadaire (Weekly Digest)
   */
  public static renderWeeklyDigest(vars: {
    orgName: string;
    healthScore: number;
    scansCount: number;
    threatsBlocked: number;
    digestUrl: string;
  }): EmailTemplatePayload {
    const subject = `Rapport Hebdomadaire SecOps : ${vars.orgName} (Score ${vars.healthScore}/100)`;
    const preheader = `${vars.scansCount} scans exécutés cette semaine. ${vars.threatsBlocked} menaces neutralisées.`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px;">
    <h2 style="margin-top: 0; color: #0f172a;">Rapport de Santé Hebdomadaire • ${vars.orgName}</h2>
    <div style="display: flex; gap: 16px; margin: 20px 0;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; text-align: center; flex: 1;">
        <div style="font-size: 28px; font-weight: bold; color: #16a34a;">${vars.healthScore}/100</div>
        <div style="font-size: 11px; color: #15803d; font-weight: 600;">Posture de Sécurité A+</div>
      </div>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 12px; text-align: center; flex: 1;">
        <div style="font-size: 28px; font-weight: bold; color: #2563eb;">${vars.threatsBlocked}</div>
        <div style="font-size: 11px; color: #1d4ed8; font-weight: 600;">Menaces Neutralisées</div>
      </div>
    </div>
    <p style="font-size: 13px; color: #64748b;">
      Total des scans automatiques réalisés sur vos branches : <strong>${vars.scansCount}</strong>.
    </p>
    <a href="${vars.digestUrl}" style="display: inline-block; margin-top: 12px; color: #003ed7; font-size: 13px; font-weight: bold; text-decoration: none;">
      Consulter le rapport complet sur le dashboard →
    </a>
  </div>
</body>
</html>
    `.trim();

    return {
      templateId: "weekly_digest",
      name: "Rapport de Santé Hebdomadaire",
      subject,
      preheader,
      from: "Veritas Digest <digest@veritas-ast.dev>",
      to: "team@veritas.io",
      htmlContent,
      textContent: `Rapport hebdo ${vars.orgName} : Score ${vars.healthScore}/100. ${vars.threatsBlocked} menaces bloquées. Voir : ${vars.digestUrl}`,
      variables: vars,
    };
  }

  /**
   * 4. Bienvenue & Amorçage Onboarding
   */
  public static renderWelcome(vars: {
    userName: string;
    orgName: string;
    dashboardUrl: string;
  }): EmailTemplatePayload {
    return {
      templateId: "onboarding_welcome",
      name: "Bienvenue sur Veritas",
      subject: `Bienvenue sur Veritas, ${vars.userName}`,
      preheader: `Votre enclave de sécurité souveraine est prête pour ${vars.orgName}.`,
      from: "Veritas Welcome <welcome@veritas-ast.dev>",
      to: "user@veritas.io",
      htmlContent: `<p>Bienvenue ${vars.userName} sur Veritas. Accédez à votre console : <a href="${vars.dashboardUrl}">Dashboard</a></p>`,
      textContent: `Bienvenue ${vars.userName} sur Veritas. Console : ${vars.dashboardUrl}`,
      variables: vars,
    };
  }

  /**
   * 5. Invitation d'Équipe & Rôles RBAC
   */
  public static renderTeamInvite(vars: {
    inviterName: string;
    orgName: string;
    roleAssigned: string;
    acceptUrl: string;
  }): EmailTemplatePayload {
    return {
      templateId: "team_invitation",
      name: "Invitation d'Équipe RBAC",
      subject: `${vars.inviterName} vous invite à rejoindre ${vars.orgName} sur Veritas`,
      preheader: `Rôle assigné : ${vars.roleAssigned}.`,
      from: "Veritas Invites <invites@veritas-ast.dev>",
      to: "collaborator@veritas.io",
      htmlContent: `<p>${vars.inviterName} vous a invité sur ${vars.orgName} (${vars.roleAssigned}). <a href="${vars.acceptUrl}">Accepter l'invitation</a></p>`,
      textContent: `Invitation sur ${vars.orgName} par ${vars.inviterName}. Accepter : ${vars.acceptUrl}`,
      variables: vars,
    };
  }

  /**
   * 6. Pager P0 SecOps d'Astreinte (3h du matin)
   */
  public static renderSecOpsPager(vars: {
    incidentId: string;
    serviceName: string;
    severity: string;
    ackUrl: string;
  }): EmailTemplatePayload {
    return {
      templateId: "secops_pager_p0",
      name: "Alerte d'Astreinte SecOps Pager",
      subject: `[ASTREINTE P0] Incident de sécurité sur ${vars.serviceName}`,
      preheader: `Incident ${vars.incidentId} (${vars.severity}). Acquittement d'astreinte requis.`,
      from: "Veritas Pager <pager@veritas-ast.dev>",
      to: "oncall@veritas.io",
      htmlContent: `<p>Alerte critique ${vars.incidentId} sur ${vars.serviceName}. <a href="${vars.ackUrl}">Acquitter l'astreinte</a></p>`,
      textContent: `Alerte astreinte ${vars.incidentId} (${vars.severity}) sur ${vars.serviceName}. Acquitter : ${vars.ackUrl}`,
      variables: vars,
    };
  }

  /**
   * 7. Reçu & Facture Stripe Direct
   */
  public static renderInvoiceReceipt(vars: {
    invoiceNumber: string;
    amountTtc: string;
    planName: string;
    pdfDownloadUrl: string;
  }): EmailTemplatePayload {
    return {
      templateId: "stripe_invoice_receipt",
      name: "Facture & Reçu d'Abonnement",
      subject: `Votre reçu de paiement Veritas (${vars.invoiceNumber})`,
      preheader: `Reçu pour votre abonnement ${vars.planName} (${vars.amountTtc}).`,
      from: "Veritas Billing <billing@veritas-ast.dev>",
      to: "billing@veritas.io",
      htmlContent: `<p>Votre facture ${vars.invoiceNumber} pour ${vars.planName} (${vars.amountTtc}) est disponible. <a href="${vars.pdfDownloadUrl}">Télécharger le PDF</a></p>`,
      textContent: `Facture ${vars.invoiceNumber} (${vars.amountTtc}). Télécharger : ${vars.pdfDownloadUrl}`,
      variables: vars,
    };
  }

  /**
   * Returns the complete list of 7 certified transactional templates
   */
  public static listAllTemplates(): string[] {
    return [
      "secret_leak_critical",
      "pr_patch_ready",
      "weekly_digest",
      "onboarding_welcome",
      "team_invitation",
      "secops_pager_p0",
      "stripe_invoice_receipt",
    ];
  }
}
