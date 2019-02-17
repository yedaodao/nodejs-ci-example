#!/bin/bash

CURRENT_PATH=`pwd`
BUILD_LOG_FILE="/tmp/build_nodejs_ci_example.log"

# 输出日志
function print() {
    local time=now
    local message=$1
    echo "[INFO]${time}|${message}"
}

# 执行命令，将标准输入打印至日志
function execWithLog() {
    local cmd=$@
    print "Run Command: ${cmd}"
    /bin/bash -c "$cmd"
}

# 当前时间 ex. 2019-1-1_12:00:01
function now() {
    echo `date +%Y%m%d_%H%M%S`
}

# 清理可能存在的脏数据
function clear() {
    execWithLog "rm -rf ./build"
}

# 编译项目
function build() {
    execWithLog "npm install"
    execWithLog "npm run build"
    # 使用该命令清理编译依赖，减少打包体积
    execWithLog "npm prune --production"
}

# 打包
function package() {
    execWithLog "cp -r ./node_modules ./build"
    execWithLog "tar -zxvf ./build -C nodejs_ci_exmaple_${now}.tar.gz"
}

# 主函数
function Main() {
    print "---------- Begin build & package ----------"
    clear && build && package
    print "---------- End build & package ----------"
}

Main $@

