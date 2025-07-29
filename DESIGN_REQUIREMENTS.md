# 🎨 Техническое задание: Дизайн-система на основе KATALOG

## 📋 Общие требования

**Цель**: Создать современный, элегантный интерфейс Document Analyzer, основанный на дизайн-системе проекта KATALOG с использованием стекломорфизма и темной темы.

**Референс**: Проект KATALOG (https://katalog.onrender.com/) - медиа-каталог с изысканным дизайном

---

## 🎯 Ключевые принципы дизайна

### 1. **Стекломорфизм (Glass-morphism)**
- Полупрозрачные элементы с размытием (`backdrop-filter: blur()`)
- Тонкие границы с низкой непрозрачностью (`rgba(255, 255, 255, 0.1)`)
- Многослойность и глубина через тени и градиенты
- Эффект "матового стекла" для карточек и модальных окон

### 2. **Темная тема с градиентами**
- Основной фон: `hsl(0, 0%, 6.7%)` - очень темный серый
- Декоративные радиальные градиенты на фоне для создания атмосферы
- Тонкие цветные акценты без агрессивной яркости

### 3. **Семантическая цветовая система**
- Медиа-типы: Movie (синий), TV (фиолетовый), Book (зеленый), Album (оранжевый)
- Статусы: Success (зеленый), Warning (оранжевый), Error (красный), Info (синий)
- Использование HSL для лучшего контроля яркости и насыщенности

---

## 🎨 Цветовая палитра

### Основные цвета (Dark Mode)
```css
/* Фоны и поверхности */
--background: hsl(0, 0%, 6.7%)          /* Основной темный фон */
--surface-elevated: hsl(0, 0%, 9.2%)    /* Приподнятые элементы */
--surface-overlay: hsl(0, 0%, 11%)      /* Оверлеи и модальные окна */
--card: hsl(0, 0%, 3.9%)                /* Карточки */

/* Текст и контент */
--foreground: hsl(0, 0%, 98%)           /* Основной текст (белый) */
--content-secondary: hsl(0, 0%, 63.9%)  /* Второстепенный текст */
--content-tertiary: hsl(0, 0%, 40%)     /* Приглушенный текст */

/* Границы */
--border: hsl(0, 0%, 14.9%)             /* Основные границы */
--border-subtle: hsl(0, 0%, 10%)        /* Тонкие границы */
```

### Семантические цвета
```css
/* Медиа-типы (для иконок и акцентов) */
--color-media-movie: hsl(217, 91%, 60%)   /* Синий */
--color-media-tv: hsl(271, 91%, 65%)      /* Фиолетовый */
--color-media-book: hsl(173, 80%, 40%)    /* Зеленый */
--color-media-album: hsl(38, 92%, 50%)    /* Оранжевый */

/* Статусы */
--color-status-success: hsl(142, 71%, 45%) /* Зеленый успех */
--color-status-warning: hsl(38, 92%, 50%)  /* Оранжевое предупреждение */
--color-status-error: hsl(0, 72%, 51%)     /* Красная ошибка */
--color-status-info: hsl(217, 91%, 60%)    /* Синяя информация */
```

---

## 📝 Типографика

### Иерархия заголовков
```css
/* Display - для главных заголовков */
.font-heading-display {
  font-size: clamp(3.75rem, 2.625rem + 3.515625vw, 7.5rem);
  font-family: serif; /* Times New Roman, Georgia */
  font-weight: 300;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

/* 2XL - для больших заголовков секций */
.font-heading-2xl {
  font-size: clamp(2.125rem, 1.625rem + 1.5625vw, 3.25rem);
  font-weight: 300;
  letter-spacing: -0.05em;
}

/* LG - для заголовков блоков */
.font-heading-lg {
  font-size: clamp(1.25rem, 1.125rem + 0.625vw, 1.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
}

/* Base - для основного текста */
.font-heading {
  font-size: clamp(0.9375rem, 0.875rem + 0.3125vw, 1.0625rem);
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* SM и XS - для вспомогательного текста */
.font-heading-sm { font-size: 0.8125rem; }
.font-heading-xs { font-size: 0.875rem; }
```

### Семейства шрифтов
- **Sans-serif**: Inter, system-ui (для интерфейса)
- **Serif**: Times New Roman, Georgia (для заголовков)

---

## 🧩 Компоненты и элементы

### 1. **Карточки (Glass Cards)**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
```

### 2. **Кнопки**
```css
.btn-primary {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.8) 0%, 
    rgba(147, 51, 234, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 16px rgba(59, 130, 246, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.9) 0%, 
    rgba(147, 51, 234, 0.9) 100%);
}
```

### 3. **Поля ввода**
```css
.input-field {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
}

