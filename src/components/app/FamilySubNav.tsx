import { NavLink } from 'react-router-dom'
import type { NavChild } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function FamilySubNav({ items }: { items: NavChild[] }) {
  return (
    <nav className="flex gap-1 overflow-x-auto py-2" aria-label="Sección">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-violet text-white shadow-sm'
                : 'text-plum/70 hover:bg-lilac-50 hover:text-plum',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
