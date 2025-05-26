import { FormUpdateType } from '@/store/form';

type HistoryState = {
    action: FormUpdateType;
    data: any;
};

class HistoryManager {
    private undoStack: any[];
    private redoStack: any[];
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    add(state: HistoryState) {
        this.undoStack.push(state);
    }

    undo() {
        if (this.undoStack.length > 0) {
            const state = this.undoStack.pop();
            this.redoStack.push(state);
            return state;
        }
        return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.undoStack.push(state);
            return state;
        }
        return null;
    }
}

export default HistoryManager;
