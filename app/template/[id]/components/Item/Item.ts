import { DraggableSyntheticListeners, UniqueIdentifier } from "@dnd-kit/core";

export interface ItemProps {
  id: UniqueIdentifier;
  label?: string;
  type: string;
  sortable: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  listeners?: DraggableSyntheticListeners;
  attributes?: any;
  [key: string | number]: any; // 底层拓展
}
