// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    path: '/demo',
    title: '工作空间',
    icon: 'folder-o',
    children: [
      { path: '/demo/page1', title: '我的待办' },
      { path: '/demo/page5', title: '我的历史' },
      { path: '/demo/page3', title: '我的看板' },
      { path: '/demo/page2', title: '我的分类' },
      { path: '/demo/page4', title: 'deepseekAI' }
    ]
  }
]
