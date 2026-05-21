'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Send, Eye, CheckCircle } from 'lucide-react';
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
  Input, Label, Badge, Textarea,
} from '@app/ui';
import { api } from '@/lib/api';
import { isSuperAdmin } from '@/lib/auth';
import { EmailTemplate } from '@app/types';

const TEMPLATE_VARIABLES: Record<string, string[]> = {
  'welcome': ['name', 'appName'],
  'reset-password': ['name', 'code', 'appName'],
  'admin-notification': ['name', 'title', 'message', 'date', 'appName'],
  'account-confirmation': ['name', 'confirmationLink', 'appName'],
  'monthly-report': ['name', 'month', 'totalPosts', 'newPosts', 'lastAccess', 'appName'],
};

export default function EmailConfigPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testTemplate, setTestTemplate] = useState<EmailTemplate | null>(null);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // if (!isSuperAdmin()) {
    //   router.replace('/dashboard');
    //   return;
    // }
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const res = await api.get<EmailTemplate[]>('/api/nest/email/templates');
    setTemplates(res.data);
  }

  async function sendTest() {
    if (!testEmail || !testTemplate) return;
    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.post('/api/nest/email/send-template', { to: testEmail, templateId: testTemplate.slug });
      setSuccessMsg(`Email sent to ${testEmail}`);
      setTestEmail('');
      setTestTemplate(null);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? err.message ?? 'Failed to send email');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-3xl font-bold tracking-tight">Email Configuration</h2>
        </div>
        <p className="text-muted-foreground">Send test emails using your templates via Gmail SMTP</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>Select a template and enter a recipient email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Template</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={testTemplate?.slug ?? ''}
                onChange={(e) => {
                  const t = templates.find((t) => t.slug === e.target.value);
                  setTestTemplate(t ?? null);
                }}
              >
                <option value="">Select a template...</option>
                {templates.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
              {testTemplate && (
                <p className="text-xs text-muted-foreground">
                  Subject: <span className="text-foreground">{testTemplate.subject}</span>
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
          </div>
          {testTemplate && (
            <div className="space-y-1">
              <Label>Template Variables (auto-replaced)</Label>
              <div className="flex flex-wrap gap-1">
                {(TEMPLATE_VARIABLES[testTemplate.slug] ?? []).map((v) => (
                  <Badge key={v} variant="secondary" className="text-xs font-mono">
                    {`{{${v}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <Button onClick={sendTest} disabled={sending || !testEmail || !testTemplate} className="gap-2">
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Available Templates</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.slug}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">{t.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setPreviewTemplate(t)} title="Preview">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setTestTemplate(t); }}
                      title="Use this template"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.subject}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!previewTemplate} onOpenChange={(o) => !o && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <Input value={previewTemplate.subject} readOnly className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Body Preview</Label>
                <div
                  className="rounded-md border bg-white p-4 text-sm [&_*]:!font-sans"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Template Variables</Label>
                <div className="flex flex-wrap gap-1">
                  {(TEMPLATE_VARIABLES[previewTemplate.slug] ?? []).map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button
              onClick={() => {
                setTestTemplate(previewTemplate);
                setPreviewTemplate(null);
              }}
              className="gap-2"
            >
              <Send className="h-4 w-4" /> Use for Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}