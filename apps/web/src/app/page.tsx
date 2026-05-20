import { redirect } from 'next/navigation';

/** Sin DB/auth activo: entrada directa al panel admin (mocks). */
export default function HomePage() {
  redirect('/admin/dashboard');
}
