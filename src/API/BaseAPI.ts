// src/api/BaseAPI.ts
import axios, { type AxiosInstance } from "axios";

interface BaseAPIOptions {
  prefix?: string;
  isPrivate?: boolean;
}

export const BaseAPI = ({ prefix, isPrivate = true }: BaseAPIOptions = {}): AxiosInstance => {
  const base = import.meta.env.VITE_API_BASE;
  const instance = axios.create({
    baseURL: `${base}${prefix ? `/${prefix}` : ""}`,
  });

  // Si la API es privada, agrega interceptores
  if (isPrivate) {
    instance.interceptors.request.use(
      (config) => {
        const token = window.localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Accept = "application/json";
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );
  }

  return instance;
};