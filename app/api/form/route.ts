import dbConnect from '@/lib/mongodb';
import Forms from '@/lib/form';

export async function POST(requset: Request) {
    await dbConnect();
    const { title, fields: formList } = await requset.json();
    const newForm = await Forms.create({ title, formList });

    const response = {
        id: newForm._id,
    };
    return new Response(JSON.stringify(response), { status: 201 });
}
