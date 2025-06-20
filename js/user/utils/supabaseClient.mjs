import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { projectId, publicKey } from "./constants.mjs"; // adjust the path if needed

export const supabase = createClient(projectId, publicKey);