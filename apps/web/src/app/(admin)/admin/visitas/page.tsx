'use client';

import { VisitasView } from '@/components/admin/visitas/VisitasView';
import { mockVisitas } from '@/lib/mock/admin/visitas';

export default function AdminVisitasPage() {
  return <VisitasView visitas={mockVisitas} />;
}
