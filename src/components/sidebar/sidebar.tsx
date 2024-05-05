'use client';
import { Menu, Radio } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { SidebarItems } from './sidebar-items';

interface SidebarProps {
  content: ReactNode;
}

export function Sidebar({ content }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prevWidth, setPrevWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const currentWidth = window.innerWidth;

        // If the screen width changes view mode (mobile/desktop), update isOpen
        if (
          (prevWidth >= 768 && currentWidth < 768) ||
          (prevWidth < 768 && currentWidth >= 768)
        ) {
          const shouldBeOpen = currentWidth >= 768;
          setIsOpen(shouldBeOpen);
        }

        document.body.style.overflow =
          currentWidth < 768 ? (isOpen ? 'hidden' : 'visible') : 'visible';

        // Update previous width
        setPrevWidth(currentWidth);
      };

      window.addEventListener('resize', handleResize);

      // Initial setup
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        document.body.style.overflow = 'visible';
      };
    }
  }, [isOpen, prevWidth]);

  const toggleSidebar = () => {
    setIsOpen((previousOpen) => !previousOpen);
  };

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
          <button className='cursor-pointer' onClick={toggleSidebar}>
            <span className='sr-only'>Toggle sidebar</span>
            <Menu />
          </button>
        </div>

        <SidebarItems />
      </nav>

      <button
        className={`fixed z-20 top-3 bg-sidebar text-white p-2 rounded-r shadow-md ${
          isOpen ? 'hidden left-64' : 'block'
        }`}
        onClick={toggleSidebar}
      >
        <span className='sr-only'>Toggle sidebar</span>
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
