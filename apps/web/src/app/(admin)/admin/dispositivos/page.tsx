'use client';

import { DispositivosView } from '@/components/admin/dispositivos/DispositivosView';
import { mockDispositivos } from '@/lib/mock/admin/dispositivos';

export default function AdminDispositivosPage() {
  return <DispositivosView dispositivos={mockDispositivos} />;
}
