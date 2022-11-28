export const rmqConfig = {
  HOST: 'localhost:5672',
  QUEUE_NAME: 'user_msgs',
  EXCHANGE_NAME: 'amq.direct',
  EXCHANGE_TYPE: 'direct',
};

export const sqlConfig = {
  HOST: 'localhost',
  PORT: 3306,
  USERNAME: 'root',
  PASSWORD: '',
  DB: 'youkraft',
};
