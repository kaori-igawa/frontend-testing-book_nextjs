import { render, screen } from '@testing-library/react'
import { TextboxWithInfo } from '.';
import { text } from 'stream/consumers';

test('TextboxWithInfo', async () => {
  const args = {
    title: '記事タイトル',
    info: '0 / 64',
    description: '半角英数64文字以内で入力してください',
    error: '不正な文字が含まれています',
  };
  render(<TextboxWithInfo {...args} />);
  const textbox = screen.getByRole('textbox');
  // labelのhtmlForにより関連付け
  expect(textbox).toHaveAccessibleName(args.title);
  // aria-describedbyにより関連付け
  expect(textbox).toHaveAccessibleDescription(args.description);
  // aria-errormessage により関連付け
  expect(textbox).toHaveErrorMessage(args.error);
})