.input-field:focus {
  border-color: hsl(217, 91%, 60%);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
```

---

## 🎭 Интерактивные состояния

### Hover-эффекты
- **Карточки**: Увеличение непрозрачности фона, поднятие на 2px
- **Кнопки**: Масштабирование 1.05x, усиление градиента
- **Иконки**: Масштабирование 1.1x, усиление цвета

### Анимации
```css
/* Плавные переходы */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Пульсация для индикаторов */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Появление элементов */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🏗️ Структура страницы

### 1. **Фоновые декорации**
- Радиальные градиенты в углах страницы
- Размытие 3rem для создания атмосферы
- Низкая непрозрачность (0.1-0.2)
- Цвета из семантической палитры

### 2. **Header**
- Логотип с градиентным текстом
- Статус-индикатор с пульсацией
- Полупрозрачный фон с размытием

### 3. **Hero Section**
- Крупный заголовок с clamp() для адаптивности
- Сетка feature-карточек 2x2 (мобиль) → 1x4 (десктоп)
- Цветные акценты для каждой категории

### 4. **Main Content**
- Центрированный контейнер с максимальной шириной
- Глубокие тени для создания объема
- Многослойные карточки с разными уровнями размытия

### 5. **Footer**
- Минималистичный дизайн
- Разделители-точки между элементами
- Приглушенные цвета

---

## 📱 Адаптивность

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Responsive Typography
Использовать `clamp()` для плавного масштабирования:
```css
font-size: clamp(минимум, базовый + viewport, максимум);
```

### Grid адаптация
- **Mobile**: `grid-cols-2` (2 колонки)
- **Tablet**: `grid-cols-3` (3 колонки)
- **Desktop**: `grid-cols-4` (4 колонки)

---

## 🔧 Технические требования

### CSS Framework
- **Tailwind CSS** для утилитарных классов
- **Custom CSS** для сложных эффектов (стекломорфизм)
- **CSS Variables** для цветовой системы

### Browser Support
- Chrome/Safari: backdrop-filter support
- Firefox: будет работать без размытия (graceful degradation)
- Edge: полная поддержка

### Performance
- Использовать `transform` вместо изменения `top/left`
- Оптимизировать количество `backdrop-filter` на странице
- Lazy loading для изображений

---

## 🎪 Микро-интерактивность

### Loading States
- Скелетоны с пульсацией
- Прогресс-бары с градиентами
- Spinning indicators

### Feedback
- Тостеры с размытием
- Валидация форм в реальном времени
- Hover tooltips

### Transitions
- Staggered animations для списков
- Морфинг между состояниями
- Параллакс эффекты (осторожно!)

---

## 📋 Чек-лист для дизайнера

### ✅ Обязательно
- [ ] Темная тема как основная
- [ ] Эффекты стекломорфизма на всех карточках
- [ ] Семантические цвета для разных типов контента
- [ ] Адаптивная типографика с clamp()
- [ ] Hover-состояния для всех интерактивных элементов
- [ ] Консистентные отступы и радиусы скругления

### ✅ Желательно
- [ ] Тонкие анимации (не более 300ms)
- [ ] Градиентные акценты
- [ ] Мульти-слойные тени
- [ ] Декоративные фоновые элементы

### ❌ Избегать
- [ ] Ярких, кислотных цветов
- [ ] Резких переходов и анимаций
- [ ] Плоского дизайна без глубины
- [ ] Слишком высокой контрастности границ

---

## 📋 Чек-лист для фронтендера

### ✅ HTML/CSS
- [ ] Semantic HTML5 markup
- [ ] CSS Grid для раскладки
- [ ] CSS Variables для темизации
- [ ] Proper z-index layering

### ✅ JavaScript/React
- [ ] Client-side рендеринг эффектов
- [ ] useState для интерактивных состояний
- [ ] useEffect для DOM-манипуляций
- [ ] Proper event handling для hover

### ✅ Performance
- [ ] Оптимизация backdrop-filter
- [ ] Lazy loading компонентов
- [ ] CSS-in-JS только для динамических стилей
- [ ] Минификация и tree-shaking

### ✅ Accessibility
- [ ] Proper contrast ratios (WCAG AA)
- [ ] Focus indicators
- [ ] Screen reader support
- [ ] Keyboard navigation

---

## 📞 Контакты и вопросы

При возникновении вопросов по дизайн-системе обращайтесь к техническому руководителю проекта. 

**Последнее обновление**: 29 июля 2024
**Версия дизайн-системы**: 1.0.0

---

*Данный документ описывает требования к дизайну Document Analyzer на основе KATALOG дизайн-системы. Все изменения должны согласовываться с техническим руководителем.* 