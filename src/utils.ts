'use strict';

import * as vscode from 'vscode';
import { Position, Range, window } from 'vscode';

export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSelection(): Promise<string | undefined> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selection = editor.selection;
    const start = selection.start;
    if (selection.isEmpty) {
        const charactersOnLine = editor.document.lineAt(selection.start.line).text.length;
        const newStart = new Position(start.line, 0);
        const newEnd = new Position(start.line, charactersOnLine);
        return editor.document.getText(new Range(newStart, newEnd));
    }
    return editor.document.getText(selection);    
}

export async function getClasspath(): Promise<string> {
    const hailstuff = process.env.hailstuff;
    if (hailstuff) return hailstuff
    return '';
}