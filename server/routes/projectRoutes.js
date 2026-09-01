import Router from "express";
import { createProject, getPublicProject, listProjects, getProject, deleteProject, updateProjectFiles, publishProject } from "../controllers/projectController";
import { authMiddleware } from "../middleware/authMiddleware";

const projectRouter = Router();

//Public route to get a project by ID
projectRouter.get("public/:id", getPublicProject);

projectRouter.use(authMiddleware); // Apply authentication middleware to all routes below

//Private routes for authenticated users
projectRouter.post("/", createProject);
projectRouter.get("/", listProjects);
projectRouter.get("/:id", getProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.put("/:id/files", updateProjectFiles);
projectRouter.post("/:id/publish", publishProject);

export default projectRouter;