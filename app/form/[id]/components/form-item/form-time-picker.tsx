import { Form, Input, Radio, TimePicker } from 'antd';
import FieldType from './field-types';
import { useForm } from 'antd/es/form/Form';
import WithUpdateState from './withUpdateState';

function FormTimePicker(props: FieldType) {
    const { isEditing, label, options, onChange } = props;
    const [form] = useForm();

    return (
        <div style={{ flex: 1 }}>
            {isEditing ? (
                <Form
                    form={form}
                    layout='horizontal'
                    initialValues={{ label, options }}
                    onChange={() => onChange(form.getFieldsValue())}
                >
                    <Form.Item label='表单问题' name='label'>
                        <Input placeholder='请输入标题' />
                    </Form.Item>
                    <Form.Item
                        label='是否为时间范围'
                        name={['options', 'range']}
                    >
                        <Radio.Group>
                            <Radio value={false}>否</Radio>
                            <Radio value={true}>是</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            ) : (
                <TimePicker style={{ width: '100%' }} />
            )}
        </div>
    );
}

export default WithUpdateState(FormTimePicker);
