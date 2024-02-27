
import { resultProps } from 'element-plus';

<template>
    <!---搜索表单-->
    <div class="search-div">
        <el-form label-width="70px" size="small">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="关键字">
                        <el-input style="width: 100%" placeholder="用户名、姓名、手机号码" v-model="sysUserDto.keyword"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间">
                        <el-date-picker type="datetimerange" range-separator="To" start-placeholder="开始时间" v-model="dateTimeRange"
                            end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="display:flex">
                <el-button type="primary" size="small" @click="fetchData()">
                    搜索
                </el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-row>
        </el-form>
    </div>

    <!--添加按钮-->
    <div class="tools-div">
        <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!---数据表格-->
    <el-table :data="list" style="width: 100%">
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column prop="avatar" label="头像" #default="scope">
            <img :src="scope.row.avatar" width="50" />
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" #default="scope">
            {{ scope.row.status == 1 ? '正常' : '停用' }}
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" align="center" width="280" #default="scope">
            <el-button type="primary" size="small" @click="editData(scope.row)">
                修改
            </el-button>
            <el-button type="danger" size="small" @click="deleteData(scope.row)">
                删除
            </el-button>
            <el-button type="warning" size="small"  @click="showAssignRole(scope.row)">
                分配角色
            </el-button>
        </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageParams.pageNum"
      v-model:page-size="pageParams.pageSize"
      :page-sizes="[1, 2, 5, 10, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />



    <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
        <el-form label-width="120px">
            <el-form-item label="用户名">
                <el-input v-model="sysUser.userName"/>
            </el-form-item>
            <el-form-item v-if="sysUser.id == null" label="密码">
                <el-input type="password" show-password v-model="sysUser.password"/>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="sysUser.name"/>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="sysUser.phone"/>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8501/admin/system/fileUpload"
                        :show-file-list="false"
                        :headers="headers"
                        :on-success="handleAvatarSuccess"
                        >
                    <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="描述">
                <el-input  v-model="sysUser.description"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveOrUpdate">提交</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog> 


    <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
        <el-form label-width="80px">
            <el-form-item label="用户名">
                <el-input disabled :value="sysUser.userName"></el-input>
            </el-form-item>

            <el-form-item label="角色列表">
                <el-checkbox-group v-model="userRoleIds">
                    <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
                        {{ role.roleName }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="doAssignRoleData">提交</el-button>
                <el-button @click="dialogRoleVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>

<script setup>
import { ref,onMounted } from 'vue';
import {findPage,save,getById,update,deleteById,findRoleByUserId,doAssignRole} from '@/api/sysUser'
import {ElMessage,ElMessageBox} from 'element-plus'

import { useApp} from '@/pinia/modules/app'

//-------------------------------------------------------------------

// 表格数据模型
const list = ref([
    // { "id": 1, "userName": "admin", "name": "admin", "phone": "13121034567", "status": 1, "createTime": "2023-05-11" },
    // { "id": 2, "userName": "admin", "name": "admin", "phone": "13121034567", "status": 1, "createTime": "2023-05-11" }
]);

// 分页条数据模型
const total = ref(0)

const sysUserDto = ref({
    keyword:'',
    createTimeBegin:'',
    createTimeEnd:''
})

const pageParams = ref({
    pageNum: 1,
    pageSize: 2
})


const dateTimeRange = ref([])

const dialogVisible = ref(false)


const sysUser = ref({
    id:'',
    userName: '',
    password: '',
    name:'',
    phone:'',
    avatar: '',
    description:''
})



const headers = {
    token: useApp().authorization.token
}


const dialogRoleVisible = ref(false)


const allRoles = ref([])
const userRoleIds = ref([])



//-------------------------------------------------------------------

onMounted(()=>{
    fetchData()
})


const fetchData = async(pageNum = 1)=>{

    

    pageParams.value.pageNum = pageNum
    if(dateTimeRange.value.length==2){
        sysUserDto.value.createTimeBegin = dateTimeRange.value[0]
        sysUserDto.value.createTimeEnd = dateTimeRange.value[1]
    }

    const {code,message,data} =  await findPage(sysUserDto.value,pageParams.value.pageNum,pageParams.value.pageSize)

    list.value = data.list
    total.value = data.total

}


const handleSizeChange = (number) => {
    pageParams.pageSize = number 
    fetchData()
}
const handleCurrentChange = (number) => {
    fetchData(number)
}



const reset = ()=>{
    sysUserDto.value.keyword = ''
    dateTimeRange.value = []
}

const addShow = ()=>{
    sysUser.value = {}
    dialogVisible.value = true 
}


const saveOrUpdate = async()=>{
    if(sysUser.value.id=='' || sysUser.value.id==null){ //添加
        const {message} = await save(sysUser.value);
        dialogVisible.value = false
        ElMessage.success(message)
        fetchData()
    } else{ //修改
        const {message} = await update(sysUser.value);
        dialogVisible.value = false
        ElMessage.success(message)
        fetchData()
    }
}


const editData = async(row)=>{
    const {data} = await getById(row.id)

    sysUser.value = data
    dialogVisible.value = true 
}


const deleteData = (row)=>{
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


const handleAvatarSuccess = (result,uploadFile)=>{
    sysUser.value.avatar = result.data  //桶设置public
}




const showAssignRole = async (row) => {
    sysUser.value = row 
    dialogRoleVisible.value = true 

    const {code,message,data} = await findRoleByUserId(row.id)

    //后端采用Map封装这两个部分数据：
    // Map<String,Object> data = new HashMap();
    // data.put("allRoles",list);
    // data.put("userRoleIds",list);
    //1.查询所有角色
    allRoles.value = data.allRoles

    //2.查询这个人之前拥有的角色id集合（复选框打钩回显）
    userRoleIds.value = data.userRoleIds

}



const doAssignRoleData = async()=>{

    //提交参数名称与后端AssginRoleDto类的属性名称一致
    let assginRoleDto = {
        userId: sysUser.value.id ,
        roleIdList: userRoleIds.value
    }

    const {message} = await doAssignRole(assginRoleDto)
    dialogRoleVisible.value = false
    ElMessage.success(message);
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
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>