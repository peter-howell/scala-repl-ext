'use strict';

import { delay, getSelection } from './utils';
import { chooseTerminal } from './getTerminal';

import * as vscode from 'vscode';

export async function runSelection(): Promise<void> {
    const text = await getSelection()
    await runText(text);
}

export async function runText(text: string | undefined): Promise<void> {
    const term = await chooseTerminal();
    if (!term || !text) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const sel0 = editor.selections;

    const split = text.split('\n');
    const last_split = split.length - 1;
    for (const [count, line] of split.entries()) {
        if (count > 0) {
            await delay(80); // Increase delay if it can't handle speed.
        }
        if (count === last_split && count > 0) {
            // Avoid sending newline on last line
            term.sendText(line, false);
        } else term.sendText(line);
    }
    term.show(true);
    // Scroll console to see latest output
    await vscode.commands.executeCommand('workbench.action.terminal.scrollToBottom');
    editor.selections = sel0;
    await vscode.window.showInformationMessage('THING HAPPENED');
    
}
