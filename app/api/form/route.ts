import dbConnect from '@/lib/mongodb';
import Forms from '@/lib/form';
import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';

export async function POST(requset: NextRequest) {
    await dbConnect();
    const { title, fields: formList } = await requset.json();
    const newForm = await Forms.create({ title, formList });

    const response = {
        id: newForm._id,
    };
    return new Response(JSON.stringify(response), { status: 201 });
}

export async function GET(request: NextRequest) {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const form = await Forms.findById(id);
    if (!form) notFound();
    const { title, formList } = form;
    const response = {
        title,
        formList,
    };
    return new Response(JSON.stringify(response), { status: 200 });
}
