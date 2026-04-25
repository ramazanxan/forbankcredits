const ru = {
  common: {
    brand: 'NeuroBank',
    tagline: 'Сервис кредитного скоринга на базе ИИ',
    loading: 'Загружаем интерфейс',
    calculate: 'Рассчитать',
    retry: 'Попробовать снова',
    continue: 'Далее',
    submit: 'Отправить',
    cancel: 'Отмена',
    save: 'Сохранить',
    open: 'Открыть',
    close: 'Закрыть',
    all: 'Все',
    comingSoon: 'Раздел готов к подключению API',
    updateOnRefresh: 'Обновится после перезагрузки',
    demoMode: 'Рабочий доступ',
    language: 'Язык',
    theme: 'Тема',
    support: 'Поддержка',
    logout: 'Выйти',
    dashboard: 'Личный кабинет',
    status: 'Статус',
    probability: 'P(default)',
    risk: 'Риск',
    actual: 'Факт',
    prediction: 'Прогноз',
  },
  roles: {
    client: 'Клиент',
    moderator: 'Модератор',
    admin_it: 'IT-админ',
    admin_bank: 'Администратор банка',
  },
  nav: {
    public: [
      { label: 'Как это работает', href: '#how' },
      { label: 'Кредиты', href: '#products' },
      { label: 'Форум', href: '#community' },
      { label: 'Поддержка', href: '/support' },
    ],
    client: [
      { label: 'Главная', href: '/client', icon: 'home' },
      { label: 'Рассчитать скор', href: '/client/score', icon: 'score' },
      { label: 'Подать заявку', href: '/client/apply', icon: 'apply' },
      { label: 'Мои кредиты', href: '/client/loans', icon: 'loans' },
      { label: 'Форум и чат', href: '/client/forum', icon: 'forum' },
      { label: 'Профиль', href: '/profile', icon: 'profile' },
      { label: 'Настройки', href: '/client/settings', icon: 'settings' },
    ],
    moderator: [
      { label: 'Обзор', href: '/moderator', icon: 'compass' },
      { label: 'Заявки', href: '/moderator/applications', icon: 'cases' },
      { label: 'Клиенты', href: '/moderator/clients', icon: 'users' },
      { label: 'Профиль', href: '/profile', icon: 'profile' },
    ],
    admin_it: [
      { label: 'IT панель', href: '/admin/it', icon: 'it' },
      { label: 'Учетные записи', href: '/admin/it/users', icon: 'users' },
      { label: 'Модели и правила', href: '/admin/it/formulas', icon: 'rules' },
      { label: 'Пакетный тест', href: '/admin/it/batch-test', icon: 'batch' },
      { label: 'Логи', href: '/admin/it/logs', icon: 'logs' },
      { label: 'Профиль', href: '/profile', icon: 'profile' },
    ],
    admin_bank: [
      { label: 'Панель банка', href: '/admin/bank', icon: 'bank' },
      { label: 'Правила банка', href: '/admin/bank/formulas', icon: 'rules' },
      { label: 'Аналитика', href: '/admin/bank/analytics', icon: 'analytics' },
      { label: 'Профиль', href: '/profile', icon: 'profile' },
    ],
  },
  landing: {
    hero: {
      eyebrow: 'Онлайн-скоринг и заявки',
      lines: ['КРЕДИТ.', 'БЫСТРО.', 'ПОНЯТНО.'],
      subtitle:
        'Рассчитайте кредитный риск, подайте заявку и отслеживайте результат в одном интерфейсе.',
      primary: 'Рассчитать скор',
      secondary: 'Войти',
      cardTitle: 'Карта клиента',
      cardChip: 'Кредитный лимит',
    },
    how: {
      eyebrow: 'Как это работает',
      title: 'От заявки до решения за несколько шагов',
      description: 'Заполнение формы, расчет риска и получение результата без лишних экранов.',
      steps: [
        {
          title: 'Заполните форму',
          text: 'Укажите данные по доходу, сумме кредита, ставке и кредитной нагрузке.',
        },
        {
          title: 'Получите расчет',
          text: 'Система оценит риск, рассчитает платеж и покажет вероятность дефолта.',
        },
        {
          title: 'Выберите следующий шаг',
          text: 'После расчета можно сразу перейти к подаче заявки или скорректировать параметры.',
        },
      ],
    },
    products: {
      eyebrow: 'Кредитные продукты',
      title: 'Выберите подходящий формат финансирования',
    },
    trust: {
      eyebrow: 'Нам доверяют',
      title: 'Ключевые показатели сервиса',
      stats: [
        { label: 'клиентов', value: '50 000+' },
        { label: 'точность модели', value: '98%' },
        { label: 'среднее время', value: '2 мин' },
      ],
    },
    forum: {
      eyebrow: 'Сообщество',
      title: 'Вопросы, отзывы и быстрые ответы',
      cta: 'Открыть форум',
    },
    finalCta: {
      title: 'Готовы проверить заявку?',
      text: 'Рассчитайте скор или сразу перейдите к заполнению кредитной заявки.',
      action: 'Перейти к расчету',
    },
    footer: 'Frontend для интеграции с Django REST API',
  },
  auth: {
    login: {
      title: 'Вход в NeuroBank',
      text: 'Введите рабочую почту и пароль. После входа система откроет ваш кабинет и актуальные задачи.',
      email: 'Почта или телефон',
      password: 'Пароль',
      action: 'Войти',
      register: 'Создать аккаунт',
    },
    register: {
      title: 'Регистрация',
      subtitle: 'Заполните данные, чтобы создать кабинет и продолжить работу с заявками.',
      steps: ['Профиль', 'Контакты', 'Безопасность'],
      fullName: 'ФИО',
      email: 'Почта',
      phone: 'Телефон',
      incomeBand: 'Доход',
      action: 'Создать аккаунт',
    },
  },
  client: {
    dashboard: {
      title: 'Главная',
      text: 'Ваш скор, активные кредиты и доступные предложения собраны в одном разделе.',
      quickActions: ['Рассчитать скор', 'Подать заявку', 'Открыть форум'],
    },
    score: {
      title: 'Расчет кредитного скора',
      text: 'Заполните основные поля; при необходимости укажите расширенный профиль — он учитывается в демо-расчете вместе с основными данными.',
      monthlyIncome: 'Ежемесячный доход',
      employmentYears: 'Стаж работы',
      loanAmount: 'Сумма кредита',
      loanTerm: 'Срок кредита',
      interestRate: 'Процентная ставка',
      pastDue: 'Количество просрочек свыше 30 дней',
      inquiries: 'Количество запросов кредитной истории за последние 6 месяцев',
      age: 'Возраст',
      previewPayment: 'Ежемесячный платеж',
      previewOverpayment: 'Переплата',
      previewRisk: 'Индикатор риска',
      youngDeclineTitle: 'Пока не одобрено',
      youngDeclineSubtitle: 'Показатели пока недостаточны для положительного решения.',
      youngDeclineBody: 'Что можно улучшить перед повторной подачей:',
      adultDeclineTitle: 'Заявка не одобрена',
      adultDeclineSubtitle: 'Текущий профиль риска выше допустимого порога.',
      approvedTitle: 'ОДОБРЕНО',
      approvedAction: 'Перейти к оформлению',
      managerAction: 'Связаться с менеджером',
      additionalParams: 'Дополнительные параметры',
      additionalParamsHide: 'Свернуть',
      additionalParamsIntro:
        'Кратко опишите свои данные по каждому пункту — в демо-модели это суммируется с основной формой (чем подробнее заполнение, тем сильнее влияние на расчёт).',
      additionalParamsItems: [
        {
          title: 'Социал-демографические данные (пол, возраст)',
          text: 'Соцсети, открытые профили.',
          placeholder: 'Например: муж, 34 года',
        },
        {
          title: 'Страна рождения и страна работы',
          text: 'Соцсети, LinkedIn, открытые реестры.',
          placeholder: 'Например: родился в КР, работа в Бишкеке',
        },
        {
          title: 'Рабочее место (сектор) и профессия',
          text: 'LinkedIn, сайты компаний, резюме.',
          placeholder: 'Например: банк, аналитик кредитных рисков, 5 лет',
        },
        {
          title: 'Образование',
          text: 'Профили в соцсетях, сайты вузов.',
          placeholder: 'Например: высшее, КНУ, финансы',
        },
        {
          title: 'Семейное положение',
          text: 'Соцсети (статус, фото).',
          placeholder: 'Например: в браке, двое детей',
        },
        {
          title: 'Политические взгляды',
          text: 'Публичные посты, подписки, комментарии.',
          placeholder: 'Например: не участвую в политических дискуссиях онлайн',
        },
        {
          title: 'Политико-экономическая ситуация страны',
          text: 'Аналитика, новости.',
          placeholder: 'Например: стабильный курс валюты, без просрочек по налогам',
        },
        {
          title: 'Юридическая часть (судимости, штрафы)',
          text: 'Базы судебных приставов, реестры судов (часто открыты).',
          placeholder: 'Например: судимостей нет, штрафы ГИБ оплачены',
        },
        {
          title: 'Проживание в столице',
          text: 'Геотеги, информация из профилей.',
          placeholder: 'Например: постоянная регистрация и проживание в Бишкеке',
        },
      ],
    },
    apply: {
      title: 'Подача заявки',
      text: 'Выберите продукт и заполните основные параметры заявки.',
      selectProduct: 'Выберите продукт',
      purpose: 'Цель кредита',
      notes: 'Комментарий',
      submit: 'Отправить заявку',
      successBadge: 'Заявка отправлена',
      successTitle: 'Спасибо, мы получили вашу заявку',
      successLead:
        'Менеджер кредитного отдела свяжется с вами по контактам из профиля в ближайшее рабочее время. При необходимости уточнит сумму, срок и пакет документов.',
      successVisit: 'Офис для личной подачи документов',
      successAddress: 'г. Бишкек, ул. Чынгыз Айтматова, 66',
      successHours: 'Пн–Пт: 09:00–18:00, обед 12:30–13:30',
      successPhonesTitle: 'Контактные номера',
      successPhoneHotline: '+996 (312) 610-900 — горячая линия',
      successPhoneCredit: '+996 (555) 120-440 — кредитный отдел',
      successPhoneWhatsapp: '+996 (700) 330-120 — WhatsApp (только сообщения)',
      successCallback:
        'Если вы не получили звонок в течение двух рабочих дней, наберите горячую линию и назовите номер заявки из SMS (в демо-режиме SMS не отправляется).',
      successSummaryNote: 'Заявка зафиксирована в системе. Дальнейшие шаги — звонок менеджера или визит в офис.',
      successAgain: 'Отправить ещё одну',
      successToDashboard: 'В личный кабинет',
    },
    loans: {
      title: 'Мои кредиты',
      text: 'Остаток, платежи и даты по действующим кредитам.',
    },
    forum: {
      title: 'Форум и чат',
      text: 'Здесь можно задать вопрос по заявке, кредиту или работе сервиса.',
    },
    settings: {
      title: 'Настройки',
      text: 'Управление оформлением, языком и звуковыми уведомлениями.',
    },
  },
  moderator: {
    dashboard: {
      title: 'Панель модератора',
      text: 'Очередь заявок и приоритетные кейсы для ручной проверки.',
    },
    applications: {
      title: 'Заявки на рассмотрении',
      text: 'Список заявок с суммой, риском и текущим статусом.',
    },
    clients: {
      title: 'Клиенты',
      text: 'Сегменты клиентов, их скор и назначенные менеджеры.',
    },
  },
  adminIt: {
    dashboard: {
      title: 'IT панель',
      text: 'Состояние моделей, версий и инфраструктуры скоринга.',
    },
    users: {
      title: 'Учетные записи',
      text: 'Список пользователей для интеграции с авторизацией и ролями.',
    },
    formulas: {
      title: 'Модели и правила',
      text: 'Версии в продакшене и shadow, метрики качества и мониторинг дрифта.',
    },
    batch: {
      title: 'Пакетное тестирование',
      text: 'Загрузка файла, запуск теста и анализ результатов по модели.',
      uploadTitle: 'Загрузка файла',
      runTitle: 'Параметры запуска',
      progressTitle: 'Прогресс',
      resultTitle: 'Результаты',
      uploadAction: 'Загрузить файл',
      downloadTemplate: 'Скачать шаблон CSV',
      runAction: 'Запустить тест',
      cancelAction: 'Отменить',
      threshold: 'Порог классификации',
      limit: 'Количество строк',
      model: 'Модель',
      terminal: 'Журнал обработки',
      export: 'Экспорт CSV',
      onlyDefault: 'Только default',
      onlyNonDefault: 'Только non-default',
      allRows: 'Все строки',
      preview: 'Первые 5 строк',
      processed: 'Обработано',
    },
    logs: {
      title: 'Системные логи',
      text: 'События по моделям, очередям и интеграциям.',
    },
  },
  adminBank: {
    dashboard: {
      title: 'Панель банка',
      text: 'Показатели портфеля, воронка одобрений и бизнес-метрики.',
    },
    formulas: {
      title: 'Правила банка',
      text: 'Бизнес-правила, лимиты и условия маршрутизации заявок.',
    },
    analytics: {
      title: 'Аналитика',
      text: 'Графики по портфелю, риску и распределению заявок.',
    },
  },
  support: {
    title: 'Поддержка и FAQ',
    text: 'Ответы на частые вопросы и контакты для связи.',
  },
  factors: {
    age: 'Возраст',
    income: 'Доход',
    employment: 'Стабильность занятости',
    amount: 'Сумма кредита',
    term: 'Срок кредита',
    rate: 'Процентная ставка',
    delinquencies: 'История просрочек',
    inquiries: 'Количество недавних запросов',
    extendedProfile: 'Расширенный профиль (открытые данные)',
  },
  recommendations: {
    reduce_delinquency: 'Сначала закройте текущие просрочки и стабилизируйте платежную дисциплину.',
    pause_inquiries: 'Сделайте паузу в новых заявках, чтобы снизить нагрузку по недавним запросам.',
    reduce_amount: 'Попробуйте уменьшить сумму кредита или увеличить первоначальный взнос.',
    increase_stability: 'Добавьте подтвержденный стаж работы или официальный источник дохода.',
    keep_profile: 'Профиль выглядит устойчиво. Можно переходить к следующему этапу.',
    legal_disclosure: 'Укажите актуальные сведения о судимостях и штрафах при общении с банком — это снизит риск отказа после проверки.',
    reduce_open_profile_risk: 'Суммарный риск по открытым данным высокий: сократите спорный цифровой след или подготовьте пояснения к заявке.',
  },
}

