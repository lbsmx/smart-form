import React from "react";
import styles from "@/app/template/[id]/components/styles/side-form-item-panel.module.css";
import TextInput from "@/app/template/[id]/components/form-item/text-input";
import NumberInput from "@/app/template/[id]/components/form-item/number-input";
import Textarea from "@/app/template/[id]/components/form-item/textarea";
// import RadioGroup from '@/components/FormComponents/SelectionComponents/RadioGroup';
// import CheckboxGroup from '@/components/FormComponents/SelectionComponents/CheckboxGroup';
// import Dropdown from '@/components/FormComponents/SelectionComponents/Dropdown';
// import CustomDatePicker from '@/components/FormComponents/SpecializedInputs/DatePicker';
// import FileUpload from '@/components/FormComponents/SpecializedInputs/FileUpload';
import SortableItem from "@/app/template/[id]/components/sortable-item";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

interface FormComponent {
  id?: UniqueIdentifier;
  type: string;
  title: string;
  component: React.ReactNode;
}

export default function SideFormItemPanel() {
  const inputFields: FormComponent[] = [
    {
      type: "textInput",
      title: "Text Input",
      component: <TextInput label="Text Input" placeholder="Enter text" />,
    },
    {
      type: "numberInput",
      title: "Number Input",
      component: (
        <NumberInput
          label="Number Input"
          placeholder="Enter number"
          style={{ width: "100%" }}
        />
      ),
    },
    { type: "textarea", title: "Textarea", component: <Textarea /> },
  ];

  const selectionComponents: FormComponent[] = [
    // {
    //     title: 'Radio Group',
    //     component: (
    //         <RadioGroup
    //             label="Radio Group"
    //             options={[
    //                 { value: 'option1', label: 'Option 1' },
    //                 { value: 'option2', label: 'Option 2' },
    //             ]}
    //         />
    //     ),
    // },
    // {
    //     title: 'Checkbox Group',
    //     component: (
    //         <CheckboxGroup
    //             label="Checkbox Group"
    //             options={[
    //                 { value: 'option1', label: 'Option 1' },
    //                 { value: 'option2', label: 'Option 2' },
    //             ]}
    //         />
    //     ),
    // },
    // {
    //     title: 'Dropdown',
    //     component: (
    //         <Dropdown
    //             label="Dropdown"
    //             options={[
    //                 { value: 'option1', label: 'Option 1' },
    //                 { value: 'option2', label: 'Option 2' },
    //             ]}
    //         />
    //     ),
    // },
  ];

  const specializedInputs: FormComponent[] = [
    // {
    //     title: 'Date Picker',
    //     component: <CustomDatePicker label="Date Picker" />,
    // },
    // { title: 'File Upload', component: <FileUpload label="File Upload" /> },
  ];

  return (
    <div className={styles.panel}>
      <h2 className={styles.categoryTitle}>Input Fields</h2>
      <SortableContext
        items={inputFields.map((item) => item.type)}
        strategy={verticalListSortingStrategy}
      >
        {inputFields.map((field, index) => (
          <div key={index} className={styles.componentContainer}>
            <h3 className={styles.componentTitle}>{field.title}</h3>
            <SortableItem id={field.type}>
              <div className={styles.disabled}>{field.component}</div>
            </SortableItem>
          </div>
        ))}
      </SortableContext>

      <h2 className={styles.categoryTitle}>Selection Components</h2>
      {selectionComponents.map((component, index) => (
        <div key={index} className={styles.componentContainer}>
          <h3 className={styles.componentTitle}>{component.title}</h3>
          {component.component}
        </div>
      ))}

      <h2 className={styles.categoryTitle}>Specialized Inputs</h2>
      {specializedInputs.map((input, index) => (
        <div key={index} className={styles.componentContainer}>
          <h3 className={styles.componentTitle}>{input.title}</h3>
          {input.component}
        </div>
      ))}
    </div>
  );
}
