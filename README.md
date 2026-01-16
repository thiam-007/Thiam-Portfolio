# Thiam-Portfolio (Next.js + Backend)

Structure proposée :
- Frontend/ : Next.js (TypeScript, App Router)
- backend/ : Node + Express + TypeScript (API + Mongoose)
- Branch de travail : feature/nextjs-typescript-app

Important :
- NE PAS COMMITER vos vraies clés. Utilisez .env.local sur votre machine.
- Les images (profil / covers / certifications) seront stockées dans Supabase Storage (buckets: images, certifications).
- La base de données sera MongoDB Atlas (MONGODB_URI dans .env).

Procédure après push :
1. Vous complétez .env locaux avec vos clés.
2. Je convertirai Portfolio.html en composants React dans Frontend/app.
