#### 分支

```
git branch          //查看本地分支
git branch -a       //查看本地和远程分支

git branch <BranchName>      //创建分支
git checkout <BranchName>    //切换分支
//简写 创建并切换分支
git checkout -b <BranchName>
//在origin/master的基础上，创建一个新分支:newBrach
git checkout -b newBrach origin/master  

git branch -D <BranchName>      //删除本地分支
git push origin --delete <BranchName>   //删除远程分支
```

#### git add
`git add`命令可将该文件添加到暂存区。

例如：
```
git status      //      查看状态
git add README hello.php
git status
```

#### git status
git status 以查看在你上次提交之后是否有修改。

我演示该命令的时候加了`-s`参数，以获得简短的结果输出。如果没有这个参数那么就是详细输出。

#### git diff
执行 git diff 来查看执行 git status 的结果的详细信息。就是你修改代码后之间代码的对比。

git diff 命令显示已写入暂存区与已修改但尚未写入缓存的改动的区别
- 尚未放到暂存区的改动：`git diff`
- 查看已放到暂存区的改动： `git diff --cached`
- 查看已缓存的与未缓存的所有改动：`git diff HEAD`
- 显示摘要而非整个 `diff：git diff --stat`


#### git commit
使用`git add`命令将想要快照的内容写入缓存区， 而执行`git commit`将缓存区内容添加到本地仓库中。

Git 为你的每一个提交都记录你的名字与电子邮箱地址，所以第一步需要配置用户名和邮箱地址。
```
git config --global user.name 'runoob'
git config --global user.email test@runoob.com
```
提交
```
git commit -m '使用-m，此处是说明'
```

#### git log
```
git log
git log --oneline               // --oneline 选项来查看历史记录的简洁的版本。
git log --oneline --graph       // --graph 选项，查看历史中什么时候出现了分支、合并。
git log --reverse --oneline     //'--reverse'参数来逆向显示所有日志。
```

#### git reset
当执行 "git reset HEAD" 命令时，暂存区的目录树会被取消，被 master 分支指向的目录树所替换，但是工作区不受影响。 就是回到某个commit的版本。
```
git reset HEAD  //暂存区里的取消清空， 工作区回到上一个commit的版本
git reset --hard HEAD
git reset HEAD^ //回退一个版本， 一个^表示一个版本， 可以多个，也可以使用git reset HEAD~n   
git reset HEAD filename   //只对一个文件做回退

git log
git reset --hard 1094a      //日志前面5-6位就可以
```

#### git rm
移除

当执行`git rm --cached <file>`命令时，会直接从暂存区删除文件，工作区则不做出改变。就是将暂存区里的内容移除，你要进行重新`git add`， 工作区中代码时不变的。

如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 -f。

```
git rm -f <file>    //直接移除这个文件
git rm --cached <file>  //将暂存区中的内容清空， 你需要重新git add， 工作区的代码不变
git rm –r *     //进入某个目录中，执行此语句，会删除该目录下的所有文件和子目录
```

#### git push

关于git push， 我们只能推相对应， 本地是dev，远程也时dev， 本地时master，远程也是master。
```
//将本地的master分支推送到origin主机的master分支。如果master不存在，则会被新建。
git push origin master
//同理, 当前本地为dev分支， 将本地的dev分支推送到origin主机的dev分支， 如果dev分
支不存在，则会被新建
git push origin dev
```

如果当前分支与多个主机存在追踪关系，则可以使用-u选项指定一个默认主机，这样后面就可以不加任何参数使用`git push`。
```
git push -u origin master
```
上面命令将本地的`master`分支推送到`origin`主机，同时指定`origin`为默认主机，后面就可以不加任何参数使用`git push`了。

将当前分支推送到远程的同名的简单方法。
```
git push origin HEAD
```

将当前本地分支对应的远程分支合并到xx分支上(下面例子是master分支)， 如果xx分支不存在，则会创建该分支。
```
git push origin HEAD:master
```

#### git pull
`git pull`命令用于从另一个存储库或本地分支获取并集成(整合)。`git pull`命令的作用是：取回远程主机某个分支的更新，再与本地的指定分支合并，它的完整格式稍稍有点复杂。
```
git pull <远程主机名> <远程分支名>:<本地分支名>
```
比如，要取回origin主机的next分支，与本地的master分支合并，需要写成下面这样。
```
git pull origin next:master
```
如果远程分支(next)要与当前分支合并，则冒号后面的部分可以省略。上面命令可以简写为：
```
git pull origin next
//等同于先做git fetch，再执行git merge
git fetch origin
git merge origin/next
```

在默认模式下，git pull是git fetch后跟git merge的缩写。

##### git pull和git fetch的区别：

git pull: 从远程拉取最新版本到本地自动合并merge。 
```
git pull origin master
```
git fetch: 从远程获取最新版本到本地,但是不会自动合并merge。
```
git fetch origin master 
git log -p master..origin/master
git merge orgin/master
```

以上命令的含义：
- 首先从远程的`origin`的`master`主分支下载最新的版本到`origin/master`分支上
- 然后比较本地的`master`分支和`origin/master`分支的差别
- 最后进行合并

上述过程其实可以用以下更清晰的方式来进行:
```
git fetch origin master:tmp
git diff tmp
git merge tmp
```

#### git fetch
Git 有两个命令用来提取远程仓库的更新。
- `git fetch`: 从远程仓库下载新分支与数据, 该命令执行完后需要执行git merge 远程分支到你所在的分支。
- `git merge`: 从远端仓库提取数据并尝试合并到当前分支

例子
```
git fetch <远程主机名>      //git fetch origin
//要更新所有分支，命令可以简写为：
git fetch
//如果只想取回特定分支的更新，可以指定分支名
git fetch <远程主机名> <分支名>

git merge origin/master
```

#### git merge
git merge命令用于将两个或两个以上的开发历史加入(合并)一起。

例子1:
合并分支`fixes`和`enhancements`在当前分支的顶部，使它们合并：
```
git merge fixes enhancements
```

例子2:
合并`obsolete`分支到当前分支，使用`ours`合并策略：
```
git merge -s ours obsolete
```

例子3:
将分支`maint`合并到当前分支中，但不要自动进行新的提交：
```
git merge --no-commit maint
```

例子4:
将分支dev合并到当前分支中，自动进行新的提交：
```
git merge dev
```
例子5:
也可以使用`git merge`命令或者`git rebase`命令，在本地分支上合并远程分支
```
git merge origin/master
//或者
git rebase origin/master
```


#### git remote
`git remote`命令管理一组跟踪的存储库。

```
git remote      //不带参数，列出已经存在的远程分支
git remote -v   //列出详细信息，在每一个名字后面列出其远程url
git remote add [shortname] [url]    //要添加一个新的远程仓库,可以指定一个简单的名字,以便将来引用
//例如
git remote add origin https://github.com/touH/aa.git
```
关于Git 远程仓库(Github)的连接ssh，请参考[这里](http://www.runoob.com/git/git-remote-repo.html)

