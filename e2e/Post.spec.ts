import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";
import { login, url } from './util';

test.describe('投稿ページ', () => {
  const path = '/posts/1';

  test('未ログイン時、ログインボタンが表示されている', async ({ page }) => {
    await page.goto(url(path));
    const buttonLogin = page.getByRole('link', { name: 'ログイン' });
    await expect(buttonLogin).toBeVisible();
  });

  test('他人の記事にLikeできる', async ({ page }) => {
    await page.goto(url('/login'));
    await login({ page, userName: 'TaroYamada' });
    await expect(page).toHaveURL(url('/'));
    // ここから ID:10 の記事ページ
    await page.goto(url('/posts/10'));
    const buttonLike = page.getByRole('button', { name: 'Like' });
    const buttonText = page.getByTestId('likeStatus');
    // likeボタンが有効になっていて、Likeは0件である
    await expect(buttonLike).toBeEnabled();
    await expect(buttonLike).toHaveText('0');
    await expect(buttonText).toHaveText('Like');
    await buttonLike.click();
    // Likeをつけたら1件カウントアップされLike済み状態になる
    await expect(buttonLike).toHaveText('1');
    await expect(buttonText).toHaveText('Liked');
  });

  test('自分の記事にLikeできない', async ({ page }) => {
    await page.goto(url('/login'));
    await login({ page, userName: 'TaroYamada' });
    await expect(page).toHaveURL(url('/'));
    // ここから ID:90 の記事ページ
    await page.goto(url('/posts/90'));
    const buttonLike = page.getByRole('button', { name: 'Like'});
    const buttonText = page.getByTestId('likeStatus');
    // Likeボタンは非活性になっていて、Likeの文字もない
    await expect(buttonLike).toBeDisabled();
    await expect(buttonText).not.toHaveText('Like');
  });

  test('アクセシビリティ検証', async ({ page }) => {
    await page.goto(url(path));
    await injectAxe(page as any);
    await checkA11y(page as any);
  });

});