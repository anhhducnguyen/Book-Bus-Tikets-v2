import knex from 'knex';
import { config } from "@/common/utils/knexfile";

const environment = process.env.NODE_ENV || 'development';
export const db = knex(config[environment]);


