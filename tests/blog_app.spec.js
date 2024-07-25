const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const exp = require('constants')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongPassword')
      await expect(page.getByTestId('notification-element'))
        .toContainText('wrong username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'CSS Container Queries',
        author: 'Geoff Graham',
        url: 'https://css-tricks.com/css-container-queries/'
      })
      await page.getByTestId('notification-element').waitFor()

      await expect(page.getByTestId('notification-element'))
        .toBeVisible()
      await expect(page.getByTestId('notification-element'))
        .toContainText('a new blog titled CSS Container Queries is added')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'CSS Container Queries',
        author: 'Geoff Graham',
        url: 'https://css-tricks.com/css-container-queries/'
      })
      // expand blog details
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByTestId('likescount')).toContainText('1')
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, {
        title: 'CSS Container Queries',
        author: 'Geoff Graham',
        url: 'https://css-tricks.com/css-container-queries/'
      })
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.blog-card')).not.toBeVisible()
    })
  })
})