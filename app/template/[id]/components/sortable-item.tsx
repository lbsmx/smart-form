import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item from "./Item";
import { UniqueIdentifier } from "@dnd-kit/core";

export default function SortableItem(props: {
  id: UniqueIdentifier;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <Item
      ref={setNodeRef}
      {...props}
      style={style}
      {...attributes}
      {...listeners}
    ></Item>
  );
}
