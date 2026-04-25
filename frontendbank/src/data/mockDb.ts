import type {
  ApplicationRecord,
  AuthUser,
  BatchInputRow,
  ClientRecord,
  CreditProduct,
  ForumMessage,
  KPI,
  LoanRecord,
  ModelVersion,
  Role,
  SystemLog,
} from '@/types/domain'

export const demoProfiles: Record<Role, Omit<AuthUser, 'email'>> = {
  client: {
    id: 'usr-client',
    name: 'Алия',
    role: 'client',
    title: 'Личный кабинет',
    avatar: 'AN',
  },
  moderator: {
    id: 'usr-moderator',
    name: 'Тимур',
    role: 'moderator',
    title: 'Проверка заявок',
    avatar: 'TA',
  },
  admin_it: {
    id: 'usr-admin-it',
    name: 'Никита',
    role: 'admin_it',
    title: 'IT панель',
    avatar: 'NS',
  },
  admin_bank: {
    id: 'usr-admin-bank',
    name: 'Дана',
    role: 'admin_bank',
    title: 'Панель банка',
    avatar: 'DZ',
  },
}

export const products: CreditProduct[] = [
  {
    id: 'auto',
    type: 'auto',
    icon: '🚗',
    rate: 12.4,
    termMonths: 60,
    maxAmount: 18_000_000,
    title: 'Автокредит',
    description: 'Подходит для покупки нового или подержанного автомобиля.',
    perks: ['Онлайн-оформление', 'Без скрытых комиссий', 'Быстрое решение'],
  },
  {
    id: 'mortgage',
    type: 'mortgage',
    icon: '🏠',
    rate: 9.8,
    termMonths: 240,
    maxAmount: 120_000_000,
    title: 'Ипотека',
    description: 'Для покупки жилья с длительным сроком и понятным графиком платежей.',
    perks: ['Долгий срок', 'Семейные программы', 'Рефинансирование'],
  },
  {
    id: 'consumer',
    type: 'consumer',
    icon: '💰',
    rate: 18.9,
    termMonths: 48,
    maxAmount: 8_000_000,
    title: 'Потребительский кредит',
    description: 'Для ремонта, покупок и других личных целей без залога.',
    perks: ['Без залога', 'Быстрая выдача', 'Гибкий срок'],
  },
  {
    id: 'business',
    type: 'business',
    icon: '🏢',
    rate: 16.3,
    termMonths: 84,
    maxAmount: 55_000_000,
    title: 'Бизнес-кредит',
    description: 'Для оборотных средств, расширения и развития бизнеса.',
    perks: ['Пополнение оборотки', 'Поддержка менеджера', 'Крупные лимиты'],
  },
]

export const clientOverviewKpis: KPI[] = [
  { id: 'score', label: 'Ваш скор', value: '742', delta: '+24 за месяц' },
  { id: 'limit', label: 'Доступный лимит', value: '4,8 млн сом', delta: 'Обновлен сегодня' },
  { id: 'loans', label: 'Активные кредиты', value: '2', delta: 'Платежи без просрочек' },
]

export const moderatorOverviewKpis: KPI[] = [
  { id: 'queue', label: 'В очереди', value: '128', delta: '+11 с утра' },
  { id: 'sla', label: 'Среднее время', value: '07:24', delta: 'На одну заявку' },
  { id: 'accuracy', label: 'Совпадение с моделью', value: '91.4%', delta: 'За 7 дней' },
]

export const adminItOverviewKpis: KPI[] = [
  { id: 'uptime', label: 'Доступность сервиса', value: '99.97%', delta: 'Без сбоев' },
  { id: 'drift', label: 'Дрейф признаков', value: '0.08', delta: 'В пределах нормы' },
  { id: 'batch', label: 'Запусков за день', value: '14', delta: '2 ждут обновления' },
]

export const adminBankOverviewKpis: KPI[] = [
  { id: 'approval', label: 'Доля одобрений', value: '61.8%', delta: '+3.1 п.п. за неделю' },
  { id: 'yield', label: 'Доходность портфеля', value: '18.2%', delta: 'Стабильный уровень' },
  { id: 'loss', label: 'Ожидаемые потери', value: '4.7%', delta: 'Ниже лимита' },
]

export const loans: LoanRecord[] = [
  {
    id: 'LN-10294',
    product: 'Автокредит',
    amount: 7_500_000,
    balance: 5_140_000,
    monthlyPayment: 184_000,
    dueDate: '2026-05-03',
    status: 'active',
  },
  {
    id: 'LN-10417',
    product: 'Потребительский кредит',
    amount: 1_200_000,
    balance: 480_000,
    monthlyPayment: 84_200,
    dueDate: '2026-05-17',
    status: 'review',
  },
]

export const applications: ApplicationRecord[] = [
  {
    id: 'APP-9012',
    customer: 'Аружан К.',
    product: 'Ипотека',
    amount: 34_000_000,
    status: 'scored',
    probabilityDefault: 0.37,
    assignee: 'Тимур',
    createdAt: '2026-04-24 10:14',
  },
  {
    id: 'APP-9013',
    customer: 'Нурлан Б.',
    product: 'Бизнес-кредит',
    amount: 19_500_000,
    status: 'approved',
    probabilityDefault: 0.21,
    assignee: 'Система',
    createdAt: '2026-04-24 10:30',
  },
  {
    id: 'APP-9014',
    customer: 'Айгерим Т.',
    product: 'Потребительский кредит',
    amount: 3_200_000,
    status: 'declined',
    probabilityDefault: 0.71,
    assignee: 'Тимур',
    createdAt: '2026-04-24 11:08',
  },
]

