import request from '@/utils/request'

const path = '/admin/product/category'

export const FindCategoryByParentId = id => {
  return request({
    url: `${path}/findCategoryByParentId/${id}`,
    method: 'get',
  })
}

// 导出方法
export const ExportCategoryData = () => {
  return request({
    url: `${path}/exportData`,
    method: 'get',
    responseType: 'blob', // // 这里指定响应类型为blob类型,二进制数据类型，用于表示大量的二进制数据
  })
}
