'use client';

import { BicicletasView } from '@/components/admin/bicicletas/BicicletasView';
import { mockBicicletas } from '@/lib/mock/admin/bicicletas';
import { mockCiclistas } from '@/lib/mock/admin/ciclistas';

export default function AdminBicicletasPage() {
  return <BicicletasView bicicletas={mockBicicletas} ciclistas={mockCiclistas} />;
}
