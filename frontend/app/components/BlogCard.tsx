'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../types';

interface BlogCardProps {
    post: Post;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '';

    const categoryColor = (post.category as any)?.color || 'var(--accent)';

    if (featured) {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row rounded-xl overflow-hidden border border-[var(--accent)] border-opacity-20 bg-[var(--secondary)] hover:border-opacity-60 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/10"
            >
                <div className="relative md:w-1/2 h-56 md:h-auto overflow-hidden">
                    {post.coverImage ? (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center">
                            <i className="fas fa-pen-nib text-5xl text-[var(--accent)] opacity-30"></i>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--secondary)]/60 md:block hidden"></div>
                    {post.isPinned && (
                        <span className="absolute top-3 left-3 bg-[var(--accent)] text-[#0a192f] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <i className="fas fa-thumbtack text-[10px]"></i> Épinglé
                        </span>
                    )}
                </div>

                <div className="flex flex-col justify-center p-6 md:w-1/2">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {post.category && (
                            <span
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}40` }}
                            >
                                {(post.category as any).name}
                            </span>
                        )}
                        <span className="text-xs text-[var(--gray)]">
                            <i className="fas fa-clock mr-1"></i>{post.readTime} min de lecture
                        </span>
                        <span className="text-xs text-[var(--gray)]">
                            <i className="fas fa-eye mr-1"></i>{post.views}
                        </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
                        {post.title}
                    </h2>

                    {post.excerpt && (
                        <p className="text-[var(--gray)] text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-[var(--gray)]">{formattedDate}</span>
                        <span className="text-[var(--accent)] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Lire l&apos;article <i className="fas fa-arrow-right text-xs"></i>
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl overflow-hidden border border-[var(--accent)] border-opacity-20 bg-[var(--secondary)] hover:border-opacity-60 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/10 hover:-translate-y-1"
        >
            <div className="relative h-44 overflow-hidden">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center">
                        <i className="fas fa-pen-nib text-4xl text-[var(--accent)] opacity-30"></i>
                    </div>
                )}
                {post.isPinned && (
                    <span className="absolute top-2 left-2 bg-[var(--accent)] text-[#0a192f] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <i className="fas fa-thumbtack text-[10px]"></i> Épinglé
                    </span>
                )}
                {post.category && (
                    <span
                        className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${categoryColor}cc`, color: '#0a192f' }}
                    >
                        {(post.category as any).name}
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-base mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="text-[var(--gray)] text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--accent)] border-opacity-10">
                    <span className="text-xs text-[var(--gray)]">{formattedDate}</span>
                    <div className="flex items-center gap-3 text-xs text-[var(--gray)]">
                        <span><i className="fas fa-clock mr-1"></i>{post.readTime} min</span>
                        <span><i className="fas fa-eye mr-1"></i>{post.views}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