const en = structuredClone(ru)
en.common.tagline = 'AI-powered credit scoring service'
en.client.score.pastDue = 'Number of delinquencies exceeding 30 days'
en.client.score.inquiries = 'Number of credit history inquiries in the last 6 months'
en.client.score.text =
  'Fill in the core fields; optionally add the extended profile — it is included in the demo score together with the main inputs.'
en.client.score.additionalParams = 'Additional parameters'
en.client.score.additionalParamsHide = 'Collapse'
en.client.score.additionalParamsIntro =
  'Briefly describe your situation for each item — in the demo model it is combined with the main form (more detail slightly increases the effect on the score).'
en.client.score.additionalParamsItems = [
  {
    title: 'Socio-demographics (gender, age)',
    text: 'Social networks, public profiles.',
    placeholder: 'e.g. Male, 34 years old',
  },
  {
    title: 'Country of birth and country of work',
    text: 'Social networks, LinkedIn, open registers.',
    placeholder: 'e.g. Born in KG, employed in Bishkek',
  },
  {
    title: 'Workplace (sector) and occupation',
    text: 'LinkedIn, company websites, résumés.',
    placeholder: 'e.g. Bank, credit risk analyst, 5 years',
  },
  {
    title: 'Education',
    text: 'Social profiles, university websites.',
    placeholder: "e.g. Bachelor's, KNU, finance",
  },
  {
    title: 'Marital status',
    text: 'Social networks (status, photos).',
    placeholder: 'e.g. Married, two children',
  },
  {
    title: 'Political views',
    text: 'Public posts, follows, comments.',
    placeholder: 'e.g. I do not post on political topics',
  },
  {
    title: 'Country political and economic context',
    text: 'Analytics, news.',
    placeholder: 'e.g. Stable FX, no tax arrears',
  },
  {
    title: 'Legal history (convictions, fines)',
    text: 'Bailiff databases, court registers (often public).',
    placeholder: 'e.g. No convictions, traffic fines paid',
  },
  {
    title: 'Living in the capital',
    text: 'Geotags, profile information.',
    placeholder: 'e.g. Registered and living in Bishkek',
  },
]
en.auth.login.title = 'Sign in to NeuroBank'
en.support.title = 'Support and FAQ'
en.roles.admin_it = 'IT admin'
en.nav.admin_it[0].label = 'IT panel'
en.adminIt.dashboard.title = 'IT panel'
en.adminIt.formulas.text =
  'Production and shadow versions, quality metrics and drift monitoring.'
