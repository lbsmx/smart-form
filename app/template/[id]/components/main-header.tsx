import { Button, Space } from 'antd';
import {
    UndoOutlined,
    RedoOutlined,
    SaveOutlined,
    EyeOutlined,
} from '@ant-design/icons';

export default function MainHeader() {
    return (
        <div
            style={{
                background: '#fff',
                padding: '16px 24px',
                borderBottom: '1px solid #e9e9e9',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Space>
                <Button icon={<UndoOutlined />}>撤销</Button>
                <Button icon={<RedoOutlined />}>重做</Button>
                <Button icon={<SaveOutlined />}>保存</Button>
                <Button icon={<EyeOutlined />}>预览</Button>
            </Space>
        </div>
    );
}
