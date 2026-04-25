import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/common/BrandMark'

export function LoadingScreen() {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(5,11,24,0.82)] backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        className="glass-panel flex flex-col items-center gap-5 rounded-[32px] px-10 py-12"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6, ease: 'easeInOut' }}
        >
          <BrandMark className="h-14 w-14" />
        </motion.div>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
          <div className="h-full w-1/2 animate-[scan_1.6s_linear_infinite] rounded-full bg-[linear-gradient(90deg,transparent,var(--accent-cyan),transparent)]" />
        </div>
        <p className="text-center text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">
          {t('common.loading')}
        </p>
      </motion.div>
    </div>
  )
}
