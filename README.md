# BYAGENT | AI TERMINAL - Vercel Deploy

Криптовалютный AI-агент для анализа рынка, оптимизированный для деплоя на Vercel.

## 🚀 Быстрый деплой на Vercel

### Вариант 1: Через GitHub (рекомендуется)

1. **Создайте новый репозиторий на GitHub**
   - Перейдите на https://github.com/new
   - Назовите репозиторий, например: `crypto-ai-terminal`
   - Выберите "Public" или "Private"
   - НЕ добавляйте README, .gitignore или лицензию (они уже есть в проекте)
   - Нажмите "Create repository"

2. **Загрузите проект в GitHub**
   
   Распакуйте ZIP архив и выполните команды:
   
   ```bash
   cd crypto-ai-vercel
   git init
   git add .
   git commit -m "Initial commit: BYAGENT AI Terminal"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/crypto-ai-terminal.git
   git push -u origin main
   ```

3. **Деплой на Vercel**
   - Перейдите на https://vercel.com
   - Нажмите "Add New" → "Project"
   - Импортируйте ваш GitHub репозиторий
   - Vercel автоматически определит настройки
   - Нажмите "Deploy"
   - Готово! Ваше приложение будет доступно через несколько минут

### Вариант 2: Через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Перейдите в директорию проекта
cd crypto-ai-vercel

# Деплой
vercel

# Для production деплоя
vercel --prod
```

### Вариант 3: Импорт ZIP напрямую

1. Перейдите на https://vercel.com/new
2. Выберите "Import Git Repository"
3. Нажмите "Import from Git" → "Import from GitHub"
4. Или используйте Vercel CLI для загрузки ZIP

---

## 📁 Структура проекта

```
crypto-ai-vercel/
├── api/                      # Serverless функции
│   ├── signals.py           # API для получения сигналов
│   └── stats.py             # API для статистики
├── public/                   # Статические файлы
│   └── index.html           # Главная страница
├── vercel.json              # Конфигурация Vercel
├── requirements.txt         # Python зависимости
├── .gitignore              # Git ignore файл
└── README.md               # Документация
```

---

## 🔧 Как это работает

### Serverless архитектура

- **Frontend**: Статический HTML размещается в `/public`
- **Backend**: Python serverless функции в `/api`
- **API Endpoints**:
  - `GET /api/signals` - получение торговых сигналов
  - `GET /api/stats` - получение статистики

### Преимущества Vercel

✅ **Бесплатный хостинг** для личных проектов  
✅ **Автоматический HTTPS** с SSL сертификатом  
✅ **CDN** для быстрой загрузки по всему миру  
✅ **Автоматический деплой** при push в GitHub  
✅ **Serverless функции** без управления серверами  
✅ **Масштабирование** автоматически под нагрузкой  

---

## 🎯 Возможности

### Анализ рынка
- Генерация реалистичных торговых сигналов
- Поддержка 10+ популярных криптовалют
- Анализ волатильности и объёмов

### Интерфейс
- Киберпанк дизайн с Matrix фоном
- Реалтайм обновления каждые 30 секунд
- Адаптивный дизайн для мобильных и десктопа
- Система алертов для критических сигналов

### Технические индикаторы
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- ATR (Average True Range)
- EMA (Exponential Moving Average)

---

## ⚙️ Конфигурация

### vercel.json

Файл `vercel.json` настраивает:
- Маршрутизацию запросов
- Serverless функции Python
- Статические файлы

### Переменные окружения (опционально)

Если нужно добавить API ключи:

1. В Vercel Dashboard → Settings → Environment Variables
2. Добавьте переменные:
   - `BINANCE_API_KEY` (если используете реальный API)
   - `BYBIT_API_KEY` (если используете реальный API)

---

## 🔄 Обновление проекта

После изменений в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически задеплоит новую версию!

---

## 🌐 Кастомный домен

1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи у регистратора домена
4. Готово! Приложение будет доступно на вашем домене

---

## 📊 Мониторинг

Vercel предоставляет:
- **Analytics** - статистика посещений
- **Logs** - логи serverless функций
- **Performance** - метрики производительности

Доступно в Dashboard → Analytics/Logs

---

## ⚠️ Лимиты бесплатного плана

- **Bandwidth**: 100 GB/месяц
- **Serverless Function Execution**: 100 GB-Hours/месяц
- **Builds**: 6000 минут/месяц
- **Deployments**: Unlimited

Для большинства проектов этого более чем достаточно!

---

## 🐛 Отладка

### Просмотр логов

```bash
vercel logs
```

### Локальная разработка

```bash
vercel dev
```

Приложение будет доступно на `http://localhost:3000`

---

## 📝 Важные замечания

- Serverless функции имеют **timeout 10 секунд** на бесплатном плане
- Каждый запрос к API создаёт новый экземпляр функции
- Нет постоянного хранилища - используйте внешние БД если нужно
- Функции **stateless** - не сохраняют состояние между запросами

---

## 🔒 Безопасность

- Все данные генерируются на лету
- Нет доступа к реальным торговым операциям
- HTTPS по умолчанию
- CORS настроен для безопасности

---

## 📚 Дополнительные ресурсы

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/runtimes#official-runtimes/python)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все файлы загружены в GitHub
3. Проверьте конфигурацию `vercel.json`

---

**Готово к деплою! 🚀**

Создано с помощью Manus AI 🤖
