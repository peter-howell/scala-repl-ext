'use strict';

import * as vscode from 'vscode';

import { getClasspath } from './utils';

export async function chooseTerminal(): Promise<vscode.Terminal | undefined> {
    // VSCode Python's extension creates hidden terminal with string 'Deactivate'
    // For now ignore terminals with this string
    const ignoreTermIdentifier = 'Deactivate';

    // Filter out terminals to be ignored
    const visibleTerminals = vscode.window.terminals.filter(terminal => {
        return !terminal.name.toLowerCase().includes(ignoreTermIdentifier);
    });

    let msg = '[chooseTerminal] ';
    msg += `A. There are ${vscode.window.terminals.length} terminals: `;
    for (let i = 0; i < vscode.window.terminals.length; i++){
        msg += `Terminal ${i}: ${vscode.window.terminals[i].name} `;
    }

    const termNameOptions = ['Java', 'java', 'Scala', 'scala', 'Scala REPL',];

    const validTerms = visibleTerminals.filter(terminal => {
        return termNameOptions.includes(terminal.name);
    });

    if (validTerms.length > 0) {
        // If there is an active terminal that is an R terminal, use it
        if (vscode.window.activeTerminal && termNameOptions.includes(vscode.window.activeTerminal.name)) {
            return vscode.window.activeTerminal;
        }
        // Otherwise, use last valid R terminal
        const term = validTerms[validTerms.length - 1];
        term.show(true);
        return term;
    } else {
        // If no valid terminals are found, create a new one
        console.info(msg);
        const term = await createTerm();
        return term;
    }
}


export async function createTerm(): Promise<vscode.Terminal> {``
    const hailpath = await getClasspath();

    const terminal = vscode.window.createTerminal("Scala REPL", '/Users/peterhowell/Library/Application Support/Coursier/bin/scala', ['-cp', hailpath]);
    terminal.show(true);
    return terminal;
}


