import { defineConfig } from 'umi';
import path from 'path';
export default defineConfig({
  base: '/',
  publicPath: '/',
  npmClient: 'yarn',
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  clickToComponent: {},
  hash: true,
  routes: [
    {
      path: '/',
      component: '@/layouts/tabLayout/index',
      routes: [
        { path: '/home', component: 'home' },
        { path: '/docs', component: 'docs' },
      ],
    },
    { path: '/login', component: 'login' },
    { path: '/todo', component: 'todo' },
  ],
  theme: {},
  title: 'Todo List',
  verifyCommit: {
    scope: [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'workflow',
      'build',
      'ci',
      'chore',
      'types',
      'wip',
      'release',
      'dep',
      'deps',
      'example',
      'examples',
      'merge',
      'revert',
    ],
    allowEmoji: true,
  },
  dva: { immer: {}, extraModels: [] },
  plugins: ['@umijs/plugins/dist/dva'],
  proxy: {
    '/api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
