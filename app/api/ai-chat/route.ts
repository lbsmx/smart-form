import { NextRequest } from 'next/server';
import OpenAI from 'openai';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function POST(request: NextRequest) {
    const { requirements } = await request.json();

    const openai = new OpenAI({
        baseURL: process.env.NEXT_PUBLIC_DEEPSEEK_BASE_URL,
        apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    });

    const systemPrompt = `你是一个专业的表单设计助手。请根据用户要求生成一个结构化的 JSON 格式表单模板

1. **表单类型和描述**:
   - textInput: 单行文本输入框，适用于短文本（如姓名、电话号码）。
     - options 支持字段：
       - maxLength: number，最大输入长度，默认 30。
       - placeholder: string，输入提示文字。
   - textArea: 多行文本输入框，适用于长文本（如个人简介、备注）。
     - options 支持字段：
       - maxLength: number，最大输入字符数。
       - placeholder: string，输入提示文字。
   - radioGroup: 单选框组，用户只能选择一项。
     - options 支持字段：
       - options: Array<{ value: string; label: string }>，选项列表。
   - checkboxGroup: 多选框组，用户可以选择多个选项。
     - options 支持字段：
       - options: Array<{ value: string; label: string }>，选项列表。
   - uploader: 文件上传组件。
     - options 支持字段：
       - accept: string，允许上传的文件类型，仅支持四种格式："image/*,.pdf,.docx,.xlsx"。默认全选。
       - multiple: boolean，是否允许用户选择多个文件。默认 false。

2. **JSON Schema 示例**:
{
  "formTitle": "表单标题",
  "formList": [
    {
      "type": "textInput",
      "label": "用户名",
      "required": true,
      "options": {
        "maxLength": 20,
        "placeholder": "请输入用户名"
      }
    },
    {
      "type": "radioGroup",
      "label": "性别",
      "required": true,
      "options": {
        "options": [
          {"value": "male", "label": "男"},
          {"value": "female", "label": "女"}
        ]
      }
    },
    {
      "type": "uploader",
      "label": "附件",
      "required": true,
      "options": {
        "accept": "image/*,.pdf,.docx,.xlsx",
        "multiple": false
      }
    }
  ]
}

3. **输出要求**:
- 表单标题应该与用户需求相关联，如果没有预期内容，则返回"表单标题"。
- 如果用户没有明确说明字段规则，请根据常识推断最合适的字段类型和验证规则。
- 返回的 JSON 必须严格符合上述格式，不要包含任何解释性文字。
- 如果需求无意义（如仅包含数字或乱码），返回空数组。
`;

    const userPrompt = `请帮我设计一个表单，需要包含以下信息：${requirements}`;

    const messages: ChatMessage[] = [
        // 系统角色，提示AI应该怎样收敛输出内容
        {
            role: 'system',
            content: systemPrompt,
        },
        // 用户角色，模拟用户的输入
        {
            role: 'user',
            content: userPrompt,
        },
    ];

    try {
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'deepseek-chat',
            // 指定返回格式为json，且返回格式通过prompt进行严格限制
            response_format: {
                type: 'json_object',
            },
        });
        const responseJson = completion.choices[0].message.content;
        return new Response(responseJson, {
            status: 200,
        });
    } catch (error: any) {
        const { status } = error;
        let message;
        switch (status) {
            case 400:
                message = '请求格式错误错误';
                break;
            case 401:
                message = 'API key错误';
                break;
            case 402:
                message = '作者没钱了:(';
                break;
            case 500:
                message = 'deepseek又挂掉了:(';
                break;
            default:
                break;
        }
        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
