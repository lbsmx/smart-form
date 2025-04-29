import { UniqueIdentifier } from '@dnd-kit/core';

export default interface FieldType {
    id: UniqueIdentifier;
    label: string;
    type: string;
    required: boolean;
    [x: string | number]: any;
}
