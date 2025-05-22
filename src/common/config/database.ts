import knex from 'knex';
import { config } from "@/common/utils/knexfile";

const environment = process.env.NODE_ENV || 'development';
export const db = knex(config[environment]);


db.raw('SELECT 1')
  .then(() => {
    console.log('Kết nối MySQL thành công!');
  })
  .catch((err) => {
    console.error('Lỗi kết nối MySQL:', err);
  });