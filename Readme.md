# Next boilerplate

Шаблон проекта на [Next.js](https://nextjs.org/)

## Начало работы

### Установка проекта

```bash
# Устанавливаем NVM в зависимости от вашей платформы

# Устанавливаем Node.js 19 версии
nvm install 19

# Устанавливаем зависимости монорепозитория, она выше "/arcadia/frontend"
npm i

# Устанавливаем зависимости сервиса
nvm use
npm run deps

# Задаём переменную окружения для локальной разработки
export NODE_ENV=development
```

### Разработка

```bash
# Локальный запуск
export NODE_ENV=development && npm run dev
```

Сервис становится доступен по адресу: <http://127.0.0.1>

### Плагины VSC

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- [StyleLint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Синхронизация переводов
