// 导入组件
const Layout = () => import('@/layout/index.vue')
const sysRole = () => import('@/views/system/sysRole.vue')
const sysUser = () => import('@/views/system/sysUser.vue')
const sysMenu = () => import('@/views/system/sysMenu.vue')

// 导出该组件
export default([
    {
        path: "/system", //路由路径
        component: Layout, //路由组件
        name: 'system',//名称
        meta: {
            title: '系统管理', //标题
        },
        icon: 'Location', //图标
        children: [ //子路由集合
            {
                path: '/sysRole',
                name: 'sysRole',
                component: sysRole,
                meta: {
                    title: '角色管理',
                },
                hidden: false //是否隐藏该路由
            },
            {
                path: '/sysUser',
                name: 'sysUser',
                component: sysUser,
                meta: {
                    title: '用户管理',
                },
                hidden: false
            },
            {
                path: '/menu',
                name: 'sysMenu',
                component: sysMenu,
                meta: {
                    title: '菜单管理',
                },
                hidden: false
            }
        ]
    }
])