# 🚀 Инструкция по деплою на Vercel

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Введите название: `crypto-ai-terminal` (или любое другое)
3. Выберите "Public" или "Private"
4. **НЕ добавляйте** README, .gitignore или лицензию
5. Нажмите **"Create repository"**

---

## Шаг 2: Загрузите проект на GitHub

### Вариант А: Через командную строку (рекомендуется)

Распакуйте ZIP и выполните:

```bash
cd crypto-ai-vercel
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/crypto-ai-terminal.git
git push -u origin main
```

### Вариант Б: Через GitHub Desktop

1. Откройте GitHub Desktop
2. File → Add Local Repository
3. Выберите папку `crypto-ai-vercel`
4. Commit changes
5. Publish repository

### Вариант В: Через веб-интерфейс GitHub

1. На странице вашего репозитория нажмите "uploading an existing file"
2. Перетащите все файлы из папки `crypto-ai-vercel`
3. Нажмите "Commit changes"

---

## Шаг 3: Деплой на Vercel

1. **Перейдите на** https://vercel.com
2. **Войдите** через GitHub аккаунт
3. Нажмите **"Add New"** → **"Project"**
4. **Найдите** ваш репозиторий `crypto-ai-terminal`
5. Нажмите **"Import"**
6. Vercel автоматически определит настройки
7. Нажмите **"Deploy"**
8. ⏳ Подождите 1-2 минуты
9. ✅ **Готово!** Ваше приложение развёрнуто

---

## 🎉 Результат

После деплоя вы получите:
- 🌐 Публичный URL: `https://ваш-проект.vercel.app`
- 🔒 Автоматический HTTPS
- 🚀 Глобальный CDN
- 📊 Dashboard для мониторинга

---

## 🔄 Обновление

После изменений в коде:

```bash
git add .
git commit -m "Update"
git push
```

Vercel автоматически задеплоит обновление!

---

## ⚡ Быстрый деплой через CLI

Если у вас установлен Node.js:

```bash
npm i -g vercel
cd crypto-ai-vercel
vercel --prod
```

---

## 🆘 Проблемы?

### Ошибка при деплое
- Проверьте логи в Vercel Dashboard
- Убедитесь, что все файлы загружены

### Не работает API
- Проверьте `/api/signals` в браузере
- Откройте консоль разработчика (F12)

### Не отображается интерфейс
- Проверьте, что `index.html` в папке `public/`
- Очистите кэш браузера (Ctrl+F5)

---

**Всё готово! Ваше приложение онлайн! 🎊**
