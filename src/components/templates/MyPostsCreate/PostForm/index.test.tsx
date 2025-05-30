import { render,screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from './';

const user = userEvent.setup();

function setUp() {
  const onClickSave = jest.fn();
  const onValid = jest.fn();
  const onInvalid = jest.fn();

  render(
    <PostForm
      title='新規記事'
      onClickSave={onClickSave}
      onValid={onValid}
      onInvalid={onInvalid}
     />
  );
  async function typeTitle(title: string) {
    const textbox = screen.getByRole('textbox', { name: '記事タイトル'});
    await user.type(textbox, title);
  }
  async function saveAsPublished() {
    await user.click(screen.getByRole('switch', { name: '公開ステータス'}));
    await user.click(screen.getByRole('button', { name: '記事を公開する'}));
  }
  async function saveAsDraft() {
    await user.click(screen.getByRole('button', { name: '下書き保存する'}));
  }
  return {
    typeTitle,
    saveAsPublished,
    saveAsDraft,
    onClickSave,
    onValid,
    onInvalid,
  }
}