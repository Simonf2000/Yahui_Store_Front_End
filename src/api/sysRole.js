import request from '@/utils/request'

const path = '/admin/system/sysRole';

export const findPage = (sysRoleDto,pageNum,pageSize) => {
    return request({
        //url: '/admin/system/sysRole/findPage/'+pageNum+'/'+pageSize,
        url: `${path}/findPage/${pageNum}/${pageSize}`,
        method: 'post',
        data: sysRoleDto //将数据以post请求方式提交，放在请求体中传递
    });
}


export const save = sysRole => {
    return request({
        url: `${path}/save`,
        method: 'post',
        data: sysRole
    });
}


export const getById = id => {
    return request({
        url: `${path}/getById/${id}`,
        method: 'get'
    });
}


export const update = sysRole => {
    return request({
        url: `${path}/update`,
        method: 'put',
        data: sysRole
    });
}

export const deleteById = id => {
    return request({
        url: `${path}/deleteById/${id}`,
        method: 'delete'
    });
}

// 查询指定角色所对应的菜单id
export const GetSysRoleMenuIds = (roleId) => {
    return request({
        url: "/admin/system/sysRoleMenu/findSysRoleMenuByRoleId/"+ roleId,
        method: 'get'
    })
}

// 根据角色分配菜单请求方法
export const DoAssignMenuIdToSysRole = (assignMenuDto) => {
    return request({
        url: "/admin/system/sysRoleMenu/doAssign",
        method: 'post',
        data: assignMenuDto
    })
}

