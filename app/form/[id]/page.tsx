import Forms from '@/lib/form';
import { notFound } from 'next/navigation';
import Fields from '@/lib/field';
import { UniqueIdentifier } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';
import DndContextWrapper from './components/dnd-context-wrapper/dnd-context-wrapper';

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
            case 'checkboxGroup':
                const { options: list } = options as {
                    options: { value: string; label: string }[];
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

export default async function Form({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id }: { id: string } = await params;
    try {
        const formPromsie = Forms.findById(id).exec();
        const fieldsPromise = Fields.find({}, { _id: 0 }).exec(); // 排除_id字段
        // 两个数据直接没有依赖 并发请求 降低瀑布流
        const [form, fields] = await Promise.all([formPromsie, fieldsPromise]);
        const formLib = convert2Tree(fields);
        const { formList, title } = form;
        const formData = {
            id,
            formList,
            title,
            formLib,
        };

        return (
            <>
                {/* <Button>nh</Button> */}
                <DndContextWrapper formData={formData} />
            </>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}
