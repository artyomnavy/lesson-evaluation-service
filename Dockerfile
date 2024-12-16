# Check out https://hub.docker.com/_/node to select a new base image
# Родительский (главный) образ
FROM node:22.11.0-alpine

# Переключаемся на управление от пользователя node
# По умолчанию Docker запускает контейнер как root, что внутри контейнера может представлять проблему безопасности.
USER node

# Создаем папку для проекта
RUN mkdir -p /home/node/dist/lesson-evaluation-service-docker-image

# Инструкция WORKDIR в Dockerfile позволяет один раз указать конкретный путь (каталог на диске),
# после чего большинство инструкций (например, RUN и COPY) будут выполняться в контексте этого каталога.
WORKDIR /home/node/dist/lesson-evaluation-service-docker-image

# Копируем файлы package.json и yarn.lock. Они потребуются для установки зависимостей проекта
# --chown изменяет владельца скопированных файлов в контейнере
COPY --chown=node package*.json ./
COPY --chown=node yarn.lock ./

# Установка зависимостей c блокировкой изменения версий пакетов
RUN yarn install --frozen-lockfile

# Устанавливаем переменные окружения
# По данному порту будет подыматься приложение в контейнере
ENV PORT=9876

# Копируем файлы проекта
COPY --chown=node . .

# Запускаем сборку проекта
RUN yarn build

# Инструкция EXPOSE информирует Docker о том, что контейнер прослушивает указанные сетевые порты во время выполнения.
# По умолчанию использует протокол TCP
EXPOSE ${PORT}

# Указываем команду и аргументы для выполнения внутри контейнера.
CMD [ "yarn", "start" ]

# Для локальной сборки image
# docker build . -t lesson-evaluation-service-docker-image
# Запуск контейнера
# docker run -p 9876:9876 lesson-evaluation-service-docker-image