import { DraggableSyntheticListeners } from '@dnd-kit/core';
import Item from './Item';
import FieldType from '../form-item/field-types';

export interface ItemProps extends FieldType {
    sortable: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    listeners?: DraggableSyntheticListeners;
    attributes?: any;
    required: boolean;
}

export default Item;
