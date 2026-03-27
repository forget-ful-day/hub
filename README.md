# Redirect Pages App (Node.js)

Простое приложение на Node.js, где ты настраиваешь страницы и кнопки со ссылками.
При нажатии на кнопку открывается нужный сайт.

## Запуск

```bash
npm start
```

После запуска открой:

- `http://localhost:3000/` — список доступных страниц
- `http://localhost:3000/page/home` — пример страницы с кнопками

## Как настраивать страницы и кнопки

Все настраивается в файле `config/pages.json`.

Структура:

```json
{
  "имяСтраницы": {
    "title": "Заголовок",
    "description": "Описание",
    "buttons": [
      { "label": "Текст кнопки", "url": "https://example.com" }
    ]
  }
}
```

### Пример

```json
{
  "social": {
    "title": "Соцсети",
    "description": "Открой нужную соцсеть",
    "buttons": [
      { "label": "YouTube", "url": "https://youtube.com" },
      { "label": "Telegram", "url": "https://t.me" }
    ]
  }
}
```

После изменения `config/pages.json` просто обнови страницу в браузере.
