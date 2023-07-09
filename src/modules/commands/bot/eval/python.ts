import { PythonShell } from "python-shell";
import { writeFile, rm, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
export async function executePythonCode(code: string, onStdout: (line: string) => void, onStderr: (line: string) => void) {
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const dir = await mkdtemp(join(tmpdir(), uuid));
    const path = join(dir, "main.py");
    await writeFile(path, code);
    const shell = new PythonShell(path);
    shell.on("message", onStdout);
    shell.on("stderr", onStderr);
    shell.on("close", async () => {
        await rm(dir, { recursive: true });
    });
}