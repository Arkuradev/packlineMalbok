import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { projectId, publicKey } from "./constants.mjs"; // adjust the path if needed

export const supabase = createClient(projectId, publicKey);
