---
title: Chat Completions 与 Responses API 的区别
date: 2026-11-22
tags: [OpenAI, API]
---

**Chat Completions 和 Responses 是 OpenAI 的两套接口，不是两种模型 🧐**

- Chat Completions 的基本单位是**消息（message）**：传一组对话历史，模型接龙出下一条消息。

- Responses 的基本单位是**条目（item）**：一次调用可以直接产出文本、推理过程、函数调用等多种条目。

只做单轮问答时两者体感差不多，但是一接入工具、跑多轮会话，这套抽象的差异就会很明显。

## 接口

| 场景       | Chat Completions                                                               | Responses                                                                                                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 发起请求   | `POST /v1/chat/completions`，用 `messages` 传列表                              | `POST /v1/responses`，`input` 可直接传字符串或条目列表                                                            |
| 读取正文   | 取 `choices[0].message.content`                                                | 1. Python SDK 可直接读 `response.output_text`<br>2. 解析原始 JSON 时按条目类型遍历 `output`，别假设第一项就是正文 |
| 续接对话   | 客户端自己维护历史，每次连同新问题全量重传                                     | 可手动传历史，也可传 `previous_response_id` 续接上一轮，或用 `conversation` 管理会话                              |
| 自定义函数 | 从助手消息的 `tool_calls` 读参数；用 `role: "tool"` 和 `tool_call_id` 回传结果 | 1. 从 `output` 读 `function_call`<br>2. 在下一轮 `input` 里传 `function_call_output` 并对应同一个 `call_id`       |
| 流式输出   | 读 `choices[0].delta`，自己拼正文和工具参数                                    | 按事件类型分流：`response.output_text.delta` 是正文，`response.function_call_arguments.delta` 是函数参数          |
| 结构化输出 | 通过 `response_format` 指定                                                    | 通过 `text.format` 指定                                                                                           |

## 举例：查订单并追问到货时间

假设应用里有一个自定义函数 `lookup_order`，能查出订单状态和预计到货日（不同于平台代为执行的文件检索、代码解释器等内置工具，自定义函数需要应用自己在本地跑）。

1. **用户问「订单 A 发货了吗？」**：模型不会自己去查库，而是返回调用 `lookup_order` 的请求。注意，收到调用请求不代表已经查到结果，此时还不能回答用户。
2. **应用查到「已发货，预计周五到」**：
   - 用 Chat Completions 时，要把带 `tool_calls` 的助手消息和对应的 `role: "tool"` 结果消息一起塞回 `messages` 再发一次。
   - 用 Responses 时，只需在下一轮 `input` 里传 `function_call_output`，并用 `previous_response_id` 指向上一轮发出调用的响应 ID。模型拿到结果后就会回答「已发货」。
3. **用户追问「那它什么时候到？」**：
   - Chat Completions 必须把订单 A 的相关历史（尤其是包含到货日的工具结果）连同新问题一起再发一遍。
   - Responses 只要把 `previous_response_id` 指向上一轮回答「已发货」的响应 ID，请求里只带新问题就行。

> [!NOTE] Note
> 传 `previous_response_id` 只是让服务端帮你回溯上下文，前面几轮的对话和工具结果依然按输入 token 计费。另外，顶层的 `instructions` 参数不会自动继承到下一轮，有全局约束的话每轮都得重传，或者直接写进 `developer` 消息里

相关笔记：[Stream 与 Non-stream 输出方式](/posts/stream-non-stream/)

官方文档：[迁移到 Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) · [会话状态](https://developers.openai.com/api/docs/guides/conversation-state) · [函数调用](https://developers.openai.com/api/docs/guides/function-calling)
