RUN npm install

RUN npx sequelize-cli db:create

RUN npx sequelize-cli db:migrate
