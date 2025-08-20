import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req) {
    try {
        const { path, url } = await req.json();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase environment variables are not configured" }, { status: 500 });
        }

        let objectPath = path || "";
        if (!objectPath && typeof url === "string") {
            // Derive object path from a public URL
            const marker = "/object/public/resume/";
            const idx = url.indexOf(marker);
            if (idx !== -1) {
                objectPath = url.substring(idx + marker.length);
            }
        }

        if (!objectPath) {
            return NextResponse.json({ error: "Missing file path or url" }, { status: 400 });
        }

        const serviceClient = createServerClient(supabaseUrl, serviceRoleKey, {
            cookies: {
                getAll() { return []; },
                setAll() { /* no-op */ },
            },
        });

        const { data, error } = await serviceClient
            .storage
            .from("resume")
            .createSignedUrl(objectPath, 60 * 60);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ url: data.signedUrl });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}


