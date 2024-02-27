
<template>
    <div class="search-div">
        <!-- 搜索表单 -->
        <el-form label-width="70px" size="small">
            <el-form-item label="角色名称">
                <el-input style="width: 100%" placeholder="角色名称" v-model="sysRoleDto.roleName"></el-input>
            </el-form-item>
            <el-row style="display:flex">
                <el-button type="primary" size="small" @click="fetchData">
                    搜索
                </el-button>
                <el-button size="small">重置</el-button>
            </el-row>
        </el-form>

        <!-- 添加按钮 -->
        <div class="tools-div">
            <el-button type="success" size="small" @click="addShow">添 加</el-button>
        </div>

        <!--- 角色表格数据 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="roleName" label="角色名称" width="180" />
            <el-table-column prop="roleCode" label="角色code" width="180" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" align="center" width="280" #default="scope">
                <el-button type="primary" size="small" @click="editShow(scope.row)">
                    修改
                </el-button>
                <el-button type="danger" size="small" @click="deleteData(scope.row)">
                    删除
                </el-button>
                <el-button type="warning" size="small" @click="showAssignMenu(scope.row)">
                    分配菜单
                </el-button>
            </el-table-column>
        </el-table>

        <!--分页条-->
        <el-pagination
               v-model:current-page="pageParams.pageNum"
               v-model:page-size="pageParams.pageSize"
               :page-sizes="[1, 2, 5, 10]"
               @size-change="fetchData"
               @current-change="fetchData"
               layout="total, sizes, prev, pager, next"
               :total="total"
            />



        <!-- 添加角色表单对话框 -->
        <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
            <el-form label-width="120px">
                <el-form-item label="角色名称">
                    <el-input v-model="sysRole.roleName"/>
                </el-form-item>
                <el-form-item label="角色Code">
                    <el-input  v-model="sysRole.roleCode"/>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input  v-model="sysRole.description"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveOrUpdate">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!-- 分配菜单的对话框 
        // tree组件添加ref属性，后期方便进行tree组件对象的获取
        -->
        <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
            <el-form label-width="80px">
                <el-tree
                        :data="sysMenuTreeList"
                        ref="tree"   
                        show-checkbox
                        default-expand-all
                        :check-on-click-node="true"
                        node-key="id"
                        :props="defaultProps"
                />
                <el-form-item>
                    <el-button type="primary" @click="doAssign">提交</el-button>
                    <el-button @click="dialogMenuVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { findPage,save,getById,update,deleteById,GetSysRoleMenuIds ,DoAssignMenuIdToSysRole} from '@/api/sysRole'
import { ElMessage,ElMessageBox } from 'element-plus'

//---------------------------------------------------

// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([
    // { "id": 9, "roleName": "系统管理员", "roleCode": "xtgly", "createTime": '2023-07-31' },
    // { "id": 10, "roleName": "商品管理员", "roleCode": "spgly", "createTime": '2023-07-31' }
])

let sysRoleDto = ref({
    roleName: ''
})

const pageParams = ref({
    pageNum: 1,
    pageSize: 2
})

const dialogVisible = ref(false)

const sysRole = ref({
    id: '',
    roleName: '',
    roleCode: '',
    description: ''
})

const dialogMenuVisible = ref(false)

const sysMenuTreeList = ref([])

const tree = ref()

const defaultProps = {
  children: 'children',
  label: 'title',
}

//----------------------------------------------------

onMounted(()=>{
    fetchData()
});

const fetchData = async()=>{
    const {code,message,data} = await findPage(sysRoleDto.value, pageParams.value.pageNum, pageParams.value.pageSize)
    total.value = data.total
    list.value = data.list 
}



const addShow = ()=>{
    dialogVisible.value = true
}

const saveOrUpdate = async()=>{
    if(sysRole.value.id == ''){
        const {code,message} = await save(sysRole.value)
        dialogVisible.value = false    
        ElMessage.success(message)
        fetchData()
    }else{
        const {code,message} = await update(sysRole.value)
        dialogVisible.value = false    
        ElMessage.success(message)
        fetchData()   
    }
    
}


const editShow = async(row)=>{
    // 采用偷懒方式，将列表行赋值给数据模型对象进行回显。并不很推荐使用。
    //推荐发起ajax请求，根据id从后端获取数据进行数据回显。
    //sysRole.value = row;
    //debugger
    const {data} = await getById(row.id)
    sysRole.value = data;
    dialogVisible.value = true   
}


const deleteData = (row) => {
    ElMessageBox.confirm('您确定要删除这个数据吗?','警告',{
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then( async()=>{//点击确定按钮事件处理
        const {code,message,data} = await deleteById(row.id)
        ElMessage.success(message)
        fetchData()
    }).catch((e)=>{ //点击取消按钮事件处理
        if('cancel' == e){
            ElMessage.info('取消删除')
        }else{
            ElMessage.error('请求失败')
        }
    })
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const showAssignMenu = async (row)=>{

    debugger

    sysRole.value = row 

    dialogMenuVisible.value = true 

    const {code,message,data} = await GetSysRoleMenuIds(row.id);

    sysMenuTreeList.value = data.sysMenuList

    tree.value.setCheckedKeys(data.roleMenuIds); //查看官网组件使用文档
}




const doAssign = async()=>{
    const roleId = sysRole.value.id 

    //1.获取菜单树上被勾选的菜单的id和isHalf状态
    const checkedNodes = tree.value.getCheckedNodes()
    const checkedList1 = checkedNodes.map(node=>{  //  node  ===>>>>  SysMenu
        return {
            menuId: node.id,
            isHalf: 0,
        }
    })

    //2.获取菜单树上不完全选择的菜单的id和isHalf状态
    const isHalfcheckedNodes = tree.value.getHalfCheckedNodes()
    const checkedList2 = isHalfcheckedNodes.map(node=>{  //  node  ===>>>>  SysMenu
        return {
            menuId: node.id,
            isHalf: 1,
        }
    })

    //3.将勾选和不完全选中的菜单，两个集合合并到一起
    const list = [...checkedList1,...checkedList2]

    const assignMenuDto = {
        roleId: roleId,
        menuIdList: list
    }

    //4.调用api进行数据保存
    const {code,message,data} = await DoAssignMenuIdToSysRole(assignMenuDto);
    dialogMenuVisible.value = false
    ElMessage.success(message)
    fetchData()
}

















</script>

<style scoped>
.search-div {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 3px;
    background-color: #fff;
}

.tools-div {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 3px;
    background-color: #fff;
}
</style>