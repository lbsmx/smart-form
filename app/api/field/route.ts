import Fields from '@/lib/field';
import dbConnect from '@/lib/mongodb';
import { UniqueIdentifier } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';

interface SideField {
    id: UniqueIdentifier;
    label: string;
    type: string;
    required: boolean;
    belong: string;
    children?: SideField[];
    options: object;
}
const convert2Tree = (arr: SideField[]) => {
    const result: Record<string, SideField[]> = {};
    arr.forEach((field) => {
        const { label, type, required, belong, options } = field;
        switch (type) {
            case 'radioGroup':
                const { list } = options as {
                    list: { value: string; label: string }[];
                };
                list.forEach((item) => {
                    item.value = uuid();
                });
                break;
            default:
                break;
        }

        if (!result[belong]) {
            result[belong] = [];
        }
        result[belong].push({
            id: uuid(),
            label,
            type,
            required,
            options,
            belong,
        });
    });
    return result;
};
export async function GET() {
    await dbConnect();
    const fields = await Fields.find({}, { _id: 0 }); // 排除_id字段
    const fieldTree = convert2Tree(fields);
    return new Response(JSON.stringify(fieldTree), { status: 200 });
}
