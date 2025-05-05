import { UniqueIdentifier } from '@dnd-kit/core';

export default interface FieldType {
    id: UniqueIdentifier;
    label: string;
    type: string;
    required: boolean;
    isEditing: boolean;
    options: Record<string, any>;
    value: any;
}
