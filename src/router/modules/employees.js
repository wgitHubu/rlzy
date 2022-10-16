import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      path: '/employees/detail/:id',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/components/print.vue'),
      hidden: true
    }
  ]
}
