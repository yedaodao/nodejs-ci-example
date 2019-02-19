#!/bin/bash

set -e

CURRENT_PATH=`pwd`

# 输出日志
function print() {
    local time=now
    local prefix=$1
    local message=${@:2}
    # 当前时间 ex. 2019-1-1_12:00:01
    echo "[${prefix}]`date +%Y%m%d_%H%M%S`|${message}"
}

function info() {
    local message=$*
    print "INFO" ${message}
}

function fatal() {
    local message=$*
    print "FATAL" ${message}
}

# 执行命令，将标准输入打印至日志
function execWithLog() {
    local cmd=$@
    info "Run Command: ${cmd}"
    /bin/bash -c "$cmd"
    if [[ $? -ne 0 ]]
    then
        fatal "Run Command ERROR: $cmd"
        exit 255
    else
        info "Run Command Success: $cmd"
        return 0
    fi
}

# 判断当前环境是否满足build任务
function checkEnv() {
    if [[ ! -x "$(command -v node)" ]]
    then
        exit 255
    fi
    return 0
}

# 清理可能存在的脏数据
function clear() {
    execWithLog "rm -rf ./node_modules"
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
    execWithLog "cd ./build && tar -zcvf nodejs_ci_exmaple_`date +%Y%m%d_%H%M%S`.tar.gz *"
}

# 主函数
function Main() {
    info "---------- Begin build & package ----------"
    checkEnv
#    checkEnv && clear && build && package
    info "---------- End build & package ----------"
}

Main $@

