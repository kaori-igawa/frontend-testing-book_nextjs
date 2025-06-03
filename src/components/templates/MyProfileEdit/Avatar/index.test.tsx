// import順によってはテストがエラーになったので注意。componentは後のほうがいいかも。
import { BasicLayout } from '@/components/layouts/BasicLayout';
import { PutInput } from '@/pages/api/my/profile/edit';
import { handleGetMyProfile } from '@/services/client/MyProfile/__mock__/msw';
import { mockUploadImage } from '@/services/client/UploadImage/__mock__/jest';
import { selectImageFile, setupMockServer } from '@/tests/jest';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Avatar } from '.';

function TestComponent() {
  const { register, setValue } = useForm<PutInput>();
  return BasicLayout(
    <Avatar register={register} setValue={setValue} name='imageUrl' />
  )
}

setupMockServer(handleGetMyProfile());

test('「写真を変更する」ボタンがある', async () => {
  render(<TestComponent />);
  // findByRoleはPromiseを返す。要素が見つからなかった場合、resolveされない。非同期として扱われる。
  // getByRoleは同期的に要素を探す。要素が見つからなかった場合は例外を発生させるのでテストが失敗する。
  expect( await screen.findByRole('button', { name: '写真を変更する'})).toBeInTheDocument();
});

test('画像のアップロードに成功した場合、画像のsrc属性が変化する', async () => {
  // 画像アップロードが成功するように設定
  mockUploadImage();
  // コンポーネントをレンダリング
  render(<TestComponent />);
  // 画像のsrc属性が空であることを確認
  expect(screen.getByRole('img').getAttribute('src')).toBeFalsy();
  // 画像を選択
  const { selectImage } = selectImageFile();
  await selectImage();
  // 画像のsrc属性が空でないことを確認
  await waitFor(() => 
    expect(screen.getByRole('img').getAttribute('src')).toBeTruthy()
  );
});

test('画像のアップロードに失敗した場合、アラート表示がされる', async () => {
  // 画像アップロードが失敗するように設定
  mockUploadImage(500);
  // コンポーネントをレンダリング
  render(<TestComponent />);
  // 画像を選択
  const { selectImage } = selectImageFile();
  await selectImage();
  // 指定した文字列をもってToastが表示されることをアサート
  await waitFor(() => 
    expect(screen.getByRole('alert')).toHaveTextContent('画像のアップロードに失敗しました')
  );
});
