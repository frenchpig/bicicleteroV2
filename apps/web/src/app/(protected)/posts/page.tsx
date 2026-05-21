'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Button, Card, CardContent, CardHeader, CardTitle,
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Input, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@app/ui';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Post } from '@app/types';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const currentUser = getUser();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<PostFormData>({ resolver: zodResolver(postSchema) });

  async function loadPosts() {
    const res = await api.get<Post[]>('/api/nest/posts');
    setPosts(res.data);
  }

  useEffect(() => { loadPosts(); }, []);

  function openCreate() {
    setEditing(null);
    reset({ title: '', content: '' });
    setOpen(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    reset({ title: post.title, content: post.content });
    setOpen(true);
  }

  async function onSubmit(data: PostFormData) {
    setSubmitError(null);
    try {
      if (editing) {
        await api.patch(`/api/nest/posts/${editing.id}`, data);
      } else {
        await api.post('/api/nest/posts', data);
      }
      setOpen(false);
      loadPosts();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message ?? 'Something went wrong');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/api/nest/posts/${id}`);
    loadPosts();
  }

  const canEdit = (post: Post) =>
    currentUser?.id === post.authorId ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'SUPERADMIN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
          <p className="text-muted-foreground">Browse and manage posts</p>
        </div>
        {currentUser && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{(post as any).author?.email ?? '—'}</TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {canEdit(post) && (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No posts yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                {...register('content')}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>
            {submitError && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