export const clients: ClientRecord[] = [
  {
    id: 'CL-1001',
    name: 'Алия Н.',
    segment: 'Премиум',
    score: 742,
    activeLoans: 2,
    risk: 'low',
    manager: 'Самат А.',
  },
  {
    id: 'CL-1002',
    name: 'Ержан М.',
    segment: 'Стандарт',
    score: 688,
    activeLoans: 1,
    risk: 'medium',
    manager: 'Лаура К.',
  },
  {
    id: 'CL-1003',
    name: 'Дильназ С.',
    segment: 'Бизнес',
    score: 621,
    activeLoans: 3,
    risk: 'medium',
    manager: 'Мария С.',
  },
]

export const forumSeedMessages: ForumMessage[] = [
  {
    id: 'msg-1',
    author: 'Нурлан',
    role: 'guest',
    message: 'Кто уже загружал файл в пакетный тест? Удобно, что сразу видно первые строки.',
    time: '2 мин назад',
  },
  {
    id: 'msg-2',
    author: 'Айгерим',
    role: 'client',
    message: 'Скор рассчитался быстро, а платеж сразу показался на форме.',
    time: '1 мин назад',
  },
  {
    id: 'msg-3',
    author: 'Тимур',
    role: 'moderator',
    message: 'Факторы риска сразу видны, это ускоряет проверку заявки.',
    time: 'только что',
  },
]

export const modelVersions: ModelVersion[] = [
  {
    id: 'mdl-2026-04-prod',
    name: 'NeuroScore 2.4.1',
    stage: 'production',
    updatedAt: '2026-04-24 09:18',
    rocAuc: 0.847,
    drift: 'Низкий',
  },
  {
    id: 'mdl-2026-04-shadow',
    name: 'NeuroScore 2.5.0',
    stage: 'shadow',
    updatedAt: '2026-04-24 11:40',
    rocAuc: 0.861,
    drift: 'Средний',
  },
]

export const systemLogs: SystemLog[] = [
  {
    id: 'log-1',
    level: 'info',
    message: 'Очередь пакетных тестов синхронизирована',
    timestamp: '11:40:08',
  },
  {
    id: 'log-2',
    level: 'warning',
    message: 'Shadow-модель: дрифт по признаку inquiries_6m выше порога наблюдения',
    timestamp: '11:43:55',
  },
  {
    id: 'log-3',
    level: 'info',
    message: 'API скоринга доступен по /api/scoring/predict',
    timestamp: '11:44:21',
  },
]

export const partnerNames = [
  'Kaspi Partner',
  'FinBridge',
  'Astana Motors',
  'Nomad Realty',
  'SilkWay Capital',
  'Steppe Ventures',
]

export const batchTemplateRows: BatchInputRow[] = [
  {
    credit_id: 'CR-001',
    age: 28,
    monthly_income: 750000,
    employment_years: 4,
    loan_amount: 3500000,
    loan_term_months: 36,
    interest_rate: 17,
    past_due_30d: 0,
    inquiries_6m: 1,
    actual: 0,
  },
  {
    credit_id: 'CR-002',
    age: 22,
    monthly_income: 420000,
    employment_years: 1,
    loan_amount: 2800000,
    loan_term_months: 48,
    interest_rate: 23,
    past_due_30d: 2,
    inquiries_6m: 5,
    actual: 1,
  },
  {
    credit_id: 'CR-003',
    age: 37,
    monthly_income: 1200000,
    employment_years: 9,
    loan_amount: 6200000,
    loan_term_months: 60,
    interest_rate: 14,
    past_due_30d: 0,
    inquiries_6m: 2,
    actual: 0,
  },
  {
    credit_id: 'CR-004',
    age: 31,
    monthly_income: 530000,
    employment_years: 3,
    loan_amount: 4100000,
    loan_term_months: 60,
    interest_rate: 20,
    past_due_30d: 1,
    inquiries_6m: 4,
    actual: 1,
  },
  {
    credit_id: 'CR-005',
    age: 45,
    monthly_income: 1800000,
    employment_years: 15,
    loan_amount: 7900000,
    loan_term_months: 72,
    interest_rate: 12,
    past_due_30d: 0,
    inquiries_6m: 1,
    actual: 0,
  },
]

export function createDemoUser(role: Role, email: string): AuthUser {
  const profile = demoProfiles[role]

  return {
    ...profile,
    email,
  }
}

export function createInitialDemoState() {
  return {
    applications: [...applications],
    clients: [...clients],
    loans: [...loans],
    forumMessages: [...forumSeedMessages],
    modelVersions: [...modelVersions],
    systemLogs: [...systemLogs],
    batchRuns: [],
  }
}

export function generateLiveForumMessage(index: number): ForumMessage {
  const source = forumSeedMessages[index % forumSeedMessages.length]

  return {
    ...source,
    id: `live-${index}-${source.id}`,
    time: 'сейчас',
  }
}
