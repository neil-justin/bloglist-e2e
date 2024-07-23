const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  // write a test here for when a login form is shown

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username-input').fill('mluukkai')
      await page.getByTestId('password-input').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username-input').fill('mluukkai')
      await page.getByTestId('password-input').fill('wrongPassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByTestId('notification-element'))
        .toContainText('wrong username or password')
    })
  })
})