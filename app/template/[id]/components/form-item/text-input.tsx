import { Input } from 'antd';

interface TextInputProps {
    label: string;
    placeholder: string;
}
export default function TextInput(props: TextInputProps) {
    return <Input></Input>;
}
