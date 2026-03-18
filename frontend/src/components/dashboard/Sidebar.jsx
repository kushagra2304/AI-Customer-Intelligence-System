import React from 'react';
import { NavLink } from 'react-router-dom';
import { LiveDot } from '../ui';

const navItems = [
  { to: '/',           icon: '◈', label: 'Overview'    },
  { to: '/queries',    icon: '◉', label: 'Queries'     },
  { to: '/analytics',  icon: '◆', label: 'Analytics'   },
  { to: '/automation', icon: '◎', label: 'Automation'  },
  { to: '/classify',   icon: '⊕', label: 'Classify'    },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-beast-surface border-r border-beast-border flex flex-col z-40">
      <div className="px-5 py-5 border-b border-beast-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-beast-accent flex items-center justify-center text-white font-black text-sm">B</div>
          <div>
            <p className="text-sm font-bold text-beast-text leading-none">BEASTLIFE</p>
            <p className="text-[10px] text-beast-muted mt-0.5 font-mono tracking-wider">AI INTELLIGENCE</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-b border-beast-border">
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="text-xs text-beast-dim font-mono">LIVE · MOCK MODE</span>
        </div>
      </div>
      <nav className="flex-1 py-3 px-3">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-beast-accent/10 text-beast-accent font-semibold'
                  : 'text-beast-dim hover:text-beast-text hover:bg-beast-border/50'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-beast-border">
        <p className="text-[10px] text-beast-muted font-mono leading-relaxed">
          STACK: MERN + LANGCHAIN<br/>
          CHROMA · MOCK DATA v1.0
        </p>
      </div>
    </aside>
  );
}
