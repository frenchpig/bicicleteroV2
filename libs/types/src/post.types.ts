import { User } from './user.types';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: Pick<User, 'id' | 'email'>;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}
