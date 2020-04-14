比如安装vue的脚手架

<br/>

#### 方法1
一开始安装的时候是直接安装， 但是当我在执行的时候是告诉我没有找到， 原因是环境变量没配置好， 而os系统和windows系统是不同的。

<br/>

```
sudo yarn global @vue/cli
sudo npm install -g @vue/cli
```

<br/>

#### 方法2
mac系统的环境变量， 加载顺讯为：

```
/etc/profile /etc/paths ~/.bash_profile ~/.bash_login ~/.profile ~/.bashrc
```

etc目录下面的是系统级的配置，~目录下的是用户配置，用户配置文件只会加载一个（.bashrc除外），不存在的可以自己新建。

<br/>

按回车执行命令查看当前变量值。

```
echo $PATH       
```

按回车输入密码后用vi打开用户目录下的bash_profile文件。一定要用sudo哦，否则没权限保存文件。

```
sudo vi ~/.bash_profile
```

意思是在PATH变量后面加多一个目录/haha/notexist。

```
export PATH=$PATH:/haha/notexist，
```

最后让bash_profile文件生效

```
soure ~/.bash_profile
```
