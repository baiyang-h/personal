–-save-dev和–save的区别

他们之间的区别就在于我们平时安装模块依赖时的：--save-dev和 --save

当你使用--save-dev安装依赖的时候就会放在package.json的devDependencies对象下面，相反的，当你使用--save安装依赖的时候就会出现在dependencies对象下面。

总结：**–save-dev 是你开发时候依赖的东西，–save 是你发布之后还依赖的东西**