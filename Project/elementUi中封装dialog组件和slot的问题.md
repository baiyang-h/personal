封装dialog组件和通过作用域插槽的方式传入组件，初始化数据的问题。



存在一个bug，当我点击按钮时，此时弹框dialog显示，并且修改data里面的name数据。因为el-form是通过slot传入的，而改变数据是在父组件就直接修改了。在插入slot之前就定义了这个初始化的状态， 所以使用`this.$refs[formName].resetFields()`清空后，关闭弹框还会还原成之前直接修改data时的初始数据（即aaa）

原因是修改数据 el-form还没渲染完成，数据在还没初入slot之前就已经赋上去了。所以成了初始化数据。

```vue
//子组件
//封住的dialog组件   dialog.vue
<template>
    <el-dialog title="收货地址" :visible.sync="visible" @close="close">
        <slot></slot>
    </el-dialog>
</template>
```

```vue
//父组件
<template>
	<div>
        <button @click="show">click</button>	
        <el-dialog :visible='visible'>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                ···
                <el-form-item>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import elDialog from './dialog.vue'
    export default {
        components: {
            elDialog
        },
        data() {
            return {
                ruleForm: {
                    name: ''
                }
            }
        },
        methods: {
            show() {	
              this.visible = true;
              this.ruleForm.name = 'aaa' 
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
```

