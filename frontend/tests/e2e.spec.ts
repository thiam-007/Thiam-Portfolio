import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {

    test('Home page should have correct metadata', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Cheick Ahmed Thiam/);
    });

    test('Hero section should display key information', async ({ page }) => {
        await page.goto('/');
        // Check for main heading
        await expect(page.getByRole('heading', { name: 'Cheick Ahmed Thiam' })).toBeVisible();
        // Check for description (static bio)
        await expect(page.getByText('Expert en pilotage de projets')).toBeVisible();
    });

    test('Navigation menu should work', async ({ page }) => {
        await page.goto('/');

        // Check desktop navigation links
        const aboutLink = page.getByRole('link', { name: 'À propos' });
        const projectsLink = page.getByRole('link', { name: 'Projets' });
        const contactLink = page.getByRole('link', { name: 'Contact' });

        await expect(aboutLink).toBeVisible();
        await expect(projectsLink).toBeVisible();
        await expect(contactLink).toBeVisible();

        // Test clicking a link navigates to the section (visibility check)
        await contactLink.click();
        // Wait for scrolling to complete or section to become visible
        await expect(page.locator('#contact')).toBeInViewport({ timeout: 10000 });
    });

    test('Contact form should be interactable', async ({ page }) => {
        await page.goto('/#contact');

        await expect(page.getByLabel('Nom')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Sujet')).toBeVisible();
        await expect(page.getByLabel('Message')).toBeVisible();

        // Fill the form (just filling, not submitting to avoid spamming)
        await page.getByLabel('Nom').fill('Test User');
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Sujet').fill('Test Subject');
        await page.getByLabel('Message').fill('This is a test message from Playwright.');
    });

    test('Admin login page should load', async ({ page }) => {
        await page.goto('/admin/login');
        await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Mot de passe')).toBeVisible();
    });

});
