import { DatePicker, Form, Input, Radio } from 'antd';
import WithUpdateState from './withUpdateState';
import FieldType from './field-types';
import { useForm } from 'antd/es/form/Form';

function FormDatePicker(props: FieldType) {
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
                    <Form.Item label='时间类型' name={['options', 'type']}>
                        <Radio.Group>
                            <Radio value=''>天</Radio>
                            <Radio value='week'>周</Radio>
                            <Radio value='month'>月</Radio>
                            <Radio value='quarter'>季度</Radio>
                            <Radio value='year'>年</Radio>
                        </Radio.Group>
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
                <DatePicker style={{ width: '100%' }} />
            )}
        </div>
    );
}

export default WithUpdateState(FormDatePicker);
