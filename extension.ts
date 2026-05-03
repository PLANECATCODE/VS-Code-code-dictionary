import * as vscode from 'vscode';

const DICTIONARY: Record<string, Array<{term: string, def: string, ex: string}>> = {
    python: [
        { term: "print()", def: "Outputs text to the console", ex: 'print("Hello, World!")' },
        { term: "len()", def: "Returns the length of a string or list", ex: 'len("hello")  // returns 5' },
        { term: "input()", def: "Reads user input from the console", ex: 'name = input("Enter your name: ")' },
        { term: "if", def: "Conditional statement", ex: 'if x > 0:\n    print("positive")' },
        { term: "for", def: "Loop over a sequence", ex: 'for i in range(5):\n    print(i)' },
        { term: "def", def: "Define a function", ex: 'def greet(name):\n    return f"Hello {name}"' }
    ],
    cpp: [
        { term: "std::cout", def: "Prints output to the console", ex: 'std::cout << "Hello" << std::endl;' },
        { term: "std::cin", def: "Reads user input", ex: 'int x; std::cin >> x;' },
        { term: "int main()", def: "Entry point of a C++ program", ex: 'int main() { return 0; }' }
    ],
    javascript: [
        { term: "console.log()", def: "Prints to console", ex: 'console.log("Hello");' },
        { term: "function", def: "Defines a reusable block of code", ex: 'function greet(name) { return "Hi " + name; }' },
        { term: "const", def: "Declares a constant variable", ex: 'const PI = 3.14;' }
    ],
    html: [
        { term: "<div>", def: "Generic block container", ex: '<div class="box">Content</div>' },
        { term: "<h1>", def: "Main heading", ex: '<h1>Title</h1>' },
        { term: "<p>", def: "Paragraph text", ex: '<p>This is a sentence.</p>' }
    ],
    java: [
        { term: "System.out.println()", def: "Prints to console", ex: 'System.out.println("Hello");' },
        { term: "public static void main", def: "Entry point", ex: 'public static void main(String[] args) { }' }
    ]
};

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('code-dictionary.search', async () => {
        const language = await vscode.window.showQuickPick(
            ['python', 'cpp', 'javascript', 'html', 'java'],
            { placeHolder: 'Select a language' }
        );
        if (!language) return;
        
        const terms = DICTIONARY[language].map(t => t.term);
        const term = await vscode.window.showQuickPick(terms, { placeHolder: `Search ${language} terms` });
        if (!term) return;
        
        const entry = DICTIONARY[language].find(t => t.term === term);
        if (entry) {
            const panel = vscode.window.createWebviewPanel(
                'codeDictionary',
                `${term} — ${language}`,
                vscode.ViewColumn.Two,
                { enableScripts: true }
            );
            panel.webview.html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { background: #1e1e1e; color: #d4d4d4; font-family: monospace; padding: 20px; }
                        h2 { color: #10b981; }
                        pre { background: #0a0a10; padding: 12px; border-radius: 8px; overflow-x: auto; }
                        button { background: #10b981; color: #1e1e1e; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 12px; }
                    </style>
                </head>
                <body>
                    <h2>📖 ${entry.term}</h2>
                    <p><strong>Definition:</strong> ${entry.def}</p>
                    <p><strong>Example:</strong></p>
                    <pre><code>${entry.ex}</code></pre>
                    <button onclick="copyCode()">📋 Copy to Clipboard</button>
                    <script>
                        function copyCode() {
                            navigator.clipboard.writeText(\`${entry.ex.replace(/`/g, '\\`')}\`);
                            alert('Copied to clipboard!');
                        }
                    </script>
                </body>
                </html>
            `;
        }
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}