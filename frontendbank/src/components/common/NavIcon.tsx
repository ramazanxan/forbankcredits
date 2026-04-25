interface NavIconProps {
  name: string
  className?: string
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--accent-cyan)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {children}
    </span>
  )
}

export function NavIcon({ name, className }: NavIconProps) {
  const common = 'h-4 w-4'
  const iconClass = className ? `${common} ${className}` : common

  switch (name) {
    case 'profile':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15.8 9.8a3.8 3.8 0 1 0-7.6 0 3.8 3.8 0 0 0 7.6 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4.6 20c1.8-3.4 4.8-5.1 7.4-5.1S17.6 16.6 19.4 20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'home':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'score':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 18V6m4 12V10m4 8V8m4 10V12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'apply':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 7h8M8 11h8M8 15h5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M6 4h12a2 2 0 0 1 2 2v12l-3 2-3-2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'loans':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 8h16v8H4V8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M7 12h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'forum':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'settings':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M19.4 13a7.7 7.7 0 0 0 .06-1l1.65-1.27-1.6-2.77-2 .64a7.9 7.9 0 0 0-.85-.5l-.3-2.07h-3.2l-.3 2.07c-.3.14-.58.3-.85.5l-2-.64-1.6 2.77L4.54 12a7.7 7.7 0 0 0 .06 1L3 14.27l1.6 2.77 2-.64c.27.2.55.36.85.5l.3 2.07h3.2l.3-2.07c.3-.14.58-.3.85-.5l2 .64 1.6-2.77L19.4 13Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'compass':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'cases':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 7h10a2 2 0 0 1 2 2v10H5V9a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'users':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4 20c1.6-3 4.4-4.5 8-4.5S18.4 17 20 20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'it':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 8h10M9 12h6M10 16h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M6 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'rules':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 4h10v16H7V4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 8h6M9 12h6M9 16h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'batch':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 7h10M7 12h10M7 17h7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </IconBox>
      )
    case 'logs':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 4h7l3 3v13H7V4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 11h6M9 15h6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'bank':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 10h16M6 10v9m4-9v9m4-9v9m4-9v9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M3 10 12 4l9 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M4 19h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    case 'analytics':
      return (
        <IconBox>
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 18V6m4 12V9m4 9V12m4 6V8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </IconBox>
      )
    default:
      return <IconBox>{name.slice(0, 1).toUpperCase()}</IconBox>
  }
}

