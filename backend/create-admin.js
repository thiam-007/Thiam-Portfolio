#!/usr/bin/env node

/**
 * Script pour créer le compte administrateur initial
 * Usage: node create-admin.js
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function createAdmin() {
    try {
        console.log('🔐 Création du compte administrateur...\n');

        const adminData = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            name: 'Cheick Ahmed Thiam',
        };

        if (!adminData.email || !adminData.password) {
            console.error('❌ ERREUR: ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
            process.exit(1);
        }

        const response = await axios.post(`${API_URL}/api/auth/create-admin`, adminData);

        console.log('✅ Compte administrateur créé avec succès!\n');
        console.log('📧 Email:', adminData.email);
        console.log('👤 Nom:', response.data.admin.name);

        if (response.data.token) {
            console.log('\n🔑 Token JWT:', response.data.token.substring(0, 30) + '...');
        }

        console.log('\n✨ Vous pouvez maintenant vous connecter sur http://localhost:3000/admin/login');

    } catch (error) {
        if (error.response) {
            console.error('❌ Erreur:', error.response.data.message);
            if (error.response.status === 409) {
                console.log('\n💡 Le compte admin existe déjà. Utilisez /admin/login pour vous connecter.');
            }
        } else {
            console.error('❌ Erreur de connexion:', error.message);
            console.log('\n💡 Assurez-vous que le serveur backend est démarré (npm run dev)');
        }
        process.exit(1);
    }
}

createAdmin();
