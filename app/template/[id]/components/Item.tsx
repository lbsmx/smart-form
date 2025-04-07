import React, { forwardRef } from "react";
import { Form, Input } from "antd";
import { UniqueIdentifier } from "@dnd-kit/core";

const Item = forwardRef<
  HTMLInputElement,
  { id: UniqueIdentifier | undefined; style?: React.CSSProperties }
>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <Form.Item label={props.id}>
        <Input></Input>
      </Form.Item>
    </div>
  );
});

export default Item;
