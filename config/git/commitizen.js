module.exports = {
  // Добавим описание на русском языке ко всем типам
  types: [
    {
      value: 'build',
      name:
        'build:     Сборка проекта или изменения внешних зависимостей или настройка проекта',
    },
    { value: 'ci', name: 'ci:        Настройка CI и работа со скриптами' },
    { value: 'docs', name: 'docs:      Обновление документации' },
    { value: 'feat', name: 'feat:      Добавление нового функционала' },
    { value: 'fix', name: 'fix:       Исправление ошибок' },
    {
      value: 'performance',
      name:
        'performance:      Изменения направленные на улучшение производительности',
    },
    {
      value: 'refactor',
      name:
        'refactor:  Правки кода без исправления ошибок или добавления новых функций',
    },
    {
      value: 'style',
      name:
        'style:     Правки по кодстайлу (табы, отступы, точки, запятые и т.д.)',
    },
    { value: 'types', name: 'types:      Правки в описания типов' },
    { value: 'test', name: 'test:      Добавление тестов' },
  ],

  // Область. Она характеризует фрагмент кода, которую затронули изменения
  scopes: [
    { name: 'update-package' },
    { name: 'scripts' },
    { name: 'tests' },
    { name: 'configure-package' },
    { name: 'performance optimization' },
    { name: 'utils' },
    { name: 'constants' },
  ],

  // Поменяем дефолтные вопросы
  messages: {
    type: 'Какие изменения вы вносите?',
    scope: '\nВыберите ОБЛАСТЬ, которую вы изменили (опционально):',
    // Спросим если allowCustomScopes в true
    customScope: 'Укажите свою ОБЛАСТЬ:',
    subject: 'Напишите КОРОТКОЕ описание в ПОВЕЛИТЕЛЬНОМ наклонении:\n',
    body:
      'Напишите ПОДРОБНОЕ описание (опционально). Используйте "|" для новой строки:\n',
    footer:
      'Место для мета данных (тикетов, ссылок и остального). Например: SECRETMRKT-700, SECRETMRKT-800:\n',
    confirmCommit: 'Вас устраивает получившийся коммит?',
  },

  // Разрешим собственную ОБЛАСТЬ
  allowCustomScopes: true,

  // Запрет на Breaking Changes
  allowBreakingChanges: false,

  // Префикс для нижнего колонтитула
  footerPrefix: 'МЕТА ДАННЫЕ:',

  // limit subject length
  subjectLimit: 72,
};
