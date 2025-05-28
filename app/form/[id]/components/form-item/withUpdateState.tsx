import { useEffect, useState } from 'react';
import FieldType from './field-types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { FormUpdateType, updateForm } from '@/store/form';

export default function WithUpdateState(Component: React.FC<FieldType>) {
    const UpdateStateComponent = (props: FieldType) => {
        const { isEditing, label, options, id } = props;
        const [changed, setChanged] = useState<boolean>(false);
        const [formData, setFormData] = useState<any>({});
        const dispatch = useDispatch<AppDispatch>();

        useEffect(() => {
            if (!isEditing && changed) {
                // 执行保存逻辑
                handleUpdate();
                setChanged(false);
            }
        }, [isEditing, changed]);

        const handleUpdate = () => {
            dispatch(
                updateForm({
                    type: FormUpdateType.UpdateItem,
                    data: {
                        id,
                        old: {
                            label,
                            options,
                        },
                        updated: formData,
                    },
                })
            );
        };
        const onChange = (formData: any) => {
            setChanged(true);
            setFormData(formData);
        };

        return <Component {...props} onChange={onChange} />;
    };

    return UpdateStateComponent;
}
