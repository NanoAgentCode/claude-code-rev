# vLLM 兼容层试验说明（实验性）

## 1. 说明

本路径用于将推理请求指向本地或自托管的 **vLLM** 服务。实现方式与 Ollama 实验分支相同：仍使用 **Anthropic SDK**（`/v1/messages` 协议）。

需要 **已启用 Anthropic 兼容 API** 的 vLLM 版本（上游在 OpenAI 服务模式下提供 `/v1/messages`）。若服务端仅暴露 OpenAI 的 `/v1/chat/completions`，则需自行加协议转换网关，不能直接使用本开关。

另见：[Ollama兼容层试验说明.md](./Ollama兼容层试验说明.md)（行为对称，默认地址与端口不同）。

---

## 2. 默认行为

**未设置 `CLAUDE_CODE_USE_VLLM` 时**，与未启用本功能前一致，走 Anthropic / Bedrock / Vertex 等原有逻辑。

vLLM 路径为 **显式 opt-in**：仅在设置 `CLAUDE_CODE_USE_VLLM=1`（或 `settings*.json` 的 `env`）时启用。

---

## 3. 环境变量

- `CLAUDE_CODE_USE_VLLM=1` — 启用 vLLM 兼容路径  
- `VLLM_BASE_URL`（可选）— 默认 `http://127.0.0.1:8000`；若未以 `/v1` 结尾，会自动补全为 `.../v1`  
- `VLLM_API_KEY`（可选）— 默认 `vllm`；若服务端校验 API Key，请与 vLLM 启动参数一致  

也可通过 `ANTHROPIC_BASE_URL` 指定基址（与 Ollama 分支相同优先级习惯：本分支优先读 `VLLM_BASE_URL`，否则 `ANTHROPIC_BASE_URL`）。

**与 Ollama 同时设置时**：`CLAUDE_CODE_USE_VLLM` 优先于 `CLAUDE_CODE_USE_OLLAMA`（仅应启用其一，避免混淆）。

---

## 4. 快速试用（PowerShell）

```powershell
$env:CLAUDE_CODE_USE_VLLM="1"
$env:VLLM_BASE_URL="http://127.0.0.1:8000"
# 模型名需与 vLLM --model / served model id 一致，例如通过 ANTHROPIC_MODEL 等配置
bun run dev
```

---

## 5. 行为变化

启用后：

- API 客户端走 vLLM 分支，OAuth / 官方 API Key 自动流程按第三方本地服务处理（与 Ollama 类似）  
- 预连接 Anthropic 官方域名的逻辑会跳过  
- 相关变量会随子进程 / 队友进程透传（见 `spawnUtils` / `managedEnvConstants`）

---

## 6. 已知限制

- 实验性能力，非官方 provider  
- 工具调用、流式、错误码与 Claude 官方 API 可能存在差异，取决于 vLLM 实现与所加载模型  
- 请使用与 vLLM 部署一致的 **模型 ID**（可通过 `ANTHROPIC_MODEL` 等环境变量或设置指定）

---

## 7. 回退

```powershell
Remove-Item Env:CLAUDE_CODE_USE_VLLM
Remove-Item Env:VLLM_BASE_URL
Remove-Item Env:VLLM_API_KEY
```
