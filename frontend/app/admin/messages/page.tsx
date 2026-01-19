'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessages() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchMessages();
    }, [router]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des messages');
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('admin_token');
            const endpoint = currentStatus ? 'unread' : 'read';
            const response = await fetch(`${API_URL}/api/contact/${id}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to update');

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, isRead: !currentStatus } : msg
            ));
            // toast.success(currentStatus ? 'Marqué comme non lu' : 'Marqué comme lu');
        } catch (error) {
            console.error('Erreur lors de la mise à jour', error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete');

            setMessages(messages.filter(msg => msg._id !== id));
            setSelectedMessage(null);
            toast.success('Message supprimé');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="min-h-screen bg-[var(--primary)]">
            <nav className="bg-[var(--secondary)] border-b border-[var(--accent)] border-opacity-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[var(--accent)] hover:underline">
                            <i className="fas fa-arrow-left mr-2"></i>
                            Retour
                        </Link>
                        <h1 className="text-2xl font-bold">
                            <span className="text-[var(--accent)]">Messages</span>
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center text-[var(--gray)]">
                        <div className="spinner inline-block"></div>
                        <p className="mt-2">Chargement...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-[var(--gray)] py-12">
                        <i className="fas fa-inbox text-4xl mb-4"></i>
                        <p>Aucun message reçu</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`bg-[var(--secondary)] p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-xl ${!msg.isRead ? 'border-l-4 border-[var(--accent)]' : ''
                                    }`}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (!msg.isRead) {
                                        toggleReadStatus(msg._id, false);
                                    }
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {!msg.isRead && (
                                                <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                                            )}
                                            <h3 className={`font-semibold ${!msg.isRead ? 'text-white' : 'text-[var(--gray)]'}`}>
                                                {msg.name}
                                            </h3>
                                            <span className="text-[var(--gray)] text-sm">
                                                &lt;{msg.email}&gt;
                                            </span>
                                        </div>
                                        <p className={`text-sm ${!msg.isRead ? 'text-white' : 'text-[var(--gray)]'}`}>
                                            <strong>{msg.subject}</strong>
                                        </p>
                                        <p className="text-[var(--gray)] text-sm mt-1 line-clamp-1">
                                            {msg.message}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-[var(--gray)] text-xs">
                                            {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => toggleReadStatus(msg._id, msg.isRead)}
                                                className="text-xs px-2 py-1 rounded bg-[var(--primary)] hover:bg-[var(--accent)] transition-colors"
                                                title={msg.isRead ? 'Marquer non lu' : 'Marquer lu'}
                                            >
                                                <i className={`fas fa-envelope${msg.isRead ? '' : '-open'}`}></i>
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(msg._id)}
                                                className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                                                title="Supprimer"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="modal active" onClick={() => setSelectedMessage(null)}>
                    <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h3>
                                <p className="text-[var(--accent)]">
                                    De: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                                </p>
                                <p className="text-[var(--gray)] text-sm">
                                    {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-2xl hover:text-[var(--accent)]"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="bg-[var(--primary)] p-6 rounded-lg mb-6">
                            <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                className="btn-primary inline-flex items-center"
                            >
                                <i className="fas fa-reply mr-2"></i>
                                Répondre
                            </a>
                            <button
                                onClick={() => toggleReadStatus(selectedMessage._id, selectedMessage.isRead)}
                                className="btn-primary inline-flex items-center bg-[var(--secondary)]"
                            >
                                <i className={`fas fa-envelope${selectedMessage.isRead ? '' : '-open'} mr-2`}></i>
                                {selectedMessage.isRead ? 'Marquer non lu' : 'Marquer lu'}
                            </button>
                            <button
                                onClick={() => deleteMessage(selectedMessage._id)}
                                className="btn-primary inline-flex items-center bg-red-500/20 text-red-400 hover:bg-red-500/40"
                            >
                                <i className="fas fa-trash mr-2"></i>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
