### mac下安装和配置MongoDB

这里只记录通过`homebrew`安装

1. 安装`homebrew`

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```



2. 使用`homebrew` 安装 `MongoDB`

```
brew install mongodb
```

这时 `MongoDB` 将被安装在 `/usr/local/Cellar/mongodb/4.0.1`



3. 添加环境变量：

```
vim .bash_profile
```

我们需要把它放进环境里：

```
export MONGO_PATH=/usr/local/Cellar/mongodb
export PATH=$PATH:$MONGO_PATH/bin
```

vim中进入编辑输入 `i`, 退出编辑状态为`esc`, 保存退出为直接输`：wq!`

重开就ok了



4. 配置 `MongoDB`

安装完 MongoDB 后，需要配置一下 MongoDB ，不然是无法启动服务端的。

(1)  创建根目录下 `data/db` 文件夹：

```
mkdir -p /data/db

# 如果出现 permission denied ，加上 sudo 命令：
sudo mkdir -p /data/db
```

(2)  给 `/data/db` 文件夹赋予权限：

```
sudo chown id -u /data/db
```

如果出现`illegal user name`的错误提示，这时我们可以查看当前的 `username` 并赋予权限：

```
$ whoami
username
$ sudo chown username /data/db
```

(3)  如果想修改(随意) MongoDB 配置文件, 配置文件默认在 /usr/local/etc 下的 mongod.conf

```
# Store data in /usr/local/var/mongodb instead of the default /data/db
dbpath = /data/db
# Append logs to /usr/local/var/log/mongodb/mongo.log
logpath = /usr/local/var/log/mongodb/mongo.log
logappend = true


# Only accept local connections
bind_ip = 127.0.0.1
```



5. 启动服务端

```
mongod

mongo

show dbs
```

`command+t`可以新开一个窗口



参考文章

[https://www.cnblogs.com/weixuqin/p/7258000.html](https://www.cnblogs.com/weixuqin/p/7258000.html)

[https://blog.csdn.net/yibowanbo/article/details/80233030](https://blog.csdn.net/yibowanbo/article/details/80233030)