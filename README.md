# Шкафчик 👕 - Управление гардеробом

Мобильное приложение для организации и управления вашим гардеробом. Создано с использованием **React Native**, **Expo** и современной архитектуры **Feature-Sliced Design (FSD)**.

## 🔗 Ссылки

- **[🎨 Макет в Figma](https://www.figma.com/design/qIIwlM0gcvNc0dN1XhmJmi/%D0%A8%D0%BA%D0%B0%D1%84%D1%87%D0%B8%D0%BA?node-id=0-1&t=XTfnrHVqEg6hKTw9-1)** - Дизайн-макет приложения
- **[📦 Репозиторий GitHub](https://github.com/mechv0d/shkafchik)** - Исходный код проекта

## 🏗️ Архитектура проекта

Проект использует **Feature-Sliced Design (FSD)** - современный архитектурный подход для масштабируемых React приложений.

### 📁 Структура проекта

```
src/
├── api/           # API клиенты и запросы
├── app/           # Инициализация приложения (navigation, providers)
├── components/    # Переиспользуемые UI компоненты
├── constants/     # Константы приложения
├── context/       # React Context провайдеры
├── hooks/         # Кастомные React хуки
├── lib/           # Вспомогательные библиотеки и утилиты
├── providers/     # Провайдеры приложения
├── screens/       # Экраны приложения
├── store/         # Redux store и slices
├── types/         # TypeScript типы
└── utils/         # Вспомогательные функции
```

### 📖 Документация

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Подробное описание архитектуры
- **[NAMING_GUIDELINES.md](./NAMING_GUIDELINES.md)** - Правила именования

### 🛠️ Технологии

- **React Native 0.81.5** - Фреймворк для мобильной разработки
- **Expo 54** - Платформа для React Native
- **TypeScript** - Типизированный JavaScript
- **React Query** - Управление серверным состоянием
- **NativeWind** - Стилизация (Tailwind CSS для React Native)
- **AsyncStorage** - Локальное хранилище

---

## 🚀 Быстрый старт

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

---

## 📋 Функциональность

### ✨ Основные возможности

- ➕ **Добавление вещей** - Создание новых элементов гардероба с фото, ценой, тегами
- 🔍 **Поиск и фильтрация** - Быстрый поиск по названию, фильтры по категориям
- ❤️ **Избранное** - Отметка любимых вещей
- 📊 **Статистика** - Аналитика гардероба
- 💾 **Локальное хранение** - Данные сохраняются на устройстве

### 🎯 Архитектурные принципы

- **FSD (Feature-Sliced Design)** - Четкое разделение по бизнес-областям
- **Single Responsibility** - Каждый модуль имеет одну ответственность
- **DRY (Don't Repeat Yourself)** - Отсутствие дублирования кода
- **SOLID** - Принципы объектно-ориентированного проектирования
