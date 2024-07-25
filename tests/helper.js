const loginWith = async (page, username, password) => {
  await page.getByTestId('username-input').fill(username)
  await page.getByTestId('password-input').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('blogtitle-input').fill(blog.title)
  await page.getByTestId('blogauthor-input').fill(blog.author)
  await page.getByTestId('blogurl-input')
    .fill('https://css-tricks.com/css-container-queries/')
  await page.getByRole('button', { name: 'create' }).click()

}

export { loginWith, createBlog }
