import dbConnect from '@/lib/mongodb';
import Forms from '@/lib/form';
import { NextRequest } from 'next/server';
import { FormUpdateType } from '@/store/form';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const cookie = request.cookies.get('userid');
        const userId = cookie?.value;
        const { title, fields: formList } = await request.json();
        const newForm = await Forms.create({ userId, title, formList });

        const response = {
            id: newForm._id,
        };
        return new Response(JSON.stringify(response), { status: 201 });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error,
            }),
            { status: 500 }
        );
    }
}

// Helper function to create a response
const createResponse = (type: string, form: any, status: number = 200) => {
    return new Response(
        JSON.stringify({
            type,
            form,
        }),
        {
            status,
        }
    );
};

// Helper function to update the form and return the updated form
const updateForm = async (
    formId: string,
    updateData: any,
    options: { arrayFilters?: any[] } = {}
) => {
    await dbConnect();
    const form = await Forms.findByIdAndUpdate(formId, updateData, {
        new: true,
        ...options,
    });
    return form;
};

export async function PUT(request: NextRequest) {
    const { type, formId, data } = await request.json();
    let form;

    switch (type) {
        case FormUpdateType.UpdateItem:
            const updatePayload = Object.keys(data.updated).reduce(
                (acc, key) => {
                    acc[`formList.$[item].${key}`] = data.updated[key];
                    return acc;
                },
                {}
            );

            form = await updateForm(
                formId,
                {
                    $set: updatePayload,
                },
                {
                    arrayFilters: [{ 'item.id': data.id }],
                }
            );
            break;
        case FormUpdateType.AddItem:
            form = await updateForm(formId, {
                $push: {
                    formList: {
                        $each: [data.newItem],
                        $position: data.index,
                    },
                },
            });
            break;
        case FormUpdateType.DeleteItem:
            form = await updateForm(formId, {
                $pull: {
                    formList: { id: data.item.id },
                },
            });
            break;
        case FormUpdateType.SortList:
            const { oldIndex, newIndex } = data;

            const currentForm = await Forms.findById(formId);
            if (!currentForm) {
                return new Response(
                    JSON.stringify({ error: 'Form not found' }),
                    {
                        status: 404,
                    }
                );
            }
            const formList = [...currentForm.formList];
            const [movedItem] = formList.splice(oldIndex, 1);
            formList.splice(newIndex, 0, movedItem);

            form = await updateForm(formId, {
                $set: {
                    formList,
                },
            });

            break;
        case FormUpdateType.UpdateTitle:
            form = await updateForm(formId, { title: data.formTitle });
            break;
        default:
            return new Response(JSON.stringify({ error: 'Invalid type' }), {
                status: 400,
            });
    }

    return createResponse(type, form);
}
