import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

export default {
  path: '/demo',
  name: 'demo',
  meta,
  redirect: { name: 'demo-page1' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'page1', name: `${pre}page1`, component: () => import('@/pages/demo/page1'), meta: { meta, title: '我的待办' } },
    { path: 'page2', name: `${pre}page2`, component: () => import('@/pages/demo/page2'), meta: { meta, title: '我的分类' } },
    { path: 'page3', name: `${pre}page3`, component: () => import('@/pages/demo/page3'), meta: { meta, title: '我的看板' } },
    { path: 'page5', name: `${pre}page5`, component: () => import('@/pages/demo/page5'), meta: { meta, title: '我的历史' } },
    { path: 'page4', name: `${pre}page4`, component: () => import('@/pages/demo/page4'), meta: { meta, title: 'deepseekAI' } }
  ])('demo-')
}
