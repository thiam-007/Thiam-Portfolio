'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <motion.h2
                    className="text-3xl font-bold mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[var(--accent)]">#</span> À propos de moi
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <p className="text-lg mb-6">
                            Consultant en <span className="text-[var(--accent)]">Stratégie & Développement de Projets</span> et{' '}
                            <span className="text-[var(--accent)]">Développeur Full Stack</span>, j&apos;apporte une vision hybride aux projets sur lesquels j&apos;interviens.
                        </p>
                        <p className="text-lg mb-6">
                            Diplômé en Entrepreneuriat, je combine une rigueur méthodologique (PMP, Agile) avec des compétences techniques pour concevoir des solutions innovantes qui répondent aux besoins réels des utilisateurs et des entreprises.
                        </p>
                        <p className="text-lg">
                            Mon approche est centrée sur l&apos;analyse stratégique et la mise en œuvre technique, me permettant d&apos;accompagner les projets de leur conception à leur réalisation.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h3 className="text-xl font-semibold mb-6 text-[var(--accent)]">Compétences clés</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: 'Gestion de projet', skills: ['Jira', 'MS Project', 'PMP', 'Agile', 'Trello'] },
                                { title: 'Développement Web', skills: ['MERN', 'Node.js/Express.js', 'React/Vite', 'Next.js', 'Python'] },
                                { title: 'Analyse de données', skills: ['Power BI', 'SQL', 'MongoDB', 'Python'] },
                                { title: 'Soft Skills', skills: ['Leadership', 'Communication', 'Résolution de problèmes', 'Autonomie', 'Team Work'] }
                            ].map((category, index) => (
                                <motion.div
                                    key={category.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                                >
                                    <h4 className="font-medium mb-3">{category.title}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill) => (
                                            <span key={skill} className="bg-[var(--secondary)] rounded-full px-3 py-1 text-sm hover:bg-[var(--accent)] hover:text-white transition-colors duration-300">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
