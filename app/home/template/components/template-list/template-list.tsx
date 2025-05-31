import { use } from 'react';
import TemplateCard from '../template-card';
import styles from './template-list.module.css';

export default function TemplateList({
    templates,
}: {
    templates: Promise<any>;
}) {
    const allTemplates = use(templates);
    return (
        <div className={styles.container}>
            {allTemplates.map((item) => (
                <TemplateCard
                    key={item._id}
                    name={item.name}
                    fields={item.structure.formList}
                />
            ))}
        </div>
    );
}
