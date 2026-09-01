import Project from "../model/Project.js";
import { reviseProject } from "../services/ai.js";
import { applyOperations } from "../services/diff.js";

export function buildManifest(files) {
  const manifest = [];
  for (const [path, entry] of Object.entries(files)) {
    manifest.push({
      path,
      size: entry.content.length,
      hash: entry.hash,
    });
  }
  return manifest;
}

export async function chat(req, res) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.status = "revising";
  project.messages.push({
    role: "user",
    content: prompt,
    timestamp: new Date(),
  });
  await project.save();

  try {
    const manifest = buildManifest(project.files);
    const relevantFiles = {};
    for (const [path, entry] of Object.entries(project.files)) {
      relevantFiles[path] = entry.content;
    }
    const recentMessages = project.messages
      .slice(-4)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    console.log(
      `[AI] revising project ${project._id}: ${prompt.slice(0, 80)}...` +
        `(${manifest.length} files, manifest ~${JSON.stringify(manifest).length} chars)`,
    );

    const result = await reviseProject(
      recentMessages,
      relevantFiles,
      manifest,
      prompt,
    );
    console.log(
      `[AI] Got ${result.operations.length} operations, ${result.description}`,
    );

    const {
      files: updatedFiles,
      applied,
      errors,
    } = applyOperations(project.files, result.operations);

    if (errors.length > 0) {
      console.error(`[AI] Errors applying operations: ${errors.join(", ")}`);
    }

    project.files = updatedFiles;
    project.markModified("files");
    project.status = "completed";
    project.messages.push({
      role: "assistant",
      content: result.description,
    });
    await project.save();

    //Return the updated project and the result description
    const filesObj = {};
    for (const [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }
    res.status(200).json({
      _id: project._id,
      name: project.name,
      owner: project.owner,
      status: project.status,
      description: project.description,
      aiDescription: result.description,
      messages: project.messages,
      applied,
      errors,
      files: filesObj,
    });
  } catch (err) {
    console.error(`[AI] Error occurred while revising project: ${err.message}`);
    project.status = "failed";
    await project.save();
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}
