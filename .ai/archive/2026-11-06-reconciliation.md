# 状态核对与整理 · 2026-11-06

现场核对时间：2026-11-06 18:03–18:08（Asia/Shanghai）。本文件记录本轮证据与事项去向；唯一可替换的当前状态是 [CURRENT](../CURRENT.md)。

## 范围与保护

- 任务仅为本仓库文档整理和只读核实。未修改 TimOS、应用代码、analytics、工作流、个人活动、配置或秘密；未同步、触发工作流、部署、安装、上传或新建提醒。
- 开始时本地 `master@2bf0ba6bac9c908aea417b438a8a75badadf6e11`，只有 `.ai/CURRENT.md` 未提交且暂存区为空。其全部原文（含已有改动）与旧 BACKLOG 已保存到 [原始记录](2026-11-06-state-history.md)，以 SHA-256 校验逐字完整性。没有覆盖其他工作。
- 原仓库没有历史目录，本轮建立 `archive/` 并补 [索引](README.md)。PROJECT 改为稳定定位／边界，README 中上游教程和 TODO 保留原内容、增加本站入口，不另建当前状态副本。

## 当前生产身份与源码关系（本轮事实）

| 项目 | 只读结果 |
| --- | --- |
| Vercel 项目 | `run-scond-me` / `prj_vRMznol05XSKfeNIYpz3XIlIoCsh` |
| 域名当前部署 | `dpl_FsqxscV2YcYPVMU54N1TY4N6THzt`，READY，target `production`，alias `run.scond.me` |
| 部署来源 | source `git`，`master@7c28664258ea1e046cc928171134afe46f31e493`，提交信息 `update new runs` |
| 当前远端 master | 同一 `7c28664`，父提交恰为缓存 `origin/master@b5298cbaaace581b9cb1fd477c02f70776b506d4` |
| 远端归属／可见性 | GitHub connector 核实 `helloo2020/running_page`，`public`，非 archived |
| 本轮前分叉 | 相对缓存 ahead 14 / behind 31；加上远端唯一新后继后，实际 ahead 14 / behind 32。没有更新本地远端引用，未 fetch/pull/merge/checkout。 |

