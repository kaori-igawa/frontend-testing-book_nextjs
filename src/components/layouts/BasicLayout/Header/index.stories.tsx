import { handleGetMyProfile } from '@/services/client/MyProfile/__mock__/msw';
import { LoginUserInfoProviderDecorator, SPStory } from '@/tests/storybook';
import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { userEvent as user, waitFor, within } from '@storybook/testing-library';
import { Header } from './';

export default {
  component: Header,
  decorators: [LoginUserInfoProviderDecorator],
} as ComponentMeta<typeof Header>;

type Story = ComponentStoryObj<typeof Header>;

export const NotLoggedIn: Story = {
  parameters: {
    msw: { handlers: [handleGetMyProfile({ status: 401})]},
  },
}

export const LoggedIn: Story = {};

export const RouteMyPosts: Story = {
  parameters: {
    nextRouter: { pathname: '/my/posts' },
  },
};

export const RouteMyPostsCreate: Story = {
  parameters: {
    nextRouter: { pathname: '/my/posts/create' },
  },
};

export const SPNotLogIn: Story = {
  parameters: {
    ...SPStory.parameters,
    ...NotLoggedIn.parameters,
  }
}

export const SPLoggedIn: Story = {
  parameters: {
    ...SPStory.parameters,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.queryByRole('navigation', { name: 'ナビゲーション'});
    await expect(navigation).not.toBeInTheDocument();
  }
};