"use client";

interface TemplateConfig {
  [key: string]: {
    name: string;
    description: string;
    structure: {
      title: string;
      formList: SortableItemProps[];
    };
  };
}

import * as React from "react";
import styles from "@/app/template/[id]/page.module.css";
import SideFormItemPanel from "./components/side-form-item-panel";
import MainFormPanel from "./components/main-form-panel";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  UniqueIdentifier,
  Announcements,
  ScreenReaderInstructions,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useState, useEffect, Usable } from "react";
import Item from "./components/Item/Item.tsx";
import { SortableItemProps } from "./components/sortable-item/sortable-item";
import { v4 as uuidv4 } from "uuid";
import TemplateJson from "@/app/template/config/template.json";
import { useSelector, useDispatch } from "react-redux";
import { setFormList } from "@/store/form.ts";
import { RootState } from "@/store/index.ts";
import SideItem from "./components/side-item/side-item.tsx";
import _ from "lodash";

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
      To pick up a sortable item, press the space bar.
      While sorting, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
};

const templateJson: TemplateConfig = TemplateJson;

export default function Template({
  params,
}: {
  params: Usable<{ id: string }>;
}) {
  const { id }: { id: string } = React.use(params);

  const [activeItem, setActiveItem] = useState<SortableItemProps | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [formItemLib, setFormItemLib] = useState<
    {
      label: string;
      sets: SortableItemProps[];
    }[]
  >([
    {
      label: "基础控件",
      sets: [
        {
          id: uuidv4(),
          type: "textInput",
          label: "输入框",
          sortable: false,
          placeholder: "请输入内容",
          maxLength: 30,
        },
        {
          id: uuidv4(),
          type: "numberInput",
          label: "数字输入框",
          sortable: false,
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "文本域",
          sortable: false,
        },
      ],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dispatch = useDispatch();
  const formList = useSelector((state: RootState) => state.form.formList);

  // 因为在服务端无法获取document 因此组件挂载时创建 portalRoot
  useEffect(() => {
    // 客户端组件也会在服务端进行预渲染，然后在客户端进行水合，最后根据交互在客户端进行渲染
    // 因此在服务端预渲染时拿不到document，需要使用副作用函数保证在客户端获取到document
    if (typeof document !== "undefined") setPortalRoot(document.body);
    // 配置初始模板
    if (templateJson[id]) {
      dispatch(setFormList(templateJson[id].structure.formList));
    }
  }, []);

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const findContainer = (id: UniqueIdentifier) => {
    if (formList.find((item) => item.id === id)) {
      return "formList";
    }
    if (id === "form-container") {
      return "formContainer";
    }
    return "formItemLib";
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      // 防止（点击）拖拽到form-container时，触发onDragStart
      if (active.id === "form-container") return;
      setActiveItem(active.data.current as SortableItemProps);
      return undefined;
    },
    onDragOver({ active, over }) {
      if (!active || !over || !activeItem) return;

      const activeContainer = findContainer(activeItem!.id);
      const overContainer = findContainer(over.id);
      if (activeContainer === overContainer) return;
      const overItem = over.data.current;
      // 从lib中拖拽到form中
      if (activeContainer === "formItemLib" && !activeItem?.sortable) {
        const overIndex = formList.findIndex(
          (item) => item.id === overItem?.id
        );
        let newIndex: number;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : formList.length + 1;
        const copyItems = [...formList];
        setFormItemLib((item) => {
          const copyItem = _.cloneDeep(item);
          const activeGroupIndex = copyItem.findIndex(
            (item) => item.sets.findIndex((item) => item.id === active.id) > -1
          );
          const activeGroup = copyItem[activeGroupIndex];
          const sets = activeGroup.sets;
          const acitveSet = sets.find((item) => item.id === activeItem.id);
          if (acitveSet) {
            acitveSet.id = uuidv4();
          }
          return copyItem;
        });
        dispatch(
          setFormList([
            ...copyItems.slice(0, newIndex),
            activeItem,
            ...copyItems.slice(newIndex),
          ])
        );
      }
      return undefined;
    },
    onDragEnd({ active, over }) {
      // formList排序
      if (active && over && active.id !== over.id) {
        const oldIndex = formList.findIndex((item) => item.id === active.id);
        const newIndex = formList.findIndex((item) => item.id === over.id);
        dispatch(setFormList(arrayMove(formList, oldIndex, newIndex)));
        return;
      }

      // 批量更新机制，同一个事件处理函数中，多个setState会被合并为一次重新渲染
      setActiveItem(null);
      return undefined;
    },
    onDragCancel({ active: { id } }) {
      return undefined;
    },
  };

  // 注： 因为侧边栏和主区域共享SortableContext，因此碰撞算法不能使用closestCenter，
  // 否则会在拖拽开始就检测到侧边栏item碰撞到了form item

  return (
    <DndContext
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      sensors={sensors}
      collisionDetection={rectIntersection}
    >
      <SortableContext
        items={[
          ...formItemLib.reduce((acc: any, cur) => {
            return acc.concat(cur.sets.map((item) => item.id));
          }, []),
          ...formList.map((item) => item.id),
        ]}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.page}>
          <SideFormItemPanel
            formItemLib={formItemLib}
            active={activeItem}
          ></SideFormItemPanel>
          <MainFormPanel formList={formList}></MainFormPanel>
        </div>
      </SortableContext>
      {portalRoot &&
        createPortal(
          <DragOverlay adjustScale={false} dropAnimation={dropAnimationConfig}>
            {activeItem != null ? (
              activeItem.sortable ? (
                <Item {...activeItem} style={{ width: "100%" }} />
              ) : (
                <SideItem {...activeItem} />
              )
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