生产身份由 Vercel `get_deployment(run.scond.me, withGitRepoInfo=true)` 返回；[生产部署入口](https://run-scond-al6f3geps-zenjurygmailcoms-projects.vercel.app)、[提交身份](https://github.com/helloo2020/running_page/commit/7c28664258ea1e046cc928171134afe46f31e493)。没有为核对读取该提交的活动 diff。

**已确认的生产差异：**

- 本轮对首页只发出普通 HTML GET，不执行 JS，不载入活动资源或计数脚本。返回 HTTP 200，主脚本 `/assets/index-8a581b93.js`；HTML 包含 `data-visit-count` 和 `https://scond.me/visit-counter.js`，不包含 `https://scond.me/analytics.js`。这只能证明页面入口与脚本接入，不能证明完整交互验收或计数服务是否正常。
- [生产提交的入口源码](https://github.com/helloo2020/running_page/blob/7c28664258ea1e046cc928171134afe46f31e493/src/main.tsx)只注册 `/`、`summary` 和通配 404，没有 `/log`。[index.html](https://github.com/helloo2020/running_page/blob/7c28664258ea1e046cc928171134afe46f31e493/index.html) 与线上旧计数脚本一致。
- 通过 Git tree 的路径／blob 哈希比较，生产提交的 `src/`（排除 `src/static/`）、`index.html`、`.github/`、`tests/`、`requirements-dev.txt` 与缓存 `b5298cb` 的 43 个文件一致，没有新源文件。生产 tree 不含 `src/pages/log.tsx` 或 `src/hooks/useTheme.ts`。没有读取活动 blob。
- 本地则有日志、新主题、统计修正及 `analytics.js`。10 月 23–27 日记录表明这些曾以隔离包正式发布，最后分析接入为 `dpl_DM4dE3CX9QywmAB7NagLyFnSV8iu`；这些记录证明历史交付，不能替代今天的别名身份。

**有证据支持的判断：** 此次数据同步提交触发 Git 生产部署，旧远端前端基线替换了独立包发布，导致之前已发布功能未保留在线上。这是“数据已恢复、前端退回旧源码”两件不同的事。当前状态不能仍写橙色日志版和隐藏分析在线；也不能声称这些功能从未做完。本轮不分析后台报表投递、不改 analytics，不修复或重新发布。

**后续前提：** 需以最新远端公开数据及 Keep／CI 修复为基线，重新整合已交付前端并验证持续同步不会再次替换它；不可以直接部署本地老数据或整体推送分叉历史。这里仅记录任务依赖，不构成实施／发布授权。

## 11 月 6 日恢复对本项目的影响

已有直接证据来自关联会话“排查并修复跑步数据同步”（`01a1af34-5e62-7130-8e00-d96d21cc0045`）最后两轮结论，以及 [TimOS 同步恢复记录](/Users/tim/Coding/TimOS/digital-life-dashboard/docs/tasks/RUNNING_SYNC_RECOVERY_2026-11-06.md)。本轮没有重跑其验证或更新 TimOS 文档。

- 该记录确认 GitHub Actions 页显示 Fork 工作流被平台停用，重新启用后原同步可执行；API 的 workflow active、仓库 enabled 与停用门禁可以并存。平台内部评分／精确停用时间未知。
- 既有恢复验收确认补回 5 次、总计 734 条、最新 11 月 5 日；跑步站、GitHub 数据与 OS 两处快照一致。这里只转述已授权任务的交付结论，未读取私人活动详情、数据库或 Keep。
- OS 心跳兜底、合法失败日志及首页按需读取／缓存竞态修复已交付：其记录中最终源码 `4e96d3b`、部署 `dpl_FmBLmj3xGpKk1S1QxoojFKdcA6C4`。501 项测试及 Chrome 首页重载／站内返回是**此前该任务结果**，不是本轮重跑；本轮没有核对 OS 后续是否产生其他部署，也不把记录中的版本重复维护为 OS 最新状态。
- OS 依据上游任务成功时间判断心跳，不以是否新增跑步判断成功；休息日无新增可正常完成。上游失败或过旧时复用／补派发，无法绕过 Fork 仓库级停用；不能保证永不复发。

本轮使用现有 GitHub connector 核对仓库身份与源码；connector 没有列出所有触发类型的 workflow run 接口，因此通过 `gh api` **GET** 补查最少任务元数据，未读日志、秘密值或活动内容：

| 最新相关任务 | event | 状态 | 北京时间 |
| --- | --- | --- | --- |
| [42166690041](https://github.com/helloo2020/running_page/actions/runs/42166690041) | `workflow_dispatch` | completed / success | 11-06 13:09:15–13:11:30 |
| [40014353169](https://github.com/helloo2020/running_page/actions/runs/40014353169) | `schedule` | completed / success | 10-24 03:48:48–03:50:53 |

恢复后首个自然排程**仍未观察到**。原上游 UTC `0 16 * * *`、OS UTC `0 22 * * *` 分别对应北京时间 00:00／06:00；恢复后下一轮计划为 11 月 7 日，计划时间不保证实际准点。下一次只读验收需区分 GitHub `event=schedule`、OS `running_cron_sync` 及两处快照；手动成功不能代替自然闭环。此处不新建自动提醒、不等待到点或触发任务。

## 历史事项去向

| 原表述／待办 | 本轮处理与依据 |
| --- | --- |
| 仍在 onboarding、7 月部署／可见计数为当前 | 从当前状态移除，原文完整归档；实际当前版本以本轮身份为准。 |
| 10 月 23 日各轮“仅本地预览／未提交／未发布” | 保留为阶段历史，后续正式发布记录已取代这些阶段状态；现网前端回退单列，不等同于从未发布。 |
| 日志五个旧 TypeScript 错误 | 10 月 23 日正式日志发布记录已确认修复，不再作为当前本地阻塞；没有本轮类型检查声明。 |
| Summary Run-only 与日志 Run + VirtualRun 不一致待修 | 10 月 24 日 `9b6bc35` 及原 CURRENT 已记录统一口径并发布，移出未开发待办；当前生产缺少该前端版本，归入恢复发布依赖。 |
| 基线构建从未检查、项目没有测试 | 前者被多次历史构建取代；后者仅是早期本地观察。远端已有 Keep/GPX 测试及 CI 修复，当前本地不含这些文件；不能概括为全项目无测试。 |
| 最小前端 smoke | 历史已有临时浏览器验证，保留真正未完成的“固化为可重复仓库验证”候选。 |
| Map/privacy settings cleanup | 已有隐私地图与图层规则，不再保留笼统清理项；公开暴露范围评估归入隐私候选，非隐私 lights 模式历史未验不宣称通过。 |
| Provider support review | 没有具体新来源或需求，撤下泛化占位；沿用 PROJECT 的 Not Now，原文留档。 |
| CI `git add .`、隐私复核、上游跟进策略 | 仍属有效未实施候选，保留在 BACKLOG；不借文档任务实施。 |

远端 10 月 23 日 Keep 空路径／无时间戳心率样本修复，以及 Black/Ruff、11 个合成回归和 Python 3.11–3.13 CI 成功，原始交付依据为 [固定版本 CURRENT](https://github.com/helloo2020/running_page/blob/b5298cbaaace581b9cb1fd477c02f70776b506d4/.ai/CURRENT.md)。本轮仅阅读该记录，不伪称重跑。

## 原始证据可用性

本轮只检查下列历史临时路径是否存在，没有读媒体／发布包内容；结果均不存在：

- `/private/tmp/scond-publish-20261023/run-build`
- `/private/tmp/run-polish-release-20261023`
- `/private/tmp/run-journal-release-20261023`
- `/private/tmp/run-journal-upload-manifest.json`
- `/private/tmp/run-journal-live-http.json`
- `/private/tmp/run-journal-live-final.png`、`run-journal-live-mobile.png`
- `/private/tmp/run-live-release-calendar.png`、`run-live-release-summary.png`
- `/private/tmp/running-page-ci-release-shallow-20261023`

原文路径仍在归档中保留以供历史追溯，但不能当作现存可复核附件。其他临时路径未逐一核实。物理手机／Safari、完整无障碍和隐藏非隐私模式未有新增验收；安装或 READY 状态不能替代使用验收。

## 验证与提交／备份边界

- 本轮验证限文档内容／差异、改动范围、链接目标、原 CURRENT/BACKLOG SHA-256 完整性及 `git diff --check`。没有跑应用构建、Lint、单测、浏览器交互或真实同步。
- 只允许暂存本次文档并本地提交；提交号以本仓库 `git log -1 --format='%h %s'` 为准，不把提交号写回同一个提交。
- **不推送**：原 origin 已核实为公开仓库，不满足长期私人备份授权；而且 Git 关联生产部署已由本次同步提交的实际发布证明，分支也无法直接快进。没有新建远端、强推或改变部署关系。
- 文档检查已通过：10 个改动文件均为本次 Markdown；35 个新增／更新本地链接目标存在；原 CURRENT（含既有改动）和 BACKLOG 的 SHA-256 完全一致；`git diff --check` 通过。历史缺失临时路径明确标注，不当作有效附件；没有活动／应用代码改动。外部业务、自然排程与真机验收仍按上方边界保留。
