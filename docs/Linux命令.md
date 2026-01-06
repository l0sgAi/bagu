# 🪟Linux 命令基础

以下是按功能分类的 Linux 常用命令总结，适合快速查找和复习：

### 1. 文件与目录管理 (最基础)

- `ls`：列出目录内容。

  - ls -l：显示详细信息（权限、大小、时间）。

  - ls -a：显示所有文件（包括以.开头的隐藏文件）。

- `cd`：切换当前目录 (Change Directory)。

  - cd /path/to/dir：进入指定目录。

  - cd ..：返回上一级目录。

  - cd ~：回到用户主目录。

- `pwd`：显示当前工作目录的绝对路径。

- `mkdir`：创建新目录。

  - mkdir -p a/b/c：递归创建多级目录。

- `touch`：创建空文件或更新文件时间戳。

- `cp`：复制文件或目录。

  - cp file1 file2：复制文件。

  - cp -r dir1 dir2：递归复制目录。

- `mv`：移动文件或重命名。

- `rm`：删除文件或目录。

  - rm file：删除文件。

  - rm -rf dir：强制递归删除目录（**慎用！**）。

- `find`：查找文件。

  - find / -name "filename"：从根目录按名称查找文件。

### 2. 文件查看与内容处理

- `cat`：查看文件全部内容。

- `more / less`：分页查看文件内容（less  支持上下翻页，更常用）。

- `head`：查看文件开头几行。

  - head -n 10 file.txt：看前 10 行。

- `tail`：查看文件结尾几行。

  - tail -f log.txt：**实时**滚动查看日志文件（非常常用）。

- `grep`：文本搜索工具（强大）。

  - grep "error" file.txt：在文件中搜索字符串。

  - grep -r "string" .：在当前目录递归搜索。

- `vim / nano`：命令行文本编辑器。

  - vim：功能强大，需学习操作模式（i 插入，:wq 保存退出）。

### 3. 系统信息与进程管理

- `top / htop`：实时显示系统资源使用情况（CPU、内存、进程）。

- `ps`：查看当前进程快照。

  - ps -ef  或  ps aux：显示所有进程详细信息。

- `kill`：终止进程。

- `df`：查看磁盘空间使用情况。

  - df -h：以易读格式（GB, MB）显示。

- `free`：查看内存使用情况。

  - free -h：以易读格式显示。

- `uname`：查看系统内核信息。

  - uname -a：显示所有系统信息。

### 4. 权限与用户管理

- `chmod`：修改文件权限。

  - chmod 755 file：赋予所有者读写执行权限，其他人读执行权限。

  - chmod +x script.sh：赋予脚本执行权限。

- `chown`：修改文件所有者。

  - chown user:group file：修改文件的用户和组。

- `sudo`：以超级管理员（root）身份执行命令。

- `su`：切换用户。

  - `su` -：切换到 root 用户并加载环境变量。

- `useradd / userdel`：添加/删除用户。

- `passwd`：修改用户密码。

### 5. 网络管理

- `ping`：测试网络连通性。

- `ip`：查看和配置网络接口（取代了老的  ifconfig）。

  - `ip addr`：查看 IP 地址。

- `netstat / ss`：查看网络端口和连接。

  - `netstat -tulnp`：查看所有监听端口及对应进程。

- `ssh`：远程登录。

  - `ssh user@ip_address`。

- `curl / wget`：文件下载或发送网络请求。

  - `curl http://example.com`：获取网页内容。

### 6. 压缩与解压

- `tar`：打包和解压工具（最常用）。

  - `tar -czvf archive.tar.gz dir/`：打包并压缩为 .tar.gz。

  - `tar -xzvf archive.tar.gz`：解压 .tar.gz。

- `zip / unzip`：处理 .zip 格式。

### 7. 软件安装 (根据发行版不同)

- **Ubuntu/Debian 系列**:

  - apt update：更新软件源列表。

  - apt install package_name：安装软件。

- **CentOS/RHEL 系列**:

  - yum install package_name (旧版) 或  dnf install package_name (新版)。

### 8. 实用快捷键与技巧

- **Tab 键**：自动补全命令或文件名（**必用技巧**）。

- **Ctrl + C**：终止当前正在运行的命令。

- **Ctrl + L**：清屏（相当于  clear  命令）。

- **| (管道符)**：将前一个命令的输出作为后一个命令的输入。

  - 例如：ps -ef | grep java (查找包含 java 的进程)。
