FROM node:18.0.0-buster-slim

WORKDIR /app

ENV CHOKIDAR_USEPOLLING=true

# For later when svelte frontend is ready
#ENV PUPPETEER_SKIP_DOWNLOAD="true"
#ENV NODE_ENV=production

COPY . /app

RUN yarn
RUN yarn build

RUN echo 'alias ll="ls -lah --group-directories-first  --color=auto"' > /root/.bashrc
RUN echo 'cd /app' >> /root/.bashrc

EXPOSE 3000

CMD ["yarn", "dev"]