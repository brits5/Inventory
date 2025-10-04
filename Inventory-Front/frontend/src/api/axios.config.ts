import axios from 'axios';

export const productApi = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionApi = axios.create({
  baseURL: 'http://localhost:5002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});