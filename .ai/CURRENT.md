# 当前状态

更新于 2026-11-06，Asia/Shanghai。

## 本轮恢复

Tim 明确要求恢复 run.scond.me 的新版 UI，并尽快修复。今日同步产生 master@7c28664 的 Git 生产部署，替换了 10 月 27 日从本地隔离包发布的新版界面。新版 UI 未合入远端 master 是反复覆盖的原因。

已将域名切回已核对的新版部署 dpl_DM4dE3CX9QywmAB7NagLyFnSV8iu 作为临时恢复。正在把原本地新版 UI 与 origin/master 的最新数据、Keep/CI 修复合并，正式使用统一源码发布，避免下次数据提交覆盖界面。

合并只在 CURRENT/DECISIONS 发生文档冲突，已保留双方有效记录。对 origin/master 的发布差异仅为既有 UI、项目记录及未使用导入修正，活动 JSON、数据库、GPS、SVG 数据与同步脚本/工作流保持远端版本。未将本地旧活动数据上传覆盖远端。

前端类型、Lint、Vite 构建和 diff 检查通过。系统 Python 3.9/3.11 缺少测试依赖，临时环境安装遭遇 PyPI 网络失败，合成 Python 测试暂未通过本机执行，待 GitHub 原 CI 验证。最终部署号与线上验收完成后补充。

自然排程仍待 11 月 7 日执行验证。历史材料见 archive/2026-11-06-reconciliation.md 与 archive/2026-11-06-state-history.md。
