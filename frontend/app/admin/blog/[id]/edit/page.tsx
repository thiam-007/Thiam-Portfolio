'use client';

import { useParams } from 'next/navigation';
import PostEditor from '../../PostEditor';

export default function EditPostPage() {
    const { id } = useParams<{ id: string }>();
    return <PostEditor postId={id} />;
}
