import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SandpackProvider,
  useSandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { detectDependencies } from "../utils/sandpackUtils";
import { useAppContext } from "../context/AppContext";

function SandpackFileWatcher({ onLiveFilesChange }) {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const { activeProject, updateProjectFiles } = useAppContext();

  const activeProjectRef = useRef(activeProject);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    const project = activeProjectRef.current;
    if (!project) return;
    const updatedFiles = {};
    let hasChanges = false;
    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code;
      updatedFiles[path] = fileCode;
      const originalContent =
        typeof project.files[path] === "string"
          ? project.files[path]
          : project.files[path]?.content;
      if (originalContent !== undefined && originalContent !== fileCode) {
        hasChanges = true;
      }
    }
    onLiveFilesChange(updatedFiles);
    if (hasChanges) {
      updateProjectFiles(updatedFiles);
    }
  }, [files]);
  return null;
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
  const [liveFiles, setLiveFiles] = useState(project.files);

  useEffect(() => {
    setLiveFiles(project.files);
  }, [project._id]);

  const handleLiveFilesChange = (newFiles) => {
    setLiveFiles((prev) => {
      let changed = false;
      for (const [p, code] of Object.entries(newFiles)) {
        if (prev[p] !== code) {
          changed = true;
          break;
        }
      }
      return changed ? newFiles : prev;
    });
  };

  const sandpackFiles = useMemo(() => {
    const spFiles = {};
    for (const [path, content] of Object.entries(liveFiles)) {
      const fileCode =
        typeof content === "string" ? content : content?.content || "";
      spFiles[path] = {
        code: fileCode,
        active: path === activeFile,
      };
    }
    return spFiles;
  }, [liveFiles, activeFile]);

  const dependencies = useMemo(() => {
    return detectDependencies(liveFiles);
  }, [liveFiles]);

  return (
    <div className="h-full w-full min-w-0 min-h-0 overflow-hidden">
      <SandpackProvider
        key={project._id}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css",
          ],
          logLevel: 0,
        }}
        theme={{
          colors: {
            surface1: "#ffffff",
            surface2: "#f4f4f5",
            surface3: "#e4e4e7",
            clickable: "#71717a",
            base: "#09090b",
            disabled: "#a1a1aa",
            hover: "#18181b",
            accent: "#18181b",
            error: "#ef4444",
            errorSurface: "#fef2f2",
          },
          font: {
            body: "'Urbanist', system-ui, -apple-system, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6",
          },
        }}
      >
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />

        <SandpackLayout
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            border: "none",
            borderRadius: 0,
            background: "transparent",
          }}
        >
          {showCode ? (
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                minWidth: 0,
                minHeight: 0,
              }}
            />
          ) : (
            <SandpackPreview
              showNavigator={false}
              showRefreshButton
              showOpenInCodeSandbox={false}
              style={{
                width: "100%",
                height: "100%",
                flex: "1 1 100%",
                minWidth: 0,
                minHeight: 0,
              }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default PreviewPanel;
