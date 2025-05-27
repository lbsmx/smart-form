import { Rate, Checkbox, Input, Radio, Form } from 'antd';
import FieldType from './field-types';
import WithUpdateState from './withUpdateState';

function FormRate(props: FieldType) {
    const { isEditing, label, options, onChange } = props;
    const [form] = Form.useForm();

    return isEditing ? (
        <Form
            form={form}
            initialValues={{ label, options }}
            onChange={() => onChange(form.getFieldsValue())}
        >
            <Form.Item label='表单问题' name='label'>
                <Input />
            </Form.Item>
            <Form.Item
                label='半星制'
                name={['options', 'allowHalf']}
                valuePropName='checked'
            >
                <Checkbox />
            </Form.Item>
            <Form.Item label='满分' name={['options', 'maxScore']}>
                <Radio.Group>
                    <Radio value={5}>5</Radio>
                    <Radio value={10}>10</Radio>
                    <Radio value={100}>100</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    ) : (
        <Rate disabled={true} defaultValue={options.maxScore} />
    );
}

export default WithUpdateState(FormRate);
