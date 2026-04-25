import type { Role } from '@/types/domain'

export const ROLE_ROUTES: Record<Role, string> = {
  client: '/client',
  moderator: '/moderator',
  admin_it: '/admin/it',
  admin_bank: '/admin/bank',
}
