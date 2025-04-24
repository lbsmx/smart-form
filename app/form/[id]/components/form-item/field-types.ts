import { UniqueIdentifier } from '@dnd-kit/core';

export default interface FieldType {
    id: UniqueIdentifier;
    label: string;
    type: string;
    [x: string | number]: any;
}
