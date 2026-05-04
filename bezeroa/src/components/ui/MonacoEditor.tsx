import type { JSX } from "react";

import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";

import GralLight from "@/components/ui/styles/gral-light.json";

function GralMonacoEditor(props: EditorProps): JSX.Element {
    const handleBeforeMount = (monaco: Monaco): void => {
        monaco.editor.defineTheme("GralLight", {
            base: "vs",
            colors: GralLight.colors,
            inherit: true,
            rules: GralLight.rules,
        });
    };

    return (
        <div className="h-[75vh] w-full rounded-md border border-slate-200 sm:h-auto sm:min-h-0 sm:w-full sm:flex-1">
            <Editor
                {...props}
                beforeMount={handleBeforeMount}
                height="100%"
                options={{
                    bracketPairColorization: { enabled: true },
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    fontLigatures: true,
                    fontSize: 14,
                    hideCursorInOverviewRuler: true,
                    lineNumbersMinChars: 3,
                    minimap: { enabled: false },
                    overviewRulerBorder: false,
                    padding: { bottom: 16, top: 16 },
                    renderLineHighlight: "line",
                    scrollbar: {
                        horizontalScrollbarSize: 8,
                        verticalScrollbarSize: 8,
                    },
                    smoothScrolling: true,
                    wordWrap: "on",
                    ...props.options,
                }}
                theme="GralLight"
                width="100%"
            />
        </div>
    );
}

export default GralMonacoEditor;
