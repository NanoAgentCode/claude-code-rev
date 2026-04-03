# Ollama 兼容层试验说明（实验性）

本地 **vLLM**（Anthropic 协议）见 [vLLM兼容层试验说明.md](./vLLM兼容层试验说明.md)。

## 1. 说明

本项目已新增一条 **实验性 Ollama 兼容路径**，用于快速尝试接入本地 Ollama。

注意：当前主客户端仍使用 Anthropic SDK 协议，因此这条路径要求目标地址能兼容 Anthropic 风格请求。  
如果你直接对接原生 Ollama 接口，可能出现协议不匹配。

---

## 2. 默认行为（原生配置）

**未设置 `CLAUDE_CODE_USE_OLLAMA` 时，与加入 Ollama 兼容层之前一致**，走原有厂商逻辑：

- 未开 Bedrock / Vertex / Foundry：使用 **Anthropic 官方路径**（OAuth、`ANTHROPIC_API_KEY`、`ANTHROPIC_BASE_URL` 等按原逻辑）
- 若开了 `CLAUDE_CODE_USE_BEDROCK` / `CLAUDE_CODE_USE_VERTEX` / `CLAUDE_CODE_USE_FOUNDRY`：仍按对应 SDK 分支

Ollama 路径 **仅为显式 opt-in**：只有在你设置 `CLAUDE_CODE_USE_OLLAMA=1`（或写入 `settings*.json` 的 `env`）时才会启用。

若希望长期默认原生：**不要把 `CLAUDE_CODE_USE_OLLAMA` 写进系统/用户级永久环境变量**；需要试 Ollama 时在当次终端里临时 ` $env:...=...` 即可。

---

## 3. 新增环境变量

- `CLAUDE_CODE_USE_OLLAMA=1`  
  启用 Ollama 兼容路径

- `OLLAMA_BASE_URL`（可选）  
  默认 `http://127.0.0.1:11434`，内部会自动补全为 `/v1`

- `OLLAMA_API_KEY`（可选）  
  默认 `ollama`

---

## 4. 快速试用

在 Windows PowerShell 中：

```powershell
$env:CLAUDE_CODE_USE_OLLAMA="1"
$env:OLLAMA_BASE_URL="http://127.0.0.1:11434"
bun run dev
```

如果需要版本验证：

```powershell
bun run version
```

---

## 5. 行为变化

启用 `CLAUDE_CODE_USE_OLLAMA=1` 后：

- API 客户端会走 Ollama 兼容分支；
- Anthropic OAuth/API Key 自动流程会被绕过；
- 预连接 Anthropic API 的逻辑会被跳过；
- 相关 provider 环境变量会随子进程/队友进程透传。

---

## 6. 已知限制

- 这是“兼容层尝试”，不是完整官方 provider；
- 若目标端不支持 Anthropic 风格接口，工具调用/流式/错误语义可能异常；
- 更稳的生产方案通常是加一层协议转换网关（将 Anthropic 请求转换到 Ollama）。

---

## 7. 回退方式

取消环境变量即可恢复默认路径：

```powershell
Remove-Item Env:CLAUDE_CODE_USE_OLLAMA
Remove-Item Env:OLLAMA_BASE_URL
Remove-Item Env:OLLAMA_API_KEY
```

