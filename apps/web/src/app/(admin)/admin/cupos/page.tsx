'use client';

import { CuposView } from '@/components/admin/cupos/CuposView';
import { mockBicicletas } from '@/lib/mock/admin/bicicletas';
import { mockCiclistas } from '@/lib/mock/admin/ciclistas';
import { mockCupos } from '@/lib/mock/admin/cupos';

export default function AdminCuposPage() {
  return (
    <CuposView cupos={mockCupos} ciclistas={mockCiclistas} bicicletas={mockBicicletas} />
  );
}
