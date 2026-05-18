'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const policyholderLinks = [
  { href: '/dashboard', label: 'Claims', icon: '&#9638;' },
  { href: '/policy', label: 'Policy Details', icon: '&#128196;' },
];

const adjusterLinks = [
  { href: '/adjuster', label: 'Claims Queue', icon: '&#9776;' },
  { href: '/adjuster/settings', label: 'Settings', icon: '&#9881;' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const links = user.role === 'policyholder' ? policyholderLinks : adjusterLinks;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-100">
        <Link href={user.role === 'policyholder' ? '/dashboard' : '/adjuster'}>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            ClaimPilot
          </h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: link.icon }} className="text-base" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role === 'adjuster' ? 'Claims Adjuster' : 'Policyholder'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full text-left px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
