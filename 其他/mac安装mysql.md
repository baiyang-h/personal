终端中无法使用`mysql`命令：

```
-bash: mysql: command not found
```

解决办法，在终端中输入：

```
ln -s /usr/local/mysql/bin/mysql /usr/bin
```

如果不报错，那就OK；如果出现如下错误：

```
ln: /usr/bin/mysql: Operation not permitted
```

那么使用如下解决方案：

```
sudo sh -c 'echo /usr/local/mysql/bin > /etc/paths.d/mysql'
```

新开一个终端，如愿使用`mysql`命令了！



#### 修改mysql密码

##### 8之前的版本

1. 第一步

关闭MySQL服务器两种方式

​	1）`sudo /usr/local/mysql/support-files/mysql.server stop`

​	2）点击系统偏好设置->最下边点MySQL，在弹出页面中，关闭服务

2. 第二步

进入终端输入：

```
cd /usr/local/mysql/bin/
```

回车后 登录管理员权限

```
 sudo su
```

回车后输入以下命令来禁止mysql验证功能

```
./mysqld_safe --skip-grant-tables &
```

回车后mysql会自动重启（偏好设置中mysql的状态会变成running）

3. 第三步

输入命令 `./mysql`

回车后，输入命令 `FLUSH PRIVILEGES;`

回车后，输入命令 `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('你的新密码');`

##### 8之后的版本

1. 第一步

打开终端停止mysql

```
sudo /usr/local/mysql/support-files/mysql.server stop
```

2. 跳过登陆方式启动并进入mysql

```
sudo mysqld_safe --user=mysql --skip-grant-tables --skip-networking
```

3. 另开一个终端窗口

敲入 `mysql -u root -p` 命令然后回车，当需要输入密码时，直接按enter键，便可以不用密码登录到数据库当中

4. 修改root密码

```
mysql>use mysql;

mysql>FLUSH PRIVILEGES; 

mysql>ALTER user 'root'@'localhost' IDENTIFIED BY '你要修改的密码'      //注意，这里的密码要用包含8位大写+小写+特殊字符+数字的密码

mysql>quit;    //退出mysql；
```



[参考](https://www.cnblogs.com/xingxiangyi/p/9334694.html)