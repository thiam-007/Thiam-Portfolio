'use client';

export default function About() {
    return (
        <section id="about" className="py-20 bg-[var(--primary)]">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center reveal">
                    <span className="text-[var(--accent)]">#</span> À propos de moi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="reveal">
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
                    </div>

                    <div className="reveal">
                        <h3 className="text-xl font-semibold mb-6 text-[var(--accent)]">Compétences clés</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3">Gestion de projet</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Jira', 'MS Project', 'PMP', 'Agile', 'Trello'].map((skill) => (
                                        <span key={skill} className="bg-[var(--secondary)] rounded-full px-3 py-1 text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Développement Web</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['MERN', 'Node.js/Express.js', 'React/Vite', 'Next.js', 'Python'].map((skill) => (
                                        <span key={skill} className="bg-[var(--secondary)] rounded-full px-3 py-1 text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Analyse de données</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Power BI', 'SQL', 'MongoDB', 'Python'].map((skill) => (
                                        <span key={skill} className="bg-[var(--secondary)] rounded-full px-3 py-1 text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Soft Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Leadership', 'Communication', 'Résolution de problèmes', 'Autonomie', 'Team Work'].map((skill) => (
                                        <span key={skill} className="bg-[var(--secondary)] rounded-full px-3 py-1 text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
