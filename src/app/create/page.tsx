import CreatePostForm from '@/components/create/CreatePostForm';

export const metadata = {
  title: 'Create Post | InstaFocus',
};

export default function CreatePostPage() {
  return (
    <div className="py-8">
      <CreatePostForm />
    </div>
  );
}
