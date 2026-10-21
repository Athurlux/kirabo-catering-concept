// Interface glyphs on a 24px grid, stroked in currentColor.
const paths = {
  check: 'M4 12l5 5L20 6',
  plus: 'M12 5v14M5 12h14',
  back: 'M19 12H5m5-5-5 5 5 5',
  left: 'M15 5l-7 7 7 7',
  right: 'M9 5l7 7-7 7',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Z',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6 6 18',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4.5 4.5',
  // A plate with a leaf: "my menu".
  plate: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-4.5C8 12 10.5 8.5 15.5 8c.4 4.6-2.6 8-7 8.5Zm0 0 5-6',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  )
}
