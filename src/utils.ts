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
    let linesDownToMoveCursor = 0;
    const selection = editor.selection;
    const start = selection.start;
    let newStart = new Position(start.line, 0);
    let newEnd = new Position(start.line, 0);
    if (selection.isEmpty) {
        const charactersOnLine = editor.document.lineAt(start.line).text.length;
        newEnd = new Position(start.line, charactersOnLine);
        linesDownToMoveCursor = 1;
    } else {
        newStart = start;
        newEnd = selection.end;
        linesDownToMoveCursor = selection.end.line - selection.start.line + 1;
    }
    await vscode.commands.executeCommand('cursorMove', { to: 'down', value: linesDownToMoveCursor });
    await vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineFirstNonWhitespaceCharacter' });
    return editor.document.getText(new Range(newStart, newEnd));  
}

export async function getClasspath(): Promise<string> {
    const hailstuff = process.env.hailstuff;
    if (hailstuff) return hailstuff
    return '';
}