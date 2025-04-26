import dbConnect from '@/lib/mongodb';
import Forms from '@/lib/form';
import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';
import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';
import { UniqueIdentifier } from '@dnd-kit/core';
import FieldType from '@/app/form/[id]/components/form-item/field-types';

export async function POST(request: NextRequest) {
    await dbConnect();
    const { title, fields: formList } = await request.json();
    const newForm = await Forms.create({ title, formList });

    const response = {
        id: newForm._id,
    };
    return new Response(JSON.stringify(response), { status: 201 });
}

interface updatedFormListParams {
    formList: SortableItemProps[];
    id: UniqueIdentifier;
    updatedItem: Partial<FieldType>;
}
const updateFormList = ({
    formList,
    id,
    updatedItem,
}: updatedFormListParams): SortableItemProps[] => {
    const itemIndex = formList.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        const updatedFormList = formList.map((item, index) =>
            index === itemIndex ? { ...item, ...updatedItem } : item
        );
        return updatedFormList;
    } else {
        return formList;
    }
};

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
const updateForm = async (formId: string, updateData: any) => {
    await dbConnect();
    const form = await Forms.findByIdAndUpdate(formId, updateData, {
        new: true,
    });
    return form;
};

export async function PUT(request: NextRequest) {
    await dbConnect();
    const { type, formId, data } = await request.json();
    let form;

    switch (type) {
        case 'formItem':
            const updatedFormList = updateFormList({
                formList: data.formList,
                id: data.id,
                updatedItem: data.updatedItem,
            });
            form = await updateForm(formId, { formList: updatedFormList });
            break;
        case 'formTitle':
            form = await updateForm(formId, { title: data.formTitle });
            break;
        case 'formList':
            form = await updateForm(formId, { formList: data.updatedFormList });
            break;
        default:
            return new Response(JSON.stringify({ error: 'Invalid type' }), {
                status: 400,
            });
    }

    return createResponse(type, form);
}

export async function GET(request: NextRequest) {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const form = await Forms.findById(id);
    if (!form) notFound();
    const { title, formList } = form;
    const response = {
        formId: id,
        formTitle: title,
        formList,
    };
    return new Response(JSON.stringify(response), { status: 200 });
}
