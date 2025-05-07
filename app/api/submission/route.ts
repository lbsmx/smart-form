import dbConnect from '@/lib/mongodb';
import Submissions from '@/lib/submission';
import { NextRequest } from 'next/server';
import Forms from '@/lib/form';

// 禁用 Next.js 默认的 body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    const cookie = request.cookies.get('userid');
    const userId = cookie?.value;
    await dbConnect();
    const formData = await request.formData();
    const { formId, ...rest } = Object.fromEntries(formData);
    const form = await Forms.findById(formId);
    const { formList } = form;
    if (!form) {
        return new Response(
            JSON.stringify({
                error: '表单不存在',
            }),
            { status: 404 }
        );
    }

    const newFormList = Object.entries(rest).map(([key, value]) => {
        const formItem = formList.find((item) => item.id === key);
        formItem['value'] = value;
        return formItem;
    });

    try {
        await Submissions.create({
            formId,
            formData: newFormList,
            userId,
        });
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log('数据库写入失败', error);
        return new Response(JSON.stringify({ error: '提交失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
