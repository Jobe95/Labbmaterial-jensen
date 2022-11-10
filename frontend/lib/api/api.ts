import { AxiosResponse } from 'axios';
import { RecipeModel, UserModel } from '../models';
import { client } from './client';

export const logoutUser = async () => {
  return await client.get('/api/logout');
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AxiosResponse<UserModel>> => {
  return await client.post('/api/login', {
    email: email,
    password: password,
  });
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AxiosResponse<UserModel>> => {
  return await client.post('/api/register', {
    username: username,
    email: email,
    password: password,
  });
};

export const getAllUsers = async (): Promise<AxiosResponse> => {
  return await client.get('/api/users');
};

export const getMe = async (): Promise<AxiosResponse> => {
  return await client.get('/api/me');
};

export const getUser = async (userId: number): Promise<AxiosResponse> => {
  return await client.get(`/api/user`, { params: { id: userId } });
};

export const createRecipe = async (
  title: string,
  link: string
): Promise<AxiosResponse<RecipeModel>> => {
  return await client.post('/api/recipe', {
    title: title,
    link: link,
  });
};

export const getRecipes = async (): Promise<AxiosResponse> => {
  return await client.get('/api/recipes');
};
