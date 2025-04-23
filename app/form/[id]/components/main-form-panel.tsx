"use client";

import MainHeader from "./main-header";
import MainForm from "./main-form";
import { memo, useState } from "react";
import FormContext from "./form-context";

function MainFormPanel(props) {
  const [editable, setEditable] = useState(true);

  return (
    <FormContext.Provider value={editable}>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <MainHeader></MainHeader>
        <MainForm formList={props.formList}></MainForm>
      </div>
    </FormContext.Provider>
  );
}

export default memo(MainFormPanel);