en.factors.extendedProfile = 'Extended profile (open data)'
en.recommendations.legal_disclosure =
  'Share up-to-date information on convictions and fines with the bank to reduce post-check decline risk.'
en.recommendations.reduce_open_profile_risk =
  'Combined open-data risk is high: reduce contentious digital footprint or prepare explanations for the application.'
en.client.apply.successBadge = 'Application sent'
en.client.apply.successTitle = 'Thank you — we have received your application'
en.client.apply.successLead =
  'A lending manager will contact you using your profile details during the next business hours. They may confirm amount, term, and documents if needed.'
en.client.apply.successVisit = 'Office for in-person documents'
en.client.apply.successAddress = 'Bishkek, Chyngyz Aitmatov St. 66'
en.client.apply.successHours = 'Mon–Fri: 09:00–18:00, lunch 12:30–13:30'
en.client.apply.successPhonesTitle = 'Contact numbers'
en.client.apply.successPhoneHotline = '+996 (312) 610-900 — hotline'
en.client.apply.successPhoneCredit = '+996 (555) 120-440 — lending desk'
en.client.apply.successPhoneWhatsapp = '+996 (700) 330-120 — WhatsApp (messages only)'
en.client.apply.successCallback =
  'If no call within two business days, dial the hotline and mention your application reference from SMS (demo mode: no SMS is sent).'
en.client.apply.successSummaryNote =
  'Your request is recorded. Next steps: a manager call or a visit to the office.'
en.client.apply.successAgain = 'Submit another'
en.client.apply.successToDashboard = 'Back to dashboard'

const kz = structuredClone(ru)
kz.common.tagline = 'AI негiзiндегi кредит скоринг сервисi'
kz.auth.login.title = 'NeuroBank-ке кiру'
kz.support.title = 'Колдау жане FAQ'

export const resources = {
  ru: { translation: ru },
  en: { translation: en },
  kz: { translation: kz },
}
