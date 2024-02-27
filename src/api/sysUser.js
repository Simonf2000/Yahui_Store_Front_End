import request from '@/utils/request'

const path = '/admin/system/sysUser';

export const findPage = (sysUserDto,pageNum,pageSize) => {
    return request({
        url: `${path}/findPage/${pageNum}/${pageSize}`,
        method: 'post',
        data: sysUserDto //将数据以post请求方式提交，放在请求体中传递
    });
}


export const save = data => {
    return request({
        url: `${path}/save`,
        method: 'post',
        data
    });
}


export const getById = id => {
    return request({
        url: `${path}/getById/${id}`,
        method: 'get'
    });
}


export const update = data => {
    return request({
        url: `${path}/update`,
        method: 'put',
        data
    });
}

export const deleteById = id => {
    return request({
        url: `${path}/deleteById/${id}`,
        method: 'delete'
    });
}

export const findRoleByUserId = id => {
    return request({
        url: `${path}/findRoleByUserId/${id}`,
        method: 'get'
    });
}

export const doAssignRole = (dto) => {
    return request({
        url: `${path}/doAssign`,
        method: 'post',
        data:dto
    });
}
