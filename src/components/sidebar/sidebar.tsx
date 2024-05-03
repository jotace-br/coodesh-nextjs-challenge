'use client';
import { Menu, Radio } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { SidebarItems } from './sidebar-items';

interface SidebarProps {
  content: ReactNode;
}

export function Sidebar({ content }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className='relative flex h-screen'>
      <nav
        className={`bg-sidebar text-slate-50 fixed h-full w-full md:w-64 space-y-4 p-4 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-row-reverse items-center justify-between'>
          <div className='flex items-center gap-1'>
            <h1 className='text-2xl font-bold tracking-tighter'>Seeker</h1>
            <Radio />
          </div>
          <button
            className='cursor-pointer'
            onClick={() => setIsOpen((previousOpen) => !previousOpen)}
          >
            <Menu />
          </button>
        </div>

        <SidebarItems />
      </nav>

      <button
        className={`absolute z-20 top-3 bg-sidebar text-white p-2 rounded-r shadow-md ${
          isOpen ? 'hidden left-64' : 'block'
        }`}
        onClick={() => setIsOpen((previousOpen) => !previousOpen)}
      >
        <Menu />
      </button>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